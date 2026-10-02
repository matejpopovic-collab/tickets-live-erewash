import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, AlertTriangle, CalendarDays, MapPin, Car, Check, Accessibility } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrustBadges } from "@/components/trust-badges";
import {
  getEvent,
  formatDate,
  formatPrice,
  bookingFee,
  BOOKING_FEE_PER_TICKET,
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
        <Link to="/" className="text-accent-blue mt-2 inline-block">
          Back to home
        </Link>
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
    () =>
      event.ticketTypes.reduce((sum: number, t: TicketType) => sum + (qty[t.id] || 0) * t.price, 0),
    [qty, event.ticketTypes],
  );
  const totalQty = useMemo(() => Object.values(qty).reduce((a, b) => a + b, 0), [qty]);
  const fee = bookingFee(event.ticketTypes, qty);

  const entryTickets = event.ticketTypes.filter((t: TicketType) => t.category !== "vehicle");
  const carParks = event.ticketTypes.filter((t: TicketType) => t.category === "vehicle");
  const carQty = carParks.reduce((a: number, t: TicketType) => a + (qty[t.id] || 0), 0);
  const ticketQty = totalQty - carQty;
  const qtyLabel = [
    ticketQty > 0 && `${ticketQty} ${ticketQty === 1 ? "ticket" : "tickets"}`,
    carQty > 0 && `${carQty} ${carQty === 1 ? "car" : "cars"}`,
  ]
    .filter(Boolean)
    .join(" + ");

  const setTicketQty = (id: string, n: number) => {
    const t = event.ticketTypes.find((x: TicketType) => x.id === id);
    const max = Math.min(8, t?.capacity ?? 8);
    setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(max, n)) }));
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

      {/* Hero (full-bleed) */}
      <section className="relative w-full h-[420px] sm:h-[480px] md:h-[560px] overflow-hidden">
        <img
          src={event.heroImage ?? event.image}
          alt={event.name}
          width={1600}
          height={800}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className="relative z-10 h-full max-w-5xl mx-auto px-4 flex flex-col justify-end pb-9 md:pb-14">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-white/85 mb-4">
            <CalendarDays className="size-4 shrink-0" />
            {formatDate(fixture.date)} · Gates {fixture.doorsTime}
            <MapPin className="size-4 shrink-0 ml-1" />
            {event.venue}
          </p>
          <h1>
            <span className="event-hero-title block">{event.name.split(" - ")[0]}</span>
            {event.name.includes(" - ") && (
              <span className="block mt-1.5 text-lg sm:text-2xl font-bold tracking-tight text-white">
                {event.name.split(" - ").slice(1).join(" - ")}
              </span>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-white/80">
            {event.tagline}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 max-w-5xl mx-auto pt-8 md:pt-10">
        <div className="grid md:grid-cols-[1fr_360px] gap-10">
          {/* Left: info */}
          <div>
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
              <p className="text-sm text-muted-foreground mb-4">
                {event.venue}, {event.address}
              </p>
              <div className="w-full aspect-[2/1] bg-surface border border-border rounded-xl overflow-hidden">
                <img
                  src={mapImg}
                  alt={`Map of ${event.venue}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Parking */}
            {carParks.length > 0 && (
              <ParkingSection carParks={carParks} qty={qty} setQty={setTicketQty} />
            )}

            {/* Important information */}
            <div className="mb-8 bg-warning/10 border border-warning/30 rounded-xl p-5">
              <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning shrink-0" />
                Important information
              </h2>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>Please do not bring your own fireworks.</li>
                <li>Sparklers are not permitted.</li>
                <li>Gates open 5pm · bonfire lit 6.30pm · fireworks 7.30pm (30 minutes).</li>
                <li>Buy online by 4 November for the discounted price.</li>
                <li>If car parks are full, please see attached map for alternative parking.</li>
              </ul>
            </div>

            {/* Mobile ticket section */}
            <div className="md:hidden mb-10">
              <h2 className="font-semibold text-base mb-1">Tickets</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Discounted online prices until 4 Nov · full price from 5 Nov
              </p>
              <TicketList
                tickets={entryTickets}
                qty={qty}
                setQty={setTicketQty}
                fixtureStatus={fixture.status}
              />
              {carParks.length > 0 && (
                <div className="mt-6">
                  <ParkingSummary carParks={carParks} qty={qty} />
                </div>
              )}
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
                      <ChevronDown
                        className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <p className="text-sm text-muted-foreground pb-4 max-w-prose">{f.a}</p>
                    )}
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
              <p className="text-xs text-muted-foreground mb-1">
                {formatDate(fixture.date)} · Gates {fixture.doorsTime}
              </p>
              <p className="text-xs text-muted-foreground mb-5">
                Discounted online prices until 4 Nov · full price from 5 Nov
              </p>
              <TicketList
                tickets={entryTickets}
                qty={qty}
                setQty={setTicketQty}
                fixtureStatus={fixture.status}
              />
              {carParks.length > 0 && (
                <div className="mt-5">
                  <ParkingSummary carParks={carParks} qty={qty} />
                </div>
              )}
              <div className="pt-5 mt-5 border-t border-border">
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-muted-foreground">
                    Subtotal {totalQty > 0 && `(${qtyLabel})`}
                  </span>
                  <span className="text-xl font-bold text-accent-blue">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground -mt-2 mb-4">
                  {fee > 0
                    ? `+ ${formatPrice(fee)} booking fee (${formatPrice(BOOKING_FEE_PER_TICKET)} per ticket)`
                    : `+ ${formatPrice(BOOKING_FEE_PER_TICKET)} booking fee per ticket · none on free tickets or parking`}
                </p>
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

      <TrustBadges className="mt-4" />

      <SiteFooter containerClassName="max-w-5xl px-4" />

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border px-4 py-3 z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">
              {totalQty === 0 ? "From (online)" : "Subtotal"}
            </p>
            <p className="text-xl font-bold text-accent-blue">
              {totalQty === 0
                ? formatPrice(
                    Math.min(
                      ...event.ticketTypes
                        .filter((t: TicketType) => t.available && t.price > 0)
                        .map((t: TicketType) => t.price),
                    ),
                  )
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

function scrollToParking() {
  document.getElementById("parking")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ParkingSection({
  carParks,
  qty,
  setQty,
}: {
  carParks: TicketType[];
  qty: Record<string, number>;
  setQty: (id: string, n: number) => void;
}) {
  return (
    <section id="parking" className="mb-8 scroll-mt-24">
      <div className="mb-4">
        <div>
          <h2 className="font-semibold text-base mb-1 flex items-center gap-2">
            <Car className="size-4 text-accent-blue" />
            Pre-book parking
          </h2>
          <p className="text-sm text-muted-foreground">
            Spaces are limited, so book your car in with your tickets.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {carParks.filter((c) => !c.blueBadge).map((c, i) => {
          const n = qty[c.id] || 0;
          const max = Math.min(8, c.capacity ?? 8);
          const selected = n > 0;
          return (
            <div
              key={c.id}
              className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                selected
                  ? "border-accent-blue bg-accent-blue/5 shadow-[0_0_0_3px] shadow-accent-blue/10"
                  : "border-border bg-white hover:border-accent-blue/40 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`size-10 rounded-xl flex items-center justify-center text-base font-bold transition-colors ${
                      selected ? "bg-accent-blue text-white" : "bg-surface border border-border text-foreground"
                    }`}
                  >
                    {selected ? <Check className="size-5" /> : "P"}
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground">
                      {c.description ?? `Car park ${i + 1}`}
                    </p>
                    <p className="font-semibold text-sm leading-snug">{c.name}</p>
                  </div>
                </div>
              </div>

              {c.capacity !== undefined && (
                <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning">
                  <span className="size-1.5 rounded-full bg-warning" />
                  Only {c.capacity} spaces
                </p>
              )}

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                <p className="text-sm">
                  <span className="font-bold text-accent-blue">{formatPrice(c.price)}</span>
                  <span className="text-muted-foreground"> per car</span>
                </p>
                {c.available ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(c.id, n - 1)}
                      disabled={n === 0}
                      className="size-8 border border-border bg-white rounded-full flex items-center justify-center text-lg disabled:opacity-30 hover:border-accent-blue transition-colors cursor-pointer"
                      aria-label={`Remove a car from ${c.name}`}
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold tabular-nums text-sm">{n}</span>
                    <button
                      onClick={() => setQty(c.id, n + 1)}
                      disabled={n >= max}
                      className="size-8 border border-border bg-white rounded-full flex items-center justify-center text-lg disabled:opacity-30 hover:border-accent-blue transition-colors cursor-pointer"
                      aria-label={`Add a car to ${c.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold uppercase text-danger">Full</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {carParks
        .filter((c) => c.blueBadge)
        .map((c) => {
          const n = qty[c.id] || 0;
          const max = Math.min(8, c.capacity ?? 8);
          const selected = n > 0;
          return (
            <div
              key={c.id}
              className={`mt-3 rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                selected
                  ? "border-[#1d4ed8] bg-[#1d4ed8]/5 shadow-[0_0_0_3px] shadow-[#1d4ed8]/10"
                  : "border-[#1d4ed8]/20 bg-[#1d4ed8]/5 hover:border-[#1d4ed8]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="size-10 shrink-0 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center">
                  {selected ? <Check className="size-5" /> : <Accessibility className="size-5" />}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm flex flex-wrap items-center gap-2">
                    {c.name}
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                      Free
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Free parking for disabled users only. Please have your blue badge upon arrival
                    for access and park as directed by staff. Please note there are a limited
                    number of parking spaces.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-[#1d4ed8]/15">
                <p className="text-sm">
                  <span className="font-bold text-success">Free</span>
                  <span className="text-muted-foreground"> · blue badge required</span>
                </p>
                {c.available ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(c.id, n - 1)}
                      disabled={n === 0}
                      className="size-8 border border-border bg-white rounded-full flex items-center justify-center text-lg disabled:opacity-30 hover:border-[#1d4ed8] transition-colors cursor-pointer"
                      aria-label={`Remove a car from ${c.name}`}
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold tabular-nums text-sm">{n}</span>
                    <button
                      onClick={() => setQty(c.id, n + 1)}
                      disabled={n >= max}
                      className="size-8 border border-border bg-white rounded-full flex items-center justify-center text-lg disabled:opacity-30 hover:border-[#1d4ed8] transition-colors cursor-pointer"
                      aria-label={`Add a car to ${c.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold uppercase text-danger">Full</span>
                )}
              </div>
            </div>
          );
        })}
    </section>
  );
}

function ParkingSummary({ carParks, qty }: { carParks: TicketType[]; qty: Record<string, number> }) {
  const chosen = carParks.filter((c) => (qty[c.id] || 0) > 0);
  const from = Math.min(...carParks.filter((c) => c.price > 0).map((c) => c.price));

  if (chosen.length === 0) {
    return (
      <button
        onClick={scrollToParking}
        className="group w-full flex items-center gap-3 rounded-xl border border-dashed border-border px-3.5 py-3 text-left hover:border-accent-blue hover:bg-accent-blue/5 transition-colors cursor-pointer"
      >
        <span className="size-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 group-hover:border-accent-blue/40">
          <Car className="size-4 text-accent-blue" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold">Add parking</span>
          <span className="block text-xs text-muted-foreground">
            {formatPrice(from)} per car · free blue badge parking
          </span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground group-hover:text-accent-blue" />
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-accent-blue/5 border border-accent-blue/20 px-3.5 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Car className="size-4 text-accent-blue" />
          Parking
        </p>
        <button
          onClick={scrollToParking}
          className="text-xs font-semibold text-accent-blue hover:opacity-80 cursor-pointer"
        >
          Edit
        </button>
      </div>
      <ul className="space-y-1">
        {chosen.map((c) => (
          <li key={c.id} className="flex justify-between gap-3 text-xs">
            <span className="text-muted-foreground">
              {qty[c.id]} × {c.name.replace(/ Car Park$/, "")}
            </span>
            <span className="font-semibold tabular-nums">
              {c.price === 0 ? "Free" : formatPrice((qty[c.id] || 0) * c.price)}
            </span>
          </li>
        ))}
      </ul>
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
      <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider sm:mb-1">
        {label}
      </p>
      <p className="text-base font-semibold text-right sm:text-left">{value}</p>
    </div>
  );
}

function AvailabilityBadge({
  status,
  available,
}: {
  status: Fixture["status"];
  available: boolean;
}) {
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
                {t.id === "adult" && (
                  <AvailabilityBadge status={fixtureStatus} available={t.available} />
                )}
              </div>
              {t.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
              )}
              <p className="text-base font-bold text-accent-blue mt-1">
                {t.price === 0 ? "Free" : formatPrice(t.price)}
                {t.gatePrice !== undefined && t.gatePrice > t.price && (
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {formatPrice(t.gatePrice)} on the night
                  </span>
                )}
              </p>
            </div>
            {t.available ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setQty(t.id, n - 1)}
                  disabled={n === 0}
                  className="size-8 border border-border rounded-full flex items-center justify-center text-lg disabled:opacity-30 hover:border-accent-blue transition-colors cursor-pointer"
                  aria-label={`Remove ${t.name}`}
                >
                  −
                </button>
                <span className="w-5 text-center font-bold tabular-nums text-sm">{n}</span>
                <button
                  onClick={() => setQty(t.id, n + 1)}
                  className="size-8 border border-border rounded-full flex items-center justify-center text-lg hover:border-accent-blue transition-colors cursor-pointer"
                  aria-label={`Add ${t.name}`}
                >
                  +
                </button>
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
