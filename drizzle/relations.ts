import { relations } from "drizzle-orm";
import { users, orders, surveyResponses, contactMessages, adminSubmissions } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  surveyResponses: many(surveyResponses),
  contactMessages: many(contactMessages),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  user: one(users, {
    fields: [surveyResponses.userId],
    references: [users.id],
  }),
}));

// contactMessages table does not have userId field, so no user relation needed
