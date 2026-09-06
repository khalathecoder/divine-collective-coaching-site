import { useEffect, useState } from "react";
import BrandShell from "@/components/BrandShell";
import { brand, programs } from "@/content/siteContent";
import { ArrowUpRight, ChevronDown, Sparkles, Star } from "lucide-react";
import { PaymentPlanSelector, type PaymentPlan } from "@/components/PaymentPlanSelector";
import WaitlistModal from "@/components/WaitlistModal";

const heroAbstract =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/purely-divine-sacred-abstract-LUSB7JT3LuXNnjruMugNij.webp";

const goldVoiceImage =
  "/manus-storage/CropPix_bf279fe3.webp";

const nancyPhoto = "/manus-storage/6A3A1315_4be8444f.webp";

// Payment plans for each program
const paymentPlansMap: Record<string, PaymentPlan[]> = {
  "called-crowned-6week": [
    {
      id: "6week-full",
      name: "Pay in Full",
      description: "One payment",
      monthlyAmount: 1497,
      installments: 1,
      totalAmount: 1497,
    },
    {
      id: "6week-2pay",
      name: "2-Payment Plan",
      description: "Split into 2 payments",
      monthlyAmount: 748.50,
      installments: 2,
      totalAmount: 1497,
    },
  ],
  "called-crowned-3month": [
    {
      id: "3month-full",
      name: "Pay in Full",
      description: "One payment",
      monthlyAmount: 2497,
      installments: 1,
      totalAmount: 2497,
    },
    {
      id: "3month-3pay",
      name: "3-Payment Plan",
      description: "Split into 3 payments",
      monthlyAmount: 832.33,
      installments: 3,
      totalAmount: 2497,
    },
  ],
  "called-crowned-6month": [
    {
      id: "6month-full",
      name: "Pay in Full",
      description: "One payment",
      monthlyAmount: 3497,
      installments: 1,
      totalAmount: 3497,
    },
    {
      id: "6month-6pay",
      name: "6-Payment Plan",
      description: "Split into 6 payments",
      monthlyAmount: 582.83,
      installments: 6,
      totalAmount: 3497,
    },
  ],
};

interface ProgramsAccordionProps {
  onSelectProgram: (program: any) => void;
  onOpenPaymentModal: () => void;
  onOpenWaitlist: (program: any) => void;
}

function ProgramsAccordion({ onSelectProgram, onOpenPaymentModal, onOpenWaitlist }: ProgramsAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(200, 168, 75, 0.3);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(200, 168, 75, 0.1);
          }
        }
        .programs-accordion-expanded {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>
      <div className="lg:hidden space-y-3">
        {programs.map((program, index) => (
          <div key={program.title} className="space-y-0">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full text-left"
            >
              <div
                className={`flex items-center justify-between gap-4 rounded-lg border-2 p-4 transition-all hover:bg-white/15 ${
                  expandedIndex === index 
                    ? "programs-accordion-expanded border-brand-gold" 
                    : "border-brand-gold bg-white/10"
                }`}
                style={{
                  background: expandedIndex === index 
                    ? `linear-gradient(135deg, ${program.accent}20, ${program.accent}12)`
                    : `linear-gradient(135deg, ${program.accent}12, ${program.accent}08)`
                }}
              >
                <div className="space-y-2 flex-1">
                  <h3 className="font-display text-lg text-foreground">{program.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground max-w-2xl">{program.summary}</p>
                  <p className="text-sm font-semibold" style={{ color: program.accent }}>{program.price}</p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition-transform ${expandedIndex === index ? "rotate-180" : ""}`}
                  style={{ color: program.accent }}
                />
              </div>
            </button>

            {expandedIndex === index && (
              <div className="mt-3 space-y-3 rounded-lg border border-brand-gold/20 bg-white/5 p-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{program.duration}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{program.format}</p>
                  <p className="text-sm leading-7 text-muted-foreground">{program.summary}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-[0.1em]">What's included:</p>
                  <ul className="space-y-1">
                    {program.includes.map((feature) => (
                      <li key={feature} className="flex gap-2 text-xs leading-6 text-muted-foreground">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {program.title === "V.O.I.C.E. Activated" ? (
                  <button
                    onClick={() => {
                      onSelectProgram(program);
                      onOpenWaitlist(program);
                    }}
                    className="brand-button brand-button-primary text-sm"
                  >
                    Add name to Wait List <ArrowUpRight className="h-3 w-3" />
                  </button>
                ) : program.productId ? (
                  <button
                    onClick={() => {
                      onSelectProgram(program);
                      onOpenPaymentModal();
                    }}
                    className="brand-button brand-button-primary text-sm"
                  >
                    Purchase Here <ArrowUpRight className="h-3 w-3" />
                  </button>
                ) : (
                  <a
                    href="/contact"
                    className="brand-button brand-button-primary text-sm"
                  >
                    Learn more <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Coaching() {
  // The nav links to /coaching#programs. On a cold load the browser resolves
  // that hash before React has rendered the section, so the jump silently does
  // nothing. Re-run it after paint. rAF (rather than a timeout) lets layout
  // settle first without guessing at a delay.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [crownHourSuccess] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("checkout") === "success" && params.get("program") === "crown-hour";
  });

  return (
    <BrandShell currentPath="/coaching">
      {crownHourSuccess && (
        <section aria-live="polite" className="border-b border-brand-gold/40 bg-brand-gold/10 px-4 py-5">
          <div className="container flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Payment received</p>
              <p className="mt-1 text-sm leading-6 text-foreground">Your Crown Hour is ready to schedule. Choose a time on Nancy’s GHL calendar.</p>
            </div>
            <a href={brand.bookACallUrl} target="_blank" rel="noreferrer" className="brand-button brand-button-primary shrink-0">Book Your Crown Hour</a>
          </div>
        </section>
      )}
      <section className="relative overflow-hidden border-b border-brand-plum/30 bg-black py-18 text-cream md:py-24">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `url(${heroAbstract})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.85)_45%,rgba(0,0,0,0.52)_100%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl space-y-6">
            <h1 className="font-display text-5xl leading-[0.96] text-brand-gold sm:text-6xl lg:text-7xl font-bold">
              Purely Divine Coaching
            </h1>
            <p className="max-w-2xl text-base leading-8 text-cream/72 sm:text-lg">
              Coaching that honors your sacred self-worth.
            </p>
            <p className="max-w-2xl text-base leading-8 text-cream/72 sm:text-lg">
              Nancy Marie Dixon offers faith-rooted coaching programs designed for women ready to move from silence into bold, purposeful expression. Each program is built on the belief that we rise to the level of our self-worth.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="mailto:info@dicollectivellc.com?subject=Coaching%20Inquiry" className="brand-button brand-button-primary">
                Inquire about coaching <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href={brand.bookACallUrl} target="_blank" rel="noreferrer" className="brand-button brand-button-ghost">
                Book a discovery call
              </a>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-white/5 shadow-[0_35px_90px_rgba(8,6,18,0.15)] max-w-sm w-full">
              <img
                src={goldVoiceImage}
              loading="lazy"
              decoding="async"
                alt="Voice Activation - Purely Divine Coaching"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16 lg:hidden">
        <div className="container flex justify-center">
          <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-white/5 shadow-[0_35px_90px_rgba(8,6,18,0.15)] max-w-lg w-full sm:max-w-md">
            <img
              src={goldVoiceImage}
              loading="lazy"
              decoding="async"
              alt="Voice Activation - Purely Divine Coaching"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container space-y-12">
          <div className="max-w-2xl space-y-4">
            <p className="eyebrow text-brand-plum">Coaching philosophy</p>
            <h2 className="section-title">What makes Purely Divine Coaching different.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Faith-rooted",
                description: "Every conversation is grounded in spiritual truth and the belief that God has placed a voice within each woman.",
              },
              {
                title: "Self-worth centered",
                description: "We rise to the level of our self-worth. Strategy without self-worth is temporary. We build from the inside out.",
              },
              {
                title: "For women over 50",
                description: "Designed especially for women who have carried wisdom and leadership but have struggled to break the barriers holding them back from using their voice.",
              },
              {
                title: "Transformational",
                description: "Coaching moves beyond advice. It creates space for women to discover their own answers, voice, and path forward.",
              },
            ].map((pillar) => (
              <article key={pillar.title} className="editorial-card border-2 border-brand-gold">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 shrink-0 text-brand-gold" />
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl text-foreground">{pillar.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{pillar.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="bg-[#f5eee7] py-20 md:py-28">
        <div className="container space-y-12">
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-4xl text-foreground">Find Your Coaching Container</h2>
              <p className="text-base leading-8 text-muted-foreground">Choose the program that aligns with your season and commitment level.</p>
            </div>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-brand-gold">
                    <th className="px-4 py-3 text-left font-display text-lg text-foreground">Program</th>
                    <th className="px-4 py-3 text-left font-display text-lg text-foreground">Format</th>
                    <th className="px-4 py-3 text-left font-display text-lg text-foreground">Duration</th>
                    <th className="px-4 py-3 text-left font-display text-lg text-foreground">Investment</th>
                    <th className="px-4 py-3 text-center font-display text-lg text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.title} className="border-b border-brand-gold/20 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{program.title}</p>
                          <p className="text-sm text-muted-foreground">{program.summary}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{program.format}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{program.duration}</td>
                      <td className="px-4 py-4 font-semibold text-foreground">{program.price}</td>
                      <td className="px-4 py-4 text-center">
                        {program.title === "V.O.I.C.E. Activated" ? (
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setWaitlistOpen(true);
                            }}
                            className="brand-button brand-button-primary inline-flex text-sm"
                          >
                            Add name to Wait List <ArrowUpRight className="h-3 w-3" />
                          </button>
                        ) : program.productId ? (
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setPaymentModalOpen(true);
                            }}
                            className="brand-button brand-button-primary inline-flex text-sm"
                          >
                            Purchase Here <ArrowUpRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <a
                            href="/contact"
                            className="brand-button brand-button-primary inline-flex text-sm"
                          >
                            Learn more <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden">
              <ProgramsAccordion
                onSelectProgram={setSelectedProgram}
                onOpenPaymentModal={() => setPaymentModalOpen(true)}
                onOpenWaitlist={(program) => {
                  setSelectedProgram(program);
                  setWaitlistOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="eyebrow text-brand-plum">About Nancy</p>
              <h2 className="section-title">Meet Your Coach</h2>
            </div>
            <p className="text-base leading-8 text-muted-foreground">
              Nancy Marie Dixon is a faith-rooted coach, speaker, and author dedicated to helping women reclaim their voice and sacred self-worth. With over two decades of experience in personal development and spiritual coaching, Nancy creates transformational experiences that move women from silence into bold, purposeful expression.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              Her coaching philosophy is simple: We rise to the level of our self-worth. Every program is designed to help you build unshakeable confidence from the inside out.
            </p>
            <div className="flex gap-4">
              <a href={brand.bookACallUrl} target="_blank" rel="noreferrer" className="brand-button brand-button-primary">
                Book a discovery call <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-white/5 shadow-[0_35px_90px_rgba(8,6,18,0.15)] max-w-sm w-full">
              <img
                src={nancyPhoto}
                loading="lazy"
                decoding="async"
                alt="Nancy Marie Dixon, certified Christian life coach"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => {
          setWaitlistOpen(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram?.title || "V.O.I.C.E. Activated"}
      />

      {selectedProgram && (
        <PaymentPlanSelector
          program={selectedProgram}
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedProgram(null);
          }}
          paymentPlans={paymentPlansMap[selectedProgram.productId] || []}
        />
      )}
    </BrandShell>
  );
}
