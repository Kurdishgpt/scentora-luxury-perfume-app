import { getRequestIP } from "@tanstack/react-start/server";
import { useSession } from "@tanstack/react-start/server";

const SESSION_NAME = "__Host-maya-admin";
const SESSION_MAX_AGE = 60 * 60 * 12;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

type AdminSessionData = { isAdmin?: boolean };
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

async function getAdminSession() {
  const secret = process.env["SESSION_SECRET"];
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  }
  return useSession<AdminSessionData>({
    name: SESSION_NAME,
    password: secret,
    maxAge: SESSION_MAX_AGE,
    cookie: { secure: true, httpOnly: true, sameSite: "lax", path: "/" },
  });
}

async function matchesConfiguredPassword(candidate: string) {
  const configuredPassword = process.env["ADMIN_PASSWORD"];
  if (!configuredPassword) throw new Error("ADMIN_PASSWORD is not configured in Replit Secrets.");
  const encoder = new TextEncoder();
  const [expected, actual] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(configuredPassword)),
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
  ]);
  const expectedBytes = new Uint8Array(expected);
  const actualBytes = new Uint8Array(actual);
  let difference = 0;
  for (let index = 0; index < expectedBytes.length; index += 1) {
    difference |= expectedBytes[index]! ^ actualBytes[index]!;
  }
  return difference === 0;
}

export async function signInAdmin(password: string) {
  const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (attempts && attempts.resetAt > now && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    throw new Error("Too many login attempts. Please wait 15 minutes and try again.");
  }

  const valid = await matchesConfiguredPassword(password);
  if (!valid) {
    const current = attempts && attempts.resetAt > now
      ? attempts
      : { count: 0, resetAt: now + LOGIN_WINDOW_MS };
    current.count += 1;
    loginAttempts.set(ip, current);
    throw new Error("Incorrect admin password.");
  }

  loginAttempts.delete(ip);
  const session = await getAdminSession();
  await session.clear();
  await session.update({ isAdmin: true });
  return { ok: true };
}

export async function isAdminSignedIn() {
  const session = await getAdminSession();
  return session.data.isAdmin === true;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.data.isAdmin !== true) throw new Error("Admin sign-in required.");
}

export async function signOutAdmin() {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true };
}
