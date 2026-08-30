export type MainCategory = "the-men-forge" | "the-lady-forge";

export type MenSubcategory = 
  | "suits-blazers" 
  | "jalamia-kaftans" 
  | "luxury-coats" 
  | "custom-trousers" 
  | "bespoke-shirts";

export type LadySubcategory = 
  | "wedding-dresses" 
  | "couture-gowns" 
  | "tailored-suits" 
  | "handmade-dresses" 
  | "corsetry-bustiers";

export type Subcategory = MenSubcategory | LadySubcategory;

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface BespokeFittingOption {
  id: string;
  name: string;
  description: string;
  measurementFields: string[]; // e.g. ["Chest/Bust", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Total Length"]
  availableFabrics: {
    id: string;
    name: string;
    colorHex: string;
    image?: string;
  }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  price: number;
  formattedPrice: string;
  mainCategory: MainCategory;
  subcategory: Subcategory;
  subcategoryName: string;
  featured: boolean;
  isBespoke: boolean;
  description: string;
  details: string[];
  fabricCare: string[];
  images: ProductImage[];
  bespokeOptions?: BespokeFittingOption;
  sizes?: string[];
  inStock: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  mainCategory: MainCategory;
  heroImage: string;
  products: Product[];
}

export interface BespokeMeasurementData {
  chestOrBust: string;
  waist: string;
  hips: string;
  shoulderWidth: string;
  sleeveLength: string;
  height: string;
  fabricPreference: string;
  customNotes?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize?: string;
  bespokeMeasurements?: BespokeMeasurementData;
  quantity: number;
}
