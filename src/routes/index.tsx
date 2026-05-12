import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { organisations, events, formatDayMonth } from "@/lib/tickets-data";

export const Route = createFileRoute("/")({
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
  return (
    <div className="min-h-screen bg-white text-brand">
      <SiteHeader />

      {/* Hero / search */}
      <header className="py-12 px-4 max-w-5xl mx-auto">
        <p className="text-sm font-medium text-accent-blue mb-3">Live, simply.</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Experience it live.</h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Browse trusted organisations, pick your event, and check out in under a minute.
        </p>
        <div className="relative">
          <input
            type="search"
            placeholder="Search events, venues, or organisations…"
            className="w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </div>
      </header>

      {/* Organisations */}
      <section className="px-4 max-w-5xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Top organisations</h2>
          <span className="text-sm text-muted-foreground">{organisations.length} listed</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {organisations.map((org) => (
            <Link
              key={org.id}
              to="/orgs/$orgId"
              params={{ orgId: org.id }}
              className="group"
            >
              <div className="aspect-square bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all group-hover:shadow-lg group-hover:border-accent-blue/30 group-hover:-translate-y-0.5">
                <div className={`size-12 rounded-full ${org.swatch} mb-3 flex items-center justify-center text-base font-bold text-brand`}>
                  {org.initial}
                </div>
                <span className="text-sm font-semibold leading-tight">{org.name}</span>
                <span className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{org.short}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured events */}
      <section className="px-4 max-w-5xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Featured events</h2>
          <span className="text-sm text-muted-foreground">Updated today</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {events.map((ev) => (
            <Link
              key={ev.id}
              to="/events/$eventId"
              params={{ eventId: ev.id }}
              className="group rounded-2xl overflow-hidden border border-border bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface">
                <img
                  src={ev.image}
                  alt={ev.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent-blue mb-2">
                  {formatDayMonth(ev.fixtures[0].date)} · {ev.venue}
                </p>
                <h3 className="font-bold text-base leading-tight mb-1">{ev.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{ev.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
