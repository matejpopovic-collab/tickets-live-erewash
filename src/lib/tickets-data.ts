import bonfireStageImg from "@/assets/event-bonfire-stage.jpg";
import erewashCrest from "@/assets/erewash-crest.png";

export type TicketType = {
  id: string;
  name: string;
  description?: string;
  price: number;      // prepaid / online price
  gatePrice?: number; // price when bought on the night
  available: boolean;
  category?: "standard" | "vip" | "vehicle";
  capacity?: number;  // total spaces available, if limited
  blueBadge?: boolean; // free disabled-access parking (blue badge holders only)
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
    name: "The Greatest Show in the Sky - Bonfire and Firework Display",
    tagline: "Fairground rides, a roaring bonfire and a dazzling 30-minute fireworks display",
    description:
      "Erewash Borough Council presents The Greatest Show in the Sky - a magical Bonfire Night at West Park, Long Eaton. Gates open at 5pm, the bonfire is lit from 6.30pm, and a dazzling 30-minute fireworks display begins at 7.30pm.\n\nBring the whole family for fairground rides and delicious food stalls with our great family value tickets.\n\nBook online in advance to pay the discounted price; from 5 November all tickets are sold at the full on-the-night price. Wrap up warm and join us for a night of fun, laughter and community spirit at West Park.",
    venue: "West Park",
    address: "Wilsthorpe Road, Long Eaton NG10 4AA",
    image: erewashCrest,
    heroImage: bonfireStageImg,
    accent: "#ea580c",
    fixtures: [
      { id: "nh-1", date: "2026-11-05T17:00:00Z", doorsTime: "17:00", status: "selling-fast" },
    ],
    ticketTypes: [
      { id: "adult", name: "Adult", price: 8, gatePrice: 10, available: true, category: "standard" },
      { id: "concession", name: "16 & Under / Over 60", price: 5, gatePrice: 7, available: true, category: "standard" },
      { id: "family", name: "Family", description: "2 adults & up to 3 children", price: 20, gatePrice: 25, available: true, category: "standard" },
      { id: "child", name: "Child (5 & under)", description: "Free entry", price: 0, gatePrice: 0, available: true, category: "standard" },
      { id: "parking-leisure-centre", name: "West Park Leisure Centre Car Park", description: "Car park 1", price: 5, available: true, category: "vehicle", capacity: 150 },
      { id: "parking-blue-badge", name: "Blue Badge Parking", description: "Disabled users only", price: 0, available: true, category: "vehicle", blueBadge: true },
      { id: "parking-events-field", name: "Events Field Car Park", description: "Car park 2", price: 5, available: true, category: "vehicle", capacity: 166 },
    ],
    faq: [
      { q: "What time do gates open?", a: "Gates open at 5pm. The bonfire is lit from 6.30pm and the 30-minute fireworks display begins at 7.30pm." },
      { q: "Why are tickets cheaper online?", a: "Online and prepaid tickets are discounted: \u00a38 adult, \u00a35 for 16 and under or over 60, and \u00a320 family. You can buy at these prices up to and including 4 November. From 5 November onward all tickets are full price - \u00a310 adult, \u00a37 concession and \u00a325 family. Children aged 5 and under go free either way." },
      { q: "What is there to do besides the fireworks?", a: "There are fairground rides and food and drink stalls throughout the evening, plus the bonfire itself from 6.30pm." },
      { q: "Are tickets refundable?", a: "Refunds are available up to 7 days before the event. Booking fees are non-refundable." },
      { q: "Is the venue accessible?", a: "Yes. Step-free access and accessible toilets are available - contact us in advance. Disabled access - with viewing area and free car parking spaces at West Park Leisure Centre's Car Park. Please have your blue badge to gain access; please note there are a limited number of spaces." },
    ],
    terms: "Discounted prepaid and online tickets are available up to and including 4 November 2026. From 5 November onward, all tickets are sold at the full on-the-night price. Children aged 5 and under are admitted free. Tickets are personal to the buyer and may not be resold above face value.",
  },
];

export const getOrganisation = (id: string) => organisations.find((o) => o.id === id);
export const getEvent = (id: string) => events.find((e) => e.id === id);
export const getEventsByOrg = (orgId: string) => events.filter((e) => e.orgId === orgId);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export const formatDayMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// £1.00 booking fee per paid ticket, including paid parking. No fee on free tickets (e.g. Child 5 & under).
export const BOOKING_FEE_PER_TICKET = 1;
export const bookingFee = (tickets: TicketType[], qty: Record<string, number | string | undefined>) =>
  tickets.reduce((sum, t) => sum + (t.price > 0 ? Number(qty[t.id] || 0) * BOOKING_FEE_PER_TICKET : 0), 0);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
