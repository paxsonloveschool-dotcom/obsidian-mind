import { CheckCircle } from "lucide-react";

const features = [
  "Over 25 years of experience",
  "Licensed and insured",
  "Eco-friendly practices",
  "Customer satisfaction guarantee",
  "Free consultations and estimates",
  "Year-round service"
];

export function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1758448511220-5439cfb3c533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwb3V0ZG9vciUyMGxpdmluZyUyMHNwYWNlJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzE0ODgxNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Premium outdoor living space"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Our Legacy
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-8 text-primary uppercase tracking-tight">
              Four Generations of Houston Excellence
            </h2>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed tracking-wide">
              Our story began when Houston's downtown streets were still dirt roads. For four generations, the HP Outdoors family has been woven into the very fabric of this city, transforming outdoor spaces across Houston with unwavering dedication and unparalleled craftsmanship.
            </p>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed tracking-wide">
              Our blood runs through Houston. This isn't just where we work—it's our home, our heritage, and our heart. Every landscape we create is born from the same deep love for this city that our great-grandparents felt when they first established this business on these very streets.
            </p>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed tracking-wide">
              We serve Houston not as outsiders, but as family. Four generations of expertise, tradition, and pride flow through every project, every relationship, and every outdoor sanctuary we design. When you choose HP Outdoors, you're choosing a Houston legacy.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t border-border pt-8">
              <div>
                <p className="text-3xl text-primary mb-2 tracking-tight">4</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Generations Strong</p>
              </div>
              <div>
                <p className="text-3xl text-primary mb-2 tracking-tight">100+</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Years Combined</p>
              </div>
              <div>
                <p className="text-3xl text-primary mb-2 tracking-tight">Houston</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Born & Raised</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}