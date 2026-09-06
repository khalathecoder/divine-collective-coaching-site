import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice } from "@/lib/formatPrice";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = trpc.payments.getOrders.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/shop">
              <Button className="w-full">Return to Shop</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "canceled":
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "succeeded":
        return "Completed";
      case "pending":
        return "Processing";
      case "failed":
        return "Failed";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Orders</h1>
          <p className="text-muted-foreground">View your purchase history and download your digital products</p>
        </div>

        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
              <Link href="/shop">
                <Button>Browse Our Shop</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{order.productName}</h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="text-sm text-muted-foreground">{getStatusLabel(order.status)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Purchased on {new Date(order.createdAt).toLocaleDateString()}
                        {order.installments && order.installments > 1 && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {order.installments} installments
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="text-lg font-semibold text-foreground">
                            {formatPrice(order.amountCents, order.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="text-sm font-mono text-foreground">
                            {order.stripePaymentIntentId
                              ? order.stripePaymentIntentId.slice(0, 12) + "..."
                              : order.stripeCheckoutSessionId?.slice(0, 12) + "..."}
                          </p>
                        </div>
                        {order.stripeSubscriptionId && (
                          <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <p className="text-sm font-semibold text-blue-600">Subscription</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {order.status === "succeeded" && (
                      <Button variant="outline" className="ml-4">
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/shop">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
