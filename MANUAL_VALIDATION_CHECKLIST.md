# Production Validation Checklist

The assessment routes and the instant digital-guide success state are covered by automated tests and the published assessment-flow checks. The following checks require the site owner’s authenticated Stripe, GoHighLevel, or Manus session and should be completed from the Management UI and the deployed domain.

## Digital Guide Delivery

Use Stripe test mode with card `4242 4242 4242 4242`, an expiration date in the future, and any valid CVC and ZIP. Purchase **The Divine Mindset Guide** from `/shop`. Confirm Stripe returns to `/shop?product=divine-mindset-guide&success=true`, the **Your guide is ready** confirmation appears, and **Open Your Guide** opens the branded guide asset. Confirm an unknown product or a normal Shop visit does not display the delivery banner.

## Coaching Subscription Checkout

From `/coaching`, choose a payment plan with installments greater than one. Confirm Stripe opens in subscription mode, the selected installment amount is shown, the success URL returns to `/survey?session_id=...`, and the resulting order displays its subscription status in Orders and Admin. Do not use live payment mode for this validation unless intentionally approved by the owner.

## Admin Production Access

Sign in with the owner’s Manus account at `/admin/submissions`. Confirm the Submissions, Customers, Orders, and Analytics tabs load. Verify waitlist and B.O.L.D. OUT filters, CSV exports, phone-number preservation, and admin-only access while signed out.

## GoHighLevel Credential Health

The automated suite has one environment-dependent failure because the configured GoHighLevel credential returns HTTP 401 (`Api key is invalid`). Refresh or replace that credential in the project Secrets panel before validating live contact upsert and tagging workflows.
