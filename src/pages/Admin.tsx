import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Package, DollarSign, Clock, Users, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderNumber: string;
  items: OrderItem[];
  customerName: string;
  size: string;
  status: "Pending" | "Completed";
  timestamp: string;
}

const ADMIN_PASSWORD = "admin";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("adminAuthenticated") === "true");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (isLoggedIn) {
      const stored: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(stored);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuthenticated", "true");
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsLoggedIn(false);
  };

  const updateOrderStatus = (orderNumber: string, status: "Pending" | "Completed") => {
    const updated = orders.map(order =>
      order.orderNumber === orderNumber ? { ...order, status } : order
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const deleteOrder = (orderNumber: string) => {
    const updated = orders.filter(order => order.orderNumber !== orderNumber);
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const exportCSV = () => {
    const headers = "Order Number,Customer,Size,Date,Total,Status\n";
    const SCREEN_SETUP_FEE = 1.25;
    const rows = orders
      .map(order => {
        const total =
          order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ) + SCREEN_SETUP_FEE;
        return `${order.orderNumber},${order.customerName},${order.size},${new Date(
          order.timestamp
        ).toLocaleString()},${total.toFixed(2)},${order.status}`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SCREEN_SETUP_FEE = 1.25;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((s, item) => s + item.price * item.quantity, 0) +
      SCREEN_SETUP_FEE,
    0
  );
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const uniqueCustomers = new Set(orders.map(o => o.customerName)).size;

  const filteredOrders = orders.filter(order =>
    filter === "all" ? true : order.status === filter
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            View and manage team merch orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900"><Package className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900"><DollarSign className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900"><Clock className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold">{pendingOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Customers</p>
              <p className="text-2xl font-bold">{uniqueCustomers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Orders</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-muted-foreground">No orders found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items &amp; Sizes</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(order => {
                  const total =
                    order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    ) + SCREEN_SETUP_FEE;
                  return (
                    <TableRow key={order.orderNumber}>
                      <TableCell>{new Date(order.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4 space-y-1">
                          {order.items.map(item => (
                            <li key={item.id}>
                              {item.name} x {item.quantity} ({order.size})
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>${total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "Completed" ? "secondary" : "outline"}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {order.status === "Pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.orderNumber, "Completed")}
                          >
                            Mark Complete
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this order?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action permanently removes order {order.orderNumber}. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteOrder(order.orderNumber)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;

