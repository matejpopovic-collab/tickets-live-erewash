import logoImg from "@/assets/logo.png";

export function SiteFooter({
  containerClassName = "max-w-6xl px-6",
}: {
  /** Tailwind container classes for the footer content, to align with page grid. */
  containerClassName?: string;
} = {}) {
  return (
    <footer className="py-12 mt-20">
      <div className={`${containerClassName} mx-auto flex justify-between gap-8`}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logoImg} alt="Tickets Live" className="h-8 w-auto" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The fastest, most secure way to discover and book live experiences.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <h4 className="font-bold text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Centre</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">For organisations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Sell Tickets</li>
              <li>Pricing</li>
              <li>White-label</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={`${containerClassName} mx-auto pt-8 mt-8 border-t border-border text-xs text-muted-foreground`}>
        © 2026 Tickets Live. All rights reserved.
      </div>
    </footer>
  );
}
