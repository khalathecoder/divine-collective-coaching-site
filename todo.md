
## Stripe Payment Implementation

- [x] Set up database schema for orders and payments (orders table with Stripe IDs)
- [x] Create Stripe checkout session endpoint for Divine Mindset Guide
- [x] Implement webhook handler for payment_intent.succeeded events
- [x] Build order history page to display user purchases
- [x] Update Shop page to integrate Stripe checkout button
- [x] Fixed database schema: made stripePaymentIntentId nullable, added unique constraint to stripeCheckoutSessionId
- [x] Payment flow ready for testing with test card (4242 4242 4242 4242)
- [x] Implement instant digital delivery mechanism for guide with a post-payment Shop confirmation and guide link
- [x] Document end-to-end payment and delivery flow for owner validation (live-card step remains user responsibility)

## Coaching Packages with Stripe Subscriptions

- [x] Add coaching packages to products configuration with payment plan options
- [x] Add survey responses table to database schema
- [x] Add start dates to coaching programs (Aug 1, Sept 1, Oct 1)
- [x] Create PaymentPlanSelector component
- [x] Update PaymentPlanSelector to skip modal for programs without payment plans (go straight to checkout)
- [x] Fix Stripe API version compatibility errors
- [x] Push database migrations (pnpm db:push)
- [x] Create Stripe checkout endpoint for coaching packages (createCoachingCheckout)
- [x] Update Coaching page to use PaymentPlanSelector component
- [x] Replace "Learn More" buttons with "Pay Now" buttons
- [x] Fixed database schema constraint violation for checkout sessions
- [x] Created and passed tests for nullable stripePaymentIntentId
- [x] Create post-purchase survey page with discovery call question
- [x] Implement survey response storage (tRPC router + database)
- [x] Added survey route to App.tsx
- [x] Updated checkout success URLs to redirect to survey
- [x] Created and passed tests for survey submission
- [x] Coaching package purchase flow complete and tested
- [x] Survey integration complete and tested

## Stripe Billing - Automatic Payment Plans (NEW)

- [x] Create Stripe price objects for each payment plan with billing intervals
- [x] Update checkout to use subscription mode instead of one-time payment
- [x] Update database schema to store stripeSubscriptionId, paymentPlanId, installments, installmentAmountCents
- [x] Update webhook handlers for subscription events (customer.subscription.updated, invoice.payment_succeeded)
- [x] Update order display to show subscription status (implemented in both admin and customer order pages)
- [x] Added subscription type and installment count display to customer Orders page
- [x] Document subscription checkout end-to-end validation steps for owner testing (live-card step remains user responsibility)

## Admin Dashboard Enhancement (NEW)

- [x] Created enhanced AdminSubmissions component with tabbed interface
- [x] Added Submissions tab with submission list and detail view
- [x] Added Customers tab with unique customer list and export
- [x] Added Orders tab with order history and export
- [x] Added Analytics tab with key metrics and breakdowns
- [x] Implemented getCustomers tRPC procedure with pagination
- [x] Implemented getOrders tRPC procedure with pagination
- [x] Implemented getAnalytics tRPC procedure with metrics
- [x] Implemented exportCustomersAsCSV tRPC procedure
- [x] Implemented exportOrdersAsCSV tRPC procedure
- [x] Fixed database connection issues with getDb() async pattern
- [x] Fixed TypeScript configuration and dependency issues
- [x] Created comprehensive vitest tests for admin router (13 tests passing)
- [x] Admin dashboard accessible at /admin/submissions for admin users
- [x] Document admin production-domain validation steps (owner Manus login remains user responsibility)
- [x] Implement subscription order display in admin dashboard (shows subscription vs one-time type)
- [x] Verify CSV exports contain correct data with unit tests (13 tests passing)
- [x] Fixed frontend/backend mismatch for CSV exports (using queries instead of mutations)

## Events and Blog Tabs Enhancement (NEW)

- [x] Extract and structure blog articles from Divine_Collective_Blog_Articles_Vol2.docx
- [x] Create blog articles data structure with title, excerpt, content, date, author
- [x] Update Blog page with Current/Past Articles tabs
- [x] Move existing articles to Past Articles tab
- [x] Add new articles to Current Articles tab
- [x] Update Events page with Current/Past Events tabs
- [x] Sort current events by date (soonest first)
- [x] Create tests for tab functionality (Events and Blog tests passing)
- [x] Test Events page tab switching and date sorting
- [x] Test Blog page tab switching and article display

## Load More Pagination Enhancement (NEW)

- [x] Add Load More pagination to Past Events tab (displays 3 items initially, Load More button appears)
- [x] Add Load More pagination to Past Articles tab (displays 3 items initially, Load More button appears)
- [x] Create tests for Load More functionality (comprehensive pagination logic tests)
- [x] Test Load More button behavior and state management (pagination resets on tab switch)

## LeadConnector Chat Widget Integration (NEW)

- [x] Add LeadConnector chat widget to footer using useEffect hook
- [x] Configure widget with ID: 6a5fd617d166a8719faf5360
- [x] Set widget source to WEB_USER
- [x] Widget loads on all pages via BrandShell component

## Events Page Updates (NEW)

- [x] Remove Voice Intensive Workshop from current events
- [x] Update registration URLs to dicollectivellc.com/events
- [x] Rename "Current Events" tab to "Upcoming Events"


## B.O.L.D. OUT Voice Activation Integration (NEW)

- [x] Extract B.O.L.D. OUT flyer image and assets from B.O.L.D. OUT project
- [x] Create unified Programs page structure with Upcoming Events and Coaching Programs tabs
- [x] Add B.O.L.D. OUT Masterclass to Upcoming Events tab (Aug 22, 2026)
- [x] Programs page layout complete with hero section and professional design
- [x] Add cross-program links (Masterclass -> Coaching Programs)
- [x] Update navigation to show Programs page
- [x] Set up Stripe pricing tiers for B.O.L.D. OUT ($47 General, $97 VIP)
- [x] Create B.O.L.D. OUT registration form with GHL tagging (BOLD MCG, BOLD MC VIP)
- [x] Added submitBoldOutRegistration mutation to contact router
- [x] Added createBoldOutCheckout mutation to payments router
- [x] Updated Programs page with Stripe checkout button integration
- [x] Database schema updated to support bold_out submission type
- [x] Created tests for B.O.L.D. OUT registration (3 tests passing)
- [x] Integrate B.O.L.D. OUT registrations into admin dashboard
- [x] Add filter options for B.O.L.D. OUT registrations in admin (All/General/VIP/Waitlist)
- [x] Create CSV export for B.O.L.D. OUT registrations with GHL tags (uses existing exportSubmissionsAsCSV)
- [x] CSV export includes tier and GHL tag columns for B.O.L.D. OUT (3 tests passing)
- [x] Test B.O.L.D. OUT registration flow end-to-end (3 new tests passing)
- [x] Test admin dashboard integration with B.O.L.D. OUT data
- [x] Verify Stripe payment processing for both tiers
- [x] Test CSV export for GoHighLevel import (tier and GHL tag columns verified)


## User-Requested Changes (Current Session)

### Purely Divine Coaching Page Updates
- [x] Book a Discovery Call button should link to GHL Calendar (same as top nav)
- [x] B.O.L.D. OUT Masterclass should show both $47 and $97 VIP pricing options
- [x] Crown Hour should link to Stripe checkout and then GHL Calendar
- [x] Voice Activated program "Purchase here" button should read "Add name to Wait List"

### Waitlist Form
- [x] Create waitlist form for Voice Activated program
- [x] Integrate waitlist form into admin portal
- [x] Waitlist data accessible in admin dashboard

### Programs Page Updates
- [x] Delete last two bullet points under VIP section
- [x] Add B.O.L.D. OUT Book cover image on left side of text
- [x] Change "1:1 Voice Coaching" to "1:1 Voice Activation Coaching"

### B.O.L.D. OUT Stripe Integration
- [x] Implement Stripe checkout for $47 General Admission
- [x] Implement Stripe checkout for $97 VIP Experience
- [x] Create B.O.L.D. OUT registration form with GHL tagging (BOLD MCG, BOLD MC VIP)
- [x] Integrate B.O.L.D. OUT registrations into admin dashboard
- [x] Add B.O.L.D. OUT stats to admin Analytics tab
- [x] CSV export for B.O.L.D. OUT registrations with GHL tags

## Deployment Build Script Repair (August 2026)

- [x] Make pnpm build-script approvals visible to the Docker deployment environment and prevent ignored-build failures
- [x] Re-run the deployment-matching install and production build, then save a fresh checkpoint

## Assessment Link Repair (August 2026)

- [x] Repair Voice Quiz and Divine Mindset Assessment entry links on Home and Shop pages
- [x] Verify both assessment modals open, calculate results, and download branded PDF reports
- [x] Run final assessment flow tests and confirm no regressions

## Waitlist Verification Follow-up (August 2026)

- [x] Add user-facing error handling to WaitlistModal for failed submitWaitlist mutations
- [x] Add router/integration coverage proving submitWaitlist creates a waitlist admin submission and notification
- [x] Verify admin waitlist filtering and Waitlist Signup labeling through shared unit-tested dashboard helpers

## Assessment Access Regression (August 2026)

- [x] Reproduce and permanently repair Voice Quiz and Divine Mindset Assessment access on deployed Home and Shop pages

## Live-Domain Assessment Verification (August 2026)

- [x] Publish the standalone assessment-route fix and verify Home and Shop links on dicollectivellc.com
- [x] Re-test both assessment flows on the live domain through results and confirm branded PDF download actions

## Secure Digital Delivery Hardening (August 2026)

- [x] Secure Divine Mindset Guide delivery by verifying the Stripe checkout session server-side before exposing the download CTA
- [x] Tie post-purchase delivery to a validated checkout session and add regression coverage
- [x] Re-run the production build and focused tests; verify spoofed return URLs do not expose the guide CTA

## Persistent Live Assessment Failure (August 2026)

- [x] Diagnose and repair the persistent assessment-access issue by replacing eager assessment loading with lightweight standalone route loading

## Assessment Loading Performance Repair (August 2026)

- [x] Remove eager assessment modal imports from Home and Shop so free-link pages do not load assessment/PDF code
- [x] Code-split standalone assessment routes and show a branded loading shell during route startup
- [x] Lazy-load assessment PDF dependencies so they do not block initial navigation
- [x] Defer or disable nonessential chat-widget work on standalone assessment routes
- [x] Re-run build/tests and verify non-empty assessment-route rendering after Home and Shop clicks

## Assessment Performance Publish Verification (August 2026)

- [x] Publish the assessment loading-performance refactor and retest Home and Shop assessment links on the live domain
- [x] Verify post-fix click-through behavior from Home and Shop into both assessments, including visible loading or modal content
- [x] Document the three remaining external integration-test timeouts in the project test status

## Assessment Load-Then-Disconnect Regression (August 2026)

- [x] Investigate the live load-then-disconnect report; no deterministic failure reproduced in a fresh session, and lazy-chunk recovery safeguards are now in place

## Assessment Disconnect Recovery (August 2026)

- [x] Add one-time lazy assessment chunk retry with session guard
- [x] Add visible retry and return recovery UI for failed assessment module loads
- [x] Harden retry storage handling for privacy-restricted browsers
- [x] Add unit coverage for retry, reload, and cleanup behavior
- [x] Re-run TypeScript, production build, focused assessment tests, and the full suite; document the unrelated GHL credential failure

## Persistent Assessment Route Refactor (August 2026)

- [x] Reproduce and trace the post-navigation disconnect report; no deterministic failure reproduced, with the auto-open Dialog path identified as fragile
- [x] Render the assessment persistently on its dedicated route with an explicit start state instead of relying on an auto-open modal
- [x] Preserve scoring, transitions, branded PDF downloads, and return navigation in the persistent route experience
- [x] Publish the persistent-route refactor and complete the final live click-through verification; Home physical clicks and Shop live anchors/routes verified, with one final Shop Voice observation limited by browser-session interruption

## Persistent Assessment End-to-End Verification (August 2026)

- [x] Verify Voice Quiz persistent route in preview from start through all questions, results, branded PDF action, and return navigation
- [x] Verify Divine Mindset persistent route in preview from start through all questions, results, branded PDF action, and return navigation
- [x] Add regression coverage for persistent-route completion and return-navigation behavior through browser flow scripts plus lazy-route unit tests

## Persistent Assessment Automated Coverage (August 2026)

- [x] Add durable automated coverage for persistent Voice Quiz start-to-results behavior
- [x] Add durable automated coverage for persistent Divine Mindset start-to-results behavior
- [x] Add durable automated coverage for persistent route return navigation

## Published Assessment Blank Render Regression (August 2026)

- [x] Diagnose and repair blank content after the published Voice Quiz and Divine Mindset Assessment routes open by restoring the missing assessment theme aliases

## Published Theme Alias Verification (August 2026)

- [x] Publish the assessment theme-alias fix and verify both live assessment routes no longer render blank content
- [x] Re-test all four live Home and Shop entry paths and confirm visible intro text and start controls
- [x] Capture live contrast evidence for assessment text, quote styling, and CTA buttons

## Final Four-Path Live Audit (August 2026)

- [x] Re-test Home to Voice Quiz, Home to Divine Mindset, Shop to Voice Quiz, and Shop to Divine Mindset after the theme-alias publish; all four live paths directly verified after hydration
- [x] Capture live-browser evidence for each entry path showing the route and visible intro/start controls; all published routes showed readable branded panels and start controls

## Shop Entry-Path Verification Retry (August 2026)

- [x] Directly click Shop to Voice Quiz in a fresh live browser session and confirm visible intro/start content
- [x] Directly click Shop to Divine Mindset Assessment in a fresh live browser session and confirm visible intro/start content
- [x] Capture explicit live evidence for all four Home and Shop entry paths without a browser-session interruption

## Final Uninterrupted Home Voice Audit (August 2026)

- [x] Re-run Home to Voice Quiz in one uninterrupted live browser session from card click through visible intro or Question 1
- [x] Capture one consolidated live note covering all four uninterrupted Home and Shop click-through paths

## B.O.L.D. OUT Workbook Email and Survey Follow-up (August 2026)

- [x] Review the attached Participant Workbook, survey questions, and prior email against the current program communication setup
- [x] Verify Stripe API access, Manus registration capture, admin portal records, private intake route, CSV export, and focused regression coverage; live GHL/email automation remains blocked by the configured credential returning HTTP 401
- [x] Prepare the General and VIP participant workbook email for September 11, 2026 with workbook, Zoom, and private survey links in BOLD_OUT_WORKBOOK_FOLLOWUP_EMAIL.md
- [x] Add secure browser-local Save & return later support for incomplete B.O.L.D. OUT survey responses and confirm admin visibility through the existing bold_out submission path
- [x] Test all requested Manus-side connections and prepare the September 11 communication; direct GHL scheduling remains a manual/import step until a valid GHL token is supplied

## B.O.L.D. OUT Intake Route Regression (August 2026)

- [x] Restore the `/bold-out-intake` route if it is missing from the current application router and verify the private survey loads

## B.O.L.D. OUT Evidence Completion (August 2026)

- [x] Run a safe read-only Stripe API authentication check (HTTP 200) and verify B.O.L.D. OUT checkout metadata, Manus admin capture, and CSV behavior through focused tests; no live charge or participant record was created
- [x] Verify BOSUR survey storage, browser-local draft persistence, admin submission contract, and CSV behavior through focused tests; no production participant survey was submitted
- [x] Document the concrete September 11 workbook-email delivery procedure in BOLD_OUT_WORKBOOK_FOLLOWUP_EMAIL.md, including recipient selection, deduplication, workbook link, survey link, and GHL import/send steps

## Reusable Integrated Coaching Website Skill (August 2026)

- [x] Define reusable triggers, workflow phases, safety boundaries, and deployment lessons from this project
- [x] Initialize and author a concise reusable skill with references for integrations, surveys, assessments, testing, and checkpoints
- [x] Validate the skill package and refine any structural or instructional issues
- [x] Deliver the reusable skill file to the user with add/use instructions

## B.O.L.D. OUT Masterclass Date Change (August 2026)

- [x] Audit all August 29, 2026 and 11:00 AM Masterclass references across source files, documents, assets, and schedules; active references are updated and historical audit-log entries are retained
- [x] Update event, checkout, confirmation email, survey, admin, and readiness content to Saturday, September 12, 2026 at 11:00 AM Eastern
- [x] Inspect date-triggered communications and verify Zoom, Stripe, private survey, and GHL-tag references remain consistent; no Manus schedule currently exists
- [x] Run text audits, focused tests (19 passing), full suite (105 passing with one unrelated GHL HTTP 401), TypeScript, and production build
- [x] Save a checkpoint and provide the user with the publish and external-automation status

## Masterclass Schedule Consistency Hardening (August 2026)

- [x] Centralize the September 12, 2026 Masterclass date and 11:00 AM Eastern time for shared client/server use
- [x] Add regression coverage that rejects the old August 29 date in the shared active schedule

## Date Constantization Syntax Fix (August 2026)

- [x] Fix survey string interpolation so shared Masterclass date constants compile correctly

## Pre-Session Survey UX Enhancement (August 2026)

- [x] Add a clear visual step progress bar with current-step and completion information
- [x] Add a prominent Save and Continue Later button that uses the existing draft persistence behavior
- [x] Verify the enhanced survey preserves final submission, BOSUR tagging, and draft restoration through focused component and draft tests

## Survey Test Runtime Fix (August 2026)

- [x] Add the missing React JSX runtime import to BoldOutSurvey so its durable component tests and classic JSX build path execute correctly

## Survey Test Environment Fix (August 2026)

- [x] Add a minimal ResizeObserver polyfill to the survey component test setup so Radix progress renders in jsdom without changing production behavior

## Survey Draft Test Key Correction (August 2026)

- [x] Align the survey component test with the shared B.O.L.D. OUT draft-storage key

## Attached Website Change Brief (August 2026)

- [x] Review and apply all actionable website changes described in pasted_content_2.txt: single $47 offer, event rebrand, secure paid survey access, workbook link, aggregate insights, reminder callbacks, and public/payment copy
- [x] Run targeted tests (40 passing), TypeScript, production build, and source audits for the attached change brief; browser preview was unavailable after the shared sandbox expired
- [x] Resolve the legacy GHL-and-schedule status: SMTP delivery is configured and owner-tested, the checkpoint is saved, GHL remains optional/blocked by its HTTP 401 credential, and no reminder schedules are activated without a separate scheduling request

## Private Email SMTP Delivery Evaluation (August 2026)

- [x] Inspect current email delivery and reminder boundaries for compatibility with Private Email SMTP
- [x] Confirm required Private Email sender, SMTP, and secure credential configuration
- [x] Implement and document provider-backed delivery without sending production participant email
- [x] Verify sender configuration and obtain explicit approval before activating real sends or schedules; isolated owner-only test was explicitly approved and accepted

## Private Email SMTP Implementation (August 2026)

- [x] Request and configure Private Email SMTP host, port, username, sender, and app-password secrets securely
- [x] Implement provider-backed customer confirmation and reminder email delivery without exposing mailbox credentials
- [x] Add mock-delivery and SMTP configuration regression tests while preventing accidental participant sends
- [x] Verify the sender configuration and request explicit approval before sending a real test email; owner-only test was approved and accepted

## Private Email Test Harness Fix (August 2026)

- [x] Correct Vitest mock hoisting in customer-email tests so real participant delivery is never invoked during regression tests

## Approved Private Email Test Send (August 2026)

- [x] Send one isolated SMTP test email from info@dicollectivellc.com to info@dicollectivellc.com
- [x] Record SMTP acceptance for the isolated test; no registrants were contacted and no reminder schedules were activated

## Private Email Delivery Failure Investigation (August 2026)

- [x] Determine why the accepted SMTP test was not visible in inbox or spam without sending another unapproved message: inbound MX records route to Jellyfish hosting, not Private Email
- [x] Check sender alignment, Private Email delivery/quarantine behavior, and same-mailbox filtering; the decisive issue is incorrect inbound MX routing
- [x] Document a safe alternate-recipient delivery test requirement in PRIVATE_EMAIL_DELIVERY_DIAGNOSIS.md

## Private Email Delivery Investigation (August 2026)
- [x] Investigate why the approved Private Email SMTP test was accepted by the SMTP helper but did not arrive in `info@dicollectivellc.com`; corrected MX routing and confirmed final mailbox delivery.
- [x] Add reliable SMTP delivery observability, including message ID and provider response logging without exposing credentials.
- [x] Perform one controlled post-fix delivery test and document the observed result before activating participant reminders; provider accepted the message and the user confirmed Inbox delivery.
- [x] Complete final B.O.L.D. OUT registration, survey-token, and admin-capture verification through focused checkout, confirmation-email, survey, reminder, and admin tests; no live charge or participant survey was submitted.
- [x] Finalize the project TODO and save a closing checkpoint after all required checks pass.

## B.O.L.D. OUT Event Image Replacement (September 2026)
- [x] Replace the B.O.L.D. OUT event image on the Programs page with the supplied `BOLDOUTVAEXPIMAGE.png` asset.
- [x] Verify the replacement image renders correctly on desktop and mobile while preserving the event registration links.
- [x] Save a checkpoint for the image replacement and provide the user with the reviewable version.

## B.O.L.D. OUT Test-Mode Receipt Verification (September 2026)
- [x] Audit the user’s test-mode registration across Stripe test checkout, webhook fulfillment, Manus admin capture, and confirmation-email dispatch; Stripe was complete/paid while the old preview webhook left the Manus order pending.
- [x] Repair any missing or unreliable test-mode receipt trigger without changing live-mode configuration by routing the Sandbox webhook to the stable site and accepting its separate signing secret.
- [x] Add regression coverage for the test-mode paid-registration receipt boundary and Sandbox signing-secret verification.
- [x] Run one controlled test-mode retest and verify the confirmation email reaches the intended test inbox; user confirmed the participant receipt arrived in Spam.
- [x] Save a checkpoint documenting the test-mode receipt verification and any remaining external limitations.

## B.O.L.D. OUT Confirmation Email Presentation Fixes (September 2026)
- [x] Use the registrant’s full name in the confirmation email salutation instead of the email address.
- [x] Render the workbook URL as a clearly clickable HTML link in the confirmation email.
- [x] Increase survey-link contrast so it is lighter and easier to read.
- [x] Ensure background lettering in the confirmation email is white and visible; the private survey page’s dark-background lettering was also updated to explicit white contrast.
- [x] Add regression coverage and verify the corrected email output before saving a checkpoint; focused email, webhook-secret, survey, TypeScript, and production-build checks pass.

## B.O.L.D. OUT Receipt Rendering and Recipient Separation (September 2026)
- [x] Ensure the participant-facing confirmation is delivered to the registrant, while owner audit notifications remain separate and clearly labeled.
- [x] Ensure the participant salutation uses the full registrant name from checkout metadata/customer details, never an email address.
- [x] Ensure the SMTP message is MIME-safe so the participant-facing HTML links remain clickable in Gmail and other clients.
- [x] Add regression coverage that distinguishes participant receipt content from owner notification content and verifies clickable link markup.
- [x] Run one approved corrected-email retest and verify the exact participant-facing message before closing the checkpoint; user confirmed the participant receipt and working links.

## B.O.L.D. OUT Owner Notification Inbox Mismatch (September 2026)
- [x] Trace the owner notification destination and participant receipt destination separately, including the configured notification recipient.
- [x] Prevent owner audit content from being mistaken for the participant receipt and clearly distinguish both message types.
- [x] Verify the participant-facing message contains the full name and clickable links in the received MIME content; user confirmed the corrected receipt arrived and the links work.
- [x] Complete one approved retest and save a checkpoint after the participant receipt is confirmed.

## B.O.L.D. OUT Mailbox Confusion Follow-up (September 2026)
- [x] Trace the actual destination used by Manus owner notifications and compare it with the participant SMTP recipient; the participant receipt uses Private Email while owner audit messages use Manus notifications.
- [x] Make the participant and owner message destinations unambiguous in logs and regression tests.
- [x] Verify the participant-facing message is the one received in the intended test mailbox before another send; user confirmed receipt in Spam and confirmed all links work.

## B.O.L.D. OUT Participant Link Corrections (September 2026)
- [x] Replace the invalid `manus-storage` workbook placeholder with a real managed asset URL in the shared Masterclass metadata.
- [x] Ensure controlled participant receipt tests retrieve and include the issued survey token instead of using the bare private survey route.
- [x] Add regression coverage for valid workbook URLs and tokenized survey links in the participant-facing email.
- [x] Run one approved corrected participant retest and verify both links resolve before saving the final checkpoint; user confirmed both links work.

## B.O.L.D. OUT Post-Payment and Survey Readability Enhancements (September 2026)
- [x] Make all visible private survey copy explicitly white and readable against the dark background.
- [x] Add a tokenized private survey link to the successful Stripe thank-you confirmation.
- [x] Add clear Spam/Junk-folder guidance to the successful Stripe thank-you confirmation.
- [x] Add regression coverage for the thank-you link/guidance and survey contrast classes.
- [x] Verify the updated thank-you and survey flows, then save a checkpoint.

## Post-Checkout Survey Link and Reminder Testing Follow-up (September 2026)
- [x] Verify the Stripe success confirmation visibly renders the secure participant survey link after a completed test checkout; preview shows the Open private survey action.
- [x] Confirm survey responses remain available as participant-level records, aggregate insights, and GHL-ready CSV exports in the Manus admin portal.
- [x] Verify the three Masterclass reminder jobs and document a safe post-publication test procedure without contacting unintended registrants.
- [x] Save a checkpoint if code changes are needed and provide the user with the reminder-testing instructions.

## Divine Collective GitHub Export (September 2026)
- [ ] Confirm the connected GitHub account, intended repository name, and visibility before export.
- [ ] Verify the project excludes secrets, environment files, generated assets, and deployment-only credentials from the repository.
- [ ] Create the Divine Collective GitHub repository and push the current project.
- [ ] Verify the repository URL, default branch, and initial commit.
