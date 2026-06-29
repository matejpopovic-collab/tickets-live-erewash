import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

type Props = {
  back?: React.ReactNode;
  cartCount?: number;
  /** Tailwind container classes for the inner bar, to align with page content. */
  containerClassName?: string;
};

export function SiteHeader({ back, cartCount = 0, containerClassName = "max-w-6xl px-6" }: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className={`${containerClassName} mx-auto h-[60px] flex items-center justify-between`}>
        <div className="flex items-center gap-6">
          <Link to="/" aria-label="Tickets Live home">
            <DiamondLogo />
          </Link>
          {back}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ShoppingCart className="size-4" />
          Cart ({cartCount})
        </div>
      </div>
    </nav>
  );
}

function DiamondLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M2 20L20 2L20 20Z" fill="#1d4ed8" />
      <path d="M20 2L38 20L20 20Z" fill="#2563eb" />
      <path d="M38 20L20 38L20 20Z" fill="#d97706" />
      <path d="M20 38L2 20L20 20Z" fill="#0d9488" />
    </svg>
  );
}
