export type MainCategory = "the-men-forge" | "the-lady-forge";

export type MenSubcategory =
  | "vintage-shirts"
  | "streetwear"
  | "pants"
  | "caps"
  | "two-piece"
  | "jalabias"
  | "danshiki"
  | "casual";

export type LadySubcategory =
  | "corporate-dresses"
  | "blazers"
  | "two-piece"
  | "dinner-birthday";

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
  measurementFields: string[];
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

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  total: number;
  formattedTotal: string;
  paystackReference?: string;
  createdAt: string;
}
