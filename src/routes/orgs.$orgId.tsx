import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getOrganisation, getEventsByOrg, formatDayMonth } from "@/lib/tickets-data";

export const Route = createFileRoute("/orgs/$orgId")({
  loader: ({ params }) => {
    const org = getOrganisation(params.orgId);
    if (!org) throw notFound();
    return { org, events: getEventsByOrg(org.id) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.org.name} — Tickets Live` },
          { name: "description", content: loaderData.org.description },
          { property: "og:title", content: `${loaderData.org.name} — Tickets Live` },
          { property: "og:description", content: loaderData.org.description },
        ]
      : [],
  }),
  component: OrgPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Organisation not found</h1>
        <Link to="/" className="text-accent-blue mt-2 inline-block">Back to home</Link>
      </div>
    </div>
  ),
});

function OrgPage() {
  const { org, events } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Branded banner */}
      <header
        className="px-4 py-12 border-b border-border"
        style={{ backgroundColor: `${org.accent}0d` }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div
            className="size-16 rounded-2xl grid place-items-center text-2xl font-bold text-white shadow-lg"
            style={{ backgroundColor: org.accent }}
          >
            {org.initial}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Organisation
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{org.name}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">{org.description}</p>
          </div>
        </div>
      </header>

      {/* Events list */}
      <section className="px-4 max-w-5xl mx-auto py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Upcoming events</h2>
          <span className="text-sm text-muted-foreground">{events.length} events</span>
        </div>

        {events.length === 0 ? (
          <p className="text-muted-foreground">No upcoming events at the moment.</p>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <Link
                key={ev.id}
                to="/events/$eventId"
                params={{ eventId: ev.id }}
                className="block group rounded-2xl overflow-hidden border border-border bg-white hover:shadow-lg transition-all"
              >
                <div className="grid md:grid-cols-[260px_1fr] gap-0">
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-surface">
                    <img
                      src={ev.image}
                      alt={ev.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-accent-blue mb-2">
                        {ev.fixtures.length} {ev.fixtures.length === 1 ? "date" : "dates"} · {ev.venue}
                      </p>
                      <h3 className="font-bold text-xl leading-tight mb-1">{ev.name}</h3>
                      <p className="text-sm text-muted-foreground">{ev.tagline}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ev.fixtures.slice(0, 3).map((f) => (
                        <span
                          key={f.id}
                          className="text-xs px-2.5 py-1 bg-surface border border-border rounded-full font-medium"
                        >
                          {formatDayMonth(f.date)}
                        </span>
                      ))}
                      <span className="ml-auto text-sm font-semibold text-accent-blue group-hover:underline">
                        View event →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
