import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface OrderConfirmationProps {
  orderNumber: string;
  onBackToShopping: () => void;
}

export const OrderConfirmation = ({ orderNumber, onBackToShopping }: OrderConfirmationProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-mono font-bold text-lg">{orderNumber}</p>
          </div>
          
          <div className="text-left space-y-2">
            <p className="text-sm text-muted-foreground">
              ✅ Your order has been submitted for review
            </p>
            <p className="text-sm text-muted-foreground">
              ✅ Admin will process your order shortly
            </p>
            <p className="text-sm text-muted-foreground">
              ✅ You'll be notified when it's ready
            </p>
          </div>
          
          <Button 
            onClick={onBackToShopping}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};