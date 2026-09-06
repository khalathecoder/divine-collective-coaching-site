/*
Design reminder for this file:
Sacred editorial luxury with an off-axis story layout, dignified typography, and reverent motion.
Every section should reinforce self-worth, voice activation, and mature elegance instead of generic coaching-site patterns.
*/
import BrandShell from "@/components/BrandShell";
import { LeadMagnetModal } from "@/components/LeadMagnetModal";
import { brand, programs, testimonials, voicePillars } from "@/content/siteContent";
import { ArrowRight, BookOpenText, Crown, Mic2, Sparkles, Star } from "lucide-react";
import { Link } from "wouter";
import { useInView } from "@/hooks/useInView";
import { useState } from "react";
import { assessmentHref, assessmentRoutes } from "@/lib/assessmentRoutes";

const heroPortrait =
  "/manus-storage/6A3A1158.jpgcrop_ec351fa2.webp";
const sacredAbstract =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/purely-divine-sacred-abstract-LUSB7JT3LuXNnjruMugNij.webp";
const communityImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/purely-divine-community-women-circle-7mFey8hkdw8rQERihiQrbU.webp";
const secondaryHeaderImage =
  "/manus-storage/ChatGPTImageApr23,2026,06_52_29PM_c0b2eff2.png";
const bookImage =
  "/manus-storage/ChatGPTImageApr28,2026,03_24_39PM_1e5b16a9.png";

const journeyItems = [
  {
    icon: BookOpenText,
    title: "Get the Book",
    description: "Read and be transformed",
    href: "/shop#books-and-resources",
  },
  {
    icon: Crown,
    title: "Get the Workbook",
    description: "Reflect and go deeper",
    href: "/shop#books-and-resources",
  },
  {
    icon: Mic2,
    title: "Take the Voice Quiz",
    description: "Assess where I am",
    href: assessmentHref(assessmentRoutes.voiceQuiz, "/"),
    isQuiz: true,
    badge: "Free",
  },
  {
    icon: Sparkles,
    title: "Divine Mindset Foundation Assessment",
    description: "Measure self-worth & confidence",
    href: assessmentHref(assessmentRoutes.divineMindset, "/"),
    isAssessment: true,
    badge: "Free",
  },
  {
    icon: BookOpenText,
    title: "Divine Mindset Research Companion",
    description: "Discover the science behind mindset mastery. Learn proven research on self-worth, belief systems, and personal transformation—your foundation for lasting change.",
    href: "#lead-magnet",
    isLeadMagnet: true,
    badge: "Free",
  },
  {
    icon: Star,
    title: "Divine Mindset Guide",
    description: "Shift my mindset first",
    href: "/shop#books-and-resources",
  },
];

interface JourneyItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  isQuiz?: boolean;
  isAssessment?: boolean;
  isLeadMagnet?: boolean;
  badge?: string;
}

function JourneyItemsSection({ journeyItems, onLeadMagnetOpen }: { journeyItems: JourneyItem[]; onLeadMagnetOpen?: () => void }) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2">
      {journeyItems.map((item: JourneyItem, index: number) => {
        const { icon: Icon, title, description, href, isQuiz, isAssessment, isLeadMagnet, badge } = item;
        const delayClass = isInView ? `scroll-fade-in-delay-${index}` : '';
        
        if (isQuiz) {
          return (
            <a
              key={title}
              href={assessmentHref(assessmentRoutes.voiceQuiz, "/")}
              aria-label="Open the Voice Activation Quiz"
              data-testid="home-voice-quiz-trigger"
              className={`flex gap-3 rounded-lg border-2 border-brand-gold bg-white/5 p-4 transition-all hover:bg-white/10 scroll-fade-in ${delayClass} ${isInView ? 'in-view' : ''} text-left justify-between items-start`}
            >
              <div className="flex gap-3">
                <Icon className="h-5 w-5 shrink-0 text-brand-gold" />
                <div className="space-y-1">
                  <p className="font-semibold text-cream">{title}</p>
                  <p className="text-xs text-cream/60">{description}</p>
                </div>
              </div>
              {badge && <span className="text-xs font-semibold text-brand-gold whitespace-nowrap ml-2">{badge}</span>}
            </a>
          );
        }
        
        if (isAssessment) {
          return (
            <a
              key={title}
              href={assessmentHref(assessmentRoutes.divineMindset, "/")}
              aria-label="Open the Divine Mindset Foundation Assessment"
              data-testid="home-mindset-assessment-trigger"
              className={`flex gap-3 rounded-lg border-2 border-brand-gold bg-white/5 p-4 transition-all hover:bg-white/10 scroll-fade-in ${delayClass} ${isInView ? 'in-view' : ''} text-left justify-between items-start`}
            >
              <div className="flex gap-3">
                <Icon className="h-5 w-5 shrink-0 text-brand-gold" />
                <div className="space-y-1">
                  <p className="font-semibold text-cream">{title}</p>
                  <p className="text-xs text-cream/60">{description}</p>
                </div>
              </div>
              {badge && <span className="text-xs font-semibold text-brand-gold whitespace-nowrap ml-2">{badge}</span>}
            </a>
          );
        }
        
        if (isLeadMagnet) {
          return (
            <button
              key={title}
              onClick={onLeadMagnetOpen}
              className={`flex gap-3 rounded-lg border-2 border-brand-gold bg-white/5 p-4 transition-all hover:bg-white/10 scroll-fade-in ${delayClass} ${isInView ? 'in-view' : ''} text-left justify-between items-start`}
            >
              <div className="flex gap-3">
                <Icon className="h-5 w-5 shrink-0 text-brand-gold" />
                <div className="space-y-1">
                  <p className="font-semibold text-cream">{title}</p>
                  <p className="text-xs text-cream/60">{description}</p>
                </div>
              </div>
              {badge && <span className="text-xs font-semibold text-brand-gold whitespace-nowrap ml-2">{badge}</span>}
            </button>
          );
        }
        
        return (
          <a
            key={title}
            href={href}
            className={`flex gap-3 rounded-lg border-2 border-brand-gold bg-white/5 p-4 transition-all hover:bg-white/10 scroll-fade-in ${delayClass} ${isInView ? 'in-view' : ''}`}
          >
            <Icon className="h-5 w-5 shrink-0 text-brand-gold" />
            <div className="space-y-1">
              <p className="font-semibold text-cream">{title}</p>
              <p className="text-xs text-cream/60">{description}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);

  return (
    <>
      <LeadMagnetModal
        isOpen={leadMagnetOpen}
        onClose={() => setLeadMagnetOpen(false)}
        title="Divine Mindset Research Companion"
        description="Get the scientific foundation for transformation. This research companion provides peer-reviewed studies supporting the Divine Mindset Guide."
        pdfUrl="/manus-storage/divine_mindset_research_companion_68c10d7d.pdf"
      />
      <BrandShell currentPath="/">
      <section className="relative overflow-hidden border-b border-brand-plum/35 bg-black text-cream min-h-screen md:min-h-[calc(100vh-88px)]">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `url(${sacredAbstract})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.82)_42%,rgba(0,0,0,0.38)_100%)]" />
        <div className="container relative flex flex-col space-y-10 py-16 md:grid md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-10 lg:py-24">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-5">
              <p className="eyebrow">Faith-rooted voice coaching</p>
              <h1 className="font-display text-5xl leading-[0.96] text-cream sm:text-6xl lg:text-7xl">
                Where silenced women <span className="text-brand-gold">find their voice</span> and walk in self-worth.
              </h1>
              <p className="hero-copy max-w-xl text-base leading-8 text-cream/72 sm:text-lg">
                {brand.owner}, author of <span className="font-medium text-cream">{brand.bookTitle}</span>, leads a coaching practice for women ready to move from silence, shrinking, and hesitation into bold expression rooted in faith.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="https://link.kopsystem.com/widget/bookings/nancy-dixon-personal-calendar-0svswpnv8" className="brand-button brand-button-primary">
                Book a discovery call
              </a>
              <Link href="/shop" className="brand-button brand-button-ghost">
                Explore the shop <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 border-t border-brand-gold/20 pt-8 sm:grid-cols-3">
              {[
                ["Author", "Signature book and companion resources"],
                ["Certified Coach", "Christian life coaching and reinvention support"],
                ["Audience", "Women over 50"],
              ].map(([label, description]) => (
                <div key={label} className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">{label}</p>
                  <p className="text-sm leading-6 text-cream/72">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center md:justify-end">
            <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-white/5 shadow-[0_35px_90px_rgba(8,6,18,0.15)] w-full max-w-sm sm:max-w-md md:max-w-lg md:w-auto">
              <img
                src={heroPortrait}
                alt="Nancy Marie Dixon - Purely Divine Coaching"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container space-y-12">
          <div className="max-w-2xl space-y-4">
            <p className="eyebrow text-brand-plum">About Nancy Marie Dixon</p>
            <h2 className="section-title">From silence to sacred clarity.</h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <p className="text-base leading-8 text-muted-foreground">
                Nancy Marie Dixon is the CEO of Divine Collective LLC, a certified Christian Life Coach, a Certified Reinvention Professional, and an author whose work helps women reclaim the voice God placed within them.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                Her practice is especially designed for women over 50 who have spent years carrying wisdom, vision, and leadership but have struggled to break the barriers holding them back from using their voice fully.
              </p>

              <blockquote className="border-l-4 border-brand-gold pl-4 italic text-base leading-8 text-brand-gold">
                "We rise to the level of our self-worth. Full stop."
              </blockquote>
            </div>

            <div className="space-y-6">
              {voicePillars.map((pillar) => (
                <div key={pillar.title} className="space-y-2 rounded-lg border-2 border-brand-gold bg-white/5 p-4 transition-all duration-300 hover:bg-white/8 hover:shadow-[0_8px_24px_rgba(200,168,75,0.15)] hover:scale-105">
                  <h3 className="font-display text-xl text-brand-gold">{pillar.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-brand-plum/30 bg-black py-20 md:py-28">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${communityImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.75)_100%)]" />
        <div className="container relative max-w-4xl space-y-8">
          <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="space-y-4 order-2 md:order-1">
              <h2 className="font-display text-4xl leading-tight text-brand-gold sm:text-5xl">Your Journey Begins Where You Are</h2>
              <p className="text-base leading-8 text-cream/72">Some women pick up the book first. Some start with a question, a reflection, a quiet moment of reckoning or a discovery call. However you arrive - you are welcome here.</p>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative overflow-hidden rounded-2xl border-2 border-brand-gold bg-white/5 shadow-[0_20px_60px_rgba(200,168,75,0.15)] w-full max-w-xs">
                <img
                  src={bookImage}
                  alt="You Have Something to Say - Use Your Voice Book"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-brand-gold bg-white/5 p-6 backdrop-blur-sm sm:p-8 transition-all duration-300 hover:bg-white/8 hover:shadow-[0_12px_32px_rgba(200,168,75,0.2)] hover:scale-105">
            <div className="space-y-4">
              <p className="font-display text-2xl text-brand-gold">You Have Something to Say… Use Your Voice is more than a book.</p>
              <p className="text-base leading-8 text-cream">It's a whole ecosystem built for women who are ready to stop shrinking and start speaking — with faith, with fire, and with everything God placed inside them.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/coaching" className="brand-button brand-button-primary">
              Click Here to View Coaching Programs
            </Link>
          </div>

          <JourneyItemsSection journeyItems={journeyItems} onLeadMagnetOpen={() => setLeadMagnetOpen(true)} />
        </div>
      </section>



      <section className="bg-background py-20 md:py-28">
        <div className="container space-y-12">
          <div className="max-w-3xl space-y-5">
            <p className="eyebrow text-brand-plum">Testimonials</p>
            <h2 className="section-title">Women who are finding their voice.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-lg border border-brand-border bg-white/2 p-6">
                <blockquote className="space-y-4">
                  <p className="text-sm leading-7 text-muted-foreground italic">"{testimonial.quote}"</p>
                  <footer className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-plum">— {testimonial.credit}</footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-brand-plum/30 bg-black py-20 md:py-28">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `url(${secondaryHeaderImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.85)_50%,rgba(0,0,0,0.4)_100%)]" />
        <div className="container relative max-w-2xl space-y-6">
          <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">Ready to find your voice?</h2>
          <p className="text-base leading-8 text-cream/72">Your transformation begins with a single conversation. Nancy offers a complimentary discovery call to explore which coaching container aligns with your season and needs.</p>
          <a href={brand.bookACallUrl} target="_blank" rel="noreferrer" className="brand-button brand-button-primary w-fit">
            Book a discovery call
          </a>
        </div>
      </section>
    </BrandShell>
    </>
  );
}
