import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import logoImg from "@/assets/logo.png";

type Props = {
  back?: React.ReactNode;
  cartCount?: number;
  /** Tailwind container classes for the inner bar, to align with page content. */
  containerClassName?: string;
};

export function SiteHeader({ back, cartCount = 0, containerClassName = "max-w-6xl px-6" }: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-black border-b-2 border-orange-500">
      <div className={`${containerClassName} mx-auto h-20 flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3 sm:gap-6 whitespace-nowrap min-w-0">
          <Link to="/" aria-label="Erewash home" className="shrink-0">
            <img src={logoImg} alt="Erewash" className="h-10 sm:h-12 w-auto" />
          </Link>
          {back}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-white whitespace-nowrap shrink-0">
          <ShoppingCart className="size-4" />
          Cart ({cartCount})
        </div>
      </div>
    </nav>
  );
}
