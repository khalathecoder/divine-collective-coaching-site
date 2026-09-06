import { useState } from "react";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { RegistrationForm, type RegistrationData } from "./RegistrationForm";

export type PaymentPlan = {
  id: string;
  name: string;
  description: string;
  monthlyAmount: number;
  installments: number;
  totalAmount: number;
};

interface PaymentPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  program: {
    title: string;
    price: string;
    productId?: string;
  };
  paymentPlans: PaymentPlan[];
}

export function PaymentPlanSelector({
  isOpen,
  onClose,
  program,
  paymentPlans,
}: PaymentPlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(paymentPlans[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  const createCheckoutMutation = trpc.payments.createCoachingCheckout.useMutation();

  // If no payment plans, go straight to checkout
  React.useEffect(() => {
    if (isOpen && paymentPlans.length === 0) {
      handleProceedToPayment();
    }
  }, [isOpen]);

  const handleProceedToPayment = async () => {
    if (paymentPlans.length > 0 && !selectedPlan) {
      toast.error("Please select a payment plan");
      return;
    }

    // Show registration form first
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = async (data: RegistrationData) => {
    setRegistrationData(data);
    setShowRegistration(false);
    
    // Proceed to checkout after registration
    setIsLoading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        productId: program.productId || "",
        paymentPlanId: selectedPlan || "full-payment",
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        customerPhone: data.phone,
      });

      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        onClose();
        toast.success("Redirecting to checkout...");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Only show modal if there are payment plans to choose from
  if (paymentPlans.length === 0) {
    return null;
  }

  return (
    <>
      <RegistrationForm
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSubmit={handleRegistrationSubmit}
        programTitle={program.title}
        isLoading={isLoading}
      />
      <Dialog open={isOpen && !showRegistration} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{program.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your payment option:
              </p>

              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="space-y-3">
                  {paymentPlans.map((plan) => (
                    <div key={plan.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                      <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                      <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-sm text-muted-foreground">{plan.description}</div>
                        <div className="text-sm font-semibold text-brand-gold mt-1">
                          ${plan.monthlyAmount.toFixed(2)}{plan.installments > 1 ? ` × ${plan.installments}` : ""}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onClose()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProceedToPayment}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
