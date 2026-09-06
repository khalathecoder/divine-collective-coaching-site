/*
Design reminder for this file:
This contact page should match the Home page's sacred editorial luxury styling with off-axis layout, dignified typography, and reverent motion.
Use the same color palette: black background with sacred abstract overlay, cream text, gold accents, and brand-plum highlights.
Emphasize the invitation to connect with Nancy through the contact form.
*/
import { useState } from "react";
import BrandShell from "@/components/BrandShell";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const sacredAbstract =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/purely-divine-sacred-abstract-LUSB7JT3LuXNnjruMugNij.webp";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitContactMutation = trpc.contact.submitMessage.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    submitContactMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Thank you! We've received your message and will get back to you soon.");
        setFormData({
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          email: "",
          phone: "",
          message: "",
        });
      },
      onError: (error: any) => {
        console.error("Form submission error:", error);
        toast.error(error?.message || "There was an error submitting your message. Please try again.");
      },
    });
  };

  return (
    <BrandShell currentPath="/contact">
      {/* Hero Section - Matches Home Page */}
      <section className="relative overflow-hidden border-b border-brand-plum/35 bg-black text-cream">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `url(${sacredAbstract})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.82)_42%,rgba(0,0,0,0.38)_100%)]" />
        <div className="container relative py-12 md:py-16 lg:py-20">
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="space-y-3">
              <p className="eyebrow">Get in Touch</p>
              <h1 className="font-display text-4xl leading-[0.96] text-cream sm:text-5xl lg:text-6xl">
                Ready to <span className="text-brand-gold">connect</span>?
              </h1>
            </div>
            <p className="hero-copy max-w-xl text-base leading-8 text-cream/72 sm:text-lg">
              Whether you have questions about coaching, want to explore our resources, or simply want to say hello—we'd love to hear from you. Fill out the form below and Nancy will get back to you shortly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative overflow-hidden py-16 md:py-20 border-b border-brand-plum/35 bg-brand-soft">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.1) 0%, transparent 50%)` }} />
        <div className="container max-w-3xl relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="eyebrow text-brand-plum">Send us a message</p>
              <h2 className="section-title">
                Connect with Nancy
              </h2>
              <p className="text-base leading-8 text-muted-foreground">
                Fill out the form below and we'll respond as soon as possible.
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="relative w-full overflow-hidden rounded-lg border border-brand-gold/30 bg-white/5 backdrop-blur-sm p-8 md:p-12 space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                  placeholder="123 Main Street"
                />
              </div>

              {/* City, State, Zip Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-foreground mb-2">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    placeholder="10001"
                  />
                </div>
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Type Message: <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 rounded-md border border-brand-gold/30 bg-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitContactMutation.isPending}
                className="w-full px-6 py-3 rounded-md bg-brand-gold text-black font-semibold hover:bg-brand-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitContactMutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods - Same background as hero */}
      <section className="relative overflow-hidden border-b border-brand-plum/35 bg-black text-cream py-16 md:py-20">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `url(${sacredAbstract})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.82)_42%,rgba(0,0,0,0.38)_100%)]" />
        <div className="container max-w-4xl relative z-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="eyebrow">Other ways to connect</p>
              <h2 className="font-display text-4xl md:text-5xl text-cream">
                Reach out <span className="text-brand-gold">directly</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-3 p-6 rounded-lg border-2 border-brand-gold bg-white/5 hover:bg-white/10 transition-all">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Email</h3>
                <p className="text-base leading-8 text-cream/72">
                  <a
                    href="mailto:info@dicollectivellc.com"
                    className="transition hover:text-brand-gold"
                  >
                    info@dicollectivellc.com
                  </a>
                </p>
                <p className="text-sm text-cream/60">
                  We typically respond within 24-48 hours.
                </p>
              </div>

              {/* Book a Call */}
              <div className="space-y-3 p-6 rounded-lg border-2 border-brand-gold bg-white/5 hover:bg-white/10 transition-all">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Schedule a Call</h3>
                <p className="text-base leading-8 text-cream/72">
                  <a
                    href="https://link.kopsystem.com/widget/bookings/nancy-dixon-personal-calendar-0svswpnv8"
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-brand-gold"
                  >
                    Book a discovery call
                  </a>
                </p>
                <p className="text-sm text-cream/60">
                  Schedule a complimentary 30-minute consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container max-w-3xl">
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <p className="eyebrow text-brand-plum">Ready to start?</p>
              <h2 className="section-title">
                Begin your journey today
              </h2>
            </div>
            <p className="text-base leading-8 text-muted-foreground max-w-xl mx-auto">
              Whether you're exploring coaching, diving into our resources, or simply ready to find your voice—we're here to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="https://link.kopsystem.com/widget/bookings/nancy-dixon-personal-calendar-0svswpnv8"
                className="brand-button brand-button-primary"
              >
                Book a discovery call
              </a>
              <a href="/shop" className="brand-button brand-button-ghost">
                Explore resources <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </BrandShell>
  );
}
