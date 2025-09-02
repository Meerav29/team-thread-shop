import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import { Header } from "@/components/Header";
import { PRODUCTS, Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  orderNumber: string;
  items: CartItem[];
  timestamp: string;
}

const App = () => {
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
    setCart(prev => {
      if (quantity === 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      return { ...prev, [productId]: quantity };
    });
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
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      orderNumber,
      items: getCartItems(),
      timestamp: new Date().toISOString()
    };
    const existingOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    console.log("Order placed:", newOrder);
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

  const totalItems = getCartItems().reduce((sum, item) => sum + item.quantity, 0);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header cartItemCount={totalItems} />
          <Routes>
            <Route path="/" element={<Index cart={cart} addToCart={addToCart} updateQuantity={updateQuantity} />} />
            <Route path="/cart" element={<Cart items={getCartItems()} onCheckout={handleCheckout} orderPlaced={orderPlaced} resetToShopping={resetToShopping} />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
