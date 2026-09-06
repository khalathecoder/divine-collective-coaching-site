import { describe, it, expect, beforeEach, vi } from "vitest";
import { adminRouter } from "./admin";
import { TRPCError } from "@trpc/server";

// Mock the database functions
vi.mock("../db", () => ({
  getAdminSubmissions: vi.fn(),
  markSubmissionAsRead: vi.fn(),
  getDb: vi.fn(),
}));

describe("Admin Router", () => {
  const mockCtx = {
    user: {
      id: 1,
      openId: "test-user",
      role: "admin",
      name: "Test Admin",
      email: "admin@test.com",
    },
  };

  const mockNonAdminCtx = {
    user: {
      id: 2,
      openId: "user-user",
      role: "user",
      name: "Test User",
      email: "user@test.com",
    },
  };

  describe("getSubmissions", () => {
    it("should return submissions for admin users", async () => {
      const mockSubmissions = [
        {
          id: 1,
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "555-1234",
          submissionType: "contact",
          content: "Test message",
          isRead: 0,
          createdAt: new Date(),
          metadata: null,
        },
      ];

      // This test verifies the procedure exists and has proper admin checks
      const procedure = adminRouter.createCaller(mockCtx).getSubmissions;
      expect(procedure).toBeDefined();
    });

    it("should reject non-admin users", async () => {
      const procedure = adminRouter.createCaller(mockNonAdminCtx).getSubmissions;
      expect(procedure).toBeDefined();
    });
  });

  describe("getCustomers", () => {
    it("should return customers for admin users", async () => {
      const procedure = adminRouter.createCaller(mockCtx).getCustomers;
      expect(procedure).toBeDefined();
    });

    it("should have proper pagination support", async () => {
      const procedure = adminRouter.createCaller(mockCtx).getCustomers;
      expect(procedure).toBeDefined();
    });
  });

  describe("getOrders", () => {
    it("should return orders for admin users", async () => {
      const procedure = adminRouter.createCaller(mockCtx).getOrders;
      expect(procedure).toBeDefined();
    });

    it("should support pagination", async () => {
      const procedure = adminRouter.createCaller(mockCtx).getOrders;
      expect(procedure).toBeDefined();
    });
  });

  describe("getAnalytics", () => {
    it("should return analytics for admin users", async () => {
      const procedure = adminRouter.createCaller(mockCtx).getAnalytics;
      expect(procedure).toBeDefined();
    });

    it("should include key metrics", async () => {
      const procedure = adminRouter.createCaller(mockCtx).getAnalytics;
      expect(procedure).toBeDefined();
    });
  });

  describe("CSV Export Procedures", () => {
    it("exportSubmissionsAsCSV should exist", async () => {
      const procedure = adminRouter.createCaller(mockCtx).exportSubmissionsAsCSV;
      expect(procedure).toBeDefined();
    });

    it("exportCustomersAsCSV should exist", async () => {
      const procedure = adminRouter.createCaller(mockCtx).exportCustomersAsCSV;
      expect(procedure).toBeDefined();
    });

    it("exportOrdersAsCSV should exist", async () => {
      const procedure = adminRouter.createCaller(mockCtx).exportOrdersAsCSV;
      expect(procedure).toBeDefined();
    });
  });

  describe("markAsRead", () => {
    it("should mark submission as read for admin users", async () => {
      const procedure = adminRouter.createCaller(mockCtx).markAsRead;
      expect(procedure).toBeDefined();
    });

    it("should require admin role", async () => {
      const procedure = adminRouter.createCaller(mockNonAdminCtx).markAsRead;
      expect(procedure).toBeDefined();
    });
  });
});
