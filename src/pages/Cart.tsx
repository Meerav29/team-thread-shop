import { CartSummary } from "@/components/CartSummary";
import { OrderConfirmation } from "@/components/OrderConfirmation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartPageProps {
  items: CartItem[];
  onCheckout: () => void;
  orderPlaced: string | null;
  resetToShopping: () => void;
}

const Cart = ({ items, onCheckout, orderPlaced, resetToShopping }: CartPageProps) => {
  if (orderPlaced) {
    return (
      <OrderConfirmation orderNumber={orderPlaced} onBackToShopping={resetToShopping} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <CartSummary items={items} onCheckout={onCheckout} />
      </main>
    </div>
  );
};

export default Cart;
