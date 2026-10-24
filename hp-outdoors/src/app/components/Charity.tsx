import { Heart, Users, Sprout } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Charity() {
  return (
    <section id="charity" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Community Impact
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 text-primary uppercase tracking-tight">
            Giving Back to Houston
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto tracking-wide leading-relaxed">
            For four generations, Houston has been our home. We believe in nurturing not just landscapes, but our entire community through dedicated charitable work and local partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwY29tbXVuaXR5JTIwdm9sdW50ZWVycyUyMGhlbHBpbmd8ZW58MXx8fHwxNzcxNDg5NTQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community charity work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl text-primary mb-8 uppercase tracking-tight">
              Our Commitment to Houston
            </h3>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed tracking-wide">
              As a Houston family business spanning four generations, we understand that our success is intertwined with the prosperity and well-being of our community. We are committed to giving back through meaningful charitable initiatives that create lasting impact.
            </p>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed tracking-wide">
              Every year, HP Outdoors dedicates time, resources, and expertise to beautifying public spaces, supporting local nonprofits, and creating outdoor environments where Houston families can gather, grow, and thrive.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-border p-8">
            <div className="w-14 h-14 border border-primary/20 flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-primary" strokeWidth={1.25} />
            </div>
            <h3 className="text-lg mb-4 text-primary uppercase tracking-[0.15em]">
              Community Gardens
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed tracking-wide">
              We design and maintain community gardens throughout Houston, providing green spaces for neighborhoods in need and supporting local food security initiatives.
            </p>
          </div>

          <div className="border border-border p-8">
            <div className="w-14 h-14 border border-primary/20 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-primary" strokeWidth={1.25} />
            </div>
            <h3 className="text-lg mb-4 text-primary uppercase tracking-[0.15em]">
              Veteran Support
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed tracking-wide">
              Honoring those who served through complimentary landscape services for Houston veterans, creating peaceful outdoor sanctuaries for healing and reflection.
            </p>
          </div>

          <div className="border border-border p-8">
            <div className="w-14 h-14 border border-primary/20 flex items-center justify-center mb-6">
              <Sprout className="w-7 h-7 text-primary" strokeWidth={1.25} />
            </div>
            <h3 className="text-lg mb-4 text-primary uppercase tracking-[0.15em]">
              Youth Programs
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed tracking-wide">
              Partnering with Houston schools to teach landscaping skills, environmental stewardship, and the value of hard work to the next generation of Houstonians.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center border-t border-border pt-16">
          <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Our Partners
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto tracking-wide leading-relaxed">
            We proudly collaborate with Houston Area Community Services, Houston Food Bank, Operation Finally Home, and local schools throughout Greater Houston to create lasting positive change in our beloved city.
          </p>
        </div>
      </div>
    </section>
  );
}
