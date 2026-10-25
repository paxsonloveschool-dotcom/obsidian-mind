import { Sprout, Scissors, TreePine, Droplets, Fence, Sun } from "lucide-react";

const services = [
  {
    icon: Sprout,
    title: "Landscape Architecture",
    description: "Bespoke landscape design solutions that harmonize with your property's natural beauty and architectural character."
  },
  {
    icon: Scissors,
    title: "Estate Maintenance",
    description: "Meticulous care and maintenance programs ensuring your outdoor spaces remain pristine throughout every season."
  },
  {
    icon: TreePine,
    title: "Tree & Plant Care",
    description: "Expert horticultural services including pruning, health assessment, and preservation of specimen plantings."
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    description: "Advanced irrigation design and technology for efficient, sustainable water management across your property."
  },
  {
    icon: Fence,
    title: "Luxury Hardscaping",
    description: "Premium outdoor living spaces, custom stonework, water features, and architectural landscape elements."
  },
  {
    icon: Sun,
    title: "Outdoor Lighting",
    description: "Sophisticated lighting design to showcase your landscape's beauty and extend outdoor living into evening hours."
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Comprehensive Services
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 text-primary uppercase tracking-tight">Exceptional Craftsmanship</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto tracking-wide leading-relaxed">
            From initial concept to ongoing stewardship, we deliver unparalleled expertise in every aspect of luxury landscape design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-background p-10 hover:bg-muted transition-colors group"
            >
              <div className="w-16 h-16 border border-primary/20 flex items-center justify-center mb-8 group-hover:border-primary/40 transition-colors">
                <service.icon className="w-8 h-8 text-primary" strokeWidth={1.25} />
              </div>
              <h3 className="text-lg mb-4 text-primary uppercase tracking-wide">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm tracking-wide">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}