import { Menu, Phone } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl text-primary uppercase tracking-[0.15em] font-light">HP Outdoors</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-12">
            <a href="#home" className="text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs">
              Home
            </a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs">
              Services
            </a>
            <a href="#gallery" className="text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs">
              Portfolio
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs">
              About
            </a>
            <a href="#charity" className="text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs">
              Charity
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-3 text-primary">
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-wider text-sm">(555) 123-4567</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1 border-t border-border pt-4">
            <a
              href="#home"
              className="block py-2 text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#services"
              className="block py-2 text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#gallery"
              className="block py-2 text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Portfolio
            </a>
            <a
              href="#about"
              className="block py-2 text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#charity"
              className="block py-2 text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Charity
            </a>
            <a
              href="#contact"
              className="block py-2 text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] text-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex items-center space-x-3 text-primary pt-2">
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              <span className="tracking-wider text-sm">(555) 123-4567</span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}