import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { routeTree } from "@/routeTree.gen";

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
    expect(screen.getByRole("button", { name: "Discover fragrance: Rosewater" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Discover fragrance: Oud Wood" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Switch language to Kurdish, then Arabic" }));
    expect(screen.getByRole("main")).toHaveAttribute("lang", "ku");
  });

  it("gives admin controls an action and status feedback", async () => {
    await renderAt("/admin");

    fireEvent.click(await screen.findByRole("button", { name: "چوونەژوورەوە" }));
    expect(screen.getByRole("status")).toHaveTextContent("چوونەژوورەوە لەم پێشبینینەدا چالاک نییە.");

    fireEvent.click(await screen.findByRole("button", { name: "زانیاری فرۆشگا" }));
    expect(screen.getByRole("textbox", { name: "ناوی فرۆشگا" })).toHaveValue("سێنتۆرا");
    fireEvent.change(screen.getByRole("textbox", { name: "ناوی فرۆشگا" }), { target: { value: "Maya" } });
    expect(screen.getByRole("textbox", { name: "ناوی فرۆشگا" })).toHaveValue("Maya");
  });
});
