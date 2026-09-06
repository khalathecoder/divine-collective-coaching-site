import BrandShell from "@/components/BrandShell";
import { assessmentRoutes } from "@/lib/assessmentRoutes";
import { clearLazyRetry, lazyWithRetry } from "@/lib/lazyWithRetry";
import { ArrowLeft, RefreshCw } from "lucide-react";
import React, { Component, lazy, Suspense, type ReactNode } from "react";
import { useLocation } from "wouter";

const VoiceQuizModal = lazyWithRetry(() => import("@/components/VoiceQuizModal"), "voice-quiz");
const DivineMindseyModal = lazyWithRetry(() => import("@/components/DivineMindseyModal"), "divine-mindset");

type AssessmentKind = "voice" | "mindset";

interface StandaloneAssessmentProps {
  kind: AssessmentKind;
}

interface AssessmentLoadBoundaryProps {
  children: ReactNode;
  from: string;
  kind: AssessmentKind;
}

interface AssessmentLoadBoundaryState {
  hasError: boolean;
}

class AssessmentLoadBoundary extends Component<AssessmentLoadBoundaryProps, AssessmentLoadBoundaryState> {
  state: AssessmentLoadBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AssessmentLoadBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[Assessment] Unable to load assessment module", { error, kind: this.props.kind });
  }

  handleRetry = () => {
    clearLazyRetry(this.props.kind === "voice" ? "voice-quiz" : "divine-mindset");
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const assessmentName = this.props.kind === "voice" ? "Voice Quiz" : "Divine Mindset Assessment";

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-6 text-center text-cream" role="alert">
        <div className="max-w-md space-y-5 rounded-2xl border border-brand-gold/35 bg-black px-7 py-8 shadow-2xl">
          <p className="eyebrow text-brand-gold">Purely Divine Coaching</p>
          <h2 className="font-display text-3xl text-cream">The {assessmentName} needs one more try.</h2>
          <p className="text-sm leading-7 text-cream/70">
            Your connection interrupted the assessment while it was loading. Nothing was submitted. Try again, or return to the page you came from.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={this.handleRetry} className="brand-button brand-button-primary inline-flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
            </button>
            <a href={this.props.from} className="brand-button brand-button-secondary inline-flex items-center justify-center">
              Return
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function AssessmentLoadingShell() {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-brand-gold/25 bg-black/60 px-6 text-center text-cream" role="status" aria-live="polite">
      <div className="space-y-4">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-brand-gold/25 border-t-brand-gold" aria-hidden="true" />
        <p className="text-sm text-cream/80">Preparing your assessment…</p>
        <p className="text-xs text-cream/50">Your assessment is loading now. This should only take a moment.</p>
      </div>
    </div>
  );
}

export default function StandaloneAssessment({ kind }: StandaloneAssessmentProps) {
  const [, setLocation] = useLocation();
  const params = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
  const from = params?.get("from") === "/shop" ? "/shop" : "/";
  const isVoice = kind === "voice";
  const route = isVoice ? assessmentRoutes.voiceQuiz : assessmentRoutes.divineMindset;

  const closeAssessment = (open: boolean) => {
    if (!open) setLocation(from);
  };

  return (
    <BrandShell currentPath={from} enableChat={false}>
      <main className="min-h-[calc(100vh-88px)] bg-black px-4 py-10 text-cream sm:px-6 lg:py-14">
        <div className="container grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
          <section className="space-y-6 lg:pt-8">
            <a href={from} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition-colors hover:text-cream">
              <ArrowLeft className="h-4 w-4" /> Back to {from === "/shop" ? "Shop" : "Home"}
            </a>
            <div className="space-y-4">
              <p className="eyebrow">Purely Divine Coaching</p>
              <h1 className="font-display text-4xl text-cream sm:text-5xl">
                {isVoice ? "Find Your Voice Quiz" : "Divine Mindset Foundation Assessment"}
              </h1>
              <p className="max-w-xl text-base leading-8 text-cream/70">
                {isVoice
                  ? "Discover where you are on your voice journey and receive personalized insights for your next step."
                  : "Measure your current self-worth and confidence patterns, then receive a personalized mindset roadmap."}
              </p>
            </div>
            <p className="max-w-xl text-sm leading-7 text-cream/55">
              The assessment is ready below. Complete it at your own pace; your answers stay on this page until you finish, download your report, or return to the previous page.
            </p>
          </section>

          <section id="assessment-panel" aria-label={isVoice ? "Voice Quiz" : "Divine Mindset Assessment"}>
            <AssessmentLoadBoundary from={from} kind={kind}>
              <Suspense fallback={<AssessmentLoadingShell />}>
                {isVoice ? (
                  <VoiceQuizModal presentation="page" onOpenChange={closeAssessment} />
                ) : (
                  <DivineMindseyModal presentation="page" onOpenChange={closeAssessment} />
                )}
              </Suspense>
            </AssessmentLoadBoundary>
          </section>
        </div>
      </main>
      <span className="sr-only">Assessment route: {route}</span>
    </BrandShell>
  );
}
