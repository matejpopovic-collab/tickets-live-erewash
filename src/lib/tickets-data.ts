import concertImg from "@/assets/event-concert.jpg";
import footballImg from "@/assets/event-football.jpg";
import theatreImg from "@/assets/event-theatre.jpg";

export type TicketType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  category?: "standard" | "vip" | "vehicle";
};

export type Fixture = {
  id: string;
  date: string;       // ISO
  doorsTime: string;  // e.g. "19:00"
  status: "available" | "selling-fast" | "sold-out";
};

export type Event = {
  id: string;
  orgId: string;
  name: string;
  tagline: string;
  description: string;
  venue: string;
  address: string;
  image: string;
  accent: string; // hex
  fixtures: Fixture[];
  ticketTypes: TicketType[];
  faq: { q: string; a: string }[];
  terms: string;
};

export type Organisation = {
  id: string;
  name: string;
  short: string;
  initial: string;
  swatch: string;     // tailwind bg class for circle
  accent: string;     // hex
  description: string;
  location?: string;
};

export const organisations: Organisation[] = [
  { id: "apex-arenas", name: "Apex Arenas", short: "Live music & arena tours", initial: "A", swatch: "bg-blue-100", accent: "#2563eb", description: "World-class arena promoter bringing global tours to UK stages.", location: "London, UK" },
  { id: "grand-theatre", name: "Grand Theatre", short: "Theatre & performing arts", initial: "G", swatch: "bg-rose-100", accent: "#e11d48", description: "Award-winning theatre productions in the heart of the West End.", location: "London, UK" },
  { id: "city-fc", name: "City FC", short: "Football fixtures & cup ties", initial: "C", swatch: "bg-emerald-100", accent: "#059669", description: "Official ticketing for City FC home fixtures and cup matches.", location: "Manchester, UK" },
  { id: "vibe-records", name: "Vibe Records", short: "Festivals & label nights", initial: "V", swatch: "bg-amber-100", accent: "#d97706", description: "Independent label hosting festivals and intimate club shows.", location: "Bristol, UK" },
  { id: "art-basel", name: "Art Basel UK", short: "Exhibitions & previews", initial: "B", swatch: "bg-purple-100", accent: "#7c3aed", description: "Contemporary art fairs, gallery previews and collector events.", location: "London, UK" },
];

export const events: Event[] = [
  {
    id: "neon-horizons",
    orgId: "apex-arenas",
    name: "Neon Horizons: World Tour 2026",
    tagline: "An immersive 360° stadium experience",
    description:
      "Experience the multi-platinum artist in an immersive 360-degree stadium performance that redefines what a live show can be. The stage sits at the centre of the arena, surrounded on every side, so wherever you're seated you're never more than a few rows from the action. Featuring a roster of special guests and a state-of-the-art visual production, the evening moves through the artist's biggest anthems alongside brand-new material from the forthcoming record. Expect a fully synchronised light rig, a 360-degree projection canopy and a sound design tuned specifically to the venue's acoustics. Doors open early so you can explore the concourse, grab merchandise from the exclusive tour pop-up and find your seats before the support act takes the stage. This is the only UK date on the world tour, and demand is expected to be exceptional — once a tier sells out it will not be restocked. Whether you're standing on the floor or seated in the upper tiers, every ticket includes access to the full production from the opening number to the encore.",
    venue: "City Arena",
    address: "Stadium Way, London SE1 9AL",
    image: concertImg,
    accent: "#2563eb",
    fixtures: [
      { id: "nh-1", date: "2026-10-12T19:00:00Z", doorsTime: "19:00", status: "selling-fast" },
      { id: "nh-2", date: "2026-10-13T18:30:00Z", doorsTime: "18:30", status: "available" },
      { id: "nh-3", date: "2026-10-14T18:30:00Z", doorsTime: "18:30", status: "available" },
    ],
    ticketTypes: [
      { id: "ga", name: "General Admission", description: "Standing, unreserved", price: 85, available: true, category: "standard" },
      { id: "seated", name: "Seated Tier 2", description: "Reserved seating", price: 120, available: true, category: "standard" },
      { id: "vip", name: "VIP Pitch Side", description: "Front of stage + lounge access", price: 245, available: false, category: "vip" },
      { id: "park", name: "On-site Parking", description: "Per vehicle", price: 18, available: true, category: "vehicle" },
    ],
    faq: [
      { q: "What time do doors open?", a: "Doors open at the time listed for each fixture. Plan to arrive 30–45 minutes early for security." },
      { q: "Are tickets refundable?", a: "Refunds are available up to 7 days before the event. Booking fees are non-refundable." },
      { q: "Is the venue accessible?", a: "Yes. Step-free access, accessible toilets and BSL interpretation are available — contact us in advance." },
    ],
    terms: "All sales are final once tickets are issued, except where required by law. Tickets are personal to the buyer and may not be resold above face value. By purchasing you agree to the venue's conditions of entry.",
  },
  {
    id: "city-fc-vs-united",
    orgId: "city-fc",
    name: "City FC vs United Rovers",
    tagline: "Premier League — Matchday 12",
    description:
      "A heavyweight derby fixture that always defines the season. City FC welcome United Rovers to the Riverside Stadium for a Matchday 12 clash with a place at the top of the table on the line. These two sides have traded blows for over a century, and the atmosphere on derby day is unlike anything else in the league. Choose from a range of areas to suit how you like to watch the game: stand with the most vocal supporters in the Home End, bring the whole family to the dedicated Family Stand, or treat yourself to padded seating and matchday dining in a Hospitality Box. Supporter coaches run round-trip from the city centre, so you can leave the car at home and travel with fellow fans. Gates open ninety minutes before kick-off with live entertainment, food stalls and the chance to watch the warm-up pitchside. Tickets are available across multiple matchdays this season, but derby fixtures historically sell out within hours of release — secure your seats early to avoid disappointment.",
    venue: "Riverside Stadium",
    address: "Quay Road, Manchester M3 4LQ",
    image: footballImg,
    accent: "#059669",
    fixtures: [
      { id: "cf-1", date: "2026-09-21T15:00:00Z", doorsTime: "13:30", status: "selling-fast" },
      { id: "cf-2", date: "2026-10-05T15:00:00Z", doorsTime: "13:30", status: "available" },
      { id: "cf-3", date: "2026-11-02T17:30:00Z", doorsTime: "16:00", status: "available" },
    ],
    ticketTypes: [
      { id: "home-end", name: "Home End", description: "Standing terrace with City supporters", price: 38, available: true, category: "standard" },
      { id: "family", name: "Family Stand", description: "Two adults + two under-16s", price: 92, available: true, category: "standard" },
      { id: "hospitality", name: "Hospitality Box", description: "Padded seating + dining", price: 185, available: true, category: "vip" },
      { id: "coach", name: "Supporter Coach", description: "Round-trip from city centre", price: 12, available: true, category: "vehicle" },
    ],
    faq: [
      { q: "Can I bring a bag?", a: "Only small bags (A4 or smaller) are permitted. Larger bags must be checked into the cloakroom." },
      { q: "Are away fans separated?", a: "Yes — away supporters are seated in the South Stand with dedicated entry." },
    ],
    terms: "Tickets are issued under the ground regulations of the Riverside Stadium. Persistent standing in seated areas may result in ejection.",
  },
  {
    id: "midnight-prelude",
    orgId: "grand-theatre",
    name: "Midnight Prelude",
    tagline: "A new play by Eleanor Vance",
    description:
      "A haunting new chamber drama from acclaimed playwright Eleanor Vance, performed in the Grand Theatre's intimate Studio space. Set over a single sleepless night, the play follows three estranged siblings as they gather in their late mother's house to divide what remains — and unearth the secrets she kept from each of them. Vance's spare, lyrical writing has drawn comparisons to the very best of contemporary British theatre, and this world premiere production is staged just feet from the audience, making every whispered confession feel almost unbearably close. The ninety-five-minute piece runs without an interval, holding its tension from the first line to the last. With only six performances in this strictly limited run and the Studio seating fewer than two hundred, this is a rare chance to see major new writing in the most personal of settings. Stalls, Dress Circle and a small number of restricted-view seats are available, and we recommend booking early as previous Vance productions have sold out well in advance.",
    venue: "Grand Theatre Studio",
    address: "37 Drury Lane, London WC2B 5LZ",
    image: theatreImg,
    accent: "#e11d48",
    fixtures: [
      { id: "mp-1", date: "2026-09-08T19:30:00Z", doorsTime: "19:00", status: "available" },
      { id: "mp-2", date: "2026-09-09T19:30:00Z", doorsTime: "19:00", status: "selling-fast" },
      { id: "mp-3", date: "2026-09-10T14:30:00Z", doorsTime: "14:00", status: "available" },
    ],
    ticketTypes: [
      { id: "stalls", name: "Stalls", description: "Best view of the stage", price: 55, available: true, category: "standard" },
      { id: "circle", name: "Dress Circle", description: "Elevated tier seating", price: 42, available: true, category: "standard" },
      { id: "restricted", name: "Restricted View", description: "Side seating, partial view", price: 22, available: true, category: "standard" },
    ],
    faq: [
      { q: "What's the running time?", a: "Approximately 95 minutes with no interval." },
      { q: "Is there an age restriction?", a: "Recommended for ages 14+ due to themes and language." },
    ],
    terms: "Latecomers will be admitted only at a suitable break in the performance, at the discretion of the management.",
  },
];

export const getOrganisation = (id: string) => organisations.find((o) => o.id === id);
export const getEvent = (id: string) => events.find((e) => e.id === id);
export const getEventsByOrg = (orgId: string) => events.filter((e) => e.orgId === orgId);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export const formatDayMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
