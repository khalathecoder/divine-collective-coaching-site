import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Orders table for tracking Stripe payments.
 * Stores essential Stripe identifiers and order metadata.
 */
export const orders = mysqlTable(
  "orders",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    /** Stripe Payment Intent ID for tracking payment status - nullable for checkout sessions */
    stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
    /** Stripe Customer ID for future reference */
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    /** Product purchased: 'divine-mindset-guide' */
    productId: varchar("productId", { length: 100 }).notNull(),
    /** Product name for display */
    productName: text("productName").notNull(),
    /** Amount in cents (e.g., 999 for $9.99) */
    amountCents: int("amountCents").notNull(),
    /** Currency code (e.g., 'usd') */
    currency: varchar("currency", { length: 3 }).default("usd").notNull(),
    /** Payment status: 'pending', 'succeeded', 'failed', 'canceled' */
    status: mysqlEnum("status", ["pending", "succeeded", "failed", "canceled"])
      .default("pending")
      .notNull(),
    /** Checkout session ID for reference - unique identifier for checkout sessions */
    stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }).unique(),
    /** Stripe Subscription ID for recurring payments */
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    /** Payment plan selected (e.g., '3month-3pay') */
    paymentPlanId: varchar("paymentPlanId", { length: 100 }),
    /** Number of installments for subscription */
    installments: int("installments").default(1),
    /** Amount per installment in cents */
    installmentAmountCents: int("installmentAmountCents"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    paymentIntentIdx: index("idx_payment_intent").on(table.stripePaymentIntentId),
    checkoutSessionIdx: index("idx_checkout_session").on(table.stripeCheckoutSessionId),
  })
);

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Survey responses table for post-purchase surveys.
 * Captures customer feedback and discovery call status.
 */
export const surveyResponses = mysqlTable("surveyResponses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderId: int("orderId").notNull(),
  /** Did customer have a discovery call: 'yes', 'no', 'scheduled' */
  hadDiscoveryCall: mysqlEnum("hadDiscoveryCall", ["yes", "no", "scheduled"]).notNull(),
  /** Additional survey responses as JSON */
  additionalResponses: text("additionalResponses"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;

/**
 * Contact form submissions table.
 * Stores contact form data from website visitors.
 */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zip: varchar("zip", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Admin submissions table for tracking all customer submissions.
 * Consolidates contact forms, surveys, and assessments for admin dashboard.
 */
export const adminSubmissions = mysqlTable(
  "adminSubmissions",
  {
    id: int("id").autoincrement().primaryKey(),
    /** Type of submission: 'contact', 'survey', 'assessment', 'lead_magnet' */
    submissionType: mysqlEnum("submissionType", ["contact", "survey", "assessment", "lead_magnet", "waitlist", "bold_out", "she_found_her_voice_event"]).notNull(),
    /** Customer name */
    customerName: varchar("customerName", { length: 255 }).notNull(),
    /** Customer email */
    customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
    /** Customer phone (optional) */
    customerPhone: varchar("customerPhone", { length: 20 }),
    /** Submission content/message */
    content: text("content").notNull(),
    /** Additional metadata as JSON (e.g., discovery call status, assessment results) */
    metadata: text("metadata"),
    /** Whether admin has reviewed this submission */
    isRead: int("isRead").default(0).notNull(),
    /** Admin notes */
    adminNotes: text("adminNotes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    submissionTypeIdx: index("idx_submission_type").on(table.submissionType),
    createdAtIdx: index("idx_created_at").on(table.createdAt),
    isReadIdx: index("idx_is_read").on(table.isRead),
  })
);

export type AdminSubmission = typeof adminSubmissions.$inferSelect;
export type InsertAdminSubmission = typeof adminSubmissions.$inferInsert;

