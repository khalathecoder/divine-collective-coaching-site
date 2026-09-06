import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: string;
}

export default function WaitlistModal({ isOpen, onClose, program }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitWaitlist = trpc.contact.submitWaitlist.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setErrorMessage("");
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "" });
        setSubmitted(false);
        onClose();
      }, 2000);
    },
    onError: (error) => {
      setErrorMessage(error.message || "We could not save your request. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    submitWaitlist.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      program: program,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-foreground">
            Join the Waitlist
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            Be the first to know when {program} becomes available
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="w-12 h-12 text-brand-gold" />
            <p className="text-foreground text-center">
              Thank you! We'll contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={submitWaitlist.isPending}
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-purple font-semibold"
            >
                  {submitWaitlist.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding to Waitlist...
                </>
              ) : (
                "Add Me to Waitlist"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
