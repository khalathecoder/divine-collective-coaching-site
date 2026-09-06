/*
Design reminder for this file:
This shared frame should express sacred editorial luxury through spacious layout, calm hierarchy, and refined motion.
Use deep purple, ivory, and restrained gold to create clarity without visual noise.
*/
import { Link } from "wouter";
import { brand } from "@/content/siteContent";
import React, { type ReactNode, useState, useEffect } from "react";
import { Menu, X, ArrowUp } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Purely Divine Coaching", href: "/coaching" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Shop", href: "/shop" },
];

export default function BrandShell({
  currentPath,
  children,
  enableChat = true,
}: {
  currentPath: string;
  children: ReactNode;
  enableChat?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load LeadConnector chat widget
  useEffect(() => {
    if (!enableChat) return;

    const script = document.createElement('script');
    script.src = 'https://widgets.leadconnectorhq.com/loader.js';
    script.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    script.setAttribute('data-widget-id', '6a5fd617d166a8719faf5360');
    script.setAttribute('data-source', 'WEB_USER');
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [enableChat]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="brand-shell min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,106,230,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(200,168,75,0.12),transparent_28%)]" />
        <div className="grain-overlay absolute inset-0" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black backdrop-blur-xl">
        <div className="container flex items-center justify-between gap-6 py-3 lg:justify-start">
          <Link href="/" className="min-w-0 flex-1 lg:flex-none lg:mr-auto text-center lg:text-left">
            <img
              src="/manus-storage/Logo(13)_150505f4.png"
              alt="Divine Collective Logo"
              className="h-auto w-24 md:w-32 lg:w-40 aspect-auto inline-block"
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              const isCurrent = item.href === currentPath;
              const isMail = item.href.startsWith("mailto:");
              const isHash = item.href.includes("#");

              if (isHash) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="nav-link text-[0.73rem] uppercase tracking-[0.28em] text-cream/70 transition hover:text-brand-gold"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`nav-link text-[0.73rem] uppercase tracking-[0.28em] transition ${
                    isCurrent ? "text-brand-gold" : "text-cream/70 hover:text-brand-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-cream/70 hover:text-brand-gold transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <a href="https://link.kopsystem.com/widget/bookings/nancy-dixon-personal-calendar-0svswpnv8" className="brand-button brand-button-primary hidden md:inline-flex">
            Book a call
          </a>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black lg:hidden">
            <div className="container space-y-4 py-6">
              {navItems.map((item) => {
                const isCurrent = item.href === currentPath;
                const isMail = item.href.startsWith("mailto:");
                const isHash = item.href.includes("#");

                if (isHash) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm uppercase tracking-[0.28em] text-cream/70 transition hover:text-brand-gold"
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-sm uppercase tracking-[0.28em] transition ${
                      isCurrent ? "text-brand-gold" : "text-cream/70 hover:text-brand-gold"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a href="https://link.kopsystem.com/widget/bookings/nancy-dixon-personal-calendar-0svswpnv8" className="brand-button brand-button-primary inline-flex md:hidden mt-4">
                Book a call
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">{children}</main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-gold/10 text-brand-gold transition-all hover:bg-brand-gold/20 hover:shadow-[0_0_20px_rgba(200,168,75,0.3)]"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <footer className="relative z-10 border-t border-white/10 bg-black text-cream/75">
        <div className="container grid gap-10 py-14 md:grid-cols-[1.25fr_0.9fr_0.9fr]">
          <div className="space-y-4">
            <p className="eyebrow">Purely Divine Coaching</p>
            <h2 className="font-display text-3xl text-cream md:text-4xl">Where silenced women find their voice.</h2>
            <p className="max-w-md text-sm leading-7 text-cream/65">
              Faith-rooted coaching, resources, and reinvention support for women who are ready to move with clarity, self-worth, and bold expression.
            </p>
            <p className="max-w-sm border-l border-brand-gold/60 pl-4 font-display text-lg italic text-brand-gold-soft">
              “We rise to the level of our self-worth. Full stop.”
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Explore</p>
            <div className="space-y-3 text-sm text-cream/65">
              <p>
                <Link href="/" className="transition hover:text-brand-gold">
                  Main site
                </Link>
              </p>
              <p>
                <Link href="/shop" className="transition hover:text-brand-gold">
                  Shop resources
                </Link>
              </p>
              <p>
                <a href="/#programs" className="transition hover:text-brand-gold">
                  Program suite
                </a>
              </p>
              <p>
                <a href={brand.shopUrl} target="_blank" rel="noreferrer" className="transition hover:text-brand-gold">
                  External storefront
                </a>
              </p>
              <p>
                <Link href="/privacy" className="transition hover:text-brand-gold">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">Connect</p>
            <div className="space-y-3 text-sm leading-7 text-cream/65">
              <p>{brand.owner}</p>
              <p>{brand.company}</p>
              <p>{brand.location}</p>
              <p>
                <a href={`mailto:${brand.email}`} className="transition hover:text-brand-gold">
                  {brand.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
