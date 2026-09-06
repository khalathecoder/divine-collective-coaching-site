import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, orders, InsertOrder, Order, surveyResponses, contactMessages, InsertContactMessage, adminSubmissions, InsertAdminSubmission, AdminSubmission } from "../drizzle/schema";
import { usersRelations, ordersRelations, surveyResponsesRelations } from "../drizzle/relations";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL, { mode: "default", schema: { users, orders, surveyResponses, contactMessages, adminSubmissions, usersRelations, ordersRelations, surveyResponsesRelations } });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Export db for direct queries (use getDb() for lazy initialization)
export const db = {
  select: () => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        limit: (n: number) => Promise.resolve([])
      })
    })
  }),
  insert: (table: any) => ({
    values: (values: any) => Promise.resolve([])
  }),
  update: (table: any) => ({
    set: (values: any) => ({
      where: (condition: any) => Promise.resolve()
    })
  })
} as any;

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Order queries
export async function createOrder(order: InsertOrder): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order: database not available");
    return undefined;
  }

  try {
    await db.insert(orders).values(order);
    // Look up by checkout session ID since stripePaymentIntentId may be null
    const insertedOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeCheckoutSessionId, order.stripeCheckoutSessionId!))
      .limit(1);
    return insertedOrder.length > 0 ? insertedOrder[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  stripePaymentIntentId: string,
  status: "pending" | "succeeded" | "failed" | "canceled"
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return;
  }

  try {
    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.stripePaymentIntentId, stripePaymentIntentId));
  } catch (error) {
    console.error("[Database] Failed to update order status:", error);
    throw error;
  }
}

export async function getOrderByPaymentIntentId(
  stripePaymentIntentId: string
): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.stripePaymentIntentId, stripePaymentIntentId))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get order:", error);
    throw error;
  }
}

export async function getOrderByCheckoutSessionId(
  stripeCheckoutSessionId: string
): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeCheckoutSessionId, stripeCheckoutSessionId))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get order by checkout session:", error);
    throw error;
  }
}

export async function updateOrderPaymentIntent(
  stripeCheckoutSessionId: string,
  stripePaymentIntentId: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return;
  }

  try {
    await db
      .update(orders)
      .set({ stripePaymentIntentId, updatedAt: new Date() })
      .where(eq(orders.stripeCheckoutSessionId, stripeCheckoutSessionId));
  } catch (error) {
    console.error("[Database] Failed to update order payment intent:", error);
    throw error;
  }
}

export async function getUserOrders(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user orders: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(orders.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user orders:", error);
    throw error;
  }
}

export async function createAdminSubmission(data: InsertAdminSubmission): Promise<AdminSubmission> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(adminSubmissions).values(data);
    const submissionId = result[0].insertId;
    const submission = await db.select().from(adminSubmissions).where(eq(adminSubmissions.id, submissionId)).limit(1);
    if (!submission || submission.length === 0) throw new Error("Failed to retrieve created submission");
    return submission[0] as AdminSubmission;
  } catch (error) {
    console.error("[Database] Failed to create admin submission:", error);
    throw new Error("Failed to create admin submission");
  }
}

export async function markAdminSubmissionReminderSent(submission: AdminSubmission, reminderKey: string): Promise<void> {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  const metadata = submission.metadata ? JSON.parse(submission.metadata) as Record<string, unknown> : {};
  const sent = Array.isArray(metadata.reminder_sent) ? metadata.reminder_sent.filter((value): value is string => typeof value === "string") : [];
  if (sent.includes(reminderKey)) return;
  await database.update(adminSubmissions).set({ metadata: JSON.stringify({ ...metadata, reminder_sent: [...sent, reminderKey] }) }).where(eq(adminSubmissions.id, submission.id));
}

export async function getBoldOutSurveyAccessByPaymentIntentId(paymentIntentId: string): Promise<AdminSubmission | undefined> {
  const submissions = await getAdminSubmissions(500, 0);
  return submissions.find((submission) => {
    if (submission.submissionType !== "bold_out" || !submission.metadata) return false;
    try {
      const metadata = JSON.parse(submission.metadata) as Record<string, unknown>;
      return metadata.payment_intent_id === paymentIntentId && metadata.survey_access === "paid_general";
    } catch {
      return false;
    }
  });
}

export async function getBoldOutSurveyAccessByToken(token: string): Promise<AdminSubmission | undefined> {
  const submissions = await getAdminSubmissions(500, 0);
  return submissions.find((submission) => {
    if (submission.submissionType !== "bold_out" || !submission.metadata) return false;
    try {
      const metadata = JSON.parse(submission.metadata) as Record<string, unknown>;
      return metadata.survey_token === token && metadata.survey_access === "paid_general";
    } catch {
      return false;
    }
  });
}

export async function getAdminSubmissions(limit: number = 50, offset: number = 0): Promise<AdminSubmission[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(adminSubmissions).orderBy(adminSubmissions.createdAt).limit(limit).offset(offset);
  } catch (error) {
    console.error("[Database] Failed to fetch admin submissions:", error);
    throw new Error("Failed to fetch admin submissions");
  }
}

export async function markSubmissionAsRead(submissionId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { eq } = require('drizzle-orm');
    await db.update(adminSubmissions).set({ isRead: 1 }).where(eq(adminSubmissions.id, submissionId));
  } catch (error) {
    console.error("[Database] Failed to mark submission as read:", error);
    throw new Error("Failed to mark submission as read");
  }
}

export async function saveContactMessage(data: InsertContactMessage): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.insert(contactMessages).values(data);
  } catch (error) {
    console.error("[Database] Failed to save contact message:", error);
    throw new Error("Failed to save contact message");
  }
}

export async function saveSurveyResponse(data: { userId: number; orderId: number; hadDiscoveryCall: "yes" | "no" | "scheduled"; additionalResponses?: string }): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save survey response: database not available");
    return;
  }

  try {
    await db.insert(surveyResponses).values({
      userId: data.userId,
      orderId: data.orderId,
      hadDiscoveryCall: data.hadDiscoveryCall,
      additionalResponses: data.additionalResponses || null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("[Database] Failed to save survey response:", error);
    throw error;
  }
}
