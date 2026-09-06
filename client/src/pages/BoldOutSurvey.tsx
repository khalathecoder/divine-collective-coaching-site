import React, { useEffect, useState } from "react";
import BrandShell from "@/components/BrandShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Download, ArrowRight, ArrowLeft, Sparkles, ShieldCheck, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { MASTERCLASS_SCHEDULE } from "@shared/masterclassSchedule";
import { toast } from "sonner";
import { generateBoldOutPdf } from "@/lib/pdfGenerator";
import {
  BOLD_OUT_SURVEY_DRAFT_KEY,
  parseBoldOutSurveyDraft,
  serializeBoldOutSurveyDraft,
} from "@/lib/boldOutSurveyDraft";

const QUESTIONS = [
  {
    id: 1,
    title: "Voice Confidence & Expression",
    prompt: "When you have to speak up or share your truth in high-stakes moments, how confident do you feel in your voice?",
    type: "radio",
    options: [
      { value: "1", label: "I often shrink back, second-guess myself, or stay silent." },
      { value: "2", label: "I speak up when necessary, but feel internal tension or throat tightness." },
      { value: "3", label: "I am ready to express my voice with absolute clarity, power, and unapologetic faith." }
    ]
  },
  {
    id: 2,
    title: "Primary Emotional Barrier",
    prompt: "Which emotional or mental block most frequently silences your voice?",
    type: "radio",
    options: [
      { value: "fear_of_judgment", label: "Fear of judgment, rejection, or what others will think." },
      { value: "imposter_syndrome", label: "Imposter syndrome or feeling like my message isn't important enough." },
      { value: "past_silencing", label: "Past experiences where I was silenced, dismissed, or misunderstood." },
      { value: "perfectionism", label: "Perfectionism and waiting until I feel 100% ready." }
    ]
  },
  {
    id: 3,
    title: "God-Given Calling",
    prompt: "How strongly do you feel called to share a message, ministry, business, or story that requires you to step into boldness?",
    type: "radio",
    options: [
      { value: "deep_calling", label: "I feel a profound, burning calling, but need the activation to release it." },
      { value: "exploring", label: "I am exploring my calling and looking for divine clarity." },
      { value: "already_moving", label: "I am already moving forward and want to sharpen my authoritative presence." }
    ]
  },
  {
    id: 4,
    title: "Current Physical Voice Tension",
    prompt: "Do you experience physical tension in your throat, chest, or breath when speaking in front of others?",
    type: "radio",
    options: [
      { value: "frequently", label: "Frequently (tight throat, shallow breathing, voice shaking)." },
      { value: "sometimes", label: "Sometimes under high pressure or stress." },
      { value: "rarely", label: "Rarely, but I want to master vocal resonance and projection." }
    ]
  },
  {
    id: 5,
    title: "Legacy & Impact",
    prompt: "What is your primary goal for stepping into your voice during this masterclass season?",
    type: "text",
    placeholder: "e.g., Launching my platform, healing from past silence, leading with authority..."
  },
  {
    id: 6,
    title: "Commitment to Self-Worth",
    prompt: "On a scale of 1 to 5, how committed are you to releasing apology language ('I'm sorry, but...', 'just my opinion') from your vocabulary?",
    type: "radio",
    options: [
      { value: "5", label: "5 - Completely committed. No more apologizing for my voice." },
      { value: "4", label: "4 - Highly committed and ready to practice." },
      { value: "3", label: "3 - Moderately committed, still building awareness." }
    ]
  },
  {
    id: 7,
    title: "Safe Space & Sisterhood",
    prompt: "How important is it for you to be surrounded by faith-rooted women who champion your authentic expression?",
    type: "radio",
    options: [
      { value: "essential", label: "Essential! I need sacred sisterhood and divine accountability." },
      { value: "important", label: "Important, though I am also building personal resilience." },
      { value: "helpful", label: "Helpful addition to my personal journey." }
    ]
  },
  {
    id: 8,
    title: "Masterclass Expectations",
    prompt: "What is one specific breakthrough or breakthrough answer you are believing God for during the B.O.L.D. OUT Voice Activation Experience™?",
    type: "text",
    placeholder: `Share your prayer or expectation for ${MASTERCLASS_SCHEDULE.dateLabel.replace("Saturday, ", "")}...`
  },
  {
    id: 9,
    title: "Post-Masterclass Vision",
    prompt: "When you look 90 days past this masterclass, what does a bold, unshakeable voice look like in your life?",
    type: "text",
    placeholder: "Describe your boldest expression..."
  },
  {
    id: 10,
    title: "Participant Details",
    prompt: "Please provide your contact details so we can tag your profile in GHL (BOSUR) and save your intake summary.",
    type: "contact"
  }
];

export default function BoldOutSurvey() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const surveyToken = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || "" : "";
  const draftKey = surveyToken ? `${BOLD_OUT_SURVEY_DRAFT_KEY}:${surveyToken.slice(0, 16)}` : BOLD_OUT_SURVEY_DRAFT_KEY;
  const requiresPaidToken = typeof window !== "undefined" && !/localhost|manus\.computer/.test(window.location.hostname);
  const accessQuery = trpc.contact.getBoldOutSurveyAccess.useQuery({ token: surveyToken }, { enabled: surveyToken.length >= 32 });

  const submitMutation = trpc.contact.submitBoldOutSurvey.useMutation();

  useEffect(() => {
    if (accessQuery.data?.valid) {
      setContactInfo((current) => ({
        name: current.name || accessQuery.data.name,
        email: current.email || accessQuery.data.email,
        phone: current.phone || accessQuery.data.phone,
      }));
    }
  }, [accessQuery.data]);

  useEffect(() => {
    try {
      const draft = parseBoldOutSurveyDraft(window.localStorage.getItem(draftKey));
      if (!draft) return;
      setAnswers(draft.answers);
      setContactInfo(draft.contactInfo);
      setCurrentIndex(Math.min(Math.max(draft.currentIndex, 0), QUESTIONS.length - 1));
      setDraftSavedAt(draft.savedAt);
      toast.success("Your saved survey draft is ready to continue.");
    } catch (error) {
      console.warn("Unable to restore survey draft:", error);
      window.localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  const currentQ = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleAnswerChange = (val: string) => {
    setAnswers({ ...answers, [currentQ.id]: val });
  };

  const handleNext = () => {
    if (currentQ.type !== "contact" && !answers[currentQ.id]) {
      toast.error("Please provide an answer before proceeding.");
      return;
    }
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSaveAndReturn = () => {
    try {
      const savedAt = Date.now();
      window.localStorage.setItem(draftKey, serializeBoldOutSurveyDraft({
        answers,
        contactInfo,
        currentIndex,
        savedAt,
      }));
      setDraftSavedAt(savedAt);
      toast.success("Draft saved on this device. Come back to this survey link to continue.");
      window.location.href = "/programs";
    } catch (error) {
      console.error("Unable to save survey draft:", error);
      toast.error("This browser did not allow a local draft to be saved. Please keep this page open and try again.");
    }
  };

  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.name || !contactInfo.email) {
      toast.error("Please enter your name and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const summaryText = Object.entries(answers)
        .map(([qId, ans]) => {
          const q = QUESTIONS.find(item => item.id === Number(qId));
          return `${q?.title || `Question ${qId}`}: ${ans}`;
        })
        .join("\n");

      await submitMutation.mutateAsync({
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone || undefined,
        surveySummary: summaryText,
        surveyToken: surveyToken || undefined,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      window.localStorage.removeItem(draftKey);
      setDraftSavedAt(null);
      toast.success("Survey submitted successfully! Tagged BOSUR in GHL.");
    } catch (error) {
      console.error("Survey submission error:", error);
      toast.error("Failed to submit survey. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (requiresPaidToken && (accessQuery.isLoading || !accessQuery.data?.valid)) {
    return (
      <BrandShell currentPath="/bold-out-intake">
        <main className="flex min-h-screen items-center justify-center bg-[#0d0d12] px-4 py-16 text-white">
          <Card className="w-full max-w-lg border-brand-gold/30 bg-[#171722]/95 text-center shadow-2xl">
            <CardContent className="space-y-5 p-8 md:p-12">
              {accessQuery.isLoading ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-gold" aria-label="Checking survey access" /> : <ShieldCheck className="mx-auto h-12 w-12 text-brand-gold" aria-hidden="true" />}
              <h1 className="font-display text-2xl font-bold text-white">Private Participant Survey</h1>
              <p className="text-sm leading-6 text-white/80">This Voice Starting Point survey is available only through the personalized link in your paid registration email. Please use that link or contact us at info@dicollectivellc.com if you need help.</p>
              {!accessQuery.isLoading && <Button type="button" onClick={() => window.location.reload()} className="bg-brand-gold text-slate-950 hover:brightness-110">Try Again</Button>}
            </CardContent>
          </Card>
        </main>
      </BrandShell>
    );
  }

  const handleDownloadPdf = () => {
    generateBoldOutPdf({
      name: contactInfo.name || "Valued Participant",
      email: contactInfo.email || "participant@dicollectivellc.com",
      answers,
      questions: QUESTIONS,
    });
    toast.success("B.O.L.D. OUT Intake Report PDF downloaded successfully!");
  };

  return (
    <BrandShell currentPath="/bold-out-intake">
      <div className="min-h-screen bg-[#0d0d12] text-white py-12 md:py-20 relative overflow-hidden">
        {/* Ambient gold glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container max-w-2xl relative z-10 px-4">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
              <Sparkles className="w-3.5 h-3.5" /> B.O.L.D. OUT Pre-Program Intake
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-white font-bold tracking-tight">
              Voice Activation Intake Assessment
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto">
              Complete your pre-masterclass reflection to customize your activation experience on {MASTERCLASS_SCHEDULE.dateLabel.replace("Saturday, ", "")}. Tagged automatically as <code className="text-brand-gold">BOSUR</code>.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="survey-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#171722]/90 border-brand-gold/30 shadow-2xl backdrop-blur-md">
                  <div className="border-b border-brand-gold/20 bg-brand-gold/[0.04] px-6 py-5 md:px-8" aria-label="Survey progress">
                    <div className="mb-3 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      <span>Step {currentIndex + 1} of {QUESTIONS.length}</span>
                      <span className="text-brand-gold">{Math.round(progress)}% complete</span>
                    </div>
                    <Progress
                      value={progress}
                      aria-label={`Survey progress: ${Math.round(progress)} percent complete`}
                      className="h-3 bg-background/70 shadow-inner"
                    />
                    <div className="mt-2 flex justify-between text-[11px] text-white/70">
                      <span>Begin</span>
                      <span>Almost there</span>
                      <span>Complete</span>
                    </div>
                  </div>

                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between gap-3 text-xs text-white">
                      <span className="font-semibold uppercase tracking-[0.16em]">{currentQ.title}</span>
                      <span className="shrink-0 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 font-semibold text-brand-gold">
                        {currentIndex + 1}/{QUESTIONS.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xs uppercase tracking-wider text-brand-gold font-bold">
                        {currentQ.title}
                      </h2>
                      <p className="font-display text-lg md:text-xl text-white font-medium">
                        {currentQ.prompt}
                      </p>
                    </div>

                    <form onSubmit={currentQ.type === "contact" ? handleSubmitSurvey : (e) => { e.preventDefault(); handleNext(); }}>
                      {currentQ.type === "radio" && currentQ.options && (
                        <RadioGroup
                          value={answers[currentQ.id] || ""}
                          onValueChange={handleAnswerChange}
                          className="space-y-3 pt-2"
                        >
                          {currentQ.options.map((opt) => (
                            <div
                              key={opt.value}
                              className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                answers[currentQ.id] === opt.value
                                  ? "border-brand-gold bg-brand-gold/10 text-white"
                                  : "border-border/60 bg-background/40 hover:bg-background/80 text-white/80"
                              }`}
                              onClick={() => handleAnswerChange(opt.value)}
                            >
                              <RadioGroupItem value={opt.value} id={opt.value} className="mt-1" />
                              <Label htmlFor={opt.value} className="flex-1 cursor-pointer text-sm md:text-base font-normal text-white">
                                {opt.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {currentQ.type === "text" && (
                        <div className="pt-2">
                          <Textarea
                            placeholder={currentQ.placeholder}
                            value={answers[currentQ.id] || ""}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className="bg-background/60 border-border/80 text-white placeholder:text-white/50 min-h-[120px] p-4 text-base focus:border-brand-gold"
                            required
                          />
                        </div>
                      )}

                      {currentQ.type === "contact" && (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-white">Full Name *</Label>
                            <Input
                              type="text"
                              placeholder="e.g., Nancy Marie Dixon"
                              value={contactInfo.name}
                              onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                              className="bg-background/60 border-border/80 text-white placeholder:text-white/50"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-white">Email Address *</Label>
                            <Input
                              type="email"
                              placeholder="e.g., nmd.dixon@gmail.com"
                              value={contactInfo.email}
                              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                              className="bg-background/60 border-border/80 text-white placeholder:text-white/50"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-white">Phone Number (Optional)</Label>
                            <Input
                              type="tel"
                              placeholder="e.g., (216) 555-0199"
                              value={contactInfo.phone}
                              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                              className="bg-background/60 border-border/80 text-white placeholder:text-white/50"
                            />
                          </div>
                          <div className="p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-lg text-xs text-brand-gold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span className="text-white/80">Submitting this intake will automatically apply the <strong className="text-white">BOSUR</strong> tag to your GHL profile.</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-3 pt-8 border-t border-border/50 mt-8">
                      <div className="flex justify-between items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrev}
                          disabled={currentIndex === 0}
                          className="border-white/40 text-white disabled:text-white/50 hover:border-white hover:text-white"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>

                        {currentQ.type === "contact" ? (
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-brand-gold to-yellow-600 text-slate-950 font-semibold px-6 hover:brightness-110"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                              </>
                            ) : (
                              <>
                                Complete & Submit <CheckCircle2 className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="bg-gradient-to-r from-brand-gold to-yellow-600 text-slate-950 font-semibold px-6 hover:brightness-110"
                          >
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl border border-brand-gold/30 bg-brand-gold/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3 text-sm text-white">
                            <div className="mt-0.5 rounded-full bg-brand-gold/15 p-2 text-brand-gold">
                              <Save className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">Need a break?</p>
                              <p className="text-xs leading-relaxed text-white/90">
                                {draftSavedAt
                                  ? `Draft saved at ${new Date(draftSavedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`
                                  : "Save your answers on this device and return whenever you are ready."}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveAndReturn}
                            className="w-full shrink-0 border-brand-gold bg-transparent font-semibold text-brand-gold hover:bg-brand-gold hover:text-slate-950 sm:w-auto"
                          >
                            <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                            Save and Continue Later
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-[#171722]/90 border-brand-gold/40 shadow-2xl backdrop-blur-md text-center">
                  <CardContent className="p-8 md:p-12 space-y-6">
                    <div className="w-16 h-16 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center mx-auto border border-brand-gold/40 shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="font-display text-2xl md:text-3xl text-white font-bold">
                        Intake Assessment Successfully Submitted!
                      </h2>
                      <p className="text-white/80 text-sm md:text-base max-w-md mx-auto">
                        Thank you, <strong className="text-white">{contactInfo.name}</strong>. Your responses have been saved to your profile and tagged with <strong className="text-brand-gold">BOSUR</strong> in GoHighLevel for the {MASTERCLASS_SCHEDULE.dateLabel} Masterclass.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleDownloadPdf}
                        className="bg-gradient-to-r from-brand-gold to-yellow-600 text-slate-950 font-semibold px-6 py-6 h-auto hover:brightness-110 shadow-lg"
                      >
                        <Download className="w-5 h-5 mr-2" /> Download Branded Intake PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = "/programs"}
                        className="border-white/40 text-white hover:bg-white/10 py-6 h-auto"
                      >
                        Return to Programs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BrandShell>
  );
}
