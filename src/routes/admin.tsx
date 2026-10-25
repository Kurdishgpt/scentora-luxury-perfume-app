import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { getAdminCatalogFn, getAdminSessionFn } from "@/lib/catalog.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Maya Collection Admin — Store Management" },
      { name: "description", content: "Manage products, stock, categories, and store contact details." },
    ],
  }),
  loader: async () => {
    try {
      const { isAdmin } = await getAdminSessionFn();
      if (!isAdmin) {
        return { isAdmin: false as const, catalog: null, error: null };
      }
      return {
        isAdmin: true as const,
        catalog: await getAdminCatalogFn(),
        error: null,
      };
    } catch (error) {
      return {
        isAdmin: false as const,
        catalog: null,
        error: error instanceof Error ? error.message : "Could not load the admin page.",
      };
    }
  },
  component: Admin,
});

function Admin() {
  const { isAdmin, catalog, error } = Route.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="glass max-w-lg rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-semibold text-gold-soft">Admin page couldn’t load</h1>
          <p role="alert" className="mt-3 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => void router.invalidate()}
            className="btn-gold mt-5 rounded-lg px-5 py-2.5 font-semibold"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  if (!isAdmin || !catalog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="glass max-w-lg rounded-2xl p-8 text-center">
          <p className="eyebrow">Scentora store management</p>
          <h1 className="mt-3 text-3xl font-semibold text-gold-soft">Admin sign in required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in with the configured store admin password to manage products and settings.
          </p>
          <a href="/" className="outline-button mt-5 inline-flex rounded-lg px-4 py-2 text-sm">
            Back to storefront
          </a>
        </section>
        <AdminLoginDialog
          open
          onClose={() => void navigate({ to: "/" })}
          onSuccess={() => void router.invalidate()}
          language="en"
        />
      </main>
    );
  }

  return <AdminDashboard initialCatalog={catalog} />;
}
