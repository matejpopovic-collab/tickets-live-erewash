import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-8 bg-brand rounded flex items-center justify-center">
            <div className="size-3 bg-white rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tight">Tickets Live</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          <button className="text-sm font-medium px-4 py-2 bg-brand text-brand-foreground rounded-full hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
