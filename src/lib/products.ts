export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "hoodies",
    name: "Hoodies",
    price: 35.23,
    description: "Comfortable team hoodies with company logo",
    image: "/images/hoodies.jpg"
  },
  {
    id: "quarter-zips",
    name: "Quarter Zips",
    price: 31.37,
    description: "Professional quarter-zip pullovers",
    image: "/images/quarter-zips.jpg"
  },
  {
    id: "tshirts",
    name: "T-Shirts",
    price: 8.44,
    description: "Classic team t-shirts",
    image: "/images/tshirts.jpg"
  },
  {
    id: "polo-shirts",
    name: "Polo Shirts",
    price: 17.23,
    description: "Business casual polo shirts",
    image: "/images/polo-shirts.jpg"
  },
  {
    id: "stickers",
    name: "Stickers",
    price: 0,
    description: "Free company logo stickers",
    image: "/images/stickers.jpg"
  }
];
