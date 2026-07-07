import bonfireStageImg from "@/assets/event-bonfire-stage.jpg";
import erewashCrest from "@/assets/erewash-crest.png";

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
  heroImage?: string;
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
    id: "erewash",
    orgId: "apex-arenas",
    name: "Blast from the Past - Bonfire and Firework Display",
    tagline: "An Evening of Spectacular Fireworks, Bonfires & Live Entertainment",
    description:
      "Join us for our highly anticipated 'Blast from the Past' event, featuring a traditional bonfire and a thrilling fireworks display. Gates open at 5pm, the bonfire is lit from 6.30pm, and fireworks light up the sky from 7.30pm. Bring the whole family down to West Park for food stalls, live entertainment and one of the biggest bonfire nights in the area.",
    venue: "West Park",
    address: "West Park, Long Eaton",
    image: erewashCrest,
    heroImage: bonfireStageImg,
    accent: "#ea580c",
    fixtures: [
      { id: "nh-1", date: "2026-11-05T17:00:00Z", doorsTime: "17:00", status: "selling-fast" },
    ],
    ticketTypes: [
      { id: "adult", name: "Adult", price: 8, available: true, category: "standard" },
      { id: "concession", name: "16 & Under / Over 60", price: 5, available: true, category: "standard" },
      { id: "family", name: "Family", description: "2 adults & up to 3 children", price: 20, available: true, category: "standard" },
      { id: "child", name: "Child (5 & under)", description: "Free entry", price: 0, available: true, category: "standard" },
    ],
    faq: [
      { q: "What time do doors open?", a: "Gates open at 5pm. The bonfire is lit from 6.30pm and fireworks begin at 7.30pm." },
      { q: "Are tickets refundable?", a: "Refunds are available up to 7 days before the event. Booking fees are non-refundable." },
      { q: "Is the venue accessible?", a: "Yes. Step-free access, accessible toilets and BSL interpretation are available — contact us in advance." },
    ],
    terms: "Online discounted tickets are available until 12 noon on the day of the event, after which all tickets are full price. Tickets are personal to the buyer and may not be resold above face value.",
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
