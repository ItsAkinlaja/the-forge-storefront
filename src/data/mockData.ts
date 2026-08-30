import { Product, Collection } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  // --- THE MEN FORGE ---
  {
    id: "men-1",
    slug: "royal-imperial-velvet-tuxedo",
    name: "The Royal Imperial Velvet Tuxedo",
    tagline: "Hand-tailored silk-velvet dinner jacket with satin lapel & Aso-Oke silk inner lining",
    price: 3450,
    formattedPrice: "$3,450 / ₦4,830,000",
    mainCategory: "the-men-forge",
    subcategory: "suits-blazers",
    subcategoryName: "Suits & Blazers",
    featured: true,
    isBespoke: true,
    description: "Crafted over 120 hours of master tailoring in our Lagos and Paris ateliers, The Royal Imperial Velvet Tuxedo represents the pinnacle of formal mens wear. Featuring a structured shoulder, hand-rolled satin lapel, and silk lining embroidered with signature Nigerian gold filigree.",
    details: [
      "100% Italian Silk Velvet with woven metallic accents",
      "Hand-finished silk satin shawl lapel",
      "Custom hand-woven Aso-Oke silk lining details",
      "Full canvas construction for unmatched structure & longevity",
      "Handmade to your exact bespoke measurements in Lagos or Paris"
    ],
    fabricCare: [
      "Dry clean only by luxury garment specialists",
      "Store on wide wooden suit hanger provided"
    ],
    images: [
      {
        id: "img-m1-1",
        src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
        alt: "The Royal Imperial Velvet Tuxedo Front View"
      },
      {
        id: "img-m1-2",
        src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85",
        alt: "The Royal Imperial Velvet Tuxedo Detail"
      },
      {
        id: "img-m1-3",
        src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=85",
        alt: "Model styling velvet tuxedo"
      }
    ],
    bespokeOptions: {
      id: "b-m1",
      name: "Master Bespoke Tailoring",
      description: "Submit your exact body measurements for a custom cut pattern created by our lead master tailor.",
      measurementFields: ["Chest", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Jacket Length"],
      availableFabrics: [
        { id: "fab-1", name: "Midnight Obsidian Velvet", colorHex: "#08080A" },
        { id: "fab-2", name: "Deep Royal Navy Velvet", colorHex: "#0B1325" },
        { id: "fab-3", name: "Imperial Gold Brocade Velvet", colorHex: "#382D12" }
      ]
    },
    sizes: ["Bespoke Custom Fit", "48 EU", "50 EU", "52 EU", "54 EU"],
    inStock: true
  },
  {
    id: "men-2",
    slug: "sovereign-embroidered-silk-jalamia",
    name: "The Sovereign Gold-Embroidered Silk Jalamia",
    tagline: "Handmade Nigerian luxury kaftan & Jalamia with intricate 24K gold thread embroidery",
    price: 2850,
    formattedPrice: "$2,850 / ₦3,990,000",
    mainCategory: "the-men-forge",
    subcategory: "jalamia-kaftans",
    subcategoryName: "Jalamia & Kaftans",
    featured: true,
    isBespoke: true,
    description: "An homage to regal Nigerian heritage and modern haute couture minimalism. Cut from heavy mulberry silk crepe de chine with hand-worked metallic gold embroidery along the neck collar, bib, and cuffs.",
    details: [
      "100% Pure Mulberry Silk Crepe de Chine",
      "24K Gold-tone metallic thread hand embroidery by master Nigerian artisans",
      "Concealed hidden placket with mother-of-pearl buttons",
      "Structured standing band collar",
      "Tailored side seam pockets for regal comfort"
    ],
    fabricCare: [
      "Specialist dry clean with embroidery protection",
      "Steam gently inside out"
    ],
    images: [
      {
        id: "img-m2-1",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
        alt: "The Sovereign Gold Embroidered Silk Jalamia"
      },
      {
        id: "img-m2-2",
        src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
        alt: "Jalamia embroidery close up detail"
      }
    ],
    bespokeOptions: {
      id: "b-m2",
      name: "Custom Bespoke Fitting",
      description: "Provide your chest, arm length, and total garment length to ensure regal drape.",
      measurementFields: ["Chest", "Shoulder Width", "Arm Length", "Garment Length"],
      availableFabrics: [
        { id: "fab-j1", name: "Pure Onyx Silk", colorHex: "#050505" },
        { id: "fab-j2", name: "Ivory Gold Weave Silk", colorHex: "#F7F5F0" },
        { id: "fab-j3", name: "Royal Emerald Silk", colorHex: "#0D2818" }
      ]
    },
    sizes: ["Bespoke Custom Fit", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "men-3",
    slug: "cashmere-opera-overcoat",
    name: "The Cashmere Opera Overcoat",
    tagline: "Double-breasted floor-length coat in virgin wool and Mongolian cashmere",
    price: 4200,
    formattedPrice: "$4,200 / ₦5,880,000",
    mainCategory: "the-men-forge",
    subcategory: "luxury-coats",
    subcategoryName: "Luxury Coats",
    featured: false,
    isBespoke: true,
    description: "Designed for dramatic presence, The Cashmere Opera Overcoat features sharp padded shoulders, deep peak lapels, and a sweeping silhouette lined in gold cupro.",
    details: [
      "90% Virgin Wool, 10% Mongolian Cashmere",
      "Full cupro lining in signature gold jacquard",
      "Buffalo horn buttons with gold engraving",
      "Hand-stitched pick detailing along collar"
    ],
    fabricCare: [
      "Dry clean only",
      "Do not tumble dry"
    ],
    images: [
      {
        id: "img-m3-1",
        src: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",
        alt: "Cashmere Opera Overcoat"
      }
    ],
    sizes: ["Bespoke Custom Fit", "48 EU", "50 EU", "52 EU"],
    inStock: true
  },

  // --- THE LADY FORGE ---
  {
    id: "lady-1",
    slug: "aurelia-royal-silk-bridal-gown",
    name: "The Aurelia Royal Silk Bridal Gown",
    tagline: "Custom handmade wedding dress with cathedral train & Coral bead filigree accent",
    price: 8900,
    formattedPrice: "$8,900 / ₦12,460,000",
    mainCategory: "the-lady-forge",
    subcategory: "wedding-dresses",
    subcategoryName: "Wedding Dresses",
    featured: true,
    isBespoke: true,
    description: "The crown jewel of The Lady Forge bridal atelier. Combining a sculptured internal corset bodice with draped heavy duchesse silk satin, hand-attached French Chantilly lace, and optional Nigerian royal coral-crystal beadwork along the neckline.",
    details: [
      "100% Italian Duchesse Silk Satin",
      "Hand-boned internal corset for waist sculpt",
      "French Chantilly lace accents with hand-beaded crystal & coral filigree",
      "Includes matching silk organza veil",
      "Over 200 hours of artisanal hand craftsmanship in Lagos & London"
    ],
    fabricCare: [
      "Specialist bridal preservation dry clean",
      "Keep in acid-free archival garment box provided"
    ],
    images: [
      {
        id: "img-l1-1",
        src: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85",
        alt: "The Aurelia Royal Silk Bridal Gown"
      },
      {
        id: "img-l1-2",
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
        alt: "Bridal Gown Train and Lace Detail"
      },
      {
        id: "img-l1-3",
        src: "https://images.unsplash.com/photo-1546804784-896d0dca3800?auto=format&fit=crop&w=1200&q=85",
        alt: "Bespoke Bridal Fitting"
      }
    ],
    bespokeOptions: {
      id: "b-l1",
      name: "Haute Couture Bridal Fitting",
      description: "Direct consultation and custom gown pattern created exclusively for your physique.",
      measurementFields: ["Bust", "Underbust", "Waist", "Hips", "Hollow to Hem", "Shoe Height"],
      availableFabrics: [
        { id: "fab-b1", name: "Pure Ivory Duchesse Silk", colorHex: "#FFFDF9" },
        { id: "fab-b2", name: "Warm Champagne Silk Satin", colorHex: "#F2E8D5" },
        { id: "fab-b3", name: "Classic Pure White Silk", colorHex: "#FFFFFF" }
      ]
    },
    sizes: ["Bespoke Custom Fit"],
    inStock: true
  },
  {
    id: "lady-2",
    slug: "obsidian-velvet-gold-embroidered-gala-gown",
    name: "The Obsidian Velvet Gala Evening Gown",
    tagline: "Sculpted column gown with gold filigree hand embroidery",
    price: 4950,
    formattedPrice: "$4,950 / ₦6,930,000",
    mainCategory: "the-lady-forge",
    subcategory: "couture-gowns",
    subcategoryName: "Couture Gowns",
    featured: true,
    isBespoke: true,
    description: "Designed for galas and royal receptions, this striking velvet gown features a deep architectural V-neckline framed in hand-worked metallic gold embroidery and a high thigh slit.",
    details: [
      "Micro-velvet with subtle stretch memory",
      "Hand-beaded gold bullion thread around neckline & waistline",
      "Hidden back zippering with silk-covered buttons",
      "Floor-length with subtle fishtail flare"
    ],
    fabricCare: ["Dry clean only by haute couture garment specialists"],
    images: [
      {
        id: "img-l2-1",
        src: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85",
        alt: "Obsidian Velvet Gala Evening Gown"
      },
      {
        id: "img-l2-2",
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
        alt: "Gold Embroidered Gown Detail"
      }
    ],
    bespokeOptions: {
      id: "b-l2",
      name: "Custom Couture Measurements",
      description: "Tailored to accentuate your silhouette.",
      measurementFields: ["Bust", "Waist", "Hips", "Height"],
      availableFabrics: [
        { id: "fab-g1", name: "Obsidian Black Velvet", colorHex: "#050505" },
        { id: "fab-g2", name: "Midnight Sapphire Velvet", colorHex: "#081B33" }
      ]
    },
    sizes: ["Bespoke Custom Fit", "36 EU", "38 EU", "40 EU", "42 EU"],
    inStock: true
  },
  {
    id: "lady-3",
    slug: "empress-double-breasted-silk-suit-set",
    name: "The Empress Double-Breasted Silk Suit Set",
    tagline: "Hand-tailored structured blazer with wide-leg trousers in heavy silk crepon",
    price: 3600,
    formattedPrice: "$3,600 / ₦5,040,000",
    mainCategory: "the-lady-forge",
    subcategory: "tailored-suits",
    subcategoryName: "Tailored Suits",
    featured: false,
    isBespoke: true,
    description: "Command power and elegance. The Empress Suit features sharp exaggerated peak lapels, 24K gold filigree buttons, and high-waisted fluid trousers that lengthen the silhouette.",
    details: [
      "100% Heavy Silk Crepon",
      "Gold filigree crest buttons",
      "Fully canvassed jacket body",
      "High-rise wide leg trouser with front pleats"
    ],
    fabricCare: ["Dry clean only"],
    images: [
      {
        id: "img-l3-1",
        src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
        alt: "The Empress Double-Breasted Silk Suit Set"
      }
    ],
    sizes: ["Bespoke Custom Fit", "36 EU", "38 EU", "40 EU"],
    inStock: true
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col-men-signature",
    slug: "the-men-forge-collection",
    title: "THE MEN FORGE",
    subtitle: "Bespoke Tailoring, Luxury Suits & Regal Jalamias",
    description: "Sovereign power expressed through razor-sharp tailoring, silk velvet dinner jackets, and gold-embroidered royal kaftans.",
    mainCategory: "the-men-forge",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85",
    products: MOCK_PRODUCTS.filter(p => p.mainCategory === "the-men-forge")
  },
  {
    id: "col-lady-signature",
    slug: "the-lady-forge-collection",
    title: "THE LADY FORGE",
    subtitle: "Haute Couture, Bespoke Bridal & Velvet Gowns",
    description: "Artisanal elegance crafted to perfection. Discover bespoke wedding dresses, sculpted gala gowns, and tailored silk suits.",
    mainCategory: "the-lady-forge",
    heroImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1800&q=85",
    products: MOCK_PRODUCTS.filter(p => p.mainCategory === "the-lady-forge")
  }
];
