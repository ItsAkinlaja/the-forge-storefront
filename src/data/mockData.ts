import { Product, Collection } from "@/types";

// Naira exchange rate -- update as needed
const NGN = (usd: number) => `N${(usd * 1600).toLocaleString()}`;
const fmt  = (usd: number) => `N${(usd * 1600).toLocaleString()}`;

export const MOCK_PRODUCTS: Product[] = [

  // ── THE MEN FORGE ─────────────────────────────────────────────────────────

  {
    id: "men-1",
    slug: "vintage-oxford-shirt",
    name: "The Forge Vintage Oxford Shirt",
    tagline: "Premium long-sleeve Oxford shirt with embroidered Forge logo crest",
    price: 45000,
    formattedPrice: fmt(45000),
    mainCategory: "the-men-forge",
    subcategory: "vintage-shirts",
    subcategoryName: "Vintage by Forge",
    featured: true,
    isBespoke: false,
    description: "The foundational piece of The Forge menswear identity. Crafted from a heavyweight 120gsm cotton Oxford weave with a subtle grid texture, this long-sleeve shirt carries the signature Forge embroidered crest at the chest pocket. Cut slightly relaxed through the body for effortless versatility from street to boardroom.",
    details: [
      "100% heavyweight cotton Oxford weave",
      "Embroidered Forge crest at chest",
      "Button-down collar with collar stays",
      "Single-button barrel cuffs",
      "Available in regular and slim fit"
    ],
    fabricCare: ["Machine wash cold", "Iron on medium heat", "Do not bleach"],
    images: [
      { id: "img-m1-1", src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85", alt: "Forge Vintage Oxford Shirt front" },
      { id: "img-m1-2", src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85", alt: "Oxford Shirt detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    inStock: true
  },

  {
    id: "men-2",
    slug: "forge-cargo-pant",
    name: "The Forge Cargo Pant",
    tagline: "Relaxed-fit tactical cargo with signature gold hardware",
    price: 55000,
    formattedPrice: fmt(55000),
    mainCategory: "the-men-forge",
    subcategory: "streetwear",
    subcategoryName: "Streetwear",
    featured: true,
    isBespoke: false,
    description: "Built for the streets, refined for The Forge. Our cargo pant is cut in a relaxed straight silhouette from durable cotton canvas with six functional pockets, taped seams, and signature gold zip pulls throughout. Pairs with the Forge Vintage Shirt or any graphic tee.",
    details: [
      "98% cotton canvas, 2% elastane",
      "Six functional pockets including two cargo side pockets",
      "Signature gold YKK zip hardware",
      "Taped seams for durability",
      "Elastic waistband with drawstring"
    ],
    fabricCare: ["Machine wash cold", "Tumble dry low", "Iron on low heat"],
    images: [
      { id: "img-m2-1", src: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85", alt: "Forge Cargo Pant" },
      { id: "img-m2-2", src: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=85", alt: "Cargo detail" }
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    inStock: true
  },

  {
    id: "men-3",
    slug: "forge-street-jacket",
    name: "The Forge Street Jacket",
    tagline: "Oversized utility jacket in waxed cotton with embossed Forge branding",
    price: 85000,
    formattedPrice: fmt(85000),
    mainCategory: "the-men-forge",
    subcategory: "streetwear",
    subcategoryName: "Streetwear",
    featured: false,
    isBespoke: false,
    description: "An oversized street-to-event jacket that defines The Forge aesthetic -- utilitarian structure meets luxury finish. Waxed cotton exterior, satin-touch lining, and embossed Forge branding on the back yoke.",
    details: [
      "Waxed 100% cotton outer",
      "Satin-feel inner lining",
      "Four exterior zip pockets",
      "Embossed Forge logo rear yoke",
      "Adjustable hem drawstring"
    ],
    fabricCare: ["Spot clean only", "Re-wax periodically to maintain finish"],
    images: [
      { id: "img-m3-1", src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85", alt: "Forge Street Jacket" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true
  },

  {
    id: "men-4",
    slug: "forge-jogger",
    name: "The Forge Signature Jogger",
    tagline: "Premium French terry jogger with gold ankle zip and embroidered logo",
    price: 42000,
    formattedPrice: fmt(42000),
    mainCategory: "the-men-forge",
    subcategory: "streetwear",
    subcategoryName: "Streetwear",
    featured: false,
    isBespoke: false,
    description: "The Forge Jogger is the premium take on an everyday essential. French terry cotton, tapered from thigh to ankle, finished with a gold ankle zip and embroidered Forge wordmark at the left thigh.",
    details: [
      "300gsm French terry cotton",
      "Tapered silhouette with gold ankle zip",
      "Embroidered logo at left thigh",
      "Deep side pockets and back zip pocket",
      "Ribbed waistband with internal drawstring"
    ],
    fabricCare: ["Machine wash cold inside out", "Do not tumble dry", "Iron on low"],
    images: [
      { id: "img-m4-1", src: "https://images.unsplash.com/photo-1529391409740-59f2cea08bc4?auto=format&fit=crop&w=1200&q=85", alt: "Forge Signature Jogger" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true
  },

  {
    id: "men-5",
    slug: "forge-corporate-trouser",
    name: "The Forge Corporate Trouser",
    tagline: "Slim-tapered corporate pant in Italian wool-blend suiting fabric",
    price: 65000,
    formattedPrice: fmt(65000),
    mainCategory: "the-men-forge",
    subcategory: "pants",
    subcategoryName: "Pants",
    featured: false,
    isBespoke: false,
    description: "Elevated office dressing starts here. Cut from a mid-weight Italian wool-blend with a slight sheen, the Forge Corporate Trouser delivers a razor-clean silhouette that holds its shape all day.",
    details: [
      "Italian wool-blend suiting fabric",
      "Slim tapered cut from hip to ankle",
      "Flat-front with side-adjusters",
      "Satin-tape inner leg seam",
      "Available in custom length at checkout"
    ],
    fabricCare: ["Dry clean recommended", "Steam to refresh"],
    images: [
      { id: "img-m5-1", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85", alt: "Forge Corporate Trouser" }
    ],
    sizes: ["28", "30", "32", "34", "36", "38", "Custom Length"],
    inStock: true
  },

  {
    id: "men-6",
    slug: "forge-palazzo-pant",
    name: "The Forge Palazzo Pant",
    tagline: "Wide-leg relaxed palazzo in breathable linen-cotton blend",
    price: 48000,
    formattedPrice: fmt(48000),
    mainCategory: "the-men-forge",
    subcategory: "pants",
    subcategoryName: "Pants",
    featured: false,
    isBespoke: false,
    description: "A modern Nigerian man does not compromise comfort for style. The Forge Palazzo gives you both -- a wide relaxed leg in a breathable linen-cotton blend that moves effortlessly from casual events to dinners.",
    details: [
      "55% linen, 45% cotton",
      "High-rise wide leg silhouette",
      "Elasticated back waistband",
      "Side slip pockets",
      "Breathable and fast-drying"
    ],
    fabricCare: ["Machine wash cold", "Line dry", "Cool iron"],
    images: [
      { id: "img-m6-1", src: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?auto=format&fit=crop&w=1200&q=85", alt: "Forge Palazzo Pant" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true
  },

  {
    id: "men-7",
    slug: "forge-snapback-cap",
    name: "The Forge Snapback Cap",
    tagline: "Structured six-panel cap with gold embroidered Forge crest",
    price: 18000,
    formattedPrice: fmt(18000),
    mainCategory: "the-men-forge",
    subcategory: "caps",
    subcategoryName: "Caps",
    featured: false,
    isBespoke: false,
    description: "Statement headwear for the Forge man. A structured six-panel snapback in premium wool-blend with the gold-thread embroidered Forge crest front and centre. Adjustable snapback closure fits all head sizes.",
    details: [
      "Structured wool-blend front panels",
      "Gold-thread embroidered Forge crest",
      "Flat brim with Forge branding underside",
      "Adjustable plastic snapback closure",
      "Sweat-wicking inner headband"
    ],
    fabricCare: ["Spot clean only", "Do not machine wash", "Air dry away from sunlight"],
    images: [
      { id: "img-m7-1", src: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85", alt: "Forge Snapback Cap" }
    ],
    sizes: ["One Size"],
    inStock: true
  },

  {
    id: "men-8",
    slug: "forge-two-piece-set",
    name: "The Forge 2-Piece Set",
    tagline: "Matching shirt and trouser set in premium cotton-linen blend",
    price: 95000,
    formattedPrice: fmt(95000),
    mainCategory: "the-men-forge",
    subcategory: "two-piece",
    subcategoryName: "2-Piece Outfits",
    featured: true,
    isBespoke: false,
    description: "Coordinated dressing made effortless. The Forge 2-Piece brings together a relaxed long-sleeve shirt and matching wide-leg trouser in the same premium cotton-linen blend. Available in three signature Forge colourways.",
    details: [
      "60% cotton, 40% linen blend",
      "Matching shirt and trouser in same fabric",
      "Relaxed shirt with button-through placket",
      "Wide-leg trouser with elasticated waist",
      "Available in Obsidian Black, Sand Cream, and Forest Olive"
    ],
    fabricCare: ["Machine wash cold", "Line dry", "Cool iron"],
    images: [
      { id: "img-m8-1", src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=85", alt: "Forge 2-Piece Set" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true
  },

  {
    id: "men-9",
    slug: "forge-embroidered-jalabiya",
    name: "The Forge Embroidered Jalabiya",
    tagline: "Premium cotton jalabiya with hand-embroidered Forge collar detail",
    price: 75000,
    formattedPrice: fmt(75000),
    mainCategory: "the-men-forge",
    subcategory: "jalabias",
    subcategoryName: "Jalabias",
    featured: true,
    isBespoke: false,
    description: "Heritage meets modern luxury. The Forge Jalabiya is cut from a heavy premium cotton with a structured silhouette and features hand-embroidered detailing around the collar, bib, and cuffs in contrasting thread. A statement piece for Eid, weddings, and high-profile events.",
    details: [
      "100% heavyweight premium cotton",
      "Hand-embroidered collar, bib, and cuff detail",
      "Concealed side pockets",
      "Available in White, Navy, Black, and Sand",
      "Tailored in Lagos"
    ],
    fabricCare: ["Hand wash cold or dry clean", "Steam gently", "Do not wring"],
    images: [
      { id: "img-m9-1", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85", alt: "Forge Embroidered Jalabiya" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    inStock: true
  },

  {
    id: "men-10",
    slug: "forge-danshiki",
    name: "The Forge Danshiki",
    tagline: "Contemporary danshiki in Ankara and cotton-blend with modern cut",
    price: 38000,
    formattedPrice: fmt(38000),
    mainCategory: "the-men-forge",
    subcategory: "danshiki",
    subcategoryName: "Danshiki",
    featured: false,
    isBespoke: false,
    description: "A contemporary interpretation of the classic danshiki. The Forge version uses locally sourced Ankara fabric combined with a structured cotton body for a cleaner, more modern silhouette that works for both casual and semi-formal occasions.",
    details: [
      "Locally sourced premium Ankara fabric",
      "Structured cotton-blend body",
      "V-neck with embroidered placket",
      "Side seam split hem",
      "Available in rotating seasonal Ankara prints"
    ],
    fabricCare: ["Machine wash cold inside out", "Line dry", "Iron on reverse side"],
    images: [
      { id: "img-m10-1", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85", alt: "Forge Danshiki" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true
  },

  // ── THE LADY FORGE ─────────────────────────────────────────────────────────

  {
    id: "lady-1",
    slug: "forge-corporate-dress",
    name: "The Forge Corporate Dress",
    tagline: "Structured midi dress in Italian ponte fabric with Forge monogram buttons",
    price: 78000,
    formattedPrice: fmt(78000),
    mainCategory: "the-lady-forge",
    subcategory: "corporate-dresses",
    subcategoryName: "Corporate Dresses",
    featured: true,
    isBespoke: false,
    description: "Power dressing redefined. The Forge Corporate Dress is a structured midi in Italian double ponte that holds its shape from morning meetings to evening events. Clean lines, a modest front slit, and signature Forge monogram buttons elevate this beyond the ordinary workwear dress.",
    details: [
      "Italian double ponte fabric",
      "Structured fit-and-flare midi silhouette",
      "Forge monogram buttons on cuffs and centre back",
      "Front inverted pleat for ease of movement",
      "Concealed back zip with hook-and-eye closure"
    ],
    fabricCare: ["Dry clean recommended", "Steam to refresh", "Do not tumble dry"],
    images: [
      { id: "img-l1-1", src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85", alt: "Forge Corporate Dress" },
      { id: "img-l1-2", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85", alt: "Corporate Dress detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true
  },

  {
    id: "lady-2",
    slug: "forge-blazer",
    name: "The Forge Power Blazer",
    tagline: "Oversized double-breasted blazer with gold Forge crest buttons",
    price: 95000,
    formattedPrice: fmt(95000),
    mainCategory: "the-lady-forge",
    subcategory: "blazers",
    subcategoryName: "Blazers",
    featured: true,
    isBespoke: false,
    description: "The statement blazer that owns every room. An oversized double-breasted silhouette cut from a premium wool-blend suiting fabric with wide peak lapels and gold Forge crest buttons. Wear it over the matching trouser for the full power suit look or belted over a mini skirt.",
    details: [
      "Premium wool-blend suiting fabric",
      "Oversized double-breasted silhouette",
      "Gold Forge crest embossed buttons",
      "Wide peak lapels",
      "Two welt pockets and one chest pocket"
    ],
    fabricCare: ["Dry clean only", "Steam to shape", "Store on wide hanger"],
    images: [
      { id: "img-l2-1", src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85", alt: "Forge Power Blazer" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true
  },

  {
    id: "lady-3",
    slug: "forge-lady-two-piece",
    name: "The Forge Lady 2-Piece",
    tagline: "Co-ord crop top and wide-leg trouser set in textured cotton",
    price: 88000,
    formattedPrice: fmt(88000),
    mainCategory: "the-lady-forge",
    subcategory: "two-piece",
    subcategoryName: "2-Piece Outfits",
    featured: true,
    isBespoke: false,
    description: "The effortless co-ord for every occasion. A structured crop top and matching high-waisted wide-leg trouser in a premium textured cotton. Clean lines, minimal branding, maximum impact. Dress it up with heels or down with sneakers.",
    details: [
      "Textured premium cotton blend",
      "Structured crop top with invisible back zip",
      "High-waisted wide-leg trouser",
      "Available in Black, Ivory, and Rust",
      "Sold as a set"
    ],
    fabricCare: ["Machine wash cold", "Line dry", "Cool iron on reverse"],
    images: [
      { id: "img-l3-1", src: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85", alt: "Forge Lady 2-Piece" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },

  {
    id: "lady-4",
    slug: "forge-dinner-dress",
    name: "The Forge Dinner Dress",
    tagline: "Floor-length halter-neck evening dress in luxe crepe with open back",
    price: 120000,
    formattedPrice: fmt(120000),
    mainCategory: "the-lady-forge",
    subcategory: "dinner-birthday",
    subcategoryName: "Dinner and Birthday Dresses",
    featured: true,
    isBespoke: false,
    description: "Made to be remembered. The Forge Dinner Dress is a floor-length halter-neck in heavyweight crepe with a dramatic open back and a subtle side slit. Minimal adornment -- the silhouette does all the work.",
    details: [
      "Heavyweight crepe with natural drape",
      "Halter neck with adjustable tie",
      "Open back with concealed hook-and-eye closure",
      "Side slit at right leg",
      "Fully lined in silk-touch fabric"
    ],
    fabricCare: ["Dry clean only", "Store hanging on padded hanger"],
    images: [
      { id: "img-l4-1", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85", alt: "Forge Dinner Dress" },
      { id: "img-l4-2", src: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85", alt: "Dinner Dress back detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },

  {
    id: "lady-5",
    slug: "forge-birthday-mini",
    name: "The Forge Birthday Mini",
    tagline: "Figure-hugging bandage mini in stretch crepe with cutout detail",
    price: 65000,
    formattedPrice: fmt(65000),
    mainCategory: "the-lady-forge",
    subcategory: "dinner-birthday",
    subcategoryName: "Dinner and Birthday Dresses",
    featured: false,
    isBespoke: false,
    description: "Your birthday outfit sorted. A body-conscious stretch-crepe mini with a signature waist cutout and one-shoulder neckline. Designed to make an entrance and stay comfortable all night.",
    details: [
      "Stretch crepe with recovery",
      "One-shoulder neckline",
      "Waist cutout panel",
      "Rear concealed zip",
      "Fully lined"
    ],
    fabricCare: ["Hand wash cold", "Line dry", "Do not tumble dry"],
    images: [
      { id: "img-l5-1", src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85", alt: "Forge Birthday Mini" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col-men",
    slug: "the-men-forge",
    title: "THE MEN FORGE",
    subtitle: "Vintage. Streetwear. Culture. Lagos.",
    description: "From premium Oxford shirts and cargo pants to embroidered Jalabias and Danshikis -- The Men Forge is built for the Nigerian man who does not compromise.",
    mainCategory: "the-men-forge",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85",
    products: MOCK_PRODUCTS.filter(p => p.mainCategory === "the-men-forge")
  },
  {
    id: "col-lady",
    slug: "the-lady-forge",
    title: "THE LADY FORGE",
    subtitle: "Corporate. Dinner. Celebration.",
    description: "Power blazers, corporate dresses, co-ord sets, and dinner gowns. The Lady Forge is for the Nigerian woman who dresses with intention.",
    mainCategory: "the-lady-forge",
    heroImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1800&q=85",
    products: MOCK_PRODUCTS.filter(p => p.mainCategory === "the-lady-forge")
  }
];
