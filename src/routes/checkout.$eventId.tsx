import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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

  const fixture = event.fixtures.find((f: { id: string }) => f.id === search.fixture) ?? event.fixtures[0];

  const items = event.ticketTypes
    .map((t: TicketType) => ({ ticket: t, qty: Number(search[t.id] || 0) }))
    .filter((i: { qty: number }) => i.qty > 0);

  const subtotal = items.reduce((s: number, i: { ticket: TicketType; qty: number }) => s + i.qty * i.ticket.price, 0);
  const fee = Math.round(subtotal * 0.06 * 100) / 100;
  const total = subtotal + fee;

  if (items.length === 0 && !done) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="max-w-md mx-auto p-12 text-center">
          <h1 className="text-2xl font-bold mb-2">No tickets selected</h1>
          <p className="text-muted-foreground mb-6">Pick your tickets to continue.</p>
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="inline-flex bg-brand text-brand-foreground font-medium px-5 py-3 rounded-xl"
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
        <SiteHeader />
        <div className="max-w-md mx-auto p-12 text-center">
          <div className="size-14 rounded-full bg-success/15 grid place-items-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" className="size-7 text-success" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Order confirmed</h1>
          <p className="text-muted-foreground mb-6">
            Your tickets for <span className="font-medium text-foreground">{event.name}</span> have been emailed to you.
          </p>
          <Link to="/" className="inline-flex bg-brand text-brand-foreground font-medium px-5 py-3 rounded-xl">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-28 md:pb-0">
      <SiteHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to event
          </Link>
          <span className="ml-auto text-muted-foreground">
            Step <span className="font-bold text-foreground">{step}</span> of 2
          </span>
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-8">
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8">
            {step === 1 ? (
              <>
                <h1 className="text-2xl font-bold mb-1">Your details</h1>
                <p className="text-sm text-muted-foreground mb-6">We'll send your tickets to this email.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                  className="space-y-4"
                >
                  <Field label="Full name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Phone" name="phone" type="tel" />
                  <button
                    type="submit"
                    className="w-full bg-brand text-brand-foreground font-bold py-4 rounded-xl mt-2"
                  >
                    Continue to payment
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1">Payment</h1>
                <p className="text-sm text-muted-foreground mb-6">Demo checkout — no card will be charged.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(true);
                    navigate({ to: "/checkout/$eventId", params: { eventId: event.id }, search });
                  }}
                  className="space-y-4"
                >
                  <Field label="Card number" name="card" placeholder="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" name="exp" placeholder="MM/YY" />
                    <Field label="CVC" name="cvc" placeholder="123" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand text-brand-foreground font-bold py-4 rounded-xl mt-2"
                  >
                    Pay {formatPrice(total)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm text-muted-foreground py-2"
                  >
                    Back
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Order summary */}
          <aside>
            <div className="md:sticky md:top-24 bg-white border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-1">{event.name}</h3>
              <p className="text-xs text-muted-foreground mb-5">
                {formatDate(fixture.date)} · {event.venue}
              </p>
              <div className="space-y-3 mb-5 pb-5 border-b border-border">
                {items.map((i: { ticket: TicketType; qty: number }) => (
                  <div key={i.ticket.id} className="flex justify-between text-sm">
                    <span>
                      {i.qty} × {i.ticket.name}
                    </span>
                    <span className="font-medium">{formatPrice(i.qty * i.ticket.price)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Booking fee" value={formatPrice(fee)} muted />
                <div className="pt-3 mt-2 border-t border-border flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full h-11 bg-surface border border-border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
      />
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
