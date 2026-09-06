export interface DigitalDelivery {
  productId: string;
  productName: string;
  downloadUrl: string;
}

export const digitalDeliveries: Record<string, DigitalDelivery> = {
  "divine-mindset-guide": {
    productId: "divine-mindset-guide",
    productName: "The Divine Mindset Guide",
    downloadUrl: "/manus-storage/divine-mindset-guide_9ca7aba7.html",
  },
};

export function getDigitalDelivery(productId: string | null | undefined) {
  return productId ? digitalDeliveries[productId] : undefined;
}
