import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ShoppingCart, Receipt, AlertCircle } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: (name: string, size: string) => void;
}

export const CartSummary = ({ items, onCheckout }: CartSummaryProps) => {
  const SCREEN_SETUP_FEE = 1.25;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const hasItems = items.length > 0;
  const total = hasItems ? subtotal + SCREEN_SETUP_FEE : 0;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");

  if (!hasItems) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add some merch items to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
          <Badge variant="secondary" className="ml-auto">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S">Small</SelectItem>
              <SelectItem value="M">Medium</SelectItem>
              <SelectItem value="L">Large</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm">Screen Setup Fee</span>
              <AlertCircle className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-sm">${SCREEN_SETUP_FEE.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <Button
          onClick={() => onCheckout(name, size)}
          disabled={!name || !size}
          className="w-full bg-[var(--gradient-primary)] text-primary-foreground hover:opacity-90 transition-[var(--transition-smooth)]"
          size="lg"
        >
          <Receipt className="h-4 w-4 mr-2" />
          Place Order
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Order will be reviewed by admin before processing
        </p>
      </CardContent>
    </Card>
  );
};
