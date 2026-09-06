# Secure Digital Delivery Verification

The Shop return flow now requires both `success=true` and a non-empty `session_id` before querying the server. The server-side `verifyDigitalDelivery` procedure retrieves the Stripe Checkout Session, requires `status=complete`, `payment_status=paid`, `mode=payment`, and matching `metadata.product_id`, and returns the guide URL only after verification. The client renders the download CTA only when the server response has `authorized: true`.

A development-preview visit to `/shop?product=divine-mindset-guide&success=true` without `session_id` rendered the normal Shop page and did not show `Your guide is ready` or `Open Your Guide`. Unit coverage passes for the success URL placeholder and the paid/unpaid/mismatched/open-session cases.
