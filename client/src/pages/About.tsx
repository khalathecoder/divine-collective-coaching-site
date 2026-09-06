/*
Design reminder for this file:
Sacred editorial luxury with dignified portraiture and reverent typography.
Nancy's presence should be the focal point, with her wisdom and credentials supporting the visual hierarchy.
*/
import BrandShell from "@/components/BrandShell";
import { brand, voicePillars } from "@/content/siteContent";
import { BookOpenText, Crown, Mic2, Sparkles } from "lucide-react";

const nancyHeadshot =
  "/manus-storage/6A3A1228.jpgcrop_65f06070.webp";

const voiceIllustration =
  "/manus-storage/gold-voice-transparent_80ebebf4.png";

const divineBrandingImage =
  "/manus-storage/ChatGPTImageApr27,2026,10_24_56AM_2c28d05c.png";

export default function About() {
  return (
    <BrandShell currentPath="/about">
      {/* Hero Section with Headshot */}
      <section className="bg-black py-20 md:py-28">
        <div className="container max-w-4xl mx-auto text-center">
          {/* Divine Collective Branding Image */}
          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-3xl">
              <img
                src={divineBrandingImage}
                alt="Divine Collective - Empowering Women, Transforming Lives, Impacting Generations"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
          
          {/* Company Mission Content */}
          <div className="mb-12 max-w-3xl mx-auto space-y-4 text-cream/90">
            <p className="text-base leading-8">
              Divine Collective LLC is a coaching and consulting firm dedicated to empowering women to achieve their fullest potential through transformative personal growth, goal achievement, and business reinvention strategies. With a focus on voice empowerment, self-worth and purpose, under the branding name of Purely Divine Coaching, Life Coaching programs are designed to help women rediscover their self-worth, use their voice and live out their life's purpose unapologetically.
            </p>
          </div>
          
          {/* Headshot with Black Background */}
          <div className="mb-12 flex justify-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-gold/30 bg-black shadow-[0_35px_90px_rgba(8,6,18,0.15)] max-w-lg">
              <img
                src={nancyHeadshot}
                alt="Nancy Marie Dixon - Certified Christian Life Coach"
                className="h-auto w-full max-w-lg object-cover"
              />
            </div>
          </div>

          {/* Title and Intro */}
          <div className="space-y-6">
            <h1 className="font-display text-5xl leading-tight text-white sm:text-6xl">
              Nancy Marie Dixon
            </h1>
            <p className="text-lg leading-8 text-white/80">
              CEO of Divine Collective LLC | Certified Christian Life Coach | Certified Reinvention Professional | Author
            </p>
            <p className="text-base leading-8 text-white max-w-2xl mx-auto mt-8">
              Inspired by faith and grounded in the belief that every woman has a powerful voice capable of driving meaningful change, I am committed to helping them tap into their unique potential. Whether you're seeking to reinvent your career, redefine your purpose, or take your business to the next level, I'm here to walk alongside you on this transformative journey.
            </p>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="border-t border-brand-border bg-[#f5f1ed] py-20 md:py-28">
        <div className="container max-w-4xl space-y-12">
          {/* Mission & Expertise - Moved Up */}
          <div className="space-y-6">
            <h2 className="section-title text-black">Mission, Vision & Expertise</h2>
            <div className="mb-8 space-y-3 max-w-3xl">
              <div>
                <h3 className="font-display text-lg font-semibold text-black mb-2">Mission</h3>
                <p className="text-base text-gray-700 leading-relaxed">Our mission is to create a global community of purpose-driven women as individuals and leaders who use their voice to embrace reinvention and reach lasting success.</p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-black mb-2">Vision</h3>
                <p className="text-base text-gray-700 leading-relaxed">To inspire women as individuals and entrepreneurs to embrace reinvention, use their voice, maximize their potential, and create impactful, purpose-driven futures</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  label: "Author",
                  value: "You Have Something to Say…Use Your Voice.",
                  description: "A transformational guide for women reclaiming their voice and presence.",
                },
                {
                  label: "Certifications",
                  value: "Christian Life Coach & Reinvention Professional",
                  description: "Specialized training in faith-rooted coaching and life transformation.",
                },
                {
                  label: "AUDIENCE",
                  value: "Women Over 50",
                  description: "Open to any woman God directs to Divine Collective's transformational work.",
                },
              ].map((item) => (
                <div key={item.label} className="editorial-card bg-card border-2 border-brand-gold">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-brand-plum font-semibold">{item.label}</p>
                  <h3 className="font-display text-xl text-foreground mt-3">{item.value}</h3>
                  <p className="text-sm leading-6 text-muted-foreground mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Four Pillars */}
          <div className="space-y-6">
            <h2 className="section-title">The Foundation of Divine Collective</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {voicePillars.map((pillar, index) => {
                const icons = [Crown, Mic2, Sparkles, BookOpenText];
                const Icon = icons[index % icons.length];
                return (
                  <article key={pillar.title} className="editorial-card bg-card text-card-foreground border-2 border-brand-gold">
                    <Icon className="h-5 w-5 text-brand-gold" />
                    <h3 className="font-display text-2xl text-foreground">{pillar.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {pillar.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-6 border-t-2 border-brand-gold pt-12">
            <h2 className="section-title">Ready to Find Your Voice?</h2>
            <p className="section-copy">
              Nancy's coaching practice offers multiple entry points—from single sessions to ongoing VIP support. Whether you're just beginning to explore your voice or ready for deep transformation, there's a program designed for your journey.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="mailto:info@dicollectivellc.com?subject=Discovery%20Call" className="brand-button brand-button-primary">
                Book a discovery call
              </a>
              <a href="/coaching" className="brand-button brand-button-ghost">
                Explore programs
              </a>
            </div>
          </div>
        </div>
      </section>
    </BrandShell>
  );
}
