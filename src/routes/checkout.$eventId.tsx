import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, CreditCard, ShieldCheck, Check, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import {
  getEvent,
  formatDate,
  formatPrice,
  type TicketType,
} from "@/lib/tickets-data";

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
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [orderRef] = useState(() => `TL-${Math.floor(100000 + Math.random() * 900000)}`);

  const fixture = event.fixtures.find((f: { id: string }) => f.id === search.fixture) ?? event.fixtures[0];

  const items = event.ticketTypes
    .map((t: TicketType) => ({ ticket: t, qty: Number(search[t.id] || 0) }))
    .filter((i: { qty: number }) => i.qty > 0);

  const subtotal = items.reduce((s: number, i: { ticket: TicketType; qty: number }) => s + i.qty * i.ticket.price, 0);
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
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="size-16 rounded-full bg-success/15 grid place-items-center mx-auto mb-6">
            <Check className="size-8 text-success" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold mb-3">Booking confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Your tickets are on their way to{" "}
            <span className="font-semibold text-foreground">{email || "your email"}</span>.
          </p>
          <div className="inline-block bg-surface border border-border rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8">
            Order ref: {orderRef}
          </div>
          <div>
            <Link
              to="/"
              className="inline-flex bg-accent-blue text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition"
            >
              Browse more events
            </Link>
          </div>
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
          <div className="w-8 sm:w-12 h-px bg-border mx-2 sm:mx-3" />
          <StepIndicator step={2} label="Payment" active={step === 2} completed={false} />
          <span className="ml-auto pl-4 text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
            Step <span className="font-semibold text-foreground">{step}</span> of 2
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 -mt-4">
          <Clock className="size-3.5 shrink-0" />
          Your tickets are reserved for 10 minutes.
        </p>

        <div className="grid md:grid-cols-[1fr_340px] gap-6">
          {/* Form card */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8">
            {step === 1 ? (
              <>
                <h1 className="text-2xl font-bold mb-1">Your details</h1>
                <p className="text-sm text-muted-foreground mb-6">We'll send your tickets to this address.</p>
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
                    <Field label="Telephone" name="phone" type="tel" placeholder="+44 000 0000 000" required />
                    <Field label="Address" name="address" placeholder="123 High Street" required />
                    <Field label="City" name="city" placeholder="Ilkeston" required />
                    <Field label="County" name="county" placeholder="Derbyshire" />
                    <Field label="Postal code" name="postcode" placeholder="DE7 8AA" required />
                    <SelectField label="Country" name="country" required defaultValue="United Kingdom">
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
                    className="w-full bg-accent-blue text-white font-semibold py-3.5 rounded-xl mt-2 flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-40"
                  >
                    Continue to payment
                    <ChevronRight className="size-4" />
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
                    navigate({ to: "/checkout/$eventId", params: { eventId: event.id }, search });
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
                    className="w-full bg-accent-blue text-white font-semibold py-3.5 rounded-xl mt-1 flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    <Lock className="size-4" />
                    Pay {formatPrice(total)}
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
            <div className="md:sticky md:top-20 bg-white border border-border rounded-2xl overflow-hidden">
              {/* Event header */}
              <div className="bg-surface px-5 py-4 border-b border-border">
                <p className="font-bold text-sm leading-tight">{event.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{event.venue}</p>
                <p className="text-xs text-muted-foreground">{formatDate(fixture.date)} · {fixture.doorsTime}</p>
              </div>

              <div className="p-5">
                <div className="space-y-3 mb-5 pb-5 border-b border-border">
                  {items.map((i: { ticket: TicketType; qty: number }) => (
                    <div key={i.ticket.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {i.qty} × {i.ticket.name}
                      </span>
                      <span className="font-medium">{formatPrice(i.qty * i.ticket.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <Row label="Subtotal" value={formatPrice(subtotal)} />
                  <Row label="Booking fee" value={formatPrice(fee)} muted />
                  <div className="pt-3 mt-2 border-t border-border flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
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

function StepIndicator({ step, label, active, completed }: { step: number; label: string; active: boolean; completed: boolean }) {
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
      <span className="font-medium">{value}</span>
    </div>
  );
}
