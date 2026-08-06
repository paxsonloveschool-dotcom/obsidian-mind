import { Link } from 'react-router';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl text-white tracking-wide">HP Landscape Architecture</h3>
            <p className="text-sm text-neutral-400">
              Creating exceptional commercial and residential landscape architecture that transforms outdoor spaces.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white tracking-wide">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link
                to="/portfolio"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Portfolio
              </Link>
              <Link
                to="/services"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                to="/charity"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Charity
              </Link>
              <Link
                to="/contact"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white tracking-wide">Services</h4>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-neutral-400">Residential Landscape</p>
              <p className="text-sm text-neutral-400">Commercial Landscape</p>
              <p className="text-sm text-neutral-400">3D Renderings</p>
              <p className="text-sm text-neutral-400">Site Plans</p>
              <p className="text-sm text-neutral-400">Master Planning</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white tracking-wide">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 text-neutral-400 flex-shrink-0" />
                <p className="text-sm text-neutral-400">123 Design Street, Suite 100<br />New York, NY 10001</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-neutral-400 flex-shrink-0" />
                <p className="text-sm text-neutral-400">(555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-neutral-400 flex-shrink-0" />
                <p className="text-sm text-neutral-400">hello@hparchitecture.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
          <p className="text-sm text-neutral-400">
            © 2026 HP Architecture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}