import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductCard = ({ product, quantity, onAddToCart, onUpdateQuantity }: ProductCardProps) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, quantity + delta);
    onUpdateQuantity(product.id, newQuantity);
  };

  return (
    <Card className="group hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)] bg-[var(--gradient-card)] border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="aspect-square rounded-lg mb-4 overflow-hidden bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardTitle className="text-xl text-card-foreground">{product.name}</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.price === 0 && (
            <Badge variant="secondary" className="bg-success text-success-foreground">
              FREE
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col gap-3">
        {quantity === 0 ? (
          <Button 
            onClick={() => onAddToCart(product.id)}
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              className="h-9 w-9 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold px-4">
              {quantity} in cart
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              className="h-9 w-9 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
