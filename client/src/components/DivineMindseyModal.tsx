import React, { useState } from "react";
import { X } from "lucide-react";
import { downloadMindsetReport } from "@/lib/assessmentPdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DivineMindseyModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  presentation?: "dialog" | "page";
}

const ASSESSMENT_QUESTIONS = [
  {
    text: "How do you view your self-worth?",
    options: [
      { text: "I recognize my value and treat myself with respect.", score: 5 },
      { text: "I sometimes feel worthy, but it depends on my circumstances.", score: 3 },
      { text: "I struggle to see my value; I often feel unworthy.", score: 1 }
    ]
  },
  {
    text: "How aligned are you with your divine purpose?",
    options: [
      { text: "I am clear on my purpose and take intentional action.", score: 5 },
      { text: "I have a sense of purpose but am still figuring it out.", score: 3 },
      { text: "I'm uncertain about my purpose or divine calling.", score: 1 }
    ]
  },
  {
    text: "What thoughts or beliefs limit you most?",
    options: [
      { text: "I identify and release limiting beliefs.", score: 5 },
      { text: "I'm aware of limiting beliefs but struggle to change them.", score: 3 },
      { text: "Limiting beliefs significantly hold me back.", score: 1 }
    ]
  },
  {
    text: "How would you rate your mindset on growth and abundance?",
    options: [
      { text: "I embrace growth, opportunity and abundance.", score: 5 },
      { text: "I believe in growth but sometimes doubt abundance.", score: 3 },
      { text: "I struggle with scarcity mindset.", score: 1 }
    ]
  },
  {
    text: "How consistently do you prioritize your personal growth?",
    options: [
      { text: "I invest in my mind, body and spirit daily.", score: 5 },
      { text: "I prioritize growth occasionally.", score: 3 },
      { text: "Personal growth is not a priority for me.", score: 1 }
    ]
  },
  {
    text: "What is one area you are committed to elevating?",
    options: [
      { text: "My mindset and self-perception", score: 5 },
      { text: "My relationships and connections", score: 4 },
      { text: "My career and financial abundance", score: 4 },
      { text: "My spiritual alignment", score: 5 },
      { text: "My health and wellness", score: 4 }
    ]
  }
];

export default function DivineMindseyModal({ open = false, onOpenChange, presentation = "dialog" }: DivineMindseyModalProps) {
  const [stage, setStage] = useState<"intro" | "assessment" | "email" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(ASSESSMENT_QUESTIONS.length).fill(null));
  const [email, setEmail] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [name, setName] = useState("");

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion] !== null && currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitAssessment = () => {
    // Calculate total score
    let score = 0;
    answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== null) {
        const option = ASSESSMENT_QUESTIONS[questionIndex].options[answerIndex];
        score += option.score;
      }
    });
    setTotalScore(score);
    setStage("email");
  };

  const handleSubmitEmail = () => {
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    console.log("Assessment email captured:", email, "Name:", name);
    setStage("results");
  };

  const handleSkipEmail = () => {
    setStage("results");
  };

  const handleDownloadReport = async () => {
    await downloadMindsetReport({
      score: totalScore,
      maxScore,
      name: name || undefined,
      email: email || undefined,
    });
  };

  const handleRestart = () => {
    setStage("intro");
    setCurrentQuestion(0);
    setAnswers(new Array(ASSESSMENT_QUESTIONS.length).fill(null));
    setEmail("");
    setName("");
    setTotalScore(0);
  };

  const handleClose = () => {
    onOpenChange?.(false);
    handleRestart();
  };

  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;
  const currentQ = ASSESSMENT_QUESTIONS[currentQuestion];
  const canProceed = answers[currentQuestion] !== null;
  const maxScore = 30; // 6 questions × 5 max score
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  const content = (
    <>
        {presentation === "page" ? (
          <div className="relative mb-6 border-b border-brand-gold/20 pb-4">
            <h2 className="text-2xl font-display text-foreground">Divine Mindset Foundation Assessment</h2>
            <button
              type="button"
              aria-label="Close Divine Mindset Assessment"
              onClick={handleClose}
              className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <DialogHeader className="border-b border-brand-gold/20 pb-4">
            <DialogTitle className="text-2xl font-display text-foreground">Divine Mindset Foundation Assessment</DialogTitle>
            <button
              type="button"
              aria-label="Close Divine Mindset Assessment"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
        )}

        <div className="mt-6">
          {stage === "intro" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-widest text-brand-purple uppercase mb-3">Divine Collective LLC</p>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Divine Mindset Foundation Assessment</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Measure your self-worth and confidence. Understand your current mindset and identify areas for growth and elevation.
                </p>
              </div>

              <div className="border-l-3 border-brand-purple bg-brand-purple/10 p-4 rounded-r">
                <p className="text-sm italic text-brand-purple mb-2">
                  "We rise to the level of our self-worth. Full stop."
                </p>
                <p className="text-xs text-brand-purple/70">— Nancy Marie Dixon</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-text-secondary">
                  Takes about 5 minutes · Personalized results · Nancy Marie Dixon
                </p>
                <p className="text-xs text-text-secondary font-medium">
                  Self-Worth vs. Self-Confidence
                </p>
              </div>

              <button
                onClick={() => setStage("assessment")}
                className="w-full bg-brand-purple text-white py-3 rounded-lg font-medium hover:bg-brand-purple/90 transition"
              >
                Begin Assessment
              </button>
            </div>
          )}

          {stage === "assessment" && (
            <div className="space-y-6">
              <div>
                <div className="h-1 bg-background-secondary rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-brand-purple transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs font-semibold tracking-widest text-text-secondary uppercase mb-2">
                  Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">{currentQ.text}</h4>
                <div className="space-y-3">
                  {currentQ.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-lg border transition ${
                        answers[currentQuestion] === idx
                          ? "border-brand-purple bg-brand-purple/10 text-foreground font-medium"
                          : "border-border-tertiary bg-background-primary text-foreground hover:border-brand-purple hover:bg-brand-purple/5"
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 items-center justify-between pt-4">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 border border-border-tertiary rounded-lg text-sm font-medium text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-secondary transition"
                >
                  Back
                </button>
                <span className="text-xs text-text-secondary">{currentQuestion + 1} / {ASSESSMENT_QUESTIONS.length}</span>
                {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleSubmitAssessment}
                    disabled={!canProceed}
                    className="px-6 py-2 bg-brand-purple text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-purple/90 transition"
                  >
                    See Results
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={!canProceed}
                    className="px-6 py-2 bg-brand-purple text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-purple/90 transition"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}

          {stage === "email" && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-foreground mb-2">Get Your Full Results</h4>
                <p className="text-sm text-text-secondary mb-4">
                  Enter your details to receive your personalized mindset assessment and recommendations.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 block">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-border-tertiary rounded-lg bg-background-primary text-foreground placeholder:text-text-secondary focus:outline-none focus:border-brand-purple transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 block">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border-tertiary rounded-lg bg-background-primary text-foreground placeholder:text-text-secondary focus:outline-none focus:border-brand-purple transition"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitEmail}
                  className="flex-1 bg-brand-purple text-white py-3 rounded-lg font-medium hover:bg-brand-purple/90 transition"
                >
                  Send Results
                </button>
                <button
                  onClick={handleSkipEmail}
                  className="flex-1 border border-border-tertiary text-text-secondary py-3 rounded-lg font-medium hover:bg-background-secondary transition"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {stage === "results" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-purple/10 border-2 border-brand-purple">
                    <span className="text-4xl font-bold text-brand-purple">{scorePercentage}%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Your Mindset Score</h3>
                <p className="text-sm text-text-secondary mb-6">
                  {scorePercentage >= 80 && "You have a strong foundation of self-worth and divine alignment."}
                  {scorePercentage >= 60 && scorePercentage < 80 && "You're on a solid path with room for growth in mindset elevation."}
                  {scorePercentage >= 40 && scorePercentage < 60 && "You're building awareness—this is the first step to transformation."}
                  {scorePercentage < 40 && "This assessment reveals where to focus your growth and elevation work."}
                </p>
              </div>

              <div className="bg-brand-purple/10 p-4 rounded-lg border border-brand-purple/20">
                <h4 className="font-semibold text-sm text-foreground mb-2">What's Next?</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  Your mindset is the foundation for everything. Whether you scored high or are just beginning, the Divine Mindset Guide and one-on-one coaching can help you elevate further and align with your divine purpose.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="flex-1 bg-brand-gold text-black py-3 rounded-lg font-medium hover:bg-brand-gold/90 transition"
                >
                  Download Branded PDF
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex-1 border border-border-tertiary text-text-secondary py-3 rounded-lg font-medium hover:bg-background-secondary transition"
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          )}
        </div>
    </>
  );

  if (presentation === "page") {
    return (
      <section className="relative mx-auto w-full max-w-2xl rounded-2xl border border-brand-gold/30 bg-background p-6 text-left shadow-2xl sm:p-8">
        {content}
      </section>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-brand-gold/30">
        {content}
      </DialogContent>
    </Dialog>
  );
}
