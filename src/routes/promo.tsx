import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Zap,
  Ticket,
  BarChart3,
  ShoppingBag,
  Lock,
  Clock,
  Mail,
  Users,
  TrendingUp,
  RefreshCw,
  HeadphonesIcon,
  Star,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import logoImg from "@/assets/logo.png";
import concertBg from "@/assets/concert.png";
import { organisations } from "@/lib/tickets-data";

export const Route = createFileRoute("/promo")({
  head: () => ({
    meta: [
      { title: "Tickets Live – Power Your Events" },
      {
        name: "description",
        content:
          "The platform behind every great live event. Manage, sell, and scale with Tickets Live.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap",
      },
    ],
  }),
  component: PromoPage,
});

// ---------------------------------------------------------------------------
// Easing presets — Apple / Linear quality beziers
// ---------------------------------------------------------------------------
const EASE_EXPO   = [0.16, 1, 0.3, 1]          as const;
const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94]   as const;

// ---------------------------------------------------------------------------
// Motion variants
// ---------------------------------------------------------------------------

// Cinematic reveal with blur — slower, more deliberate
const reveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_EXPO },
  },
};

const revealLight = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_EXPO },
  },
};

// Per-word headline animation
const wordReveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_EXPO },
  },
};

const staggerWords = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_EXPO },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -52, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 160, damping: 28 },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 52, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 160, damping: 28 },
  },
};

// ---------------------------------------------------------------------------
// Particle field — stable data defined at module level
// ---------------------------------------------------------------------------
const PARTICLES: Array<{
  id: number; x: number; y: number; size: number;
  opacity: number; duration: number; delay: number;
  dx: number; dy: number;
}> = [
  { id:  0, x:  8, y: 12, size: 1.5, opacity: 0.18, duration: 11, delay: 0.0, dx:  8, dy: -10 },
  { id:  1, x: 22, y: 32, size: 1.0, opacity: 0.10, duration: 14, delay: 1.6, dx: -6, dy:   8 },
  { id:  2, x: 38, y:  7, size: 2.0, opacity: 0.14, duration:  9, delay: 3.1, dx: 10, dy: -12 },
  { id:  3, x: 55, y: 22, size: 1.5, opacity: 0.08, duration: 13, delay: 0.8, dx: -8, dy:  10 },
  { id:  4, x: 72, y: 14, size: 1.0, opacity: 0.20, duration: 10, delay: 2.4, dx:  6, dy:  -8 },
  { id:  5, x: 88, y: 35, size: 1.5, opacity: 0.12, duration: 12, delay: 4.0, dx: -9, dy:  11 },
  { id:  6, x: 14, y: 55, size: 2.0, opacity: 0.16, duration:  8, delay: 1.2, dx:  7, dy:  -9 },
  { id:  7, x: 30, y: 68, size: 1.0, opacity: 0.10, duration: 15, delay: 3.6, dx: -6, dy:   7 },
  { id:  8, x: 48, y: 48, size: 1.5, opacity: 0.22, duration: 11, delay: 0.4, dx: 10, dy: -11 },
  { id:  9, x: 65, y: 75, size: 1.0, opacity: 0.08, duration: 13, delay: 2.0, dx: -7, dy:   9 },
  { id: 10, x: 82, y: 62, size: 2.0, opacity: 0.14, duration:  9, delay: 4.4, dx:  8, dy: -10 },
  { id: 11, x: 92, y: 18, size: 1.5, opacity: 0.18, duration: 10, delay: 1.8, dx: -9, dy:  12 },
  { id: 12, x:  5, y: 82, size: 1.0, opacity: 0.12, duration: 12, delay: 3.3, dx:  6, dy:  -7 },
  { id: 13, x: 20, y: 90, size: 1.5, opacity: 0.20, duration: 14, delay: 0.6, dx: -8, dy:   8 },
  { id: 14, x: 42, y: 85, size: 2.0, opacity: 0.10, duration:  8, delay: 2.8, dx: 11, dy: -12 },
  { id: 15, x: 60, y: 92, size: 1.5, opacity: 0.16, duration: 11, delay: 4.8, dx: -6, dy:   7 },
  { id: 16, x: 77, y: 88, size: 1.0, opacity: 0.22, duration: 13, delay: 1.0, dx:  9, dy: -10 },
  { id: 17, x: 95, y: 72, size: 1.5, opacity: 0.12, duration: 10, delay: 3.8, dx: -7, dy:   9 },
  { id: 18, x: 33, y: 42, size: 2.0, opacity: 0.08, duration:  9, delay: 0.2, dx:  8, dy: -11 },
  { id: 19, x: 50, y: 60, size: 1.0, opacity: 0.18, duration: 12, delay: 2.6, dx: -9, dy:  10 },
  { id: 20, x: 68, y: 38, size: 1.5, opacity: 0.14, duration: 14, delay: 4.2, dx:  7, dy:  -8 },
  { id: 21, x: 85, y: 50, size: 2.0, opacity: 0.20, duration:  8, delay: 1.4, dx: -8, dy:  11 },
  { id: 22, x: 10, y: 38, size: 1.0, opacity: 0.10, duration: 11, delay: 3.0, dx:  9, dy:  -9 },
  { id: 23, x: 25, y: 18, size: 1.5, opacity: 0.16, duration: 13, delay: 0.9, dx: -6, dy:   8 },
  { id: 24, x: 44, y: 25, size: 2.0, opacity: 0.22, duration: 10, delay: 2.2, dx: 10, dy: -12 },
  { id: 25, x: 58, y: 52, size: 1.0, opacity: 0.12, duration: 12, delay: 4.6, dx: -7, dy:   9 },
  { id: 26, x: 75, y: 28, size: 1.5, opacity: 0.18, duration:  9, delay: 1.7, dx:  8, dy: -10 },
  { id: 27, x: 90, y: 44, size: 2.0, opacity: 0.08, duration: 14, delay: 3.5, dx: -9, dy:  11 },
  { id: 28, x: 16, y: 70, size: 1.5, opacity: 0.20, duration: 11, delay: 0.5, dx:  6, dy:  -7 },
  { id: 29, x: 35, y: 78, size: 1.0, opacity: 0.14, duration: 13, delay: 2.9, dx: -8, dy:   9 },
];

// ---------------------------------------------------------------------------
// Magnetic wrapper — translates children toward cursor
// ---------------------------------------------------------------------------

function MagneticWrapper({
  children,
  className,
  reduce,
}: {
  children: React.ReactNode;
  className?: string;
  reduce: boolean | null;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const x      = useSpring(rawX, { stiffness: 260, damping: 22 });
  const y      = useSpring(rawY, { stiffness: 260, damping: 22 });

  function onMouseMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width  / 2)) * 0.3);
    rawY.set((e.clientY - (r.top  + r.height / 2)) * 0.3);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------

function PromoNav({ reduce }: { reduce: boolean | null }) {
  const { scrollY } = useScroll();
  const navBg     = useTransform(scrollY, [0, 80], ["rgba(15,27,20,0)",    "rgba(15,27,20,0.88)"]);
  const navBorder = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.07)"]);
  const navBlur   = useTransform(scrollY, [0, 80], [0, 20]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={
        reduce
          ? { backgroundColor: "rgba(15,27,20,0.92)", borderBottomColor: "rgba(255,255,255,0.08)", borderBottomWidth: 1 }
          : { backgroundColor: navBg, borderBottomColor: navBorder, borderBottomWidth: 1, borderBottomStyle: "solid", backdropFilter: `blur(${navBlur}px)`, WebkitBackdropFilter: `blur(${navBlur}px)` }
      }
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE_EXPO }}
        >
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="Tickets Live" className="h-8 w-auto" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <a
            href="#organisers"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("organisers")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm font-medium text-white/55 hover:text-white transition-colors duration-200"
          >
            Browse Events
          </a>
          <motion.a
            href="mailto:demo@ticketslive.com"
            whileHover={reduce ? {} : { scale: 1.04, backgroundColor: "#2a6a48" }}
            whileTap={reduce  ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-sm font-semibold px-4 py-2 text-white rounded-full"
            style={{ background: "#1e4a32" }}
          >
            Book a Demo
          </motion.a>
        </motion.div>
      </div>
    </motion.nav>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function HeroSection({ reduce }: { reduce: boolean | null }) {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll parallax — each layer moves at a different rate
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const auroraY  = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  // Mouse parallax — aurora blobs track cursor at different rates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const blob1X = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-14%", "14%"]), { stiffness: 42, damping: 28 });
  const blob1Y = useSpring(useTransform(mouseY, [-0.5, 0.5], ["-10%",  "10%"]), { stiffness: 42, damping: 28 });
  const blob2X = useSpring(useTransform(mouseX, [-0.5, 0.5], [  "9%",  "-9%"]), { stiffness: 32, damping: 30 });
  const blob2Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [  "6%",  "-6%"]), { stiffness: 32, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }

  const titleWords = "The platform behind every great live event.".split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#1A1614" }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Layer 0: Dot-grid — slowest parallax ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={reduce ? {} : { y: bgY }}
        aria-hidden="true"
      >
        <div
          className="w-full h-[140%] opacity-[0.055]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.98 0.003 247) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </motion.div>

      {/* ── Layer 1: Particle field ── */}
      {!reduce && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left:             `${p.x}%`,
                top:              `${p.y}%`,
                width:            p.size,
                height:           p.size,
                background:       "#7fc4a0",
                opacity:          p.opacity,
              }}
              animate={{
                x:       [0, p.dx, 0],
                y:       [0, p.dy, 0],
                opacity: [p.opacity, p.opacity * 2.4, p.opacity],
              }}
              transition={{
                duration:   p.duration,
                delay:      p.delay,
                repeat:     Infinity,
                ease:       "easeInOut",
                repeatType: "loop",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Layer 2: Aurora blobs — mouse parallax + breathing ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={reduce ? {} : { y: auroraY }}
        aria-hidden="true"
      >
        {/* Primary green aurora — top right */}
        <motion.div
          className="absolute w-[780px] h-[780px] rounded-full blur-[130px]"
          style={
            reduce
              ? { top: "-200px", right: "-200px", background: "#2a6a48", opacity: 0.2 }
              : { top: "-200px", right: "-200px", background: "radial-gradient(circle, #3a7a58 0%, #1e4a32 52%, transparent 76%)", opacity: 0.2, x: blob1X, y: blob1Y }
          }
          animate={reduce ? {} : { scale: [1, 1.1, 1], opacity: [0.16, 0.26, 0.16] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary teal — left center, counter-moves */}
        <motion.div
          className="absolute w-[520px] h-[520px] rounded-full blur-[110px]"
          style={
            reduce
              ? { top: "28%", left: "-120px", background: "#1a5448", opacity: 0.11 }
              : { top: "28%", left: "-120px", background: "radial-gradient(circle, #1a6a52 0%, transparent 68%)", opacity: 0.11, x: blob2X, y: blob2Y }
          }
          animate={reduce ? {} : { scale: [1, 1.18, 1], opacity: [0.07, 0.16, 0.07] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Tertiary amber — bottom, extremely subtle warmth */}
        <motion.div
          className="absolute w-[440px] h-[440px] rounded-full blur-[90px]"
          style={{ bottom: "-60px", left: "38%", background: "radial-gradient(circle, rgba(190,110,45,0.5) 0%, transparent 70%)", opacity: 0.055 }}
          animate={reduce ? {} : { scale: [1, 1.22, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      </motion.div>

      {/* ── Layer 3: Roaming spotlight ── */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(700px circle at 14% 42%, rgba(58,122,88,0.075) 0%, transparent 62%)",
              "radial-gradient(700px circle at 82% 58%, rgba(58,122,88,0.075) 0%, transparent 62%)",
              "radial-gradient(700px circle at 52% 12%, rgba(58,122,88,0.075) 0%, transparent 62%)",
              "radial-gradient(700px circle at 22% 82%, rgba(58,122,88,0.075) 0%, transparent 62%)",
              "radial-gradient(700px circle at 14% 42%, rgba(58,122,88,0.075) 0%, transparent 62%)",
            ],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      )}

      {/* ── Layer 4: Content — lightest parallax ── */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 pt-24 pb-16"
        style={reduce ? {} : { y: contentY }}
      >
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <motion.p
            variants={reduce ? {} : revealLight}
            initial="hidden"
            animate="show"
            className="text-sm font-semibold uppercase tracking-widest mb-6"
            style={{ color: "#3a7a58" }}
          >
            For Event Organizers
          </motion.p>

          {/* Headline — word by word */}
          <motion.h1
            variants={reduce ? {} : staggerWords}
            initial="hidden"
            animate="show"
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6"
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                variants={reduce ? {} : wordReveal}
                style={{ display: "inline-block", marginRight: "0.28em" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={reduce ? {} : reveal}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
            className="text-xl text-white/55 max-w-2xl mx-auto mb-10"
          >
            Tickets Live gives you the tools to create, sell, and scale – and a
            marketplace your audience already trusts.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={reduce ? {} : revealLight}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.62 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <motion.a
              href="mailto:demo@ticketslive.com"
              whileHover={reduce ? {} : { scale: 1.04 }}
              whileTap={reduce ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="px-7 py-3.5 bg-white text-brand font-semibold rounded-full text-sm"
            >
              Book a Demo
            </motion.a>
            <motion.div
              whileHover={reduce ? {} : { scale: 1.03 }}
              whileTap={reduce ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Link
                to="/"
                className="block px-7 py-3.5 border border-white/25 text-white font-semibold rounded-full hover:bg-white/8 hover:border-white/40 transition-colors text-sm"
              >
                Explore the marketplace →
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={reduce ? {} : staggerFast}
            initial="hidden"
            animate="show"
            transition={{ delayChildren: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/35"
          >
            {["500+ events powered", "99.9% uptime", "Trusted by 50+ organisations"].map((badge, i) => (
              <motion.span key={badge} variants={reduce ? {} : revealLight} className="flex items-center gap-6">
                {badge}
                {i < 2 && <span className="inline-block w-px h-3.5 bg-white/15" aria-hidden="true" />}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Org showcase — card with 3D tilt, cursor glow, live pulse
// ---------------------------------------------------------------------------

const ACTIVE_ORG_IDS = new Set(["apex-arenas", "vibe-records", "city-fc"]);

function OrgCard({
  org,
  index,
  reduce,
}: {
  org: (typeof organisations)[number];
  index: number;
  reduce: boolean | null;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const glowX  = useTransform(rawX, [0, 1], [0, 100]);
  const glowY  = useTransform(rawY, [0, 1], [0, 100]);
  const glowBg = useMotionTemplate`radial-gradient(220px circle at ${glowX}% ${glowY}%, rgba(58,122,88,0.22), transparent 72%)`;

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width);
    rawY.set((e.clientY - r.top)  / r.height);
  }

  function onMouseLeave() {
    rawX.set(0.5);
    rawY.set(0.5);
    setHovered(false);
  }

  const isActive = ACTIVE_ORG_IDS.has(org.id);

  return (
    <motion.a
      ref={cardRef}
      href={`/?org=${org.id}`}
      target="_blank"
      rel="noopener noreferrer"
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.92 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.65, ease: EASE_EXPO, delay: index * 0.1 },
        },
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      whileTap={reduce ? {} : { scale: 0.97 }}
      style={{}}
      className="group relative flex flex-col items-center text-center gap-4 p-8 rounded-2xl overflow-hidden"
    >
      {/* Glass bg */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: hovered ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transition: "background 0.25s",
        }}
        aria-hidden="true"
      />

      {/* Cursor glow */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: glowBg, opacity: hovered ? 1 : 0, transition: "opacity 0.25s" }}
          aria-hidden="true"
        />
      )}

      {/* Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ borderColor: hovered ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.12)" }}
        style={{ border: "1px solid" }}
        transition={{ duration: 0.25 }}
        aria-hidden="true"
      />

      {/* Avatar */}
      <motion.div
        className={`relative z-10 size-16 rounded-full ${org.swatch} flex items-center justify-center text-2xl font-bold`}
        style={{ color: org.accent }}
        animate={
          isActive && !reduce
            ? { boxShadow: ["0 0 0 0px rgba(74,222,128,0.25)", "0 0 0 7px rgba(74,222,128,0)", "0 0 0 0px rgba(74,222,128,0.25)"] }
            : {}
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
        whileHover={reduce ? {} : { scale: 1.08 }}
      >
        {org.initial}
      </motion.div>

      <div className="relative z-10">
        <p className="font-bold leading-snug text-white">{org.name}</p>
        <p className="text-sm text-white/50 mt-1 leading-snug">{org.short}</p>
      </div>

      {/* CTA nudges right on hover */}
      <motion.span
        className="relative z-10 text-sm font-semibold mt-auto"
        style={{ color: "#3a7a58" }}
        animate={!reduce ? { x: hovered ? 3 : 0 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        View events →
      </motion.span>
    </motion.a>
  );
}

function OrgShowcase({ reduce }: { reduce: boolean | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="organisers"
      ref={sectionRef}
      className="relative overflow-hidden px-6 min-h-screen flex flex-col justify-center"
      style={{ background: "#1A1614" }}
    >
      {/* Concert bg with scroll parallax */}
      <motion.img
        src={concertBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={reduce ? {} : { y: bgY, scale: 1.18 }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #1A1614 0%, rgba(26,22,20,0.75) 30%, rgba(26,22,20,0.65) 55%, rgba(26,22,20,0.97) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto pt-16">
        <motion.div
          variants={reduce ? {} : reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-40"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            Powering real events, right now
          </h2>
          <p className="text-white/45 text-lg">
            50+ organisations already sell on Tickets Live.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {organisations
            .filter((org) => org.id !== "grand-theatre")
            .map((org, index) => (
              <OrgCard key={org.id} org={org} index={index} reduce={reduce} />
            ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features strip
// ---------------------------------------------------------------------------

const FEATURES = [
  { icon: Zap,          title: "Instant event setup",    body: "Create and publish events in minutes, not days." },
  { icon: Ticket,       title: "Flexible ticketing",     body: "Set ticket types, pricing tiers, and availability caps." },
  { icon: BarChart3,    title: "Live sales dashboard",   body: "Track revenue, attendance, and conversions in real time." },
  { icon: ShoppingBag,  title: "Built-in marketplace",   body: "Your events appear instantly on the Tickets Live storefront." },
] as const;

function FeaturesStrip({ reduce }: { reduce: boolean | null }) {
  return (
    <section className="bg-white border-t border-[#1e4a32]/10 py-16 px-6">
      <motion.div
        variants={reduce ? {} : stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <motion.div key={title} variants={reduce ? {} : revealLight} className="flex flex-col gap-3">
            <motion.div
              className="size-10 rounded-xl bg-[#d9efe6] flex items-center justify-center"
              whileHover={reduce ? {} : { scale: 1.12, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
            >
              <Icon className="size-5 text-[#1e4a32]" />
            </motion.div>
            <h3 className="font-bold text-base">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------

const STEPS = [
  {
    number: "01",
    value: 1,
    title: "Create your event",
    body: "Sign up and configure your event in the Event Manager Suite – details, ticket types, pricing, and availability in one place.",
    side: "left",
  },
  {
    number: "02",
    value: 2,
    title: "Go live instantly",
    body: "One click publishes your event directly to the Tickets Live marketplace. No extra setup, no integration required.",
    side: "center",
  },
  {
    number: "03",
    value: 3,
    title: "Buyers discover & book",
    body: "Attendees find your event on the public storefront and complete checkout in under a minute – on any device.",
    side: "left",
  },
] as const;

// Counts from 0 up to `target` when `inView` becomes true
function AnimatedNumber({ target, inView, reduce }: { target: number; inView: boolean; reduce: boolean | null }) {
  const motionVal = useMotionValue(0);
  const display   = useTransform(motionVal, (v) => String(Math.round(v)).padStart(2, "0"));

  useEffect(() => {
    if (reduce) { motionVal.set(target); return; }
    if (!inView) return;
    const ctrl = animate(motionVal, target, { duration: 0.7, ease: "easeOut", delay: 0.15 });
    return ctrl.stop;
  }, [inView, reduce]);

  return <motion.span>{display}</motion.span>;
}

// Single step row — owns its own inView so we can track active step
function StepRow({
  step,
  index,
  isActive,
  onActivate,
  reduce,
}: {
  step: (typeof STEPS)[number];
  index: number;
  isActive: boolean;
  onActivate: (i: number) => void;
  reduce: boolean | null;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.55 });

  useEffect(() => {
    if (inView) onActivate(index);
  }, [inView]);

  const isRight = step.side === "right";

  return (
    <motion.div
      ref={ref}
      variants={reduce ? {} : isRight ? slideInRight : slideInLeft}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={`flex items-start gap-8 ${isRight ? "md:flex-row-reverse md:text-right" : "md:flex-row"} flex-col`}
    >
      {/* Text content */}
      <div className="flex-1">
        {/* Counting number */}
        <motion.p
          className="text-6xl font-black leading-none mb-3 select-none"
          animate={
            reduce ? {} : {
              color: isActive ? "rgba(30,74,50,0.45)" : "rgba(74,118,96,0.16)",
            }
          }
          transition={{ duration: 0.4 }}
          aria-hidden="true"
        >
          <AnimatedNumber target={step.value} inView={inView} reduce={reduce} />
        </motion.p>

        {/* Title — brightens when active */}
        <motion.h3
          className="text-xl font-bold mb-2 transition-colors"
          animate={reduce ? {} : { color: isActive ? "#111" : "#374151" }}
          transition={{ duration: 0.35 }}
        >
          {step.title}
        </motion.h3>

        {/* Body */}
        <motion.p
          className="text-sm leading-relaxed max-w-sm"
          animate={reduce ? {} : { opacity: isActive ? 1 : 0.55 }}
          transition={{ duration: 0.35 }}
          style={{ color: "#6b7280" }}
        >
          {step.body}
        </motion.p>
      </div>

      {/* Edge dot — sits on the track line, glows when active */}
      <motion.div
        className="hidden md:flex flex-shrink-0 size-5 rounded-full self-center items-center justify-center -mr-2.5"
        animate={
          reduce ? {} : {
            backgroundColor: isActive ? "#1e4a32" : "#c8dfd4",
            boxShadow: isActive
              ? "0 0 0 6px rgba(30,74,50,0.15), 0 0 16px rgba(30,74,50,0.3)"
              : "0 0 0 4px rgba(74,118,96,0.1)",
            scale: isActive ? 1.2 : 1,
          }
        }
        transition={{ duration: 0.4, ease: EASE_EXPO }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

function HowItWorksSection({ reduce }: { reduce: boolean | null }) {
  const sectionRef  = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  // Line grows proportionally to scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 30%"],
  });
  const lineScaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  // Section in-view — drives the floating indicator
  const sectionInView = useInView(sectionRef, { amount: 0.1 });

  return (
    <section ref={sectionRef} className="bg-surface py-24 px-6 relative">

      {/* Floating progress indicator — visible only while section is in view */}
      <AnimatePresence>
        {sectionInView && !reduce && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.4, ease: EASE_EXPO }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
            aria-hidden="true"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex items-center gap-2"
                animate={{
                  opacity: activeStep === i ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="text-[10px] font-semibold tabular-nums"
                  style={{ color: "#1e4a32" }}
                  animate={{ opacity: activeStep === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {step.number}
                </motion.span>
                <motion.div
                  className="rounded-full"
                  animate={{
                    width:           activeStep === i ? 8 : 6,
                    height:          activeStep === i ? 8 : 6,
                    backgroundColor: activeStep === i ? "#1e4a32" : "rgba(30,74,50,0.3)",
                  }}
                  transition={{ duration: 0.3, ease: EASE_EXPO }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={reduce ? {} : reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Two platforms. One seamless experience.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From creating an event to a buyer holding their ticket – it all happens inside Tickets Live.
          </p>
        </motion.div>

        <div className="flex gap-16 items-start w-full">
          {/* Timeline column */}
          <div className="flex-1 min-w-0 relative">
            {/* Track line — faint base */}
            <div
              className="absolute right-0 top-0 bottom-0 w-px hidden md:block"
              style={{ background: "rgba(74,118,96,0.12)" }}
              aria-hidden="true"
            />

            {/* Scroll-driven growing line */}
            {!reduce && (
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-px origin-top hidden md:block"
                style={{ background: "#1e4a32", scaleY: lineScaleY }}
                aria-hidden="true"
              />
            )}

            <div className="flex flex-col gap-20">
              {STEPS.map((step, i) => (
                <StepRow
                  key={step.number}
                  step={step}
                  index={i}
                  isActive={activeStep === i}
                  onActivate={setActiveStep}
                  reduce={reduce}
                />
              ))}
            </div>
          </div>

          {/* Phone image — sticky on the right, fills timeline height */}
          <div className="hidden lg:flex flex-1 min-w-0 sticky top-32 self-start justify-center items-center">
            <motion.img
              src="/tickets.png"
              alt="Tickets Live mobile app"
              className="w-full h-full object-contain drop-shadow-2xl"
              variants={reduce ? {} : slideInRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Platform showcase — browser frames
// ---------------------------------------------------------------------------

function BrowserFrame({
  url,
  children,
  className = "",
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${className}`}>
      <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="size-3 rounded-full bg-red-400/60" />
          <div className="size-3 rounded-full bg-yellow-400/60" />
          <div className="size-3 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-xs text-white/35 font-mono">
          {url}
        </div>
      </div>
      <div className="bg-white/5">{children}</div>
    </div>
  );
}

// Animated stat value — counts from 0 to target on enter
function CountingStat({
  value,
  format,
  inView,
  reduce,
}: {
  value: number;
  format: (v: number) => string;
  inView: boolean;
  reduce: boolean | null;
}) {
  const mv      = useMotionValue(0);
  const display = useTransform(mv, (v) => format(Math.round(v)));

  useEffect(() => {
    if (reduce) { mv.set(value); return; }
    if (!inView) return;
    const ctrl = animate(mv, value, { duration: 1.4, ease: "easeOut", delay: 0.4 });
    return ctrl.stop;
  }, [inView, reduce]);

  return <motion.span>{display}</motion.span>;
}

const BAR_HEIGHTS = [30, 55, 42, 70, 58, 85, 65, 90, 75, 95, 80, 100];

function DashboardMockup({ inView, reduce }: { inView: boolean; reduce: boolean | null }) {
  return (
    <div className="flex h-[360px]">
      {/* Sidebar */}
      <div className="w-36 shrink-0 border-r border-white/8 p-4 space-y-1 bg-white/3">
        <p className="text-[9px] text-white/25 uppercase tracking-widest mb-3 px-2">Navigation</p>
        {[
          { label: "Dashboard", active: true  },
          { label: "Events",    active: false },
          { label: "Tickets",   active: false },
          { label: "Sales",     active: false },
          { label: "Settings",  active: false },
        ].map(({ label, active }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.4, ease: EASE_EXPO, delay: 0.1 + i * 0.06 }}
            className={`h-8 rounded-lg text-[11px] flex items-center px-3 font-medium ${
              active ? "bg-[#3a7a58]/30 text-[#7fc4a0]" : "text-white/35"
            }`}
          >
            {label}
          </motion.div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-5 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold text-white/70">Overview</p>
          <div className="h-5 w-20 rounded-md bg-white/8 text-[9px] text-white/30 flex items-center justify-center">This month</div>
        </div>

        {/* Counting stats */}
        <div className="grid grid-cols-3 gap-2">
          {([
            { label: "Revenue",      value: 12480, format: (v: number) => `£${v.toLocaleString()}`, trend: "+14%" },
            { label: "Tickets Sold", value: 843,   format: (v: number) => String(v),                trend: "+9%"  },
            { label: "Live Events",  value: 6,     format: (v: number) => String(v),                trend: ""     },
          ] as const).map(({ label, value, format, trend }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.45, ease: EASE_EXPO, delay: 0.2 + i * 0.08 }}
              className="bg-white/5 rounded-xl p-3 border border-white/5"
            >
              <p className="text-[9px] text-white/35 mb-1.5">{label}</p>
              <p className="text-base font-bold text-white leading-none tabular-nums">
                <CountingStat value={value} format={format as (v: number) => string} inView={inView} reduce={reduce} />
              </p>
              {trend && <p className="text-[9px] mt-1" style={{ color: "#3a7a58" }}>{trend}</p>}
            </motion.div>
          ))}
        </div>

        {/* Animated bar chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white/4 rounded-xl p-3 border border-white/5"
        >
          <p className="text-[9px] text-white/35 mb-3">Revenue trend</p>
          <div className="flex items-end gap-1 h-12">
            {BAR_HEIGHTS.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm origin-bottom"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0.35 + i * 0.04 }}
                style={{
                  height:     `${h}%`,
                  background: i === 11 ? "#3a7a58" : `rgba(58,122,88,${0.2 + h / 300})`,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Event rows */}
        <div className="space-y-1.5">
          {([
            { name: "Summer Concert",     status: "Live",  tickets: "240/300" },
            { name: "City FC vs Arsenal", status: "Draft", tickets: "0/500"   },
            { name: "Art Basel Preview",  status: "Live",  tickets: "88/100"  },
          ] as const).map(({ name, status, tickets }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
              transition={{ duration: 0.4, ease: EASE_EXPO, delay: 0.55 + i * 0.08 }}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/4 border border-white/5"
            >
              <span className="text-[11px] text-white/65 truncate">{name}</span>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                  status === "Live" ? "bg-[#3a7a58]/25 text-[#7fc4a0]" : "bg-white/8 text-white/35"
                }`}>{status}</span>
                <span className="text-[10px] text-white/35 font-mono">{tickets}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketplaceMockup({ inView }: { inView: boolean }) {
  return (
    <div className="h-[360px] bg-[#f8f9fa] overflow-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="size-5 bg-[#1A1614] rounded flex items-center justify-center">
            <div className="size-2 bg-white rounded-full" />
          </div>
          <span className="text-[11px] font-bold text-[#1A1614] tracking-tight">Tickets Live</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] text-gray-400">Browse</span>
          <div className="h-6 w-20 rounded-full bg-[#1A1614] flex items-center justify-center">
            <span className="text-[9px] text-white font-medium">Sign in</span>
          </div>
        </div>
      </div>

      {/* Featured event — slides up */}
      <motion.div
        className="px-5 pt-4"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0.2 }}
      >
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          <div
            className="h-28 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0f2318 0%, #1e4a32 50%, #3a7a58 100%)" }}
          >
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
            <div className="absolute bottom-3 left-4">
              <p className="text-[9px] text-white/60 uppercase tracking-widest">Fri 18 Jul · O2 Arena</p>
              <p className="text-sm font-bold text-white mt-0.5">Summer Concert Series</p>
            </div>
            <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-sm rounded-full px-2 py-0.5 border border-white/20">
              <p className="text-[9px] text-white font-medium">240 left</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="size-5 rounded-full bg-[#d9efe6] flex items-center justify-center text-[8px] font-bold text-[#0f2318]">A</div>
              <span className="text-[10px] text-gray-500">Apex Arenas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#1A1614]">from £32</span>
              <div className="h-5 w-14 rounded-full bg-[#1e4a32] flex items-center justify-center">
                <span className="text-[8px] text-white font-medium">Buy now</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event grid — staggered */}
      <div className="px-5 pt-3 grid grid-cols-2 gap-2">
        {([
          { name: "City FC vs Arsenal", venue: "Stamford Bridge", price: "£55", color: "bg-blue-50",   i: 0 },
          { name: "Art Basel Preview",  venue: "Royal Academy",   price: "£28", color: "bg-purple-50", i: 1 },
        ] as const).map(({ name, venue, price, color, i }) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: EASE_EXPO, delay: 0.38 + i * 0.1 }}
            className={`rounded-lg border border-gray-100 p-3 ${color} bg-opacity-50`}
          >
            <p className="text-[9px] text-gray-400 mb-0.5">{venue}</p>
            <p className="text-[10px] font-semibold text-gray-800 leading-tight">{name}</p>
            <p className="text-[9px] font-bold text-[#1e4a32] mt-1">{price}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// View toggle pill
function PlatformShowcase({ reduce }: { reduce: boolean | null }) {
  const dashRef  = useRef<HTMLDivElement>(null);
  const mktRef   = useRef<HTMLDivElement>(null);
  const dashInView = useInView(dashRef,  { once: true, amount: 0.25 });
  const mktInView  = useInView(mktRef,   { once: true, amount: 0.25 });

  // Mouse spotlight — dashboard frame
  const dMouseX = useMotionValue(0);
  const dMouseY = useMotionValue(0);
  const dSpotlight = useMotionTemplate`radial-gradient(260px circle at ${dMouseX}px ${dMouseY}px, rgba(58,122,88,0.12), transparent 65%)`;
  function onDashMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !dashRef.current) return;
    const r = dashRef.current.getBoundingClientRect();
    dMouseX.set(e.clientX - r.left);
    dMouseY.set(e.clientY - r.top);
  }

  // Mouse spotlight — marketplace frame
  const mMouseX = useMotionValue(0);
  const mMouseY = useMotionValue(0);
  const mSpotlight = useMotionTemplate`radial-gradient(260px circle at ${mMouseX}px ${mMouseY}px, rgba(255,255,255,0.06), transparent 65%)`;
  function onMktMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !mktRef.current) return;
    const r = mktRef.current.getBoundingClientRect();
    mMouseX.set(e.clientX - r.left);
    mMouseY.set(e.clientY - r.top);
  }

  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ background: "#1A1614" }}>
      {/* Radial highlight */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(58,122,88,0.11) 0%, transparent 70%)" }} />
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]" aria-hidden="true"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={reduce ? {} : reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Built for both sides of the experience.
          </h2>
          <p className="text-white/38 text-base">
            One ecosystem. A management suite for organizers, and a marketplace buyers already trust.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Dashboard frame */}
          <motion.div
            variants={reduce ? {} : slideInLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col"
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                ref={dashRef}
                onMouseMove={onDashMouseMove}
                className="relative"
              >
                {!reduce && (
                  <motion.div className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
                    style={{ background: dSpotlight }} aria-hidden="true" />
                )}
                <div className="absolute inset-0 rounded-2xl blur-2xl opacity-28 -z-10 scale-90"
                  style={{ background: "radial-gradient(ellipse at center, rgba(58,122,88,0.75), transparent 70%)" }}
                  aria-hidden="true" />
                <div className="rounded-2xl p-px" style={{
                  background: "linear-gradient(145deg, rgba(58,122,88,0.65) 0%, rgba(58,122,88,0.12) 40%, rgba(255,255,255,0.04) 100%)",
                }}>
                  <BrowserFrame url="manager.ticketslive.com" className="bg-[#0c1810]">
                    <DashboardMockup inView={dashInView} reduce={reduce} />
                  </BrowserFrame>
                </div>
              </motion.div>
            </motion.div>
            <div className="mt-5 px-1">
              <p className="text-white font-semibold text-sm mb-1">For Organizers</p>
              <p className="text-white/38 text-sm">Manage events, track sales, configure everything from one place.</p>
            </div>
          </motion.div>

          {/* Marketplace frame */}
          <motion.div
            variants={reduce ? {} : slideInRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col"
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
            >
              <motion.div
                ref={mktRef}
                onMouseMove={onMktMouseMove}
                className="relative"
              >
                {!reduce && (
                  <motion.div className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
                    style={{ background: mSpotlight }} aria-hidden="true" />
                )}
                <div className="absolute inset-0 rounded-2xl blur-2xl opacity-14 -z-10 scale-90"
                  style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.5), transparent 70%)" }}
                  aria-hidden="true" />
                <div className="rounded-2xl p-px" style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 100%)",
                }}>
                  <BrowserFrame url="ticketslive.com">
                    <MarketplaceMockup inView={mktInView} />
                  </BrowserFrame>
                </div>
              </motion.div>
            </motion.div>
            <div className="mt-5 px-1">
              <p className="text-white font-semibold text-sm mb-1">For Attendees</p>
              <p className="text-white/38 text-sm">Discover events and buy tickets in under a minute, on any device.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Organizer benefits
// ---------------------------------------------------------------------------

const ORG_BENEFITS = [
  { icon: Zap,            title: "Zero commission on setup",    body: "No upfront fees. Pay only when you sell tickets." },
  { icon: Ticket,         title: "Custom ticket types",         body: "GA, VIP, early bird, group – configure any structure you need." },
  { icon: RefreshCw,      title: "Real-time inventory control", body: "Cap sales, release waves, or pause at any time." },
  { icon: TrendingUp,     title: "Instant payouts",             body: "Revenue hits your account directly, not ours." },
  { icon: Users,          title: "Audience insights",           body: "See who's buying, when, and where they're coming from." },
  { icon: HeadphonesIcon, title: "Dedicated support",           body: "A real person, not a chatbot, when it matters most." },
] as const;

function OrganizerBenefits({ reduce }: { reduce: boolean | null }) {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={reduce ? {} : reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Everything you need to run events at scale.
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Built for organisers who need reliability, flexibility, and zero friction.
          </p>
        </motion.div>

        <motion.div
          variants={reduce ? {} : stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {ORG_BENEFITS.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={reduce ? {} : scaleIn}
              whileHover={
                reduce ? {} : {
                  y: -5,
                  boxShadow: "0 12px 32px rgba(74,118,96,0.09)",
                  borderColor: "rgba(30,74,50,0.22)",
                }
              }
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="p-6 rounded-2xl border border-border bg-surface"
            >
              <motion.div
                className="size-10 rounded-xl bg-[#d9efe6] flex items-center justify-center mb-4"
                whileHover={reduce ? {} : { scale: 1.12, rotate: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
              >
                <Icon className="size-5 text-[#1e4a32]" />
              </motion.div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Attendee benefits
// ---------------------------------------------------------------------------

const ATTENDEE_BENEFITS = [
  { icon: Lock,  headline: "Secure checkout",   body: "PCI-compliant payments, every single time." },
  { icon: Clock, headline: "Under 60 seconds",  body: "From discovery to confirmed booking – faster than the queue." },
  { icon: Mail,  headline: "Instant access",    body: "Tickets in your inbox the moment you pay." },
] as const;

function AttendeeBenefits({ reduce }: { reduce: boolean | null }) {
  return (
    <section className="bg-surface py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={reduce ? {} : reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Tickets you can trust.</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A checkout experience built for speed, security, and simplicity.
          </p>
        </motion.div>

        <motion.div
          variants={reduce ? {} : stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {ATTENDEE_BENEFITS.map(({ icon: Icon, headline, body }) => (
            <motion.div
              key={headline}
              variants={reduce ? {} : scaleIn}
              whileHover={reduce ? {} : { y: -5, boxShadow: "0 10px 28px rgba(0,0,0,0.07)" }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="p-6 rounded-2xl border border-border bg-white"
            >
              <div className="size-10 rounded-xl bg-[#d9efe6] flex items-center justify-center mb-4">
                <Icon className="size-5 text-[#1e4a32]" />
              </div>
              <h3 className="font-bold mb-2">{headline}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    quote:    "We went from spreadsheets to sold-out shows in a week. The dashboard alone is worth it.",
    name:     "Sarah M.",
    org:      "Vibe Records",
    initial:  "S",
  },
  {
    quote:    "Setting up our first season of fixtures took 20 minutes. The marketplace did the rest.",
    name:     "James T.",
    org:      "City FC",
    initial:  "J",
  },
  {
    quote:    "Our theatre company has run 40+ productions through Tickets Live. Couldn't imagine going back.",
    name:     "Rachel K.",
    org:      "Grand Theatre",
    initial:  "R",
  },
] as const;

function TestimonialsSection({ reduce }: { reduce: boolean | null }) {
  return (
    <section className="py-24 px-6 overflow-hidden" style={{ background: "#1A1614" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={reduce ? {} : reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Trusted by organisers across the UK.
          </h2>
          <p className="text-white/38">Real words from the people who run events on Tickets Live.</p>
        </motion.div>

        <motion.div
          variants={reduce ? {} : stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map(({ quote, name, org, initial }) => (
            <motion.div
              key={name}
              variants={reduce ? {} : scaleIn}
              whileHover={
                reduce ? {} : {
                  y: -7,
                  boxShadow: "0 24px 56px rgba(0,0,0,0.35)",
                  borderColor: "rgba(255,255,255,0.16)",
                }
              }
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="p-7 rounded-2xl flex flex-col gap-5 border border-white/8"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div className="flex gap-1" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4" style={{ fill: "#3a7a58", color: "#3a7a58" }} aria-hidden="true" />
                ))}
              </div>
              <p className="text-white/72 text-sm leading-relaxed flex-1">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="size-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "rgba(114,174,146,0.14)", color: "#3a7a58" }}
                >
                  {initial}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{name}</p>
                  <p className="text-white/35 text-xs">{org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

function CTASection({ reduce }: { reduce: boolean | null }) {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="bg-surface py-28 px-6 text-center overflow-hidden">
      <motion.div
        variants={reduce ? {} : scaleIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
          Ready to power your next event?
        </h2>
        <p className="text-muted-foreground text-lg mb-10">
          Join 50+ organisations already selling on Tickets Live.
        </p>

        <div className="relative inline-flex items-center justify-center">
          {/* Pulse ring — only while hovered */}
          <AnimatePresence>
            {hovered && !reduce && (
              <motion.div
                key="pulse"
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.7, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut", repeat: Infinity, repeatDelay: 1.2 }}
                style={{ background: "#1e4a32" }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
          <motion.a
            href="mailto:demo@ticketslive.com"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={reduce ? {} : { scale: 1.04, backgroundColor: "#2a6a48" }}
            whileTap={reduce  ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative inline-flex items-center gap-2 px-8 py-4 font-bold rounded-full text-base text-white"
            style={{ background: "#1e4a32" }}
          >
            Book a Demo
            <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function PromoPage() {
  const reduce = useReducedMotion();

  return (
    <div
      className="min-h-screen bg-white text-foreground"
      style={{
        fontFamily: "'Noto Sans', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <PromoNav reduce={reduce} />
      <HeroSection reduce={reduce} />
      <OrgShowcase reduce={reduce} />
      <FeaturesStrip reduce={reduce} />
      <HowItWorksSection reduce={reduce} />
      <PlatformShowcase reduce={reduce} />
      <OrganizerBenefits reduce={reduce} />
      <AttendeeBenefits reduce={reduce} />
      <TestimonialsSection reduce={reduce} />
      <CTASection reduce={reduce} />
      <SiteFooter />
    </div>
  );
}
