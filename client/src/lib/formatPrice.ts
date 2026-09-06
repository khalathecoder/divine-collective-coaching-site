export function formatPrice(cents: number, currency: string = "usd"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  });
  return formatter.format(cents / 100);
}
