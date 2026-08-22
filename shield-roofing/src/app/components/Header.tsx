import { Link, useLocation } from "react-router";
import { Menu, X, Shield } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8" style={{ color: 'var(--aggie-maroon)' }} />
            <span className="font-bold text-xl text-gray-900">Shield Roofing</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive(link.path)
                    ? "font-semibold"
                    : "text-gray-700"
                }`}
                style={isActive(link.path) ? { color: 'var(--aggie-maroon)' } : {}}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = 'var(--aggie-maroon)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = '';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="text-white px-6 py-2 rounded-md transition-colors font-semibold"
              style={{ backgroundColor: 'var(--aggie-maroon)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--aggie-maroon-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--aggie-maroon)'}
            >
              Get Free Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md ${
                  isActive(link.path)
                    ? "font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={isActive(link.path) ? { backgroundColor: '#fef2f2', color: 'var(--aggie-maroon)' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block mx-4 text-center text-white px-6 py-2 rounded-md font-semibold"
              style={{ backgroundColor: 'var(--aggie-maroon)' }}
            >
              Get Free Quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}