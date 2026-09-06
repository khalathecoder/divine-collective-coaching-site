import { protectedProcedure, router } from "../_core/trpc";
import { getAdminSubmissions, markSubmissionAsRead, getDb } from "../db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { orders, adminSubmissions } from "../../drizzle/schema";
import { desc, eq, inArray } from "drizzle-orm";

export const adminRouter = router({
  /**
   * Get all customer submissions (contact forms, surveys, assessments)
   * Admin-only endpoint
   */
  getSubmissions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can access submissions",
});
}



      try {
        const submissions = await getAdminSubmissions(input.limit, input.offset);
        return {
          submissions,
          total: submissions.length || 0,
        };
      } catch (error) {
        console.error("[Admin] Failed to fetch submissions:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch submissions",
        });
      }
    }),

  /**
   * Mark a submission as read
   * Admin-only endpoint
   */
  markAsRead: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can mark submissions as read",
        });
      }

      try {
        await markSubmissionAsRead(input.submissionId);
        return { success: true };
      } catch (error) {
        console.error("[Admin] Failed to mark submission as read:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mark submission as read",
        });
      }
    }),

  /**
   * Export all submissions as CSV
   * Admin-only endpoint
   */
  exportSubmissionsAsCSV: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can export submissions",
      });
    }

    try {
      const submissions = await getAdminSubmissions(1000, 0);

      // Deduplicate by email - keep most recent entry
      // For phone-only entries, keep all of them (don't deduplicate)
      const deduped = new Map<string, any>();
      const phoneOnlyEntries: any[] = [];
      
      for (const submission of submissions) {
        const key = (submission.customerEmail || "").toLowerCase();
        if (!key) {
          // If no email, add to phone-only list (don't deduplicate these)
          phoneOnlyEntries.push(submission);
        } else {
          // For entries with email, deduplicate by keeping most recent
          const existing = deduped.get(key);
          if (!existing || submission.createdAt > existing.createdAt) {
            deduped.set(key, submission);
          }
        }
      }
      // Combine deduplicated email entries with all phone-only entries
      const dedupedSubmissions = [...Array.from(deduped.values()), ...phoneOnlyEntries];

      // Build CSV header
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Type",
        "Message",
        "Read",
        "Created At",
        "Tier",
        "GHL Tag",
        "Metadata",
      ];

      // Build CSV rows with proper escaping
      const rows = dedupedSubmissions.map((submission: any) => {
        const escapeCSV = (value: string | null | undefined) => {
          if (!value) return '""';
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        };

        // Parse metadata for B.O.L.D. OUT registrations
        let tier = "";
        let ghlTag = "";
        if (submission.submissionType === "bold_out" && submission.metadata) {
          try {
            const metadata = JSON.parse(submission.metadata);
            tier = metadata.historical_tier === "vip" ? "Historical VIP ($97)" : "General Admission ($47)";
            ghlTag = metadata.ghl_tag || "BOLD MCG";
          } catch (e) {
            // Ignore parse errors
          }
        }

        return [
          submission.id,
          escapeCSV(submission.customerName),
          escapeCSV(submission.customerEmail),
          submission.customerPhone ? `'${submission.customerPhone}` : "",
          submission.submissionType,
          escapeCSV(submission.content),
          submission.isRead ? "Yes" : "No",
          new Date(submission.createdAt).toISOString(),
          tier,
          ghlTag,
          escapeCSV(submission.metadata),
        ];
      });

      // Combine headers and rows
      const csv = [
        headers.join(","),
        ...rows.map((row: any[]) => row.join(",")),
      ].join("\n");

      return {
        success: true,
        csv,
        filename: `submissions-${new Date().toISOString().split("T")[0]}.csv`,
      };
    } catch (error) {
      console.error("[Admin] Failed to export submissions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export submissions",
      });
    }
  }),

  /**
   * Get all customers from admin submissions (unique emails)
   * Admin-only endpoint
   */
  getCustomers: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can access customer data",
        });
      }

      try {
        // Get unique customers from submissions
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        if (!db) {
          return { customers: [], total: 0 };
        }
        const allSubmissions = await db.select().from(adminSubmissions);
        const uniqueCustomers = Array.from(
          new Map(
            allSubmissions.map((s) => [s.customerEmail, s])
          ).values()
        )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(input.offset, input.offset + input.limit);

        return {
          customers: uniqueCustomers.map((s) => ({
            id: s.id,
            name: s.customerName,
            email: s.customerEmail,
            phone: s.customerPhone,
            firstSubmission: s.createdAt,
          })),
          total: allSubmissions.length,
        };
      } catch (error) {
        console.error("[Admin] Failed to fetch customers:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch customers",
        });
      }
    }),

  /**
   * Get all orders
   * Admin-only endpoint
   */
  getOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can access order data",
        });
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        if (!db) {
          return { orders: [], total: 0 };
        }
        const allOrders = await db
          .select()
          .from(orders)
          .orderBy(desc(orders.createdAt));

        const paginatedOrders = allOrders.slice(
          input.offset,
          input.offset + input.limit
        );

        return {
          orders: paginatedOrders.map((o) => ({
            id: o.id,
            productName: o.productName,
            amount: (o.amountCents / 100).toFixed(2),
            currency: o.currency,
            status: o.status,
            createdAt: o.createdAt,
            stripeCustomerId: o.stripeCustomerId,
          })),
          total: allOrders.length,
        };
      } catch (error) {
        console.error("[Admin] Failed to fetch orders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch orders",
        });
      }
    }),

  /**
   * Get analytics summary
   * Admin-only endpoint
   */
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can access analytics",
      });
    }

    try {
      const db = await getDb();
        if (!db) throw new Error("Database connection failed");
      if (!db) {
        return {
          totalCustomers: 0,
          totalRevenue: "0.00",
          totalSubmissions: 0,
          totalOrders: 0,
          submissionsByType: {},
          ordersByStatus: {},
        };
      }
      const allSubmissions = await db.select().from(adminSubmissions);
      const allOrders = await db.select().from(orders);

      const totalCustomers = new Set(
        allSubmissions.map((s) => s.customerEmail)
      ).size;
      const totalRevenue = allOrders
        .filter((o) => o.status === "succeeded")
        .reduce((sum, o) => sum + (o.amountCents || 0), 0) / 100;

      const submissionsByType = allSubmissions.reduce(
        (acc, s) => {
          acc[s.submissionType] = (acc[s.submissionType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const ordersByStatus = allOrders.reduce(
        (acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        totalCustomers,
        totalRevenue: totalRevenue.toFixed(2),
        totalSubmissions: allSubmissions.length,
        totalOrders: allOrders.length,
        submissionsByType,
        ordersByStatus,
      };
    } catch (error) {
      console.error("[Admin] Failed to fetch analytics:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch analytics",
      });
    }
  }),

  /** Host-only aggregate audience insights; individual survey answers remain in the submissions view. */
  getAudienceInsights: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can access audience insights" });
    }
    const submissions = await getAdminSubmissions(1000, 0);
    const surveys = submissions.filter((submission) => {
      if (submission.submissionType !== "bold_out" || !submission.metadata) return false;
      try {
        return JSON.parse(submission.metadata).survey_type === "bold_out_intake";
      } catch {
        return false;
      }
    });
    const counts: Record<string, Record<string, number>> = {};
    for (const survey of surveys) {
      const lines = survey.content.split("\\n").slice(1);
      for (const line of lines) {
        const separator = line.indexOf(": ");
        if (separator < 0) continue;
        const question = line.slice(0, separator);
        const answer = line.slice(separator + 2).trim();
        if (!answer) continue;
        counts[question] ??= {};
        counts[question][answer] = (counts[question][answer] || 0) + 1;
      }
    }
    return { surveyCount: surveys.length, responseCounts: counts };
  }),

  /**
   * Export customers as CSV
   * Admin-only endpoint
   */
  exportCustomersAsCSV: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can export customers",
      });
    }

    try {
      const db = await getDb();
        if (!db) throw new Error("Database connection failed");
      if (!db) {
        return {
          success: false,
          csv: "",
          filename: "customers-error.csv",
        };
      }
      const allSubmissions = await db.select().from(adminSubmissions);
      const uniqueCustomers = Array.from(
        new Map(
          allSubmissions.map((s) => [s.customerEmail, s])
        ).values()
      );

      const headers = ["Name", "Email", "Phone", "First Submission"];
      const rows = uniqueCustomers.map((c) => {
        const escapeCSV = (value: string | null | undefined) => {
          if (!value) return '""';
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        };

        return [
          escapeCSV(c.customerName),
          escapeCSV(c.customerEmail),
          escapeCSV(c.customerPhone),
          new Date(c.createdAt).toISOString(),
        ];
      });

      const csv = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      return {
        success: true,
        csv,
        filename: `customers-${new Date().toISOString().split("T")[0]}.csv`,
      } as any;
    } catch (error) {
      console.error("[Admin] Failed to export customers:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export customers",
      });
    }
  }),

  /**
   * Export orders as CSV
   * Admin-only endpoint
   */
  exportOrdersAsCSV: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can export orders",
      });
    }

    try {
      const db = await getDb();
        if (!db) throw new Error("Database connection failed");
      if (!db) {
        return {
          success: false,
          csv: "",
          filename: "orders-error.csv",
        };
      }
      const allOrders = await db.select().from(orders);

      const headers = [
        "Order ID",
        "Product",
        "Amount",
        "Currency",
        "Status",
        "Date",
      ];
      const rows = allOrders.map((o) => {
        const escapeCSV = (value: string | null | undefined) => {
          if (!value) return '""';
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        };

        return [
          o.id,
          escapeCSV(o.productName),
          (o.amountCents / 100).toFixed(2),
          o.currency,
          o.status,
          new Date(o.createdAt).toISOString(),
        ];
      });

      const csv = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      return {
        success: true,
        csv,
        filename: `orders-${new Date().toISOString().split("T")[0]}.csv`,
      } as any;
    } catch (error) {
      console.error("[Admin] Failed to export orders:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export orders",
      });
    }
  }),

  /**
   * Import She Found Her Voice event attendees from CSV
   * Admin-only endpoint
   * CSV format: Full Name, Email, Phone, # Attendees, Attended Y/N, Book Y/N
   */
  importSFHVAttendees: protectedProcedure
    .input(
      z.object({
        csvData: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can import attendees",
        });
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        
        // Parse CSV with proper header mapping
        const lines = input.csvData.trim().split("\n").map(line => line.replace(/\r$/, ''));
        const headerLine = lines[0];
        const dataLines = lines.slice(1).filter((line) => line.trim());
        
        // Parse header to find column indices
        const headerParts: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < headerLine.length; i++) {
          const char = headerLine[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            headerParts.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        headerParts.push(current.trim());
        
        // Find column indices
        const nameIdx = headerParts.findIndex(h => h.toLowerCase() === 'full name');
        const emailIdx = headerParts.findIndex(h => h.toLowerCase() === 'email');
        const phoneIdx = headerParts.findIndex(h => h.toLowerCase() === 'phone');
        const attendedIdx = headerParts.findIndex(h => h.toLowerCase().includes('attended'));
        const bookIdx = headerParts.findIndex(h => h.toLowerCase().includes('book'));
        
        let importedCount = 0;
        let skippedCount = 0;

        for (const line of dataLines) {
          // Parse CSV line (handle quoted fields)
          const parts: string[] = [];
          let current = "";
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              parts.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          parts.push(current.trim());

          let fullName = (nameIdx >= 0 ? parts[nameIdx] : "") || "";
          let email = (emailIdx >= 0 ? parts[emailIdx] : "") || "";
          let phone = (phoneIdx >= 0 ? parts[phoneIdx] : "") || "";
          const attended = (attendedIdx >= 0 ? parts[attendedIdx] : "")?.toUpperCase() === "Y";
          const boughtBook = (bookIdx >= 0 ? parts[bookIdx] : "")?.toUpperCase().startsWith("Y");

          // If Full Name looks like a phone number (all digits), move it to phone column
          if (fullName && /^\d{10,}$/.test(fullName.replace(/[^\d]/g, ''))) {
            if (!phone) {
              phone = fullName;
              fullName = "";
            }
          }

          // Skip rows with no name and no phone
          if (!fullName && !phone) {
            skippedCount++;
            continue;
          }

          // Determine GHL tag based on attendance and book purchase
          let ghlTag = "";
          if (attended && boughtBook) {
            ghlTag = "SFHV-ATB";
          } else if (!attended && boughtBook) {
            ghlTag = "SFHV-NSB";
          } else if (attended && !boughtBook) {
            ghlTag = "SFHV-ATNB";
          } else {
            ghlTag = "SFHV-NSNB";
          }

          // Create submission
          await db.insert(adminSubmissions).values({
            submissionType: "she_found_her_voice_event",
            customerName: fullName || "Unknown",
            customerEmail: email || `phone-${phone}@sfhv.local`,
            customerPhone: phone || null,
            content: `Attended: ${attended ? "Yes" : "No"}, Book: ${boughtBook ? "Yes" : "No"}`,
            metadata: JSON.stringify({
              ghl_tag: ghlTag,
              attended,
              boughtBook,
              importedAt: new Date().toISOString(),
            }),
            isRead: 0,
          });

          importedCount++;
        }

        return {
          success: true,
          importedCount,
          skippedCount,
          message: `Imported ${importedCount} attendees, skipped ${skippedCount} empty rows`,
        };
      } catch (error) {
        console.error("[Admin] Failed to import SFHV attendees:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to import attendees",
        });
      }
    }),

  /**
   * Remove duplicate submissions by email, keeping the most recent
   * Admin-only endpoint
   */
  removeDuplicates: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can remove duplicates",
      });
    }

    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const submissions = await getAdminSubmissions(1000, 0);

      // Find duplicates by email
      const emailMap = new Map<string, any[]>();
      for (const submission of submissions) {
        const key = (submission.customerEmail || "").toLowerCase();
        if (key) {
          if (!emailMap.has(key)) {
            emailMap.set(key, []);
          }
          emailMap.get(key)!.push(submission);
        }
      }

      // Find entries to delete (keep most recent for each email)
      const toDelete: number[] = [];
      let deletedCount = 0;

      for (const [email, entries] of Array.from(emailMap.entries())) {
        if (entries.length > 1) {
          // Sort by createdAt descending, keep first (most recent)
          entries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          // Mark older entries for deletion
          for (let i = 1; i < entries.length; i++) {
            toDelete.push(entries[i].id);
            deletedCount++;
          }
        }
      }

      // Delete duplicate entries
      if (toDelete.length > 0) {
        await db.delete(adminSubmissions).where(inArray(adminSubmissions.id, toDelete));
      }

      return {
        success: true,
        deletedCount,
        message: `Removed ${deletedCount} duplicate submissions, kept most recent entries`,
      };
    } catch (error) {
      console.error("[Admin] Failed to remove duplicates:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove duplicates",
      });
    }
  }),
});
