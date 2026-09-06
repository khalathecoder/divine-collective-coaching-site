import { MASTERCLASS_SCHEDULE } from "@shared/masterclassSchedule";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: "workshop" | "coaching" | "community" | "intensive";
  registrationUrl?: string;
  image?: string;
}

// Current events (upcoming)
export const currentEvents: Event[] = [
  {
    // Sourced from MASTERCLASS_SCHEDULE so the date, time and format can never
    // drift from the Programs page, which is where registration actually happens.
    // The date is built at local midnight ("...T00:00:00", not a bare "YYYY-MM-DD")
    // because a bare date parses as UTC and renders a day early west of Greenwich.
    id: "bold-out-voice-activation",
    title: MASTERCLASS_SCHEDULE.eventName,
    description:
      "A faith-rooted voice activation experience with practical exercises, B.O.L.D. Voice Framework teaching, seven Bold Declarations, and live Q&A with Nancy. For women who want to stop shrinking and start showing up.",
    date: new Date(`${MASTERCLASS_SCHEDULE.dateIso}T00:00:00`),
    time: MASTERCLASS_SCHEDULE.windowLabel,
    location: MASTERCLASS_SCHEDULE.formatLabel,
    type: "workshop",
    registrationUrl: "/programs",
    image: MASTERCLASS_SCHEDULE.imageUrl,
  },
  {
    id: "coaching-circle-sept",
    title: "Monthly Coaching Circle",
    description: "Join our intimate monthly coaching circle where women gather to share, support, and grow together. Each session focuses on a specific topic related to finding your voice and living your purpose.",
    date: new Date("2026-09-10"),
    time: "6:00 PM - 7:30 PM",
    location: "Virtual",
    type: "coaching",
    registrationUrl: "https://dicollectivellc.com/events",
  },
  {
    id: "self-worth-workshop-sept",
    title: "Self-Worth Breakthrough Workshop",
    description: "Explore the difference between confidence and self-worth, and discover how to build an unshakeable foundation for your voice. This half-day workshop is perfect for women ready to move from self-doubt to self-assurance.",
    date: new Date("2026-09-22"),
    time: "10:00 AM - 1:00 PM",
    location: "Virtual",
    type: "workshop",
    registrationUrl: "https://dicollectivellc.com/events",
  },
  {
    id: "women-leaders-summit",
    title: "Women Leaders Summit",
    description: "A full-day summit bringing together faith-rooted women leaders for networking, inspiration, and practical tools to amplify your voice and impact. Featuring keynote speakers, breakout sessions, and community connections.",
    date: new Date("2026-10-18"),
    time: "8:00 AM - 5:00 PM",
    location: "Nashville, TN",
    type: "community",
    registrationUrl: "https://dicollectivellc.com/events",
  },
];

// Past events (completed)
export const pastEvents: Event[] = [
  {
    id: "spring-workshop-2026",
    title: "Spring Voice Workshop",
    description: "A transformative workshop that helped women discover their authentic voice and break through limiting beliefs.",
    date: new Date("2026-05-20"),
    time: "9:00 AM - 5:00 PM",
    location: "Charlotte, NC",
    type: "workshop",
  },
  {
    id: "coaching-circle-may",
    title: "May Coaching Circle",
    description: "Monthly gathering of women committed to growth, faith, and purposeful living.",
    date: new Date("2026-05-15"),
    time: "6:00 PM - 7:30 PM",
    location: "Virtual",
    type: "coaching",
  },
  {
    id: "faith-courage-intensive",
    title: "Faith & Courage Intensive",
    description: "A 2-day intensive exploring how faith fuels courage and how courage unlocks your voice.",
    date: new Date("2026-04-10"),
    time: "9:00 AM - 5:00 PM",
    location: "Atlanta, GA",
    type: "intensive",
  },
  {
    id: "april-coaching-circle",
    title: "April Coaching Circle",
    description: "Monthly gathering focused on overcoming self-doubt and building confidence.",
    date: new Date("2026-04-08"),
    time: "6:00 PM - 7:30 PM",
    location: "Virtual",
    type: "coaching",
  },
  {
    id: "women-empowerment-workshop",
    title: "Women Empowerment Workshop",
    description: "A powerful workshop on finding your voice and stepping into your power.",
    date: new Date("2026-03-15"),
    time: "9:00 AM - 5:00 PM",
    location: "Miami, FL",
    type: "workshop",
  },
  {
    id: "march-coaching-circle",
    title: "March Coaching Circle",
    description: "Monthly gathering of women committed to growth, faith, and purposeful living.",
    date: new Date("2026-03-10"),
    time: "6:00 PM - 7:30 PM",
    location: "Virtual",
    type: "coaching",
  },
];
