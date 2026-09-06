/*
Design reminder for this file:
Sacred editorial luxury with asymmetrical narrative flow, dignified pacing, and restrained purple-and-gold accents.
Navigation should feel calm, clear, and crafted rather than app-like or generic.
*/
import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Seo from "./components/Seo";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Coaching from "./pages/Coaching";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogArchive from "./pages/BlogArchive";
import BlogArticle from "./pages/BlogArticle";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Programs from "./pages/Programs";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import Orders from "./pages/Orders";
import PostPurchaseSurvey from "./pages/PostPurchaseSurvey";
import AdminSubmissions from "./pages/AdminSubmissions";
import Login from "./pages/Login";
const StandaloneAssessment = lazy(() => import("./pages/StandaloneAssessment"));
const BoldOutSurvey = lazy(() => import("./pages/BoldOutSurvey"));

function LoadingShell({ label = "Preparing your assessment…", description = "Your experience is loading now. This should only take a moment." }: { label?: string; description?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-cream">
      <div className="max-w-md space-y-5">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-gold/25 border-t-brand-gold" aria-hidden="true" />
        <p className="eyebrow text-brand-gold">Purely Divine Coaching</p>
        <h1 className="font-display text-3xl">{label}</h1>
        <p className="text-sm leading-6 text-cream/65">{description}</p>
      </div>
    </main>
  );
}

function AssessmentLoadingShell() {
  return <LoadingShell />;
}

function AssessmentRoute({ kind }: { kind: "voice" | "mindset" }) {
  return (
    <Suspense fallback={<AssessmentLoadingShell />}>
      <StandaloneAssessment kind={kind} />
    </Suspense>
  );
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/voice-quiz" component={() => <AssessmentRoute kind="voice" />} />
      <Route path="/divine-mindset-assessment" component={() => <AssessmentRoute kind="mindset" />} />
      <Route
        path="/bold-out-intake"
        component={() => (
          <Suspense fallback={<LoadingShell label="Preparing your intake survey…" description="Your private B.O.L.D. OUT intake is loading now." />}>
            <BoldOutSurvey />
          </Suspense>
        )}
      />
      <Route path="/coaching" component={Coaching} />
      <Route path="/blog" component={Blog} />
      {/* /blog/archive must stay above /blog/:slug so the literal path wins. */}
      <Route path="/blog/archive" component={BlogArchive} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/about" component={About} />
      <Route path="/events" component={Events} />
      <Route path="/programs" component={Programs} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/orders" component={Orders} />
      <Route path="/survey" component={PostPurchaseSurvey} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminSubmissions} />
      <Route path="/admin/submissions" component={AdminSubmissions} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {/* Keeps title, description, canonical and JSON-LD correct as wouter
              changes routes without a page load. */}
          <Seo />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
