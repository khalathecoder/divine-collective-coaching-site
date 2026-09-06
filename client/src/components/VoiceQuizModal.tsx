import React, { useState } from "react";
import { X } from "lucide-react";
import { downloadVoiceQuizReport } from "@/lib/assessmentPdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VoiceQuizModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  presentation?: "dialog" | "page";
}

const QUESTIONS = [
  {
    text: "Where are you in your life right now?",
    options: [
      { text: "I feel stuck — like life has pressed pause and I don't know how to restart.", scores: { fear: 3, silence: 2, identity: 1, readiness: 0 } },
      { text: "I'm in a major transition — widowed, divorced, retired, or starting over.", scores: { fear: 1, silence: 2, identity: 3, readiness: 1 } },
      { text: "I know I have a purpose, but fear keeps me from stepping into it.", scores: { fear: 3, silence: 1, identity: 1, readiness: 2 } },
      { text: "I'm ready for my next bold chapter — I just need clarity and a guide.", scores: { fear: 0, silence: 0, identity: 1, readiness: 4 } }
    ]
  },
  {
    text: "When you think about speaking up — sharing your story, your opinion, your truth — what happens inside?",
    options: [
      { text: "My heart races. I worry people will judge me or not take me seriously.", scores: { fear: 4, silence: 2, identity: 0, readiness: 0 } },
      { text: "I start to speak, then pull back. I've been silenced so many times it became habit.", scores: { fear: 2, silence: 4, identity: 1, readiness: 0 } },
      { text: "I feel a pull — something wants to come out. But I don't know where to start.", scores: { fear: 1, silence: 1, identity: 2, readiness: 3 } },
      { text: "I'm ready. I just need someone to help me shape it and hold me accountable.", scores: { fear: 0, silence: 0, identity: 1, readiness: 4 } }
    ]
  },
  {
    text: "When was the last time you felt truly heard — like what you said actually mattered?",
    options: [
      { text: "I honestly can't remember. I've spent most of my life making sure others feel heard instead.", scores: { fear: 2, silence: 4, identity: 1, readiness: 0 } },
      { text: "It's been a while. A significant loss or change took that sense of belonging from me.", scores: { fear: 1, silence: 2, identity: 3, readiness: 1 } },
      { text: "In flashes — brief moments where I showed up fully and it felt electric.", scores: { fear: 1, silence: 1, identity: 2, readiness: 3 } },
      { text: "More recently than before. I'm finding my voice — I just want to go further.", scores: { fear: 0, silence: 0, identity: 1, readiness: 4 } }
    ]
  },
  {
    text: "What does 'using your voice' mean to you right now?",
    options: [
      { text: "Saying what I feel without fear of rejection or ridicule.", scores: { fear: 4, silence: 1, identity: 0, readiness: 0 } },
      { text: "Remembering who I was before life asked me to become someone smaller.", scores: { fear: 1, silence: 2, identity: 4, readiness: 0 } },
      { text: "Sharing the story I've been carrying — and finally letting it help someone else.", scores: { fear: 1, silence: 1, identity: 2, readiness: 3 } },
      { text: "Building something — a platform, a message, a legacy that outlasts me.", scores: { fear: 0, silence: 0, identity: 1, readiness: 4 } }
    ]
  },
  {
    text: "How would you describe the role faith plays in your life right now?",
    options: [
      { text: "It's my foundation — I turn to God first in everything, especially in hard seasons.", scores: { fear: 0, silence: 0, identity: 1, readiness: 3 } },
      { text: "I believe deeply, but I've been going through a quiet season — a little distant.", scores: { fear: 1, silence: 2, identity: 2, readiness: 1 } },
      { text: "My faith is strong, but I haven't connected it to my purpose or my voice yet.", scores: { fear: 2, silence: 1, identity: 3, readiness: 1 } },
      { text: "I'm still searching — I believe in something greater, but I'm figuring out what that means for me.", scores: { fear: 2, silence: 2, identity: 2, readiness: 0 } }
    ]
  },
  {
    text: "Which of these feels most like your story?",
    options: [
      { text: "I poured everything into others — my family, my career, my community — and now I feel empty.", scores: { fear: 2, silence: 3, identity: 2, readiness: 0 } },
      { text: "I lost someone or something significant, and the person I was before seems far away.", scores: { fear: 1, silence: 2, identity: 4, readiness: 0 } },
      { text: "I've always known I was called to more — but I've let the opinions of others hold me back.", scores: { fear: 4, silence: 1, identity: 1, readiness: 1 } },
      { text: "I've done the inner work — I know who I am. Now I need the strategy and the push.", scores: { fear: 0, silence: 0, identity: 1, readiness: 5 } }
    ]
  },
  {
    text: "What would feel like the greatest breakthrough for you?",
    options: [
      { text: "Believing that my voice matters — not needing anyone's permission to speak.", scores: { fear: 4, silence: 1, identity: 1, readiness: 0 } },
      { text: "Knowing who I am outside of the roles I've played — and loving her.", scores: { fear: 1, silence: 1, identity: 4, readiness: 1 } },
      { text: "Actually doing the thing I've been putting off — speaking, writing, launching, leading.", scores: { fear: 1, silence: 0, identity: 1, readiness: 4 } },
      { text: "Healing the wounds that made me silent in the first place.", scores: { fear: 2, silence: 4, identity: 1, readiness: 0 } }
    ]
  },
  {
    text: "If you could change one thing in the next 90 days, what would it be?",
    options: [
      { text: "I would finally stop shrinking. I would take up space without apology.", scores: { fear: 3, silence: 1, identity: 2, readiness: 1 } },
      { text: "I would know my next chapter clearly — and have the courage to walk into it.", scores: { fear: 2, silence: 1, identity: 2, readiness: 2 } },
      { text: "I would share my story — in some form — and let it land where God intends.", scores: { fear: 1, silence: 2, identity: 1, readiness: 3 } },
      { text: "I would have a coach, a plan, and accountability — and be in motion.", scores: { fear: 0, silence: 0, identity: 1, readiness: 5 } }
    ]
  }
];

const VOICE_ARCHETYPES = [
  {
    id: "silenced",
    name: "The Silenced Woman",
    subtitle: "Your voice has been pressed down — and it's time to reclaim it.",
    color: "#185FA5",
    bgColor: "#E6F1FB",
    textColor: "#0C447C",
    badge: "Voice Stage: Silenced",
    desc: "For years, you've made yourself smaller. Whether it was to keep the peace, protect others, or survive a season that demanded your silence, you learned to swallow your words. But something is shifting. You're beginning to wonder what might happen if you finally spoke.",
    truths: [
      "Your silence is not evidence that you have nothing to say — it is evidence of how much you have been carrying.",
      "You are not too late. You are exactly on time for the chapter God is writing right now.",
      "The most powerful voice in a room is often the one that has waited the longest to speak."
    ],
    recommendation: "One-on-One Coaching (Purely Divine)",
    recDesc: "A private, sacred space to unpack the silence and step into your voice — at your pace, with Nancy's full attention on you.",
    recColor: "#D85A30",
    recBg: "#FAECE7"
  },
  {
    id: "searching",
    name: "The Searching Woman",
    subtitle: "You are in the middle of a transition — and you are ready to find yourself again.",
    color: "#185FA5",
    bgColor: "#E6F1FB",
    textColor: "#0C447C",
    badge: "Voice Stage: Searching",
    desc: "Life handed you a major change — a loss, a transition, an ending you did not choose. And in the space that loss created, you found yourself looking in the mirror and not quite recognizing the woman looking back. The roles that defined you are shifting. The relationships that anchored you have changed.",
    truths: [
      "This season is not a punishment — it is a preparation.",
      "You are not lost. You are being remade.",
      "The woman you are becoming is worth the discomfort of becoming her."
    ],
    recommendation: "Voice Intensive (Group Program)",
    recDesc: "A 6-week intensive with other women in transition. Together, you'll uncover who you are beyond the roles, and step into your next chapter with clarity and confidence.",
    recColor: "#6B4C9A",
    recBg: "#F3EFFE"
  },
  {
    id: "awakening",
    name: "The Awakening Woman",
    subtitle: "You know you're called to something more — and you're ready to answer.",
    color: "#D85A30",
    bgColor: "#FAECE7",
    textColor: "#8B3A1F",
    badge: "Voice Stage: Awakening",
    desc: "You've felt the stirring for a while now. There's something inside you — a message, a calling, a purpose — that wants to come out. You know you're meant for more than silence, more than the sidelines. The question is: how do you step into it?",
    truths: [
      "Your calling is not a luxury — it is a responsibility.",
      "Fear and faith can coexist. You don't have to choose between them.",
      "The world doesn't need a perfect version of you. It needs the real one."
    ],
    recommendation: "The Voice Intensive + 1:1 Coaching",
    recDesc: "Start with the group to connect with your calling, then move into 1:1 coaching to build your strategy and accountability.",
    recColor: "#6B4C9A",
    recBg: "#F3EFFE"
  },
  {
    id: "ready",
    name: "The Ready Woman",
    subtitle: "You know who you are. Now it's time to amplify.",
    color: "#6B4C9A",
    bgColor: "#F3EFFE",
    textColor: "#3C3489",
    badge: "Voice Stage: Ready",
    desc: "You've done the inner work. You know who you are, what you stand for, and what you're called to do. You're not asking for permission anymore. What you need now is the strategy, the structure, and someone in your corner to help you launch.",
    truths: [
      "Your voice is ready. The world is waiting.",
      "You don't need to be perfect to be powerful.",
      "This is your season to lead, to build, to impact."
    ],
    recommendation: "One-on-One Coaching (Purely Divine)",
    recDesc: "A private, sacred space to build your platform, amplify your message, and launch your voice with impact.",
    recColor: "#6B4C9A",
    recBg: "#F3EFFE"
  },
  {
    id: "leader",
    name: "The Leader Woman",
    subtitle: "Your voice is already changing the world — let's expand its reach.",
    color: "#6B4C9A",
    bgColor: "#F3EFFE",
    textColor: "#3C3489",
    badge: "Voice Stage: Leader",
    desc: "You're already speaking. You're already leading. You're already making an impact. But there's a next level — a bigger platform, a deeper message, a wider reach. You're ready to scale your voice and your impact.",
    truths: [
      "Your voice has power. Use it wisely.",
      "Leadership is not about being the loudest — it's about being the most authentic.",
      "One-on-one strategic partnership to build your platform, amplify your message, and launch your voice with impact."
    ],
    recommendation: "One-on-One Coaching (Purely Divine)",
    recDesc: "One-on-one strategic partnership to build your platform, amplify your message, and launch your voice with impact.",
    recColor: "#6B4C9A",
    recBg: "#F3EFFE"
  }
];

export default function VoiceQuizModal({ open = false, onOpenChange, presentation = "dialog" }: VoiceQuizModalProps) {
  const [stage, setStage] = useState<"intro" | "quiz" | "email" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [email, setEmail] = useState("");
  const [scores, setScores] = useState({ fear: 0, silence: 0, identity: 0, readiness: 0 });
  const [result, setResult] = useState<typeof VOICE_ARCHETYPES[0] | null>(null);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion] !== null && currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate scores
    let newScores = { fear: 0, silence: 0, identity: 0, readiness: 0 };
    answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== null) {
        const option = QUESTIONS[questionIndex].options[answerIndex];
        newScores.fear += option.scores.fear;
        newScores.silence += option.scores.silence;
        newScores.identity += option.scores.identity;
        newScores.readiness += option.scores.readiness;
      }
    });
    setScores(newScores);

    // Determine archetype based on highest scores
    const maxScore = Math.max(newScores.fear, newScores.silence, newScores.identity, newScores.readiness);
    let archetypeId = "ready";
    
    if (newScores.silence === maxScore && newScores.silence > 6) archetypeId = "silenced";
    else if (newScores.identity === maxScore && newScores.identity > 6) archetypeId = "searching";
    else if (newScores.fear === maxScore && newScores.fear > 6) archetypeId = "awakening";
    else if (newScores.readiness === maxScore && newScores.readiness > 6) archetypeId = "ready";
    else archetypeId = "leader";

    const archetype = VOICE_ARCHETYPES.find(a => a.id === archetypeId) || VOICE_ARCHETYPES[3];
    setResult(archetype);
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
    console.log("Email captured:", email);
    setStage("results");
  };

  const handleSkipEmail = () => {
    setStage("results");
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    await downloadVoiceQuizReport({
      archetypeName: result.name,
      badge: result.badge,
      subtitle: result.subtitle,
      description: result.desc,
      recommendation: result.recommendation,
      recommendationDescription: result.recDesc,
      truths: result.truths,
      scores,
      email: email || undefined,
    });
  };

  const handleRestart = () => {
    setStage("intro");
    setCurrentQuestion(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setEmail("");
  };

  const handleClose = () => {
    onOpenChange?.(false);
    handleRestart();
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[currentQuestion];
  const canProceed = answers[currentQuestion] !== null;

  const content = (
    <>
        {presentation === "page" ? (
          <div className="relative mb-6 border-b border-brand-gold/20 pb-4">
            <h2 className="text-2xl font-display text-foreground">Find Your Voice Quiz</h2>
            <button
              type="button"
              aria-label="Close Voice Activation Quiz"
              onClick={handleClose}
              className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <DialogHeader className="border-b border-brand-gold/20 pb-4">
            <DialogTitle className="text-2xl font-display text-foreground">Find Your Voice Quiz</DialogTitle>
            <button
              type="button"
              aria-label="Close Voice Activation Quiz"
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
                <h3 className="text-2xl font-semibold text-foreground mb-3">Find Your Voice Quiz</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  In just 8 questions, discover where you are on your voice journey — and what God may be calling you toward in this season. There are no wrong answers. Just honest ones.
                </p>
              </div>

              <div className="border-l-3 border-brand-purple bg-brand-purple/10 p-4 rounded-r">
                <p className="text-sm italic text-brand-purple mb-2">
                  "For God has not given us the spirit of fear, but of power, and of love and a sound mind."
                </p>
                <p className="text-xs text-brand-purple/70">2 Timothy 1:7</p>
              </div>

              <p className="text-xs text-text-secondary">
                Takes about 3 minutes · Personalized results · Nancy Marie Dixon
              </p>

              <button
                onClick={() => setStage("quiz")}
                className="w-full bg-brand-purple text-white py-3 rounded-lg font-medium hover:bg-brand-purple/90 transition"
              >
                Begin the Quiz
              </button>
            </div>
          )}

          {stage === "quiz" && (
            <div className="space-y-6">
              <div>
                <div className="h-1 bg-background-secondary rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-brand-purple transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs font-semibold tracking-widest text-text-secondary uppercase mb-2">
                  Question {currentQuestion + 1} of {QUESTIONS.length}
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
                <span className="text-xs text-text-secondary">{currentQuestion + 1} / {QUESTIONS.length}</span>
                {currentQuestion === QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
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

          {stage === "email" && result && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-foreground mb-2">Get Your Full Results</h4>
                <p className="text-sm text-text-secondary mb-4">
                  Enter your email to receive your personalized voice profile and next steps.
                </p>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border-tertiary rounded-lg bg-background-primary text-foreground placeholder:text-text-secondary focus:outline-none focus:border-brand-purple transition"
                />
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

          {stage === "results" && result && (
            <div className="space-y-6">
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                  style={{ backgroundColor: result.recColor }}
                >
                  {result.badge}
                </span>
                <h3 className="text-2xl font-semibold text-foreground mb-2">{result.name}</h3>
                <p className="text-sm text-text-secondary mb-4">{result.subtitle}</p>
                <p className="text-sm text-foreground leading-relaxed mb-4">{result.desc}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-widest text-text-secondary uppercase mb-3">Truths for Your Journey</h4>
                <div className="space-y-3">
                  {result.truths.map((truth, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: result.recColor }}
                      />
                      <p className="text-sm text-foreground leading-relaxed">{truth}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: result.recBg }}
              >
                <h4 className="font-semibold text-sm mb-2" style={{ color: result.recColor }}>
                  {result.recommendation}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: result.recColor }}>
                  {result.recDesc}
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
                  Retake Quiz
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
