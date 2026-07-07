import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { events, organisations, formatDate, formatPrice, type Event, type Fixture } from "@/lib/tickets-data";
import heroImg from "@/assets/event-bonfire.jpg";
import { z } from "zod";

export const Route = createFileRoute("/")({
  validateSearch: z.object({ org: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Tickets Live — Find and book live events" },
      { name: "description", content: "Discover concerts, sport, and theatre. Book tickets in seconds with Tickets Live." },
      { property: "og:title", content: "Tickets Live — Find and book live events" },
      { property: "og:description", content: "Discover concerts, sport, and theatre. Book tickets in seconds with Tickets Live." },
    ],
  }),
  component: Index,
});


function Index() {
  const { org } = Route.useSearch();
  const activeOrg = org ? organisations.find(o => o.id === org) : null;
  const filteredEvents = org ? events.filter(ev => ev.orgId === org) : events;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader containerClassName="max-w-5xl px-4 md:px-6" />

      {/* Hero banner */}
      <header className="relative overflow-hidden bg-surface" style={{ height: "435px" }}>
        <img
          src={heroImg}
          alt="Live events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="hero-title-fx leading-tight md:whitespace-nowrap">
            {activeOrg ? `${activeOrg.name} Events` : "Blast from the Past"}
          </h1>
          <p className="mt-4 text-white text-xl whitespace-nowrap">
            {activeOrg ? activeOrg.short : "An Evening of Spectacular Fireworks, Bonfires & Live Entertainment"}
          </p>
          {activeOrg && (
            <Link to="/" className="mt-4 text-sm text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors">
              View all events
            </Link>
          )}
        </div>
      </header>

      {/* Events list */}
      <section className="px-4 md:px-6 max-w-5xl mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {activeOrg ? `${activeOrg.name} events` : "Upcoming events"}
          </h2>
        </div>

        <div className="space-y-4">
          {filteredEvents.map((ev: Event) => {
            const f: Fixture = ev.fixtures[0];
            const availablePrices = ev.ticketTypes.filter(t => t.available && t.price > 0).map(t => t.price);
            const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : null;
            return (
              <Link
                key={ev.id}
                to="/events/$eventId"
                params={{ eventId: ev.id }}
                className="block border border-border rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-[200px_1fr]">
                  <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-surface">
                    <img
                      src={ev.image}
                      alt={ev.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{ev.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatDate(f.date)} · {f.doorsTime} · {ev.venue}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ev.tagline}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      {minPrice !== null && (
                        <div>
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="font-bold text-accent-blue">{formatPrice(minPrice)}</p>
                        </div>
                      )}
                      <span className="ml-auto text-sm font-semibold text-accent-blue">
                        View event →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter containerClassName="max-w-5xl px-4 md:px-6" />
    </div>
  );
}
