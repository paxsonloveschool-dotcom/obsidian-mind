import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section id="home" className="relative h-[700px] sm:h-[800px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1757840595760-1672370b35e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBsYW5kc2NhcGluZyUyMG5pZ2h0JTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcxNDg4MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Luxury landscape design with elegant lighting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] uppercase text-white/80 mb-4">
            A Houston Legacy • Four Generations of Excellence
          </p>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8 tracking-tight uppercase font-bold leading-[0.95]">
          Elevated Landscapes
        </h1>
        <p className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto tracking-wide leading-relaxed text-white/90 font-light">
          Crafting exceptional outdoor environments where luxury meets nature through thoughtful design and impeccable execution
        </p>
        <div className="flex flex-col sm:flex-row gap-0 justify-center">
          <a
            href="#contact"
            className="bg-white hover:bg-white/90 text-primary px-12 py-5 transition-all inline-block uppercase tracking-[0.2em] text-sm border-2 border-white"
          >
            Schedule Consultation
          </a>
          <a
            href="#gallery"
            className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-12 py-5 transition-all inline-block uppercase tracking-[0.2em] text-sm"
          >
            View Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}