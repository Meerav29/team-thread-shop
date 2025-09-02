import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

interface IndexProps {
  cart: Record<string, number>;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const Index = ({ cart, addToCart, updateQuantity }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] || 0}
              onAddToCart={addToCart}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
