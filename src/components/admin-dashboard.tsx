import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, LogOut, PackagePlus, Save, Trash2 } from "lucide-react";
import {
  createProductFn,
  deleteProductFn,
  signOutAdminFn,
  updateCategoriesFn,
  updateProductFn,
  updateWhatsappFn,
} from "@/lib/catalog.functions";
import type { CatalogProduct, StorefrontCatalog } from "@/lib/catalog-types";

type Notice = { type: "success" | "error"; message: string };
type ProductDraft = {
  name: string;
  brand: string;
  image: string;
  subtitle: string;
  categories: string;
  sizes: string;
  top: string;
  heart: string;
  base: string;
  description: string;
};

const EMPTY_DRAFT: ProductDraft = {
  name: "",
  brand: "",
  image: "",
  subtitle: "",
  categories: "",
  sizes: "",
  top: "",
  heart: "",
  base: "",
  description: "",
};

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--deep)]/40 px-3 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]";
const labelClass = "grid gap-1.5 text-sm text-muted-foreground";
const MAX_PRODUCT_IMAGE_BYTES = 2 * 1024 * 1024;
const PRODUCT_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function parseSizes(value: string) {
  const entries = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const sizes = entries.map((entry) => {
    const [volume, price, extra] = entry.split(":");
    return { volume: Number(volume), price: Number(price), extra };
  });

  if (
    sizes.length === 0 ||
    sizes.some(
      (size) =>
        size.extra !== undefined ||
        !Number.isInteger(size.volume) ||
        size.volume < 1 ||
        !Number.isFinite(size.price) ||
        size.price < 0,
    )
  ) {
    throw new Error("Enter bottle sizes as volume:price, for example 30:45, 50:88.");
  }

  return sizes.map(({ volume, price }) => ({ volume, price }));
}

export function AdminDashboard({ initialCatalog }: { initialCatalog: StorefrontCatalog }) {
  const router = useRouter();
  const productImageInputRef = useRef<HTMLInputElement>(null);
  const [catalog, setCatalog] = useState(initialCatalog);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [edits, setEdits] = useState<Record<string, CatalogProduct>>({});
  const [newCategory, setNewCategory] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState(initialCatalog.whatsappNumber);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingAction, setPendingAction] = useState("");

  async function runCatalogAction(
    action: () => Promise<StorefrontCatalog>,
    successMessage: string,
  ) {
    setPendingAction("save");
    setNotice(null);
    try {
      const updatedCatalog = await action();
      setCatalog(updatedCatalog);
      setWhatsappNumber(updatedCatalog.whatsappNumber);
      setEdits({});
      setNotice({ type: "success", message: successMessage });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: messageFromError(error) });
      return false;
    } finally {
      setPendingAction("");
    }
  }

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    try {
      if (!draft.name.trim() || !draft.brand.trim() || !draft.image.trim()) {
        throw new Error("Enter the product name and brand, then choose a product image.");
      }
      const categories = [
        ...new Set(
          draft.categories
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ];
      const product = {
        name: draft.name.trim(),
        brand: draft.brand.trim(),
        image: draft.image.trim(),
        subtitle: draft.subtitle.trim(),
        categories,
        sizes: parseSizes(draft.sizes),
        top: draft.top.trim(),
        heart: draft.heart.trim(),
        base: draft.base.trim(),
        description: draft.description.trim(),
        inStock: true,
      };
      const saved = await runCatalogAction(
        () => createProductFn({ data: product }),
        "Product added to the store.",
      );
      if (saved) {
        setDraft(EMPTY_DRAFT);
        if (productImageInputRef.current) productImageInputRef.current.value = "";
      }
    } catch (error) {
      setNotice({ type: "error", message: messageFromError(error) });
    }
  }

  function editProduct(product: CatalogProduct, patch: Partial<CatalogProduct>) {
    setEdits((current) => ({
      ...current,
      [product.id]: { ...(current[product.id] ?? product), ...patch },
    }));
  }

  async function saveProduct(product: CatalogProduct) {
    const edited = edits[product.id] ?? product;
    await runCatalogAction(
      () => updateProductFn({ data: { id: product.id, product: edited } }),
      `${edited.name} saved.`,
    );
  }

  async function removeProduct(product: CatalogProduct) {
    if (!window.confirm(`Remove ${product.name} from the storefront?`)) return;
    await runCatalogAction(
      () => deleteProductFn({ data: { id: product.id } }),
      `${product.name} removed.`,
    );
  }

  async function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) {
      setNotice({ type: "error", message: "Enter a category name." });
      return;
    }
    if (catalog.categories.includes(name)) {
      setNotice({ type: "error", message: "That category already exists." });
      return;
    }
    const saved = await runCatalogAction(
      () => updateCategoriesFn({ data: { categories: [...catalog.categories, name] } }),
      "Category saved.",
    );
    if (saved) setNewCategory("");
  }

  async function saveWhatsapp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedNumber = whatsappNumber.trim();
    if (!/^\+?\d{7,18}$/.test(normalizedNumber)) {
      setNotice({ type: "error", message: "Enter a WhatsApp number with 7–18 digits." });
      return;
    }
    await runCatalogAction(
      () => updateWhatsappFn({ data: { whatsappNumber: normalizedNumber } }),
      "WhatsApp number saved.",
    );
  }

  async function signOut() {
    setPendingAction("signout");
    setNotice(null);
    try {
      await signOutAdminFn();
      await router.invalidate();
    } catch (error) {
      setNotice({ type: "error", message: messageFromError(error) });
    } finally {
      setPendingAction("");
    }
  }

  function updateDraft<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleProductImageChange(file: File | undefined) {
    if (!file) return;
    updateDraft("image", "");

    if (!PRODUCT_IMAGE_TYPES.has(file.type)) {
      if (productImageInputRef.current) productImageInputRef.current.value = "";
      setNotice({ type: "error", message: "Choose a JPEG, PNG, WebP, or AVIF image." });
      return;
    }
    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      if (productImageInputRef.current) productImageInputRef.current.value = "";
      setNotice({ type: "error", message: "Choose an image smaller than 2 MB." });
      return;
    }

    setNotice(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject(new Error("Could not read the selected image."));
        };
        reader.onerror = () => reject(new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      });
      updateDraft("image", dataUrl);
    } catch (error) {
      setNotice({ type: "error", message: messageFromError(error) });
    }
  }

  return (
    <main dir="ltr" className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Store management</p>
            <h1 className="mt-2 text-4xl font-semibold text-gold-soft">Admin dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Changes save to the live catalog and storefront.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="outline-button inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm"
            >
              <ArrowLeft size={16} /> Storefront
            </a>
            <button
              type="button"
              onClick={() => void signOut()}
              disabled={pendingAction !== ""}
              className="outline-button inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm disabled:opacity-50"
            >
              {pendingAction === "signout" ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <LogOut size={16} />
              )}
              Sign out
            </button>
          </div>
        </header>

        {notice && (
          <div
            role={notice.type === "error" ? "alert" : "status"}
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              notice.type === "error"
                ? "border-destructive/50 bg-destructive/10 text-destructive"
                : "border-[var(--gold)]/40 bg-[var(--gold)]/10 text-gold-soft"
            }`}
          >
            {notice.message}
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-3" aria-label="Store summary">
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Products</p>
            <p className="mt-1 text-3xl font-semibold text-gold">{catalog.products.length}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="mt-1 text-3xl font-semibold text-gold">
              {catalog.products.filter((product) => product.inStock).length}
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="mt-1 text-3xl font-semibold text-gold">{catalog.categories.length}</p>
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <section className="glass rounded-2xl p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <PackagePlus className="text-gold" />
              <div>
                <h2 className="text-xl font-semibold">Add a product</h2>
                <p className="text-sm text-muted-foreground">
                  Required details are marked with an asterisk.
                </p>
              </div>
            </div>
            <form className="grid gap-4" onSubmit={handleCreateProduct}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Product name *
                  <input
                    className={inputClass}
                    maxLength={120}
                    value={draft.name}
                    onChange={(event) => updateDraft("name", event.target.value)}
                  />
                </label>
                <label className={labelClass}>
                  Brand *
                  <input
                    className={inputClass}
                    maxLength={120}
                    value={draft.brand}
                    onChange={(event) => updateDraft("brand", event.target.value)}
                  />
                </label>
              </div>
              <div className={labelClass}>
                <label htmlFor="product-image">Product image *</label>
                <input
                  id="product-image"
                  ref={productImageInputRef}
                  aria-label="Product image *"
                  className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[var(--gold)] file:px-3 file:py-1.5 file:font-semibold file:text-[var(--deep)]`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) =>
                    void handleProductImageChange(event.currentTarget.files?.[0])
                  }
                />
                <p className="text-xs">
                  Choose a photo from your device’s gallery (JPEG, PNG, WebP, or AVIF; max 2 MB).
                </p>
                {draft.image && (
                  <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-2">
                    <img
                      src={draft.image}
                      alt="Product image preview"
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      className="outline-button rounded-lg px-3 py-2 text-sm"
                      onClick={() => {
                        updateDraft("image", "");
                        if (productImageInputRef.current) productImageInputRef.current.value = "";
                      }}
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
              <label className={labelClass}>
                Short description
                <input
                  className={inputClass}
                  maxLength={240}
                  value={draft.subtitle}
                  onChange={(event) => updateDraft("subtitle", event.target.value)}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Categories (comma-separated)
                  <input
                    className={inputClass}
                    maxLength={400}
                    placeholder="Floral, Fresh"
                    value={draft.categories}
                    onChange={(event) => updateDraft("categories", event.target.value)}
                  />
                </label>
                <label className={labelClass}>
                  Sizes and prices *
                  <input
                    className={inputClass}
                    value={draft.sizes}
                    onChange={(event) => updateDraft("sizes", event.target.value)}
                    aria-describedby="size-format-help"
                  />
                  <span id="size-format-help" className="text-xs">
                    Use volume:price pairs, e.g. 30:45, 50:88
                  </span>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className={labelClass}>
                  Top notes
                  <input
                    className={inputClass}
                    maxLength={240}
                    value={draft.top}
                    onChange={(event) => updateDraft("top", event.target.value)}
                  />
                </label>
                <label className={labelClass}>
                  Heart notes
                  <input
                    className={inputClass}
                    maxLength={240}
                    value={draft.heart}
                    onChange={(event) => updateDraft("heart", event.target.value)}
                  />
                </label>
                <label className={labelClass}>
                  Base notes
                  <input
                    className={inputClass}
                    maxLength={240}
                    value={draft.base}
                    onChange={(event) => updateDraft("base", event.target.value)}
                  />
                </label>
              </div>
              <label className={labelClass}>
                Full description
                <textarea
                  className={inputClass}
                  rows={3}
                  maxLength={2000}
                  value={draft.description}
                  onChange={(event) => updateDraft("description", event.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={pendingAction !== ""}
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold disabled:cursor-wait disabled:opacity-60"
              >
                {pendingAction === "save" ? (
                  <LoaderCircle className="animate-spin" size={17} />
                ) : (
                  <Save size={17} />
                )}
                Add product
              </button>
            </form>
          </section>

          <div className="grid gap-6">
            <section className="glass rounded-2xl p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Products and stock</h2>
                <p className="text-sm text-muted-foreground">
                  Edit a product, then press Save to publish the change.
                </p>
              </div>
              {catalog.products.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[var(--border)] p-6 text-center text-sm text-muted-foreground">
                  No products yet. Add your first product using the form.
                </p>
              ) : (
                <div className="grid gap-3">
                  {catalog.products.map((product) => {
                    const edited = edits[product.id] ?? product;
                    const firstSize = edited.sizes[0] ?? { volume: 50, price: 0 };
                    return (
                      <article
                        key={product.id}
                        className="rounded-xl border border-[var(--border)] bg-[var(--deep)]/30 p-4"
                      >
                        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                          <label className={labelClass}>
                            Product name
                            <input
                              className={inputClass}
                              value={edited.name}
                              maxLength={120}
                              aria-label={`${product.name} product name`}
                              onChange={(event) =>
                                editProduct(product, { name: event.target.value })
                              }
                            />
                          </label>
                          <label className={labelClass}>
                            Price
                            <input
                              className={inputClass}
                              type="number"
                              min="0"
                              step="0.01"
                              value={firstSize.price}
                              aria-label={`${product.name} price`}
                              onChange={(event) =>
                                editProduct(product, {
                                  sizes: edited.sizes.map((size, index) =>
                                    index === 0
                                      ? { ...size, price: Number(event.target.value) }
                                      : size,
                                  ),
                                })
                              }
                            />
                          </label>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            aria-pressed={edited.inStock}
                            onClick={() => editProduct(product, { inStock: !edited.inStock })}
                            className={`rounded-full border px-3 py-1.5 text-xs ${
                              edited.inStock
                                ? "border-[var(--gold)]/50 text-gold-soft"
                                : "border-destructive/50 text-destructive"
                            }`}
                          >
                            {edited.inStock ? "Available" : "Out of stock"}
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={pendingAction !== ""}
                              onClick={() => void saveProduct(product)}
                              className="btn-gold inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                              aria-label={`Save changes for ${product.name}`}
                            >
                              <Save size={14} /> Save
                            </button>
                            <button
                              type="button"
                              disabled={pendingAction !== ""}
                              onClick={() => void removeProduct(product)}
                              className="outline-button inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-destructive disabled:opacity-50"
                              aria-label={`Remove ${product.name}`}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="glass rounded-2xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Store settings</h2>
              <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={saveWhatsapp}>
                <label className={labelClass}>
                  WhatsApp order number
                  <input
                    className={inputClass}
                    inputMode="tel"
                    value={whatsappNumber}
                    onChange={(event) => setWhatsappNumber(event.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  disabled={pendingAction !== ""}
                  className="btn-gold self-end rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  Save number
                </button>
              </form>
              <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={addCategory}>
                <label className={labelClass}>
                  Add a category
                  <input
                    className={inputClass}
                    maxLength={48}
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  disabled={pendingAction !== ""}
                  className="btn-gold self-end rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  Add category
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Current categories">
                {catalog.categories.map((category) => (
                  <span
                    key={category}
                    className="glass rounded-full px-3 py-1.5 text-xs text-gold-soft"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
