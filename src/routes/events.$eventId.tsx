import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, AlertTriangle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getEvent,
  formatDate,
  formatPrice,
  type TicketType,
  type Fixture,
} from "@/lib/tickets-data";
import mapImg from "@/assets/venue-map.jpg";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const event = getEvent(params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.event.name} — Tickets Live` },
          { name: "description", content: loaderData.event.tagline },
          { property: "og:title", content: loaderData.event.name },
          { property: "og:description", content: loaderData.event.tagline },
          { property: "og:image", content: loaderData.event.image },
        ]
      : [],
  }),
  component: EventPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link to="/" className="text-accent-blue mt-2 inline-block">Back to home</Link>
      </div>
    </div>
  ),
});

function EventPage() {
  const { event } = Route.useLoaderData();
  const navigate = useNavigate();
  const fixtureId = event.fixtures[0].id;
  const [qty, setQty] = useState<Record<string, number>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fixture = event.fixtures.find((f: Fixture) => f.id === fixtureId)!;
  const total = useMemo(
    () => event.ticketTypes.reduce((sum: number, t: TicketType) => sum + (qty[t.id] || 0) * t.price, 0),
    [qty, event.ticketTypes]
  );
  const totalQty = useMemo(
    () => Object.values(qty).reduce((a, b) => a + b, 0),
    [qty]
  );

  const setTicketQty = (id: string, n: number) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(8, n)) }));
  };

  const goCheckout = () => {
    if (totalQty === 0) return;
    navigate({
      to: "/checkout/$eventId",
      params: { eventId: event.id },
      search: { fixture: fixtureId, ...qty },
    });
  };

  return (
    <div className="min-h-screen bg-white pb-28 md:pb-0">
      <SiteHeader containerClassName="max-w-5xl px-4" cartCount={totalQty} />

      {/* Hero */}
      <section className="px-4 max-w-5xl mx-auto pt-8">
        <div className="overflow-hidden rounded-2xl aspect-[16/8] bg-surface">
          <img
            src={event.heroImage ?? event.image}
            alt={event.name}
            width={1600}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-10 mt-8">
          {/* Left: info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {event.name.split(" - ").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-xl">{event.tagline}</p>

            <h2 className="font-semibold text-base mb-3">Overview</h2>
            <ExpandableText text={event.description} className="mb-8 max-w-xl" />

            {/* Key facts */}
            <div className="flex flex-col divide-y divide-border sm:grid sm:grid-cols-3 sm:gap-4 sm:divide-y-0 py-2 sm:py-6 border-y border-border mb-6 bg-surface rounded-xl px-5">
              <Fact label="Date" value={formatDate(fixture.date)} />
              <Fact label="Time" value={fixture.doorsTime} />
              <Fact label="Venue" value={event.venue} />
            </div>

            {/* Location map */}
            <div className="mb-8">
              <h2 className="font-semibold text-base mb-1">Location</h2>
              <p className="text-sm text-muted-foreground mb-4">{event.venue}, {event.address}</p>
              <div className="w-full aspect-[2/1] bg-surface border border-border rounded-xl overflow-hidden">
                <img src={mapImg} alt={`Map of ${event.venue}`} loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Important information */}
            <div className="mb-8 bg-warning/10 border border-warning/30 rounded-xl p-5">
              <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning shrink-0" />
                Important information
              </h2>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>Please do not bring your own fireworks.</li>
                <li>Sparklers are not permitted.</li>
                <li>If car parks are full, please see attached map for alternative parking.</li>
              </ul>
            </div>

            {/* Mobile ticket section */}
            <div className="md:hidden mb-10">
              <h2 className="font-semibold text-base mb-4">Tickets</h2>
              <TicketList tickets={event.ticketTypes} qty={qty} setQty={setTicketQty} fixtureStatus={fixture.status} />
            </div>

            {/* FAQ */}
            <h2 className="font-semibold text-base mb-3">Frequently asked</h2>
            <div className="border-y border-border divide-y divide-border mb-8">
              {event.faq.map((f: { q: string; a: string }, i: number) => {
                const open = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
                    >
                      <span className="font-medium text-sm">{f.q}</span>
                      <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <p className="text-sm text-muted-foreground pb-4 max-w-prose">{f.a}</p>}
                  </div>
                );
              })}
            </div>

            {/* Terms */}
            <details className="border border-border rounded-xl p-4">
              <summary className="font-medium text-sm cursor-pointer">Terms & conditions</summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{event.terms}</p>
            </details>
          </div>

          {/* Right: sticky ticket box (desktop) */}
          <aside className="hidden md:block">
            <div className="sticky top-20 bg-white border border-border rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-0.5">Select tickets</h3>
              <p className="text-xs text-muted-foreground mb-5">
                {formatDate(fixture.date)} · {fixture.doorsTime}
              </p>
              <TicketList tickets={event.ticketTypes} qty={qty} setQty={setTicketQty} fixtureStatus={fixture.status} />
              <div className="pt-5 mt-5 border-t border-border">
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-muted-foreground">
                    Subtotal {totalQty > 0 && `(${totalQty} ${totalQty === 1 ? "ticket" : "tickets"})`}
                  </span>
                  <span className="text-xl font-bold text-accent-blue">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground -mt-2 mb-4">+ £1.00 booking fee</p>
                <button
                  onClick={goCheckout}
                  disabled={totalQty === 0}
                  className="w-full bg-accent-blue text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to checkout
                  <ChevronRight className="size-4" />
                </button>
                <p className="text-[11px] text-center text-muted-foreground mt-3">
                  Secure checkout powered by Tickets Live
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter containerClassName="max-w-5xl px-4" />

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border px-4 py-3 z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">
              {totalQty === 0 ? "From" : "Subtotal"}
            </p>
            <p className="text-xl font-bold text-accent-blue">
              {totalQty === 0
                ? formatPrice(Math.min(...event.ticketTypes.filter((t: TicketType) => t.available && t.price > 0).map((t: TicketType) => t.price)))
                : formatPrice(total)}
            </p>
          </div>
          <button
            onClick={goCheckout}
            disabled={totalQty === 0}
            className="flex-1 bg-accent-blue text-white font-semibold py-3 rounded-xl disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            {totalQty === 0 ? "Select tickets" : "Continue"}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpandableText({ text, className = "" }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <div className="relative">
        <p
          className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${expanded ? "" : "line-clamp-6"}`}
        >
          {text}
        </p>
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-sm font-semibold text-accent-blue hover:opacity-80 transition-opacity cursor-pointer"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 sm:block sm:py-0">
      <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider sm:mb-1">{label}</p>
      <p className="text-base font-semibold text-right sm:text-left">{value}</p>
    </div>
  );
}

function AvailabilityBadge({ status, available }: { status: Fixture["status"]; available: boolean }) {
  if (!available) return null;
  if (status === "selling-fast") {
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-warning">
        <span className="size-1.5 rounded-full bg-warning inline-block" />
        Selling fast
      </span>
    );
  }
  if (status === "sold-out") return null;
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
      <span className="size-1.5 rounded-full bg-success inline-block" />
      Available
    </span>
  );
}

function TicketList({
  tickets,
  qty,
  setQty,
  fixtureStatus,
}: {
  tickets: TicketType[];
  qty: Record<string, number>;
  setQty: (id: string, n: number) => void;
  fixtureStatus: Fixture["status"];
}) {
  return (
    <div className="space-y-5">
      {tickets.map((t) => {
        const n = qty[t.id] || 0;
        return (
          <div key={t.id} className="flex items-start justify-between gap-3">
            <div className={t.available ? "" : "opacity-50"}>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{t.name}</p>
                {t.id === "adult" && <AvailabilityBadge status={fixtureStatus} available={t.available} />}
              </div>
              {t.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
              )}
              <p className="text-base font-bold text-accent-blue mt-1">{formatPrice(t.price)}</p>
            </div>
            {t.available ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setQty(t.id, n - 1)}
                  disabled={n === 0}
                  className="size-8 border border-border rounded-full flex items-center justify-center text-lg disabled:opacity-30 hover:border-accent-blue transition-colors cursor-pointer"
                  aria-label={`Remove ${t.name}`}
                >−</button>
                <span className="w-5 text-center font-bold tabular-nums text-sm">{n}</span>
                <button
                  onClick={() => setQty(t.id, n + 1)}
                  className="size-8 border border-border rounded-full flex items-center justify-center text-lg hover:border-accent-blue transition-colors cursor-pointer"
                  aria-label={`Add ${t.name}`}
                >+</button>
              </div>
            ) : (
              <span className="text-xs font-bold uppercase text-danger shrink-0">Sold out</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
