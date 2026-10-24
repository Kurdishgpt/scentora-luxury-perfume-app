import { useEffect, useState, type FormEvent } from "react";
import { Lock, X } from "lucide-react";
import { signInAdminFn } from "@/lib/catalog.functions";

type Language = "en" | "ku" | "ar";

const COPY: Record<
  Language,
  {
    title: string;
    description: string;
    password: string;
    submit: string;
    submitting: string;
    close: string;
    genericError: string;
  }
> = {
  en: {
    title: "Admin sign in",
    description: "Enter the store admin password to continue.",
    password: "Admin password",
    submit: "Sign in",
    submitting: "Signing in…",
    close: "Close sign-in dialog",
    genericError: "Sign-in failed. Check the password and try again.",
  },
  ku: {
    title: "چوونەژوورەوەی ئەدمین",
    description: "وشەی نهێنی ئەدمین بنووسە بۆ بەردەوامبوون.",
    password: "وشەی نهێنی ئەدمین",
    submit: "چوونەژوورەوە",
    submitting: "چاوەڕێ بکە…",
    close: "داخستنی چوونەژوورەوە",
    genericError: "چوونەژوورەوە سەرکەوتوو نەبوو. وشەی نهێنی بپشکنە.",
  },
  ar: {
    title: "دخول المسؤول",
    description: "أدخل كلمة مرور مسؤول المتجر للمتابعة.",
    password: "كلمة مرور المسؤول",
    submit: "تسجيل الدخول",
    submitting: "جارٍ تسجيل الدخول…",
    close: "إغلاق نافذة تسجيل الدخول",
    genericError: "تعذر تسجيل الدخول. تحقق من كلمة المرور وحاول مرة أخرى.",
  },
};

export function AdminLoginDialog({
  open,
  onClose,
  onSuccess,
  language,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const copy = COPY[language];

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError("");
      setSubmitting(false);
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose, submitting]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signInAdminFn({ data: { password } });
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : copy.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="overlay-open detail-overlay" onClick={() => !submitting && onClose()}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        className="glass w-full max-w-md rounded-2xl p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-heading">
          <div>
            <h2 id="admin-login-title">{copy.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label={copy.close}
            disabled={submitting}
          >
            <X size={18} />
          </button>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value="admin"
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />
          <label className="grid gap-2 text-sm" htmlFor="admin-password">
            <span>{copy.password}</span>
            <span className="glass flex items-center gap-2 rounded-lg px-3">
              <Lock size={16} className="text-gold" aria-hidden="true" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={512}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3 outline-none"
              />
            </span>
          </label>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="gold-button rounded-lg px-4 py-3 font-semibold disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? copy.submitting : copy.submit}
          </button>
        </form>
      </section>
    </div>
  );
}
