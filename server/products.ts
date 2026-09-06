/**
 * Product definitions for Stripe integration.
 * Centralized configuration for all purchasable products.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents (e.g., 999 for $9.99)
  currency: string;
  type: "digital" | "physical" | "coaching";
  deliveryMethod?: string; // e.g., "instant", "email", "shipping", "coaching"
  guideUrl?: string; // URL to digital guide file (for instant delivery)
}

export interface PaymentPlan {
  id: string; // Unique identifier for the plan (e.g., '3month-3pay')
  name: string;
  installments: number;
  monthlyPrice: number; // in cents
  totalPrice: number; // in cents
}

export interface ProductWithPlans extends Product {
  paymentPlans?: PaymentPlan[];
}

export const PRODUCTS: Record<string, ProductWithPlans> = {
  "bold-out-masterclass": {
    id: "bold-out-masterclass",
    name: "B.O.L.D. OUT Voice Activation Experience™",
    description: "A 90-minute virtual, faith-rooted voice activation experience with practical exercises, B.O.L.D. Voice Framework™ teaching, seven Bold Declarations, and live Q&A with Nancy Marie Dixon.",
    price: 4700,
    currency: "usd",
    type: "coaching",
    deliveryMethod: "live-event",
  },
  // Retained only for historical order reconciliation; it is not a live offer.
  "bold-out-masterclass-vip": {
    id: "bold-out-masterclass-vip",
    name: "B.O.L.D. OUT Voice Activation Experience™ — Historical VIP",
    description: "Historical VIP registration record retained for audit purposes; no longer available for new checkout.",
    price: 9700,
    currency: "usd",
    type: "coaching",
    deliveryMethod: "live-event",
  },
  "crown-hour": {
    id: "crown-hour",
    name: "The Crown Hour",
    description: "A powerful first step for women who need clarity, language, and direction before they make another move.",
    price: 9700,
    currency: "usd",
    type: "coaching",
    deliveryMethod: "private-session",
  },
  "voice-activated": {
    id: "voice-activated",
    name: "V.O.I.C.E. Activated",
    description: "A group activation journey for women ready to practice speaking, showing up, and moving in alignment with their calling.",
    price: 49700,
    currency: "usd",
    type: "coaching",
    deliveryMethod: "group-program",
  },
  "you-have-something-to-say-book": {
    id: "you-have-something-to-say-book",
    name: "You Have Something to Say...Use Your Voice",
    description: "A transformational guide for women reclaiming their voice and presence. Explore the connection between mindset, self-worth, and authentic expression.",
    price: 1999, // $19.99
    currency: "usd",
    type: "digital",
    deliveryMethod: "instant",
  },
  "divine-mindset-guide": {
    id: "divine-mindset-guide",
    name: "The Divine Mindset Guide",
    description:
      "A companion guide exploring the relationship between your mindset and your voice. Includes practical reflections and declarations aligned with God's truth.",
    price: 999, // $9.99
    currency: "usd",
    type: "digital",
    deliveryMethod: "instant",
    guideUrl: "/manus-storage/divine-mindset-guide_9ca7aba7.html",
  },
  "called-crowned-6week": {
    id: "called-crowned-6week",
    name: "Called & Crowned (6-Week)",
    description:
      "An intimate private coaching journey for women ready to activate their voice and step into their sacred self-worth over six weeks.",
    price: 149700, // $1,497
    currency: "usd",
    type: "coaching",
    deliveryMethod: "coaching",
    paymentPlans: [
      {
        id: "6week-full",
        name: "Full Payment",
        installments: 1,
        monthlyPrice: 149700,
        totalPrice: 149700,
      },
      {
        id: "6week-2pay",
        name: "2-Payment Plan",
        installments: 2,
        monthlyPrice: 74850,
        totalPrice: 149700,
      },
    ],
  },
  "called-crowned-3month": {
    id: "called-crowned-3month",
    name: "Called & Crowned (3-Month)",
    description:
      "An extended private coaching journey for women ready to go deeper in their voice activation and self-worth transformation over a full quarter.",
    price: 249700, // $2,497
    currency: "usd",
    type: "coaching",
    deliveryMethod: "coaching",
    paymentPlans: [
      {
        id: "3month-full",
        name: "Full Payment",
        installments: 1,
        monthlyPrice: 249700,
        totalPrice: 249700,
      },
      {
        id: "3month-3pay",
        name: "3-Payment Plan",
        installments: 3,
        monthlyPrice: 83233,
        totalPrice: 249700,
      },
    ],
  },
  "called-crowned-6month": {
    id: "called-crowned-6month",
    name: "Called & Crowned (6-Month)",
    description:
      "Nancy's most comprehensive private coaching experience for women committed to complete transformation and sustained voice activation over six months.",
    price: 349700, // $3,497
    currency: "usd",
    type: "coaching",
    deliveryMethod: "coaching",
    paymentPlans: [
      {
        id: "6month-full",
        name: "Full Payment",
        installments: 1,
        monthlyPrice: 349700,
        totalPrice: 349700,
      },
      {
        id: "6month-6pay",
        name: "6-Payment Plan",
        installments: 6,
        monthlyPrice: 58283,
        totalPrice: 349700,
      },
    ],
  },
};

export function getProduct(productId: string): ProductWithPlans | undefined {
  return PRODUCTS[productId];
}

export function formatPrice(cents: number, currency: string = "usd"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  });
  return formatter.format(cents / 100);
}
