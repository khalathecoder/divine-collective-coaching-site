import { ENV } from "./env";

export interface GhlContactData {
  email: string;
  name: string;
  phone?: string;
  tags: string[];
}

/**
 * Upsert contact in GoHighLevel and apply tags.
 * Uses official GHL v2 /v1 contacts API with location ID and bearer token.
 */
export async function syncContactToGhl(data: GhlContactData): Promise<boolean> {
  const apiKey = process.env.GOHIGHLEVEL_API_KEY;
  const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.warn("[GHL] GOHIGHLEVEL_API_KEY or GOHIGHLEVEL_LOCATION_ID not configured.");
    return false;
  }

  // Split name into first and last
  const nameParts = data.name.trim().split(/\s+/);
  const firstName = nameParts[0] || "Valued";
  const lastName = nameParts.slice(1).join(" ") || "Participant";

  const payload = {
    locationId,
    email: data.email,
    firstName,
    lastName,
    phone: data.phone || undefined,
    tags: data.tags,
    source: "Purely Divine Coaching Website - Stripe Checkout",
  };

  try {
    // Try HighLevel v1/v2 upsert endpoint
    const response = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GHL] Failed to sync contact (${response.status}): ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log("[GHL] Successfully synced contact and applied tags:", data.tags);
    return true;
  } catch (error) {
    console.error("[GHL] Error syncing contact to GoHighLevel:", error);
    return false;
  }
}
