import { Award, Shield, CheckCircle, Star } from "lucide-react";

const certifications = [
  {
    icon: Award,
    title: "NALP Certified",
    description: "National Association of Landscape Professionals",
  },
  {
    icon: Shield,
    title: "Fully Insured & Licensed",
    description: "Licensed Landscape Contractor",
  },
  {
    icon: CheckCircle,
    title: "BBB A+ Rated",
    description: "Better Business Bureau Accredited",
  },
  {
    icon: Star,
    title: "ISA Certified Arborists",
    description: "International Society of Arboriculture",
  },
  {
    icon: Award,
    title: "ICPI Certified",
    description: "Interlocking Concrete Pavement Institute",
  },
  {
    icon: Shield,
    title: "OSHA Compliant",
    description: "Safety Trained & Certified",
  },
];

export function Certifications() {
  return (
    <section className="py-20 sm:py-28 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 text-white uppercase tracking-tight">
            Licensed & Certified Excellence
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto tracking-wide">
            Our team maintains the highest industry certifications and standards to deliver superior craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <div
                key={index}
                className="bg-primary p-10 border border-white/10 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 border-2 border-white/30 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl mb-3 text-white uppercase tracking-tight">
                    {cert.title}
                  </h3>
                  <p className="text-white/70 text-sm tracking-wide leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-6">
            Trusted By
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center">
            <div className="text-white/40 uppercase tracking-wider text-xs">NALP Member</div>
            <div className="text-white/40 uppercase tracking-wider text-xs">ISA Certified</div>
            <div className="text-white/40 uppercase tracking-wider text-xs">ICPI Member</div>
            <div className="text-white/40 uppercase tracking-wider text-xs">BBB A+ Rated</div>
            <div className="text-white/40 uppercase tracking-wider text-xs">Angie's List Super Service</div>
          </div>
        </div>
      </div>
    </section>
  );
}
