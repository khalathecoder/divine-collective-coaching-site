import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BrandShell from "@/components/BrandShell";
import { ArrowRight, Calendar, CheckCircle2, Clock, Loader2, MapPin, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { MASTERCLASS_SCHEDULE } from "@shared/masterclassSchedule";

const EVENT_TITLE = "B.O.L.D. OUT Voice Activation Experience™";
const WORKBOOK_TITLE = "B.O.L.D. OUT Voice Activation Experience Participant Workbook";
const ZOOM_LINK = "https://us06web.zoom.us/j/83079974714?pwd=ntvSUetlgammUMsGfZjcFnZ5lD2yaU.1&jst=5";

function calendarUrl() {
  const start = "20260912T150000Z";
  const end = "20260912T163000Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_TITLE)}&dates=${start}/${end}&details=${encodeURIComponent(`Virtual Zoom experience. Join here: ${ZOOM_LINK}`)}&location=${encodeURIComponent("Virtual (Zoom)")}`;
}

export default function Programs() {
  const [, navigate] = useLocation();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [location] = useLocation();
  const checkoutComplete = useMemo(() => new URLSearchParams(window.location.search).get("bold-out") === "success", [location]);
  const checkoutSessionId = useMemo(() => new URLSearchParams(window.location.search).get("session_id") || "", [location]);
  const thankYouQuery = trpc.payments.getBoldOutThankYou.useQuery(
    { sessionId: checkoutSessionId },
    {
      enabled: checkoutComplete && checkoutSessionId.length >= 20,
      retry: 4,
      retryDelay: 1500,
      refetchInterval: (query) => query.state.data?.valid ? false : 2000,
      refetchIntervalInBackground: false,
    },
  );

  const createCheckout = trpc.payments.createBoldOutCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    },
    onError: (error) => setCheckoutError(error.message || "Unable to start secure checkout."),
  });

  const submitRegistration = (event: React.FormEvent) => {
    event.preventDefault();
    setCheckoutError(null);
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setCheckoutError("Please provide your name, email, and phone number before continuing.");
      return;
    }
    createCheckout.mutate({ tier: "general", email: guestEmail.trim(), name: guestName.trim(), phone: guestPhone.trim() });
  };

  const openRegistration = () => setRegistrationOpen(true);

  return (
    <BrandShell currentPath="/programs">
      <div className="min-h-screen bg-[#0d0d12] text-white">
        {checkoutComplete && (
          <section className="border-b border-amber-400/30 bg-[#171721] px-4 py-8">
            <div className="mx-auto max-w-4xl rounded-2xl border border-amber-400/40 bg-black/30 p-6 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-amber-300" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-bold text-amber-200">Thank you for registering</h2>
              <p className="mx-auto mt-3 max-w-2xl text-zinc-200">Thank you for registering for the B.O.L.D. OUT Voice Activation Experience. Your payment is complete, and your Stripe receipt is being sent to the email address you provided when you registered.</p>
              <div className="mt-4 grid gap-2 text-sm text-zinc-300 sm:grid-cols-3"><span>{MASTERCLASS_SCHEDULE.dateLabel}</span><span>11:00 AM EST</span><span>Virtual (Zoom) · 90 minutes</span></div>
              <div className="mt-5 flex flex-wrap justify-center gap-3"><a href={calendarUrl()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-300">Add to calendar <Calendar className="h-4 w-4" /></a><a href={MASTERCLASS_SCHEDULE.workbookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-amber-300/60 px-5 py-3 font-semibold text-amber-100 hover:bg-amber-300/10">Download workbook</a>{thankYouQuery.data?.valid && thankYouQuery.data.surveyUrl && <a href={thankYouQuery.data.surveyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-200">Open private survey</a>}</div>
              {thankYouQuery.isLoading && <p className="mx-auto mt-4 max-w-2xl text-sm text-amber-100">Preparing your private survey link…</p>}
              {!thankYouQuery.isLoading && !thankYouQuery.data?.valid && checkoutSessionId && <p className="mx-auto mt-4 max-w-2xl text-sm text-amber-100">Your payment is confirmed. Your private survey link is still syncing; please use the link in your confirmation email or refresh this page in a moment.</p>}
              <p className="mx-auto mt-4 max-w-2xl text-sm text-amber-100">Your personalized survey link and workbook are also included in your confirmation email. If the email is not in your Inbox, please check your Spam, Junk, or Promotions folder. If you pause the survey, use the same private link to return later.</p>
            </div>
          </section>
        )}

        <section className="relative overflow-hidden border-b border-amber-400/30 py-16 md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-6xl -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-6 flex justify-center"><span className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-200"><Sparkles className="h-4 w-4" /> Featured virtual experience · {MASTERCLASS_SCHEDULE.dateShortLabel}</span></div>
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="flex justify-center lg:col-span-5"><div className="relative w-full max-w-md rounded-2xl border-2 border-amber-400/60 bg-black p-2 shadow-2xl"><img src={MASTERCLASS_SCHEDULE.imageUrl} alt={`${EVENT_TITLE} book-cover artwork`} loading="eager" fetchPriority="high" decoding="async" className="w-full rounded-xl object-cover" /></div></div>
              <div className="space-y-6 lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Faith-rooted voice activation</p>
                <h1 className="font-serif text-4xl font-bold leading-tight text-amber-100 md:text-6xl">{EVENT_TITLE}</h1>
                <p className="font-serif text-xl italic text-amber-300">Uncovered Head. Uncovered Voice. Unstoppable Woman.</p>
                <p className="max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">Join Nancy Marie Dixon for a focused 90-minute virtual experience designed to move you from hesitation into faith-rooted clarity, practical voice activation, and bold expression.</p>
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-amber-400/40 bg-zinc-900/80 p-4 md:grid-cols-4">
                  <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-amber-300" /><span className="text-sm">{MASTERCLASS_SCHEDULE.dateShortLabel}</span></div>
                  <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-300" /><span className="text-sm">11:00 AM EST</span></div>
                  <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-amber-300" /><span className="text-sm">Virtual (Zoom)</span></div>
                  <div className="flex items-center gap-2"><Users className="h-5 w-5 text-amber-300" /><span className="text-sm">90 minutes</span></div>
                </div>
                <Button type="button" onClick={openRegistration} className="rounded-xl bg-amber-400 px-8 py-6 text-base font-bold text-zinc-950 hover:bg-amber-300">Register — General Admission $47 <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {["Break through fear with practical voice activation exercises.", "Learn the B.O.L.D. Voice Framework™ and seven Bold Declarations.", "Speak with faith-rooted clarity and join live Q&A with Nancy."].map((text, index) => <div key={text} className="rounded-2xl border-2 border-amber-500/30 bg-[#F4EEDC] p-7 text-zinc-900"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 font-bold text-amber-900">0{index + 1}</div><p className="leading-relaxed">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="bg-[#FDFBF7] py-20 text-zinc-900">
          <div className="mx-auto max-w-7xl px-4">
            <Tabs defaultValue="coaching" className="w-full">
              <TabsList className="mx-auto mb-12 flex h-14 w-fit rounded-2xl bg-zinc-200/80 p-1.5"><TabsTrigger value="coaching" className="rounded-xl px-8 py-3 text-base">Coaching Programs</TabsTrigger><TabsTrigger value="upcoming" className="rounded-xl px-8 py-3 text-base">Upcoming Masterclasses</TabsTrigger></TabsList>
              <TabsContent value="coaching"><div className="grid gap-8 md:grid-cols-3">{["1:1 Voice Activation Coaching", "Group Coaching Circle", "Signature Program"].map((title) => <Card key={title} className="rounded-2xl border-amber-500/30"><CardHeader><CardTitle className="font-serif text-2xl">{title}</CardTitle><CardDescription>Personalized support for women finding their voice, clarity, and next bold step.</CardDescription></CardHeader><CardContent><Link href="/coaching"><Button className="w-full bg-zinc-900 text-white">Explore Program <ArrowRight className="ml-2 h-4 w-4" /></Button></Link></CardContent></Card>)}</div></TabsContent>
              <TabsContent value="upcoming"><Card className="mx-auto max-w-2xl rounded-2xl border-amber-500/40"><CardHeader><CardTitle className="font-serif text-2xl">{EVENT_TITLE}</CardTitle><CardDescription>{MASTERCLASS_SCHEDULE.dateLabel} · 11:00 AM EST · Virtual (Zoom)</CardDescription></CardHeader><CardContent><p className="mb-6 text-zinc-700">A single $47 General Admission offer for the complete 90-minute experience.</p><Button type="button" onClick={openRegistration} className="bg-zinc-900 text-white">Register — $47 <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card></TabsContent>
            </Tabs>
          </div>
        </section>

        {registrationOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-labelledby="registration-title"><div className="relative w-full max-w-md rounded-3xl border border-amber-400/60 bg-[#121218] p-8 text-white shadow-2xl"><button type="button" onClick={() => setRegistrationOpen(false)} className="absolute right-5 top-5 rounded-lg p-2 text-zinc-400 hover:text-white" aria-label="Close registration"><X className="h-5 w-5" /></button><h2 id="registration-title" className="font-serif text-2xl font-bold text-amber-200">Register — General Admission $47</h2><p className="mt-2 text-sm text-zinc-300">Enter your details, then continue to the existing secure Stripe checkout.</p><form onSubmit={submitRegistration} className="mt-6 space-y-4"><label className="block text-sm">Full name<input required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white" /></label><label className="block text-sm">Email<input required type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white" /></label><label className="block text-sm">Phone<input required type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white" /></label>{checkoutError && <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/40 p-3 text-sm text-red-100">{checkoutError}</p>}<Button type="submit" disabled={createCheckout.isPending} className="w-full bg-amber-400 py-6 font-bold text-zinc-950 hover:bg-amber-300">{createCheckout.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Preparing secure checkout…</> : <>Continue to Stripe Checkout <ArrowRight className="ml-2 h-4 w-4" /></>}</Button><p className="flex items-center justify-center gap-2 text-xs text-zinc-400"><ShieldCheck className="h-4 w-4 text-amber-300" /> Stripe-secured checkout</p></form></div></div>}
      </div>
    </BrandShell>
  );
}
