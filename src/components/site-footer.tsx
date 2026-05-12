export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12 px-4 mt-20">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-6 bg-brand rounded flex items-center justify-center">
              <div className="size-2 bg-white rounded-full" />
            </div>
            <span className="font-bold text-lg tracking-tight">Tickets Live</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The fastest, most secure way to discover and book live experiences.
          </p>
        </div>
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
      <div className="max-w-5xl mx-auto px-0 pt-8 mt-8 border-t border-border text-xs text-muted-foreground">
        © 2026 Tickets Live. All rights reserved.
      </div>
    </footer>
  );
}
