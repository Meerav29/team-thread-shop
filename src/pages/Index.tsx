import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CartSummary } from "@/components/CartSummary";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
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

const Index = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const { toast } = useToast();

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    toast({
      title: "Added to cart",
      description: "Item has been added to your order",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [productId]: quantity
      }));
    }
  };

  const getCartItems = (): CartItem[] => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = PRODUCTS.find(p => p.id === productId);
        return product ? { ...product, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  };

  const handleCheckout = () => {
    // Generate a simple order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    // In a real app, this would submit to your database
    console.log("Order placed:", {
      orderNumber,
      items: getCartItems(),
      timestamp: new Date().toISOString()
    });
    
    setOrderPlaced(orderNumber);
    setCart({});
    
    toast({
      title: "Order placed successfully!",
      description: `Order ${orderNumber} has been submitted for review.`,
    });
  };

  const resetToShopping = () => {
    setOrderPlaced(null);
  };

  if (orderPlaced) {
    return (
      <OrderConfirmation 
        orderNumber={orderPlaced}
        onBackToShopping={resetToShopping}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Team Merch Store
            </h1>
            <p className="text-muted-foreground">
              Limited edition team merchandise - Order your items below
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary 
              items={getCartItems()}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;