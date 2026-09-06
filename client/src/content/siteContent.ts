export type Program = {
  title: string;
  price: string;
  format: string;
  duration: string;
  palette: string;
  accent: string;
  summary: string;
  audience: string;
  includes: string[];
  startDate?: string;
  productId?: string;
};

export type ShopResource = {
  slug: string;
  category: string;
  title: string;
  price: string;
  status: "Available now" | "Free" | "Join waitlist" | "Coming soon";
  format: string;
  description: string;
  audience: string;
  accent: string;
  cta: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const brand = {
  title: "Purely Divine Coaching",
  owner: "Nancy Marie Dixon",
  company: "Divine Collective LLC",
  tagline: "Where Silenced Women Find Their Voice.",
  subtagline: "We rise to the level of our self-worth. Full stop.",
  mission:
    "Purely Divine Coaching is a faith-rooted voice coaching practice led by Nancy Marie Dixon, serving Black women over 50 and any woman God directs her way. The work helps women move from silence and self-doubt into bold, purpose-filled expression.",
  location: "Cleveland Heights / South Euclid, Ohio",
  email: "info@dicollectivellc.com",
  shopUrl: "https://shop.dicollectivellc.com",
  primaryUrl: "https://dicollectivellc.com",
  bookTitle: "You Have Something to Say…Use Your Voice.",
  bookACallUrl: "https://link.kopsystem.com/widget/bookings/nancy-dixon-personal-calendar-0svswpnv8",
};

export const programs: Program[] = [
  {
    title: "Book a Discovery Call",
    price: "Complimentary",
    format: "Private consultation",
    duration: "30-minute call",
    palette: "Gold & Cream",
    accent: "#c8a84b",
    summary:
      "A complimentary conversation with Nancy to explore your coaching goals and discover which program aligns with your season.",
    audience:
      "Women ready to take the next step and explore personalized coaching support.",
    includes: [
      "Personal goals and challenges discussion",
      "Program recommendation based on your season",
      "Clear next steps and pathway forward",
    ],
  },
  {
    title: "B.O.L.D. OUT Voice Activation Experience™",
    price: "$47",
    format: "Virtual (Zoom)",
    duration: "90 minute activation experience",
    palette: "Deep Navy, Plum, Ivory & Champagne Gold",
    accent: "#181216",
    summary:
      "A faith-rooted voice activation experience with practical exercises, B.O.L.D. Voice Framework teaching, seven Bold Declarations, and live Q&A with Nancy.",
    audience:
      "Women who want an accessible virtual experience that helps them stop shrinking and start showing up.",
    includes: [
      "Full 90-minute virtual experience",
      "Faith-rooted voice activation and practical exercises",
      "B.O.L.D. Voice Framework, seven Bold Declarations, and live Q&A",
    ],
    productId: "bold-out-masterclass",
  },
  {
    title: "The Crown Hour",
    price: "$97",
    format: "Private 1:1 session",
    duration: "60 minute expanded exploratory session",
    palette: "Purple & Gold",
    accent: "#7a6ae6",
    summary:
      "A powerful first step for women who need clarity, language, and direction before they make another move.",
    audience:
      "Women who want a single strategic session to name what is blocking them and identify the next faithful step.",
    includes: [
      "Personal voice and purpose clarity conversation",
      "Practical next-step guidance",
      "Private coaching support in a focused container",
    ],
    productId: "crown-hour",
  },
  {
    title: "V.O.I.C.E. Activated",
    price: "$497",
    format: "5-week group program",
    duration: "Five guided weeks",
    palette: "Teal & Gold",
    accent: "#0f8a83",
    summary:
      "A group activation journey for women ready to practice speaking, showing up, and moving in alignment with their calling.",
    audience:
      "Women who want structure, accountability, and community as they rebuild confidence in their voice.",
    includes: [
      "Weekly group coaching experience",
      "Faith-rooted confidence and expression exercises",
      "Supportive group momentum and reflection",
    ]
  },
  {
    title: "Crowned & Called",
    price: "$1,497",
    format: "6-week private flagship",
    duration: "Six high-touch weeks",
    palette: "Deep Crown Purple & Gold",
    accent: "#26215C",
    summary:
      "Nancy's private flagship experience for women who are ready to reclaim their voice and live from sacred self-worth.",
    audience:
      "Women in a reinvention season who want private support, deeper strategy, and transformational accountability.",
    includes: [
      "Private high-touch coaching journey",
      "Identity, voice, and self-worth work",
      "Strategic support for bold next decisions",
    ],
    startDate: "August 1, 2026",
    productId: "called-crowned-6week",
  },
  {
    title: "Crowned & Called (3-Month)",
    price: "$2,497 - Payment plans available",
    format: "12-week private program",
    duration: "Three months of high-touch coaching",
    palette: "Deep Crown Purple & Gold",
    accent: "#26215C",
    summary:
      "An extended private coaching journey for women ready to go deeper in their voice activation and self-worth transformation over a full quarter.",
    audience:
      "Women who want sustained support, deeper transformation, and accountability over an extended timeframe.",
    includes: [
      "Weekly private coaching sessions",
      "Deep identity, voice, and self-worth work",
      "Strategic life and voice planning",
      "Ongoing accountability and support",
    ],
    startDate: "September 1, 2026",
    productId: "called-crowned-3month",
  },
  {
    title: "Crowned & Called (6-Month)",
    price: "$3,497 - Payment plans available",
    format: "24-week private program",
    duration: "Six months of high-touch coaching",
    palette: "Deep Crown Purple & Gold",
    accent: "#26215C",
    summary:
      "Nancy's most comprehensive private coaching experience for women committed to complete transformation and sustained voice activation over six months.",
    audience:
      "Women ready for deep, lasting transformation with intensive private support, strategic planning, and transformational accountability.",
    includes: [
      "Bi-weekly private coaching sessions",
      "Deep identity, voice, and self-worth transformation",
      "Comprehensive life and voice strategy",
      "Ongoing accountability, support, and community",
    ],
    startDate: "October 1, 2026",
    productId: "called-crowned-6month",
  },
];

export const shopResources: ShopResource[] = [
  {
    slug: "book",
    category: "Book",
    title: "You Have Something to Say…Use Your Voice.",
    price: "$19.99",
    status: "Available now",
    format: "Published book",
    description:
      "Nancy Marie Dixon's signature book for women who know there is more inside them and are ready to stop silencing their God-given voice.",
    audience:
      "Best for women who want the foundational message and framework that anchors the whole brand.",
    accent: "#26215C",
    cta: "Shop the book",
    href: "https://shop.dicollectivellc.com",
  },
  {
    slug: "companion-workbook",
    category: "Workbook",
    title: "Use Your Voice Companion Workbook",
    price: "$14.99",
    status: "Available now",
    format: "Fillable 7-chapter workbook",
    description:
      "A guided companion experience covering Mindset, Fear, Vision, Opportunity, Inspiration, Commitment, and Elevation.",
    audience:
      "Best for women who want to process the book with reflection prompts and personal application.",
    accent: "#c8a84b",
    cta: "Join the workbook waitlist",
    href: "mailto:info@dicollectivellc.com?subject=Workbook%20Waitlist",
  },
  {
    slug: "unmuted-starter-kit",
    category: "Lead Magnet",
    title: "The Unmuted Woman Starter Kit",
    price: "Free",
    status: "Free",
    format: "Digital ebook",
    description:
      "A free starter resource with foundational prompts and encouragement for women beginning their voice activation journey.",
    audience:
      "Best for new visitors who want a no-pressure first step into the brand.",
    accent: "#534AB7",
    cta: "Request the starter kit",
    href: "mailto:info@dicollectivellc.com?subject=Unmuted%20Woman%20Starter%20Kit",
  },
  {
    slug: "boldness-challenge",
    category: "Challenge",
    title: "5-Day Boldness Activation Challenge",
    price: "Free",
    status: "Free",
    format: "Digital challenge",
    description:
      "A five-day activation experience that helps women practice courage, movement, and voice in simple daily steps.",
    audience:
      "Best for women who want momentum quickly and enjoy action-oriented prompts.",
    accent: "#a57d2c",
    cta: "Start the challenge",
    href: "mailto:info@dicollectivellc.com?subject=5-Day%20Boldness%20Activation%20Challenge",
  },
  {
    slug: "voice-assessment",
    category: "Assessment",
    title: "Voice Breakthrough Assessment",
    price: "Free",
    status: "Free",
    format: "Assessment tool",
    description:
      "A quick assessment to help women identify where their voice feels blocked and what next support may fit them best.",
    audience:
      "Best for women who want clarity before choosing a program or resource.",
    accent: "#8d5a76",
    cta: "Take the assessment",
    href: "mailto:info@dicollectivellc.com?subject=Voice%20Breakthrough%20Assessment",
  },
  {
    slug: "mindset-guide",
    category: "Guide",
    title: "Divine Mindset Guide",
    price: "$9.99",
    status: "Available now",
    format: "Digital guide",
    description:
      "A faith-rooted guide and social media content companion focused on renewing the mind and building a bold, purpose-driven perspective.",
    audience:
      "Best for women who want a mindset reset and a gentle way to engage the brand consistently.",
    accent: "#6c5ed6",
    cta: "Get the guide",
    href: "mailto:info@dicollectivellc.com?subject=Divine%20Mindset%20Guide",
  },
];

export const shopFaqs: FaqItem[] = [
  {
    question: "What can I buy right now from Purely Divine Coaching?",
    answer:
      "Right now the storefront is centered on Nancy Marie Dixon's book and a growing collection of faith-rooted digital resources. Some items are available immediately, while others are listed as coming soon or waitlist so visitors know exactly what is live.",
  },
  {
    question: "Are the resources physical products, digital downloads, or coaching offers?",
    answer:
      "The shop includes a mix of formats: published book products, digital guides, assessments, challenges, and workbook-based resources. Coaching programs remain part of the broader Purely Divine Coaching experience and are featured on the main site so visitors can clearly distinguish resources from private coaching support.",
  },
  {
    question: "How do I know whether a resource is free, paid, or not yet released?",
    answer:
      "Each product card shows a clear status label such as Free, Available now, Coming soon, or Join waitlist. This keeps the shop easy to scan and helps visitors understand the next step without confusion.",
  },
  {
    question: "Which resource should I start with if I am new to the brand?",
    answer:
      "Most first-time visitors should begin with a free entry-point resource such as The Unmuted Woman Starter Kit, the 5-Day Boldness Activation Challenge, or the Voice Breakthrough Assessment. These options offer a gentle introduction before stepping into a paid resource or coaching container.",
  },
  {
    question: "How are coaching programs different from the shop resources?",
    answer:
      "Shop resources are designed for self-guided encouragement, reflection, and activation. Coaching programs offer live guidance, deeper accountability, and direct support from Nancy Marie Dixon within private or group containers.",
  },
  {
    question: "Can I contact someone if I need help choosing the right offer?",
    answer:
      "Yes. Visitors who are unsure where to begin can use the contact path on the site or email the team directly. The brand experience is designed to help women choose the right next step with clarity rather than pressure.",
  },
];

export const managerNotes = [
  "All shop products live in one file: client/src/content/siteContent.ts.",
  "To add or remove a product, update the shopResources array instead of editing the page layout.",
  "Status labels are standardized so visitors instantly understand what is live, free, or upcoming.",
  "Program pricing, descriptions, and brand language are also centralized to reduce repetitive edits.",
];

export type VoicePillar = {
  title: string;
  description: string;
};

export const voicePillars: VoicePillar[] = [
  {
    title: "Faith-rooted reinvention",
    description: "A coaching practice grounded in spiritual wisdom, helping women navigate seasons of change with intention, faith, and clarity about their calling.",
  },
  {
    title: "Self-worth before strategy",
    description: "Before tactics come identity. Nancy's work begins by helping women reclaim their sacred self-worth as the foundation for bold, authentic expression.",
  },
  {
    title: "Voice activation for women over 50",
    description: "Specialized coaching designed for women in their mature seasons who have carried wisdom and leadership but have struggled to break barriers holding them back from using their voice fully.",
  },
  {
    title: "Elegant, honest, spiritually grounded encouragement",
    description: "A coaching environment that honors dignity, truth, and faith—where women are met with respect, candor, and the spiritual resources they need to rise.",
  },
];

export const testimonials = [
  {
    quote:
      "Thank you for sharing your voice, wisdom and love. I recently finished the book and have been overwhelmed with your story. The book is very motivating.",
    credit: "Chi R.",
  },
  {
    quote:
      "I am deeply grateful to Nancy for her coaching. Her ability to naturally connect with spiritual alignment, and therapeutic approach has helped me increase my confidence and shift fully focused towards changing my career and starting my business.",
    credit: "Oprah R.",
  },
  {
    quote:
      "The goal is not just confidence. It is alignment, obedience, and a voice that is fully awake.",
    credit: "Sarah H."
  },
];
