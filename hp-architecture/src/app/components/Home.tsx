import { Link } from 'react-router';
import { ArrowRight, Award, Users, Map, Leaf } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ClientMap } from './ClientMap';

export function Home() {
  const featuredProjects = [
    {
      id: 1,
      title: 'Modern Commercial Complex',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1768225953944-de033dad3b6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBsYW5kc2NhcGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNDg5MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      title: 'Luxury Corporate Building',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1758448721134-1798533ae917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb3Jwb3JhdGUlMjBidWlsZGluZyUyMG91dGRvb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcxNDg5MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 3,
      title: 'Contemporary Office Landscape',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1768192809193-7eee28d284a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBvZmZpY2UlMjBidWlsZGluZyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzE0ODkzMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const stats = [
    { icon: <Map size={24} />, value: '200+', label: 'Projects Completed' },
    { icon: <Users size={24} />, value: '150+', label: 'Happy Clients' },
    { icon: <Award size={24} />, value: '15+', label: 'Years Experience' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section with Full Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1762926628099-a27b380d94c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvdXRkb29yJTIwbGFuZHNjYXBlJTIwYXJjaGl0ZWN0dXJlJTIwdGVycmFjZXxlbnwxfHx8fDE3NzE0OTAxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury outdoor landscape architecture"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8">
              <Leaf className="text-emerald-600" size={20} />
              <span className="text-sm tracking-wider text-neutral-700">LANDSCAPE ARCHITECTURE</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8">
              Elevate Your
              <span className="block text-emerald-400 mt-2">Outdoor Space</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-2xl">
              Premium landscape design for businesses and homeowners seeking extraordinary outdoor environments
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-5 text-lg rounded-full hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore Our Work
                <ArrowRight size={24} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 bg-white text-neutral-900 px-8 py-5 text-lg rounded-full hover:bg-neutral-50 transition-all border-2 border-white shadow-lg"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm tracking-wider">SCROLL TO EXPLORE</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Flowing Stats Section with Wave Background */}
      <section className="relative py-24 bg-neutral-900 overflow-hidden">
        {/* Wave divider at top */}
        <div className="absolute top-0 left-0 right-0 h-24 -mt-1">
          <svg className="absolute w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path 
              d="M0,50 C360,80 720,80 1080,50 C1260,35 1350,20 1440,50 L1440,0 L0,0 Z" 
              fill="#f0fdfa"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center relative">
                {/* Curved background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-[40%_60%_60%_40%/60%_40%_60%_40%] transform scale-110" />
                <div className="relative">
                  <div className="flex justify-center mb-6 text-emerald-400">{stat.icon}</div>
                  <div className="text-6xl mb-3 text-white">{stat.value}</div>
                  <div className="text-lg text-neutral-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 -mb-1">
          <svg className="absolute w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path 
              d="M0,50 C360,20 720,20 1080,50 C1260,65 1350,80 1440,50 L1440,100 L0,100 Z" 
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Featured Projects with Organic Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-5xl md:text-6xl mb-6 text-neutral-900">Featured Projects</h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full" />
            </div>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mt-6">
              Discover how we blend artistry with functionality to create breathtaking outdoor environments
            </p>
          </div>

          {/* Asymmetric curved grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            {/* Large curved project */}
            <div className="md:col-span-7">
              <Link
                to="/portfolio"
                className="group relative block overflow-hidden rounded-[40px] aspect-[4/5] md:aspect-[7/9] bg-neutral-200 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <ImageWithFallback
                  src={featuredProjects[0].image}
                  alt={featuredProjects[0].title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span className="inline-block bg-emerald-500 text-white text-xs tracking-wider px-4 py-2 rounded-full mb-4">
                      {featuredProjects[0].category}
                    </span>
                    <h3 className="text-3xl mb-2">{featuredProjects[0].title}</h3>
                    <div className="flex items-center gap-2 text-white/80 group-hover:gap-4 transition-all">
                      <span>View Project</span>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Two smaller projects stacked */}
            <div className="md:col-span-5 space-y-6">
              {featuredProjects.slice(1).map((project) => (
                <Link
                  key={project.id}
                  to="/portfolio"
                  className="group relative block overflow-hidden rounded-[30px] aspect-[5/3] bg-neutral-200 shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block bg-emerald-500 text-white text-xs tracking-wider px-3 py-1 rounded-full mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-xl mb-1">{project.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 bg-neutral-900 text-white px-10 py-5 text-lg rounded-full hover:bg-neutral-800 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Projects
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Clients Map with Curved Container */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
        {/* Decorative curved element */}
        <div 
          className="absolute top-20 right-0 w-1/3 h-96 bg-gradient-to-l from-emerald-100/30 to-transparent rounded-[70%_30%_30%_70%/60%_40%_60%_40%] -z-0"
          style={{ transform: 'translateX(30%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-6 text-neutral-900">Clients Worldwide</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Trusted by leading businesses and homeowners across North America, Europe, and beyond
            </p>
          </div>
          
          <div className="rounded-[40px] overflow-hidden shadow-2xl">
            <ClientMap />
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              From luxury residential estates to large-scale commercial developments, our designs transform outdoor spaces around the globe
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 text-lg rounded-full hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Become a Client
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview with Flowing Layout */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Curved background element */}
        <div 
          className="absolute -left-1/4 top-1/4 w-1/2 h-96 bg-gradient-to-r from-teal-100/20 to-transparent rounded-[60%_40%_40%_60%/50%_50%_50%_50%]"
          style={{ transform: 'rotate(-20deg)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image with curved frame */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-[50px] overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1739497065635-73e9facadfaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJ2ZWQlMjBvcmdhbmljJTIwbGFuZHNjYXBlJTIwdGV4dHVyZSUyMGdyZWVufGVufDF8fHx8MTc3MTQ5MDE2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Landscape architecture design process"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              {/* Floating accent shape */}
              <div 
                className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-[60%_40%_30%_70%/40%_60%_50%_50%] -z-10"
                style={{ transform: 'rotate(25deg)' }}
              />
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-block bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-sm tracking-wider">
                ABOUT US
              </div>
              
              <h2 className="text-5xl md:text-6xl text-neutral-900 leading-tight">
                Landscape Architecture Excellence
              </h2>
              
              <p className="text-xl text-neutral-600 leading-relaxed">
                At HP Landscape Architecture, we specialize in creating exceptional outdoor spaces through expert design, detailed 3D renderings, and comprehensive site plans for both businesses and homeowners.
              </p>
              
              <p className="text-lg text-neutral-600 leading-relaxed">
                With over 15 years of experience, our team combines creativity, technical expertise, and environmental stewardship to deliver designs that enhance both beauty and functionality.
              </p>
              
              <Link
                to="/about"
                className="inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-full hover:bg-neutral-800 transition-all group"
              >
                Learn More About Us
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Curved Design */}
      <section className="relative py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        {/* Organic shapes overlay */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div 
            className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 bg-white rounded-[60%_40%_30%_70%/40%_60%_50%_50%]"
            style={{ transform: 'rotate(30deg)' }}
          />
          <div 
            className="absolute -bottom-1/3 -left-1/4 w-2/3 h-2/3 bg-white rounded-[40%_60%_70%_30%/60%_40%_60%_40%]"
            style={{ transform: 'rotate(-20deg)' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl mb-8 text-white leading-tight">
            Ready to Transform Your Outdoor Space?
          </h2>
          <p className="text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
            Whether you're a business owner or homeowner, let's work together to create a landscape that exceeds your vision
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white text-emerald-600 px-10 py-5 text-lg rounded-full hover:bg-neutral-50 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Your Project
              <ArrowRight size={24} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-10 py-5 text-lg rounded-full hover:bg-white/10 transition-all"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}