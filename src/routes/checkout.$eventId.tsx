import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CreditCard,
  ShieldCheck,
  Check,
  Clock,
  MapPin,
  CalendarDays,
  Flame,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getEvent, formatDate, formatPrice, type TicketType } from "@/lib/tickets-data";

type Search = Record<string, string | number | undefined> & { fixture?: string };

export const Route = createFileRoute("/checkout/$eventId")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    for (const [k, v] of Object.entries(s)) {
      if (typeof v === "string" || typeof v === "number") out[k] = v;
    }
    return out;
  },
  loader: ({ params }) => {
    const event = getEvent(params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `Checkout — ${loaderData.event.name}` }, { name: "robots", content: "noindex" }]
      : [],
  }),
  component: CheckoutPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Event not found</div>,
});

function CheckoutPage() {
  const { event } = Route.useLoaderData();
  const search = Route.useSearch();
  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [orderRef] = useState(() => `TL-${Math.floor(100000 + Math.random() * 900000)}`);

  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [done]);
  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const timeLow = secondsLeft <= 120;

  useEffect(() => {
    if (done) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [done]);

  const fixture =
    event.fixtures.find((f: { id: string }) => f.id === search.fixture) ?? event.fixtures[0];

  const items = event.ticketTypes
    .map((t: TicketType) => ({ ticket: t, qty: Number(search[t.id] || 0) }))
    .filter((i: { qty: number }) => i.qty > 0);

  const subtotal = items.reduce(
    (s: number, i: { ticket: TicketType; qty: number }) => s + i.qty * i.ticket.price,
    0,
  );
  const fee = 1.0;
  const total = subtotal + fee;
  const totalQty = items.reduce((s: number, i: { qty: number }) => s + i.qty, 0);

  if (items.length === 0 && !done) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader
          containerClassName="max-w-5xl px-4"
          back={
            <Link
              to="/events/$eventId"
              params={{ eventId: event.id }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              Back to event
            </Link>
          }
        />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">No tickets selected</h1>
          <p className="text-muted-foreground mb-6">Pick your tickets to continue.</p>
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="inline-flex bg-accent-blue text-white font-medium px-5 py-3 rounded-xl"
          >
            Back to event
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface">
        <SiteHeader
          containerClassName="max-w-5xl px-4"
          back={
            <Link
              to="/events/$eventId"
              params={{ eventId: event.id }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              Back to event
            </Link>
          }
        />
        <div className="max-w-lg mx-auto px-4 py-14 sm:py-20">
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 text-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_40px_-16px_rgba(16,24,40,0.14)]">
            {/* Success badge */}
            <div className="mx-auto mb-5 grid place-items-center size-20 rounded-full bg-success/10">
              <div className="size-16 rounded-full bg-success/15 grid place-items-center motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:fade-in motion-safe:duration-500">
                <Check className="size-8 text-success" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking confirmed!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your tickets are on their way to{" "}
              <span className="font-semibold text-foreground">{email || "your email"}</span>.
            </p>

            {/* Order recap */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden text-left mb-6">
              <div className="flex items-center gap-3 p-3">
                <img
                  src={event.heroImage ?? event.image}
                  alt=""
                  className="size-14 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm leading-tight line-clamp-2">{event.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(fixture.date)} · Gates {fixture.doorsTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">
                  {totalQty} {totalQty === 1 ? "ticket" : "tickets"} · {orderRef}
                </span>
                <span className="font-bold tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Wallet */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Add tickets to your wallet
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Add to Apple Wallet"
                  className="h-11 px-4 bg-black text-white rounded-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <svg
                    viewBox="0 0 814 1000"
                    className="h-[16px] w-auto fill-current"
                    aria-hidden="true"
                  >
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                  </svg>
                  <span className="text-sm font-medium">Add to Apple Wallet</span>
                </button>
                <button
                  type="button"
                  aria-label="Add to Google Wallet"
                  className="h-11 px-4 bg-black text-white rounded-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <svg viewBox="0 0 48 48" className="size-[16px]" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 12.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Add to Google Wallet</span>
                </button>
              </div>
            </div>

            <Link
              to="/"
              className="w-full inline-flex items-center justify-center bg-accent-blue text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-accent-blue/25 hover:shadow-xl hover:shadow-accent-blue/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Browse more events
            </Link>
          </div>

          <p className="flex items-center justify-center gap-1.5 mt-5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-success" />A confirmation email with your
            e-tickets is on the way.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-12">
      <SiteHeader
        containerClassName="max-w-5xl px-4"
        back={
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-3.5" />
            Back to event
          </Link>
        }
        cartCount={totalQty}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          <StepIndicator step={1} label="Your details" active={step === 1} completed={step > 1} />
          <div
            className={`w-8 sm:w-12 h-0.5 rounded-full mx-2 sm:mx-3 transition-colors ${step > 1 ? "bg-success" : "bg-border"}`}
          />
          <StepIndicator step={2} label="Payment" active={step === 2} completed={false} />
          <span className="ml-auto pl-4 text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
            Step <span className="font-semibold text-foreground">{step}</span> of 2
          </span>
        </div>

        <div className="-mt-3 mb-6">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              timeLow
                ? "border-orange-200 bg-orange-50 text-orange-700"
                : "border-border bg-white text-muted-foreground"
            }`}
          >
            <Clock className={`size-3.5 shrink-0 ${timeLow ? "animate-pulse" : ""}`} />
            Tickets reserved
            <span className="tabular-nums font-semibold text-foreground">{mmss}</span>
          </span>
        </div>

        <div className="grid md:grid-cols-[1fr_340px] gap-6">
          {/* Form card */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_40px_-16px_rgba(16,24,40,0.14)]">
            {step === 1 ? (
              <>
                <p className="text-sm font-semibold text-center mb-4">Express checkout</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    aria-label="Pay with Apple Pay"
                    onClick={() => {
                      setDone(true);
                    }}
                    className="h-12 bg-black text-white rounded-full flex items-center justify-center gap-1 hover:opacity-90 transition"
                  >
                    <svg
                      viewBox="0 0 814 1000"
                      className="h-[18px] w-auto fill-current"
                      aria-hidden="true"
                    >
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                    </svg>
                    <span className="text-[17px] font-medium">Pay</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Pay with Google Pay"
                    onClick={() => {
                      setDone(true);
                    }}
                    className="h-12 bg-white border border-[#dadce0] rounded-full flex items-center justify-center gap-1.5 hover:bg-surface transition"
                  >
                    <svg viewBox="0 0 48 48" className="size-[19px]" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
                      />
                      <path
                        fill="#EA4335"
                        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 12.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
                      />
                    </svg>
                    <span className="text-[17px] font-medium text-[#5f6368]">Pay</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <h1 className="text-2xl font-bold mb-1">Your details</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  We'll send your tickets to this address.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email !== confirmEmail) {
                      setEmailError("Email addresses do not match.");
                      return;
                    }
                    setEmailError("");
                    setStep(2);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First name" name="firstName" placeholder="John" required />
                    <Field label="Last name" name="lastName" placeholder="Smith" required />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                    />
                    <Field
                      label="Confirm email"
                      name="confirmEmail"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail((e.target as HTMLInputElement).value)}
                    />
                    <Field
                      label="Telephone"
                      name="phone"
                      type="tel"
                      placeholder="+44 000 0000 000"
                      required
                    />
                    <Field label="Address" name="address" placeholder="123 High Street" required />
                    <Field label="City" name="city" placeholder="Ilkeston" required />
                    <Field label="County" name="county" placeholder="Derbyshire" />
                    <Field label="Postal code" name="postcode" placeholder="DE7 8AA" required />
                    <SelectField
                      label="Country"
                      name="country"
                      required
                      defaultValue="United Kingdom"
                    >
                      <option>United Kingdom</option>
                      <option>Ireland</option>
                      <option>France</option>
                      <option>Germany</option>
                      <option>Spain</option>
                      <option>Netherlands</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Other</option>
                    </SelectField>
                  </div>
                  {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                  <button
                    type="submit"
                    className="group w-full bg-accent-blue text-white font-semibold py-3.5 rounded-xl mt-2 flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/25 hover:shadow-xl hover:shadow-accent-blue/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-40"
                  >
                    Continue to payment
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1">Payment</h1>
                <p className="text-sm text-muted-foreground mb-6">Enter your card details.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Card number
                      </span>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          name="card"
                          placeholder="4242 4242 4242 4242"
                          className="w-full h-11 bg-surface border border-border rounded-lg pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
                        />
                      </div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" name="exp" placeholder="mm/yy" />
                    <Field label="CVC" name="cvc" placeholder="•••" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-success font-medium">
                    <ShieldCheck className="size-3.5" />
                    Encrypted end-to-end · We never store card details
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent-blue text-white font-semibold py-3.5 rounded-xl mt-1 flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/25 hover:shadow-xl hover:shadow-accent-blue/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <Lock className="size-4" />
                    Pay <span className="tabular-nums">{formatPrice(total)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm text-muted-foreground py-1.5 flex items-center justify-center gap-1 hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="size-3.5" />
                    Back to your details
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Order summary */}
          <aside>
            <div className="md:sticky md:top-24 bg-white border border-border rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_40px_-16px_rgba(16,24,40,0.14)]">
              {/* Event image header */}
              <div className="relative h-32">
                <img
                  src={event.heroImage ?? event.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                {fixture.status === "selling-fast" && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                    <Flame className="size-3" />
                    Selling fast
                  </span>
                )}
                <p className="absolute inset-x-0 bottom-0 p-4 font-bold text-sm leading-tight text-white line-clamp-2">
                  {event.name}
                </p>
              </div>

              {/* Event meta */}
              <div className="px-5 py-4 border-b border-border space-y-2">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5 shrink-0 text-foreground/50" />
                  {formatDate(fixture.date)} · Gates {fixture.doorsTime}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 text-foreground/50" />
                  {event.venue}
                </p>
              </div>

              <div className="p-5">
                <div className="space-y-3 mb-5 pb-5 border-b border-border">
                  {items.map((i: { ticket: TicketType; qty: number }) => (
                    <div
                      key={i.ticket.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex items-center gap-2 text-foreground">
                        <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-md bg-surface border border-border text-xs font-semibold tabular-nums">
                          {i.qty}
                        </span>
                        {i.ticket.name}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatPrice(i.qty * i.ticket.price)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <Row label="Subtotal" value={formatPrice(subtotal)} />
                  <Row label="Booking fee" value={formatPrice(fee)} muted />
                  <div className="pt-3 mt-2 border-t border-border flex items-baseline justify-between font-bold">
                    <span>Total</span>
                    <span className="text-lg tabular-nums">{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs text-success font-medium">
                  <ShieldCheck className="size-3.5" />
                  Secure checkout · Instant e-ticket delivery
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`size-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
          completed
            ? "bg-success text-white"
            : active
              ? "bg-accent-blue text-white"
              : "border-2 border-border text-muted-foreground"
        }`}
      >
        {completed ? <Check className="size-3.5" strokeWidth={3} /> : step}
      </div>
      <span
        className={`text-sm font-medium whitespace-nowrap ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
      {label}
      {required && <span className="text-accent-blue"> *</span>}
    </span>
  );
}

function Field({
  label,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <FieldLabel label={label} required={props.required} />
      <input
        {...props}
        onChange={onChange}
        className="w-full h-11 bg-surface border border-border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
      />
    </label>
  );
}

function SelectField({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block">
      <FieldLabel label={label} required={props.required} />
      <select
        {...props}
        className="w-full h-11 bg-surface border border-border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
      >
        {children}
      </select>
    </label>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${muted ? "text-muted-foreground" : ""}`}>
      <span>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
