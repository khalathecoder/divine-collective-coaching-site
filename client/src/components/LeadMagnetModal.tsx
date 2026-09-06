import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  pdfUrl: string;
}

export function LeadMagnetModal({
  isOpen,
  onClose,
  title,
  description,
  pdfUrl,
}: LeadMagnetModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const createLeadMagnet = trpc.contact.createLeadMagnet.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please enter your name and email");
      return;
    }

    try {
      await createLeadMagnet.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        leadMagnetType: "divine_mindset_research_companion",
        downloadUrl: pdfUrl,
      });

      setSubmitted(true);

      // Auto-download the PDF
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "Divine_Mindset_Research_Companion.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close modal after 2 seconds
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting lead magnet:", error);
      alert("There was an error. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        </DialogHeader>

        {!submitted ? (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">{description}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={createLeadMagnet.isPending}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={createLeadMagnet.isPending}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createLeadMagnet.isPending}
              >
                {createLeadMagnet.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Get Your Free Guide"
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              We respect your privacy. Your information will never be shared.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2 py-8">
            <p className="text-lg font-semibold text-green-600">✓ Success!</p>
            <p className="text-sm text-muted-foreground">
              Your download is starting. Check your email for the guide.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
