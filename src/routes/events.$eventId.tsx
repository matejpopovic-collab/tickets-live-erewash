import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getEvent,
  getOrganisation,
  formatDate,
  formatDayMonth,
  formatPrice,
  type TicketType,
} from "@/lib/tickets-data";
import mapImg from "@/assets/venue-map.jpg";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const event = getEvent(params.eventId);
    if (!event) throw notFound();
    const org = getOrganisation(event.orgId)!;
    return { event, org };
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
  const { event, org } = Route.useLoaderData();
  const navigate = useNavigate();
  const [fixtureId, setFixtureId] = useState(event.fixtures[0].id);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fixture = event.fixtures.find((f) => f.id === fixtureId)!;
  const total = useMemo(
    () => event.ticketTypes.reduce((sum, t) => sum + (qty[t.id] || 0) * t.price, 0),
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
      <SiteHeader />

      {/* Branded thin bar */}
      <div className="px-4 py-2 border-b border-border" style={{ backgroundColor: `${event.accent}0d` }}>
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to="/orgs/$orgId"
            params={{ orgId: org.id }}
            className="text-muted-foreground hover:text-foreground"
          >
            {org.name}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium truncate">{event.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 max-w-5xl mx-auto pt-8">
        <div className="rounded-3xl overflow-hidden border border-border aspect-[16/8] bg-surface">
          <img
            src={event.image}
            alt={event.name}
            width={1600}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-10 mt-8">
          {/* Left: info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                style={{ backgroundColor: `${event.accent}1a`, color: event.accent }}
              >
                {fixture.status === "selling-fast" ? "Selling fast" : fixture.status === "sold-out" ? "Sold out" : "On sale"}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {event.venue}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{event.name}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">{event.tagline}</p>

            {/* Key facts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-border mb-10">
              <Fact label="Date" value={formatDate(fixture.date)} />
              <Fact label="Doors" value={fixture.doorsTime} />
              <Fact label="Venue" value={event.venue} />
            </div>

            <h2 className="font-semibold text-lg mb-4">About this event</h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl">{event.description}</p>

            {/* Fixtures */}
            <h2 className="font-semibold text-lg mb-4">Choose a date</h2>
            <div className="space-y-3 mb-12">
              {event.fixtures.map((f) => {
                const active = f.id === fixtureId;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFixtureId(f.id)}
                    disabled={f.status === "sold-out"}
                    className={`w-full text-left flex items-center justify-between p-4 bg-white border rounded-xl transition-all ${
                      active
                        ? "border-accent-blue ring-2 ring-accent-blue/20"
                        : "border-border hover:border-accent-blue/50"
                    } ${f.status === "sold-out" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div>
                      <p className="font-bold">{formatDate(f.date)}</p>
                      <p className="text-sm text-muted-foreground">
                        Doors: {f.doorsTime} · {event.venue}
                      </p>
                    </div>
                    {f.status === "sold-out" ? (
                      <span className="text-xs font-bold uppercase text-danger">Sold out</span>
                    ) : f.status === "selling-fast" ? (
                      <span className="text-xs font-bold uppercase" style={{ color: event.accent }}>
                        Few left
                      </span>
                    ) : (
                      <span className={`text-xs font-bold uppercase ${active ? "text-accent-blue" : "text-muted-foreground"}`}>
                        {active ? "Selected" : "Select"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile ticket section */}
            <div className="md:hidden mb-12">
              <h2 className="font-semibold text-lg mb-4">Tickets</h2>
              <TicketList tickets={event.ticketTypes} qty={qty} setQty={setTicketQty} />
            </div>

            {/* FAQ */}
            <h2 className="font-semibold text-lg mb-4">Frequently asked</h2>
            <div className="border-y border-border divide-y divide-border mb-10">
              {event.faq.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="font-medium">{f.q}</span>
                      <span className={`text-xl font-light transition-transform ${open ? "rotate-45" : ""}`}>+</span>
                    </button>
                    {open && <p className="text-sm text-muted-foreground pb-4 max-w-prose">{f.a}</p>}
                  </div>
                );
              })}
            </div>

            {/* Terms */}
            <details className="border border-border rounded-xl p-4 bg-surface">
              <summary className="font-medium text-sm cursor-pointer">Terms & conditions</summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{event.terms}</p>
            </details>
          </div>

          {/* Right: sticky ticket box (desktop) */}
          <aside className="hidden md:block">
            <div className="sticky top-24 bg-white border border-border rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-xl mb-1">Select tickets</h3>
              <p className="text-xs text-muted-foreground mb-5">{formatDate(fixture.date)} · {fixture.doorsTime}</p>
              <TicketList tickets={event.ticketTypes} qty={qty} setQty={setTicketQty} />
              <div className="pt-5 mt-5 border-t border-border">
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-muted-foreground">
                    Subtotal {totalQty > 0 && `(${totalQty} ${totalQty === 1 ? "ticket" : "tickets"})`}
                  </span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={goCheckout}
                  disabled={totalQty === 0}
                  className="w-full bg-brand text-brand-foreground font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to checkout
                </button>
                <p className="text-[11px] text-center text-muted-foreground mt-4">
                  Secure checkout powered by Tickets Live
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Venue map */}
      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">Location</h3>
        <p className="text-muted-foreground mb-8">{event.venue}, {event.address}</p>
        <div className="w-full aspect-[2/1] bg-surface border border-border rounded-2xl overflow-hidden">
          <img src={mapImg} alt={`Map of ${event.venue}`} loading="lazy" className="w-full h-full object-cover" />
        </div>
      </section>

      <SiteFooter />

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border px-4 py-3 z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">
              {totalQty === 0 ? "From" : "Subtotal"}
            </p>
            <p className="text-lg font-bold">
              {totalQty === 0
                ? formatPrice(Math.min(...event.ticketTypes.filter((t) => t.available).map((t) => t.price)))
                : formatPrice(total)}
            </p>
          </div>
          <button
            onClick={goCheckout}
            disabled={totalQty === 0}
            className="flex-1 bg-brand text-brand-foreground font-bold py-3 rounded-xl disabled:opacity-40"
          >
            {totalQty === 0 ? "Select tickets" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function TicketList({
  tickets,
  qty,
  setQty,
}: {
  tickets: TicketType[];
  qty: Record<string, number>;
  setQty: (id: string, n: number) => void;
}) {
  return (
    <div className="space-y-5">
      {tickets.map((t) => {
        const n = qty[t.id] || 0;
        return (
          <div key={t.id} className="flex items-start justify-between gap-3">
            <div className={t.available ? "" : "opacity-50"}>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{t.name}</p>
                {t.category === "vehicle" && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                    Vehicle
                  </span>
                )}
                {t.category === "vip" && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent-blue/10 text-accent-blue">
                    VIP
                  </span>
                )}
              </div>
              {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
              <p className="text-sm font-medium mt-1">{formatPrice(t.price)}</p>
            </div>
            {t.available ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setQty(t.id, n - 1)}
                  disabled={n === 0}
                  className="size-8 border border-border rounded-full flex items-center justify-center text-lg disabled:opacity-30 hover:border-accent-blue"
                  aria-label={`Remove ${t.name}`}
                >−</button>
                <span className="w-5 text-center font-bold tabular-nums">{n}</span>
                <button
                  onClick={() => setQty(t.id, n + 1)}
                  className="size-8 border border-border rounded-full flex items-center justify-center text-lg hover:border-accent-blue"
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
