import { normalizeCatalogImage } from "@/lib/catalog-images";

describe("normalizeCatalogImage", () => {
  it.each([
    ["/src/assets/oud-wood.jpg", "/images/oud-wood.jpg"],
    ["/src/assets/rosewater.jpg", "/images/rosewater.jpg"],
    ["/assets/hero-bottle-AbC123.jpg", "/images/hero-bottle.jpg"],
  ])("repairs old bundled asset paths: %s", (image, expected) => {
    expect(normalizeCatalogImage(image)).toBe(expected);
  });

  it("preserves gallery uploads and external images", () => {
    const dataImage = "data:image/jpeg;base64,dGVzdA==";
    const externalImage = "https://images.example.com/custom.jpg";

    expect(normalizeCatalogImage(dataImage)).toBe(dataImage);
    expect(normalizeCatalogImage(externalImage)).toBe(externalImage);
  });
});
