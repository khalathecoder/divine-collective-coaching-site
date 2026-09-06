# B.O.L.D. OUT Voice Activation Blueprint™ Masterclass
## Pre-Event Readiness Checklist (Event Date: September 12, 2026)

This comprehensive checklist ensures that your registration flows, payment processing, GoHighLevel workflows, automated confirmation emails, and Zoom links are fully verified and ready for launch on **Saturday, September 12, 2026**.

---

### 1. Website & Registration Flow Verification
- [ ] **Programs Page Display:** Verify that the B.O.L.D. OUT cover image displays correctly on both desktop and mobile devices at `dicollectivellc.com/programs`.
- [ ] **Tier Selection:** Confirm that both **General Admission ($47)** and **VIP Experience ($97)** pricing tiers are clearly displayed.
- [ ] **Checkout Buttons:** Test clicking "Register Now" for both tiers to ensure customer details (name, email, phone) are captured and the user is redirected to Stripe.
- [ ] **Admin Portal Access:** Log in to `https://purelycoach-ezfepbm4.manus.space/admin` using your admin credentials to confirm that test registrations appear under the **B.O.L.D. OUT** filter.

### 2. GoHighLevel (GHL) Workflow & Tagging Verification
- [ ] **Tag Assignment:** Verify in the Manus admin portal that General registrations receive the `BOLD MCG` tag and VIP registrations receive the `BOLD MC VIP` tag.
- [ ] **Workflow 1 (General Admission - `BOLD MCG`):**
  - [ ] Trigger configured in GHL for tag `BOLD MCG added`.
  - [ ] Email template populated with Sender Name (**Nancy Marie Dixon**) and Sender/Reply-To (`info@dicollectivellc.com`).
  - [ ] Includes Masterclass date (**September 12, 2026**) and the General Zoom link (`https://us06web.zoom.us/j/83079974714?pwd=ntvSUetlgammUMsGfZjcFnZ5lD2yaU.1&jst=5`).
- [ ] **Workflow 2 (VIP Experience - `BOLD MC VIP`):**
  - [ ] Trigger configured in GHL for tag `BOLD MC VIP added`.
  - [ ] Email template populated with Sender Name (**Nancy Marie Dixon**) and Sender/Reply-To (`info@dicollectivellc.com`).
  - [ ] Includes both the General Masterclass Zoom link **and** the dedicated VIP Session Zoom link (`https://us06web.zoom.us/j/86204248497?pwd=8RSV5kXbpNndkzCOwbR9yeDo1mTqGL.1`).
- [ ] **Live Test Submission:** Submit a test registration using a personal test email address for both tiers to verify that contacts sync into GHL and trigger the confirmation emails successfully.

### 3. Stripe Payment & Webhook Verification
- [ ] **Production Keys Active:** Ensure production Stripe API keys are configured in the Management UI (`Settings -> Payment`).
- [ ] **Webhook Endpoint:** Confirm the production webhook endpoint (`https://purelycoach-ezfepbm4.manus.space/api/stripe/webhook`) is active in your Stripe Dashboard.
- [ ] **End-to-End Test Charge:** Conduct a live $1 test charge or verify test mode payment processing to ensure successful webhook firing and database logging.

### 4. Day-of Event Operations (September 12, 2026)
- [ ] **Zoom Room Opening:** Open both the main Zoom room and the VIP meeting room 15 minutes prior to the 11:00 AM ET start time.
- [ ] **Attendance Export:** Use the Manus admin portal CSV export feature (`Export CSV`) to download attendee records and import them into GHL or print for session tracking.
- [ ] **VIP Breakout Transition:** Prepare co-hosts or moderators for the post-Masterclass VIP Q&A transition using the dedicated VIP Zoom link.

---
*Prepared for Nancy Marie Dixon — Purely Divine Coaching / Divine Collective LLC*
