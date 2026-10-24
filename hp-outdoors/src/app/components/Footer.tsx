import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-white/10">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl mb-6 uppercase tracking-[0.15em] font-light">HP Outdoors</h3>
            <p className="text-primary-foreground/70 leading-relaxed tracking-wide mb-6">
              A Houston legacy spanning four generations. Since the days when downtown streets were still dirt roads, our family has been crafting exceptional outdoor environments for this great city we call home.
            </p>
            <p className="text-primary-foreground/60 text-xs uppercase tracking-[0.2em] mb-2">
              Houston, Texas
            </p>
            <p className="text-primary-foreground/60 text-xs uppercase tracking-[0.2em]">
              Licensed • Insured • Certified
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 uppercase tracking-[0.15em] text-xs text-white/90">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-primary-foreground/70 hover:text-white transition-colors text-sm tracking-wide">
                  Services
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-primary-foreground/70 hover:text-white transition-colors text-sm tracking-wide">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/70 hover:text-white transition-colors text-sm tracking-wide">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/70 hover:text-white transition-colors text-sm tracking-wide">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 uppercase tracking-[0.15em] text-xs text-white/90">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-primary-foreground/70 tracking-wide">
                (555) 123-4567
              </li>
              <li className="text-primary-foreground/70 tracking-wide">
                info@hpoutdoors.com
              </li>
              <li className="text-primary-foreground/70 tracking-wide">
                Greater Metro Region
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-primary-foreground/60 text-xs tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} HP Outdoors. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}