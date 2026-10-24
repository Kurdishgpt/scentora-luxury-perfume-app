import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { routeTree } from "@/routeTree.gen";
import {
  createProductFn,
  getAdminSessionFn,
  signInAdminFn,
  updateProductFn,
} from "@/lib/catalog.functions";

async function renderAt(path: string) {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("interactive buttons", () => {
  it("opens product details, adds to the bag, and updates/removes cart items", async () => {
    await renderAt("/");

    fireEvent.click(await screen.findByRole("button", { name: "Discover fragrance: Oud Wood" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Woody · Spicy");
    fireEvent.click(screen.getByRole("button", { name: /^Add to bag$/ }));

    fireEvent.click(screen.getByRole("button", { name: "Shopping bag, 1 items" }));
    const cart = screen.getByRole("dialog", { name: /your bag/i });
    fireEvent.click(within(cart).getByRole("button", { name: "Increase quantity" }));
    expect(within(cart).getByText("2", { selector: ".quantity-control span" })).toBeInTheDocument();

    fireEvent.click(within(cart).getByRole("button", { name: "Remove item: Oud Wood" }));
    expect(within(cart).getByText("A beautiful beginning.")).toBeInTheDocument();
  });

  it("filters products and cycles the language control", async () => {
    await renderAt("/");

    fireEvent.click(await screen.findByRole("button", { name: "Floral" }));
    expect(
      screen.getByRole("button", { name: "Discover fragrance: Rosewater" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Discover fragrance: Oud Wood" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Switch language to Kurdish, then Arabic" }),
    );
    expect(screen.getByRole("main")).toHaveAttribute("lang", "ku");
  });

  it("saves product and inventory changes from the admin panel", async () => {
    await renderAt("/admin");

    fireEvent.change(screen.getByRole("textbox", { name: /Product name/ }), {
      target: { value: "Sea Breeze" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Brand *" }), {
      target: { value: "Scentora" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Product image URL *" }), {
      target: { value: "https://example.com/sea-breeze.jpg" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /Sizes and prices/ }), {
      target: { value: "50:88" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add product" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Product added to the store.");
    expect(createProductFn).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("textbox", { name: "Sea Breeze product name" })).toHaveValue(
      "Sea Breeze",
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Oud Wood product name" }), {
      target: { value: "Oud Wood Reserve" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes for Oud Wood" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Oud Wood Reserve saved.");
    expect(updateProductFn).toHaveBeenCalledTimes(1);
  });

  it("signs in and opens the protected admin dashboard", async () => {
    vi.mocked(getAdminSessionFn).mockResolvedValueOnce({ isAdmin: false });
    await renderAt("/admin");

    fireEvent.change(screen.getByLabelText("Admin password"), {
      target: { value: "example-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("heading", { name: "Admin dashboard" })).toBeInTheDocument();
    expect(signInAdminFn).toHaveBeenCalledWith({ data: { password: "example-password" } });
  });
});
