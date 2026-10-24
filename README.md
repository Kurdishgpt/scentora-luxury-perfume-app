# Scentora Luxury Perfume App

Part 1: The UI Kit System (Consistency)

Use this segment first. It establishes the rules for all screens.

Prompt (UI System): High-fidelity UI design showcase for a luxury perfume app named 'SCENTORA', dark green and gold color palette, premium aesthetic, glassmorphism elements, clean minimal iconography, serif headlines combined with clean sans-serif body text, consistent padding and rounded corner radius across all screens, soft backlighting and blurred bokeh floral background textures, professional Figma style showcase, photorealistic rendering.

Part 2: Screen 1: The Onboarding (Welcome)

Add this after the UI System part to describe the first screen.

Prompt (Screen 1): Include the Onboarding/Welcome Screen: A central floating frosted glass panel with a sleek logo (perfume bottle within a stylized 'L'). Text reads "SCENTORA" and "Discover Your Essence. Luxury perfumes. Exquisite scents." A large, elegant gold call-to-action button with a right arrow icon reads "Explore Scents." Soft, dark green background.

Part 3: Screen 2: The Home (Main Shop) Page

Add this after Screen 1 to describe the main navigation and content.

Prompt (Screen 2): Include the Home Screen (Shop): Top navigation bar with the logo and a cart icon with a '2' badge. A main hero banner card: "Find Your Signature Scent." with a detailed product photo of a premium clear glass perfume bottle with a gold cap. Section below for a horizontal row of icon-based "Notes" category filters (Citrus, Floral, Woody, etc.). Below the filters, a "Best Sellers" grid with detailed product cards, pricing, and 5-star ratings. Bottom navigation bar with elegant icons for Home, Scents, Collections, Wishlist, and Profile.

Part 4: Screen 3: The Product Detail Page (Oud Wood)

Add this after Screen 2 to describe a single product focus.

Prompt (Screen 3): Include the Product Detail Page: A single, close-up, high-definition photo of a specific luxury product, "Oud Wood." Title, description, and price ($95.00) are clear. Use a stylized data row of icons below the description for key features: Key Note (Oud), Longevity (Long Lasting), Projection (Strong), and Gender (Unisex). Small floating gold heart and share icons are present. A primary gold 'Add to Bag' button is at the very bottom.

Part 4: Screen 4: The 'My Bag' (Cart & Checkout) Page

Add this final section to complete the flow.

Prompt (Screen 4): Include the 'My Bag' / Cart Screen: A vertical list of items with product thumbnails (Oud Wood, Rosewater). Quantity selectors (+ 1 -). A detailed checkout summary with Promo Code input, Subtotal ($175.00), Shipping ($8.50), and the Total ($183.50). A large, primary gold button at the bottom reads "Proceed to Checkout" with a right arrow. All screens side-by-side.

How to use these in Midjourney:

For a result showing all screens together (like the image you provided), combine all the parts into one large prompt, like this:

/imagine prompt: [Part 1: UI Kit System] + [Part 2: Onboarding] + [Part 3: Home Page] + [Part 4: Product Detail] + [Part 5: Cart Page]

Pro Tips for UI Generation:

Iterative Focus: If the prompt gets too long, you might get a messy result. Sometimes it is better to generate one screen perfectly, and then use the result of that first image as an "image prompt" (or reference image) when you create the second screen, to force stylistic consistency.

Specific Style References: I included glassmorphism and Figma style showcase. These terms are critical for getting a professional, modern look.

AspectRatio (AR): For a mobile layout on a single canvas, add --ar 3:4 or --ar 9:16 to the end of the combined prompt to define the correct canvas orientation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e29958b-fe32-4178-8844-0075bfc8406c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
