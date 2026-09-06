import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BrandShell from "@/components/BrandShell";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PostPurchaseSurvey() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<"loading" | "survey" | "success">("loading");
  const [hadDiscoveryCall, setHadDiscoveryCall] = useState<string>("");
  const [additionalFeedback, setAdditionalFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSurveyMutation = trpc.surveys.submitPostPurchaseSurvey.useMutation();

  // Get session ID from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (!sid) {
      toast.error("Invalid session. Redirecting...");
      setTimeout(() => setLocation("/orders"), 2000);
      return;
    }
    setSessionId(sid);
    setStep("survey");
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hadDiscoveryCall) {
      toast.error("Please answer all required questions");
      return;
    }

    if (!sessionId) {
      toast.error("Session ID not found");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSurveyMutation.mutateAsync({
        stripeCheckoutSessionId: sessionId,
        hadDiscoveryCall: hadDiscoveryCall as "yes" | "no" | "scheduled",
        additionalResponses: additionalFeedback || undefined,
      });

      setStep("success");
      setTimeout(() => {
        setLocation("/orders");
      }, 3000);
    } catch (error) {
      console.error("Survey submission error:", error);
      toast.error("Failed to submit survey. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (step === "loading") {
    return (
      <BrandShell currentPath="/survey">
        <section className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            <p className="text-muted-foreground">Loading survey...</p>
          </div>
        </section>
      </BrandShell>
    );
  }

  if (step === "success") {
    return (
      <BrandShell currentPath="/survey">
        <section className="min-h-screen flex items-center justify-center bg-background">
          <Card className="max-w-md w-full border-brand-gold/30">
            <CardContent className="pt-12 pb-8 text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-brand-gold" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl text-foreground">Thank you!</h2>
                <p className="text-sm text-muted-foreground">
                  Your feedback has been received. Redirecting to your orders...
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </BrandShell>
    );
  }

  return (
    <BrandShell currentPath="/survey">
      <section className="min-h-screen bg-background py-12 md:py-20">
        <div className="container max-w-2xl">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="font-display text-4xl text-foreground">Your Coaching Journey</h1>
              <p className="text-lg text-muted-foreground">
                Help us understand your coaching goals and experience so far.
              </p>
            </div>

            <Card className="border-brand-gold/30">
              <CardHeader>
                <CardTitle className="text-xl">Quick Survey</CardTitle>
                <CardDescription>Just a few questions to help us serve you better</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Discovery Call Question */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold text-foreground">
                        Have you had a Discovery Call with Nancy?
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        A Discovery Call helps us understand your coaching goals and which program aligns best with your season.
                      </p>
                    </div>

                    <RadioGroup value={hadDiscoveryCall} onValueChange={setHadDiscoveryCall}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                          <RadioGroupItem value="yes" id="call-yes" />
                          <Label htmlFor="call-yes" className="flex-1 cursor-pointer">
                            <div className="font-semibold">Yes, I've had a Discovery Call</div>
                            <div className="text-sm text-muted-foreground">
                              I've already spoken with Nancy about my coaching goals
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                          <RadioGroupItem value="scheduled" id="call-scheduled" />
                          <Label htmlFor="call-scheduled" className="flex-1 cursor-pointer">
                            <div className="font-semibold">I have one scheduled</div>
                            <div className="text-sm text-muted-foreground">
                              I'm planning to have a Discovery Call soon
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                          <RadioGroupItem value="no" id="call-no" />
                          <Label htmlFor="call-no" className="flex-1 cursor-pointer">
                            <div className="font-semibold">Not yet</div>
                            <div className="text-sm text-muted-foreground">
                              I'd like to schedule a Discovery Call to discuss my coaching goals
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Additional Feedback */}
                  <div className="space-y-3">
                    <Label htmlFor="feedback" className="text-base font-semibold text-foreground">
                      Additional Feedback (Optional)
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="Share any additional thoughts, questions, or goals you'd like Nancy to know about..."
                      value={additionalFeedback}
                      onChange={(e) => setAdditionalFeedback(e.target.value)}
                      className="min-h-24 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/orders")}
                      className="flex-1"
                    >
                      Skip for now
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !hadDiscoveryCall}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="bg-white/5 border border-brand-gold/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Ready to schedule a Discovery Call?</span>
                {" "}
                <a
                  href="https://calendly.com/dicollectivellc"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gold hover:underline"
                >
                  Book one with Nancy here
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </BrandShell>
  );
}
