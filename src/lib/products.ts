export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "hoodies",
    name: "Hoodies",
    price: 35.23,
    description: "Comfortable team hoodies with company logo"
  },
  {
    id: "quarter-zips",
    name: "Quarter Zips",
    price: 31.37,
    description: "Professional quarter-zip pullovers"
  },
  {
    id: "tshirts",
    name: "T-Shirts",
    price: 8.44,
    description: "Classic team t-shirts"
  },
  {
    id: "polo-shirts",
    name: "Polo Shirts",
    price: 17.23,
    description: "Business casual polo shirts"
  },
  {
    id: "stickers",
    name: "Stickers",
    price: 0,
    description: "Free company logo stickers"
  }
];
