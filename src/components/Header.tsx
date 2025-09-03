import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface HeaderProps {
  cartItemCount: number;
}

export const Header = ({ cartItemCount }: HeaderProps) => (
  <header className="bg-card border-b border-primary">
    <div className="container mx-auto px-4 py-6 flex items-center justify-between">
      <Link to="/" className="text-foreground">
        <h1 className="text-3xl font-bold">Team Merch Store</h1>
        <p className="text-muted-foreground text-sm">
          Limited edition team merchandise - Order your items below
        </p>
      </Link>
      <div className="flex items-center gap-4 text-foreground">
        <Link to="/admin" className="hover:underline">
          Admin
        </Link>
        <Link to="/cart" className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Cart{cartItemCount > 0 && ` (${cartItemCount})`}</span>
        </Link>
      </div>
    </div>
  </header>
);
