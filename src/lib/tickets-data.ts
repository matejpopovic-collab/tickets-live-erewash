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
};

export const organisations: Organisation[] = [
  { id: "apex-arenas", name: "Apex Arenas", short: "Live music & arena tours", initial: "A", swatch: "bg-blue-100", accent: "#2563eb", description: "World-class arena promoter bringing global tours to UK stages." },
  { id: "grand-theatre", name: "Grand Theatre", short: "Theatre & performing arts", initial: "G", swatch: "bg-rose-100", accent: "#e11d48", description: "Award-winning theatre productions in the heart of the West End." },
  { id: "city-fc", name: "City FC", short: "Football fixtures & cup ties", initial: "C", swatch: "bg-emerald-100", accent: "#059669", description: "Official ticketing for City FC home fixtures and cup matches." },
  { id: "vibe-records", name: "Vibe Records", short: "Festivals & label nights", initial: "V", swatch: "bg-amber-100", accent: "#d97706", description: "Independent label hosting festivals and intimate club shows." },
  { id: "art-basel", name: "Art Basel UK", short: "Exhibitions & previews", initial: "B", swatch: "bg-purple-100", accent: "#7c3aed", description: "Contemporary art fairs, gallery previews and collector events." },
];

export const events: Event[] = [
  {
    id: "neon-horizons",
    orgId: "apex-arenas",
    name: "Neon Horizons: World Tour 2026",
    tagline: "An immersive 360° stadium experience",
    description:
      "Experience the multi-platinum artist in an immersive 360-degree stadium performance. Featuring special guests and state-of-the-art visual production.",
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
      "A heavyweight derby fixture in the league. Choose home end seating, family stand or hospitality across multiple matchdays this season.",
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
      "A haunting new chamber drama performed in the Grand Theatre's intimate Studio space. Limited run — six performances only.",
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
