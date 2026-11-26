import { Link } from "react-router";
import { Shield, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8" style={{ color: 'var(--aggie-maroon)' }} />
              <span className="font-bold text-xl text-white">Shield Roofing</span>
            </div>
            <p className="text-sm">
              Professional roofing services in College Station and Houston area. Your trusted partner for all roofing needs.
            </p>
            <div className="flex gap-4">
              <a href="#" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Roof Installation</li>
              <li>Roof Repair</li>
              <li>Roof Replacement</li>
              <li>Storm Damage Repair</li>
              <li>Roof Inspection</li>
              <li>Emergency Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--aggie-maroon)' }} />
                <span>College Station, TX & Houston Area</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--aggie-maroon)' }} />
                <a href="tel:+19795551234" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  (979) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--aggie-maroon)' }} />
                <a href="mailto:info@topshieldroofing.com" className="transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  info@topshieldroofing.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Shield Roofing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}