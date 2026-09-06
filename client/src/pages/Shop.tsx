/*
Design reminder for this file:
Product grid storefront featuring 5 products/assessments in a responsive grid layout.
3 paid products (2 Amazon, 1 Stripe) + 2 free assessments, all styled as consistent product cards.
Each card displays: cover image, title, description, price/FREE badge, and action button.
Maintains luxury aesthetic with gold accents and elegant typography.
*/
import BrandShell from "@/components/BrandShell";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Mic2, Sparkles, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { assessmentHref, assessmentRoutes } from "@/lib/assessmentRoutes";

// Product images
const bookImage = "/manus-storage/ChatGPTImageApr28,2026,03_24_39PM_1e5b16a9.png";
const workbookImage = "/manus-storage/WorkbookCover_VersionA_Black_0663073a.png";
const mindsetImage = "/manus-storage/ChatGPTImageApr30,2026,08_54_46PM_e4ae7e06.png";
const voiceQuizImage = "/manus-storage/voice-quiz-image_ba1fcf4a.png";
const assessmentImage = "/manus-storage/divine-mindset-assessment-image_8912d12d.png";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  type: "amazon" | "stripe" | "quiz" | "assessment" | "dual";
  amazonLink?: string;
  stripeProductId?: string;
  category: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: "book",
    title: "You Have Something to Say...Use Your Voice",
    description: "A transformational guide for women reclaiming their voice and presence. Explore the connection between mindset, self-worth, and authentic expression.",
    price: "$19.99",
    image: bookImage,
    type: "dual",
    amazonLink: "https://www.amazon.com/You-Have-Something-Your-Voice/dp/B0DJWJP5VG/",
    stripeProductId: "you-have-something-to-say-book",
    category: "Book"
  },
  {
    id: "workbook",
    title: "You Have Something to Say...Use Your Voice Companion Workbook",
    description: "Deepen your journey with guided reflections, declarations, and interactive exercises designed to help you discover and activate your authentic voice.",
    price: "$14.99",
    image: workbookImage,
    type: "amazon",
    amazonLink: "https://www.amazon.com/Have-Something-Voice-Companion-Workbook/dp/B0H5BTP4YS/",
    category: "Workbook"
  },
  {
    id: "mindset-guide",
    title: "The Divine Mindset Guide",
    description: "A companion guide exploring the relationship between your mindset and your voice. Includes practical reflections and declarations aligned with God's truth.",
    price: "$9.99",
    image: mindsetImage,
    type: "stripe",
    stripeProductId: "divine-mindset-guide",
    category: "Guide"
  },
  {
    id: "voice-quiz",
    title: "Voice Activation Quiz",
    description: "Discover your voice archetype and receive personalized insights to help you activate your authentic expression.",
    price: "FREE",
    image: voiceQuizImage,
    type: "quiz",
    category: "Assessment",
    badge: "FREE"
  },
  {
    id: "mindset-assessment",
    title: "Divine Mindset Assessment",
    description: "Assess your current mindset patterns and receive a personalized roadmap for cultivating a divine perspective aligned with your voice.",
    price: "FREE",
    image: assessmentImage,
    type: "assessment",
    category: "Assessment",
    badge: "FREE"
  }
];

function ProductCard({ product, onStripeOpen }: {
  product: Product;
  onStripeOpen: (productId?: string) => void;
}) {
  const handleClick = (source?: string) => {
    if (product.type === "stripe") {
      onStripeOpen(product.stripeProductId);
    } else if (product.type === "dual" && source === "stripe") {
      onStripeOpen(product.stripeProductId);
    } else if ((product.type === "amazon" || product.type === "dual") && product.amazonLink) {
      window.open(product.amazonLink, "_blank");
    }
  };

  const buttonText = 
    product.type === "quiz" ? "Take Quiz" :
    product.type === "assessment" ? "Start Assessment" :
    product.type === "stripe" ? "Purchase" :
    product.type === "dual" ? "Purchase Options" :
    "Buy on Amazon";

  if (product.type === "quiz" || product.type === "assessment") {
    const href = product.type === "quiz"
      ? assessmentHref(assessmentRoutes.voiceQuiz, "/shop")
      : assessmentHref(assessmentRoutes.divineMindset, "/shop");
    const label = product.type === "quiz" ? "Open the Voice Activation Quiz" : "Open the Divine Mindset Assessment";
    const buttonText = product.type === "quiz" ? "Take Quiz" : "Start Assessment";

    return (
      <div className="group rounded-lg border-2 border-brand-gold bg-white/5 overflow-hidden transition-all hover:bg-white/10 hover:shadow-lg">
        <div className="relative h-48 overflow-hidden bg-black">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {product.badge && <div className="absolute top-3 right-3 bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-semibold">{product.badge}</div>}
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-wide">{product.category}</p>
            <h3 className="font-serif text-lg text-cream font-semibold leading-tight">{product.title}</h3>
            <p className="text-sm text-cream/70">{product.description}</p>
          </div>
          <div className="pt-2 border-t border-brand-gold/20"><p className="text-lg font-semibold text-brand-gold">{product.price}</p></div>
          <a href={href} aria-label={label} data-testid={product.type === "quiz" ? "shop-voice-quiz-trigger" : "shop-mindset-assessment-trigger"} className="w-full py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10">
            {buttonText}<ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border-2 border-brand-gold bg-white/5 overflow-hidden transition-all hover:bg-white/10 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-black">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <div className="absolute top-3 right-3 bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-wide">{product.category}</p>
          <h3 className="font-serif text-lg text-cream font-semibold leading-tight">{product.title}</h3>
          <p className="text-sm text-cream/70">{product.description}</p>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-brand-gold/20">
          <p className="text-lg font-semibold text-brand-gold">{product.price}</p>
        </div>

        {/* Action Button(s) */}
        {product.type === "dual" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleClick("amazon")}
              className="flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-brand-gold text-black hover:bg-brand-gold/90"
            >
              Amazon
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleClick("stripe")}
              className="flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10"
            >
              Buy Direct
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label={buttonText === "Take Quiz" ? "Open the Voice Activation Quiz" : buttonText === "Start Assessment" ? "Open the Divine Mindset Assessment" : buttonText}
            data-testid={undefined}
            onClick={() => handleClick()}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              product.type === "amazon"
                ? "bg-brand-gold text-black hover:bg-brand-gold/90"
                : "border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10"
            }`}
          >
            {buttonText}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  const [stripeOpen, setStripeOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  const [successfulProductId, setSuccessfulProductId] = useState<string | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSuccessfulProductId(params.get("success") === "true" ? params.get("product") : null);
    setCheckoutSessionId(params.get("session_id"));
  }, []);

  const deliveryVerificationInput = useMemo(
    () => successfulProductId && checkoutSessionId
      ? { productId: successfulProductId, sessionId: checkoutSessionId }
      : undefined,
    [successfulProductId, checkoutSessionId],
  );
  const verifiedDeliveryQuery = trpc.payments.verifyDigitalDelivery.useQuery(deliveryVerificationInput!, {
    enabled: Boolean(deliveryVerificationInput),
    retry: false,
  });
  const createGuestCheckoutMutation = trpc.payments.createGuestCheckout.useMutation();

  const handleStripeCheckout = async (productId?: string) => {
    try {
      createGuestCheckoutMutation.mutate(
        { 
          productId: productId || "divine-mindset-guide",
          email: user?.email || "", 
          name: user?.name || "" 
        },
        {
          onSuccess: (data) => {
            if (data.checkoutUrl) {
              window.open(data.checkoutUrl, "_blank");
              toast.success("Redirecting to checkout...");
              setStripeOpen(false);
            }
          },
          onError: (error: any) => {
            toast.error("Failed to create checkout session");
            console.error(error);
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during checkout");
    }
  };

  return (
    <>
      {/* Stripe Checkout Modal */}
      {stripeOpen && selectedProductId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-brand-gold rounded-lg p-6 max-w-md w-full space-y-4">
            <button
              onClick={() => setStripeOpen(false)}
              className="absolute top-4 right-4 text-cream hover:text-brand-gold"
            >
              ✕
            </button>
            {selectedProductId === "you-have-something-to-say-book" && (
              <>
                <img src={bookImage} alt="You Have Something to Say...Use Your Voice" className="w-full h-48 object-cover rounded" />
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-cream font-semibold">You Have Something to Say...Use Your Voice</h3>
                  <p className="text-sm text-cream/70">A transformational guide for women reclaiming their voice and presence. Instant digital delivery.</p>
                  <p className="text-2xl font-semibold text-brand-gold">$19.99</p>
                </div>
              </>
            )}
            {selectedProductId === "divine-mindset-guide" && (
              <>
                <img src={mindsetImage} alt="Divine Mindset Guide" className="w-full h-48 object-cover rounded" />
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-cream font-semibold">The Divine Mindset Guide</h3>
                  <p className="text-sm text-cream/70">A companion guide exploring the relationship between your mindset and your voice. Instant digital delivery.</p>
                  <p className="text-2xl font-semibold text-brand-gold">$9.99</p>
                </div>
              </>
            )}
            <button
              onClick={() => handleStripeCheckout(selectedProductId)}
              disabled={createGuestCheckoutMutation.isPending}
              className="w-full bg-brand-gold text-black py-2 rounded-lg font-semibold hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createGuestCheckoutMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <BrandShell currentPath="/shop">
        <div className="min-h-screen bg-black py-20">
          <div className="max-w-7xl mx-auto px-4">
            {deliveryVerificationInput && verifiedDeliveryQuery.isLoading && (
              <section role="status" aria-live="polite" className="mx-auto mb-12 max-w-2xl rounded-2xl border border-brand-gold/40 bg-brand-gold/5 p-6 text-center">
                <p className="text-sm text-cream/75">Verifying your payment and preparing your guide…</p>
              </section>
            )}
            {verifiedDeliveryQuery.data?.authorized && (
              <section role="status" aria-live="polite" className="mx-auto mb-12 max-w-2xl rounded-2xl border-2 border-brand-gold bg-brand-gold/10 p-6 text-center shadow-[0_12px_36px_rgba(200,168,75,0.16)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">Payment received</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-cream">Your guide is ready</h2>
                <p className="mt-2 text-sm leading-6 text-cream/75">Thank you for purchasing {verifiedDeliveryQuery.data.productName}. Open your digital guide now or return to it later from this confirmation page.</p>
                <a href={verifiedDeliveryQuery.data.downloadUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-5 py-3 font-semibold text-black transition-colors hover:bg-brand-gold/90">
                  Open Your Guide
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </section>
            )}

            {/* Header */}
            <div className="text-center mb-16 space-y-4">
              <p className="text-brand-gold font-semibold uppercase tracking-widest">Shop</p>
              <h1 className="font-serif text-4xl md:text-5xl text-cream font-bold">
                Resources for Your Voice
              </h1>
              <p className="text-cream/70 max-w-2xl mx-auto text-lg">
                Explore our collection of books, guides, and assessments designed to support your journey toward authentic expression and self-worth.
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onStripeOpen={(productId) => {
                    setSelectedProductId(productId);
                    setStripeOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </BrandShell>
    </>
  );
}
