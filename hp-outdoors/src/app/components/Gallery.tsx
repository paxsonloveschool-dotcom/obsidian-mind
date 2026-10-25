import { ImageWithFallback } from "./figma/ImageWithFallback";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1758424106282-6d8476c33b19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwb29sJTIwYmFja3lhcmQlMjBmaW5pc2hlZHxlbnwxfHx8fDE3NzE0ODg4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Luxury Pool & Landscape Design"
  },
  {
    url: "https://images.unsplash.com/photo-1762117361030-a23ec89aa218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzdHlsZSUyMHBvb2wlMjBldmVuaW5nfGVufDF8fHx8MTc3MTQ4ODg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Resort-Style Pool with Evening Ambiance"
  },
  {
    url: "https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcG9vbCUyMGxhbmRzY2FwZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzE0ODg4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Elegant Pool Landscape Architecture"
  },
  {
    url: "https://images.unsplash.com/photo-1714203172156-4c2f8c767a37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwYmFja3lhcmQlMjBwb29sJTIwZGVzaWdufGVufDF8fHx8MTc3MTQ4ODg3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Upscale Backyard Pool Design"
  },
  {
    url: "https://images.unsplash.com/photo-1619492774026-a9d7bebe06e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYXRpbyUyMGZ1cm5pdHVyZSUyMG91dGRvb3J8ZW58MXx8fHwxNzcxNDg4ODc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Premium Outdoor Living Space"
  },
  {
    url: "https://images.unsplash.com/photo-1747297654020-deb3a9e4ad31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwb3V0ZG9vciUyMGtpdGNoZW4lMjBzdG9uZXxlbnwxfHx8fDE3NzE0ODg4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "High-End Outdoor Kitchen"
  },
  {
    url: "https://images.unsplash.com/photo-1713815713309-59488fe8694c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYW5kc2NhcGUlMjBoYXJkc2NhcGUlMjBwYXZlcnN8ZW58MXx8fHwxNzcxNDg4ODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Modern Hardscape & Stone Pavers"
  },
  {
    url: "https://images.unsplash.com/photo-1670140269678-3e3d96f211e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwb3V0ZG9vciUyMGxpdmluZyUyMGZpcmVwbGFjZXxlbnwxfHx8fDE3NzE0ODg4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Outdoor Living with Custom Fireplace"
  },
  {
    url: "https://images.unsplash.com/photo-1761024300164-30e4c4c8ee1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnYXJkZW4lMjB3YXRlciUyMGZvdW50YWlufGVufDF8fHx8MTc3MTQ4ODg4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Luxury Garden Water Feature"
  }
];

export function Gallery() {
  return (
    <section id="gallery" className="py-20 sm:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 text-primary uppercase tracking-tight">Featured Projects</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto tracking-wide leading-relaxed">
            A curated selection of our most distinguished landscape designs and installations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden group"
            >
              <ImageWithFallback
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-sm uppercase tracking-wider">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}