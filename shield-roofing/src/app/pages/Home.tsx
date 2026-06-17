import { Link } from "react-router";
import { Shield, CheckCircle, Star, Phone, ArrowRight, Home as HomeIcon, Wrench, RefreshCw, CloudLightning, Search, AlertCircle, Award, Users } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const services = [
    {
      title: "Premium Installation",
      description: "Masterfully crafted roofing systems using the finest materials and advanced installation techniques.",
      icon: HomeIcon,
    },
    {
      title: "Expert Repair",
      description: "Swift, sophisticated repairs that restore your roof's integrity with precision and care.",
      icon: Wrench,
    },
    {
      title: "Complete Replacement",
      description: "Transform your property with a comprehensive roof replacement that enhances value and protection.",
      icon: RefreshCw,
    },
    {
      title: "Storm Restoration",
      description: "Rapid response and expert restoration services for weather-related roof damage.",
      icon: CloudLightning,
    },
    {
      title: "Professional Inspections",
      description: "Thorough assessments to identify issues before they become costly problems.",
      icon: Search,
    },
    {
      title: "24/7 Emergency Service",
      description: "Round-the-clock availability for urgent roofing needs and immediate protection.",
      icon: AlertCircle,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "College Station, TX",
      rating: 5,
      text: "Shield Roofing exceeded all expectations. The quality of work and attention to detail were remarkable. As a proud Aggie family, we appreciate their local expertise and Texas values!",
    },
    {
      name: "Michael Chen",
      location: "Houston, TX",
      rating: 5,
      text: "After storm damage, their team responded immediately with professionalism and skill. The restoration work was flawless. True Texas hospitality combined with world-class craftsmanship!",
    },
    {
      name: "Emily Rodriguez",
      location: "Bryan, TX",
      rating: 5,
      text: "From consultation to completion, every aspect was handled with care. The result is stunning, and the peace of mind is priceless. They truly treat you like family!",
    },
  ];

  const stats = [
    { number: "15+", label: "Years of Excellence" },
    { number: "500+", label: "Luxury Projects" },
    { number: "100%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Concierge Service" }
  ];

  return (
    <div>
      {/* Luxurious Hero Section with Video */}
      <section className="relative bg-gray-900 text-white overflow-hidden -mt-16 pt-16">
        {/* YouTube Video Background */}
        <div className="absolute inset-0">
          <iframe
            src="https://www.youtube.com/embed/hvSq38FChGU?autoplay=1&mute=1&loop=1&playlist=hvSq38FChGU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
            title="Background video"
            style={{ border: 'none', opacity: 0.8 }}
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-900/20"></div>
          
          {/* Premium pattern overlay */}
          <div 
            className="absolute inset-0 opacity-3"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Premium badge */}
            <div className="inline-block px-6 py-2 rounded-full mb-8" style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))',
              border: '1px solid rgba(212, 175, 55, 0.4)'
            }}>
              <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#D4AF37' }}>
                Howdy! Premium Texas Roofing Excellence
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Protecting Texas Homes
              <br />
              <span style={{ color: 'var(--aggie-maroon)' }}>
                With Pride & Precision
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 leading-relaxed">
              Serving College Station, Bryan, and Greater Houston with unparalleled craftsmanship. 
              <br className="hidden sm:block" />
              Quality Texas roofing you can trust. Gig 'em!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg shadow-2xl hover:scale-105 transform hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                style={{ 
                  background: 'linear-gradient(135deg, #D4AF37, #C5A028)',
                  color: '#1a1a1a'
                }}
              >
                Get Your Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              
              <a
                href="tel:+19795551234"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm"
              >
                <Phone className="h-5 w-5" /> (979) 555-1234
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>Fully Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ 
                  backgroundColor: 'var(--aggie-maroon)',
                  color: 'white'
                }}>
                  TAMU
                </div>
                <span>Aggie Owned & Operated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <span>5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-md font-bold text-xs" style={{ 
                  background: 'linear-gradient(135deg, #0066b2, #004a8f)',
                  color: 'white'
                }}>
                  BBB A+
                </div>
                <span>Accredited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block mb-4">
                  <div className="text-5xl sm:text-6xl font-bold mb-2" style={{ color: 'var(--aggie-maroon)' }}>
                    {stat.number}
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" style={{
                    background: 'var(--aggie-maroon)'
                  }}></div>
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{
          background: 'linear-gradient(90deg, transparent, var(--aggie-maroon), #D4AF37, var(--aggie-maroon), transparent)'
        }}></div>
      </section>

      {/* Luxurious Services Section */}
      <section className="py-24 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#C5A028' }}>
                Our Services
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Roofing
              <br />
              <span style={{ color: 'var(--aggie-maroon)' }}>
                Excellence & Expertise
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From installation to maintenance, we provide world-class roofing solutions for discerning homeowners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="relative group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Icon container with premium styling */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center relative" style={{
                      background: 'linear-gradient(135deg, var(--aggie-maroon), var(--aggie-maroon-dark))'
                    }}>
                      <IconComponent className="h-8 w-8 text-white relative z-10" />
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 w-16 h-16 rounded-xl opacity-50 blur-lg group-hover:blur-xl transition-all" style={{
                      background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)'
                    }}></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 font-semibold transition-colors group-hover:gap-3"
                    style={{ color: 'var(--aggie-maroon)' }}
                  >
                    Explore Service <ArrowRight className="h-4 w-4 transition-all" />
                  </Link>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-10 transition-opacity" style={{
                    background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)',
                    borderRadius: '0 1rem 0 100%'
                  }}></div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform"
              style={{ 
                backgroundColor: 'var(--aggie-maroon)',
                color: 'white'
              }}
            >
              View All Premium Services <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas - Luxurious Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative h-72 rounded-2xl overflow-hidden shadow-xl group">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1656530888466-4fb42a15be2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXhhcyUyMGFtJTIwa3lsZSUyMGZpZWxkJTIwc3RhZGl1bXxlbnwxfHx8fDE3NzE0ODk1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Kyle Field - Home of the Texas A&M Aggies"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white font-semibold">College Station</div>
                </div>
                <div className="relative h-72 rounded-2xl overflow-hidden shadow-xl group mt-12">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1653149870708-50f54131a536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzdG9uJTIwdGV4YXMlMjBza3lsaW5lJTIwZG93bnRvd258ZW58MXx8fHwxNzcxNDg5NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Houston Texas skyline"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white font-semibold">Houston Area</div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ 
                background: 'linear-gradient(135deg, rgba(128, 0, 0, 0.1), rgba(128, 0, 0, 0.05))',
                border: '1px solid rgba(128, 0, 0, 0.2)'
              }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--aggie-maroon)' }}>
                  Service Areas
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Proudly Serving
                <br />
                <span style={{ color: 'var(--aggie-maroon)' }}>Central Texas</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Shield Roofing brings premium craftsmanship to homeowners and businesses throughout the College Station and Houston metropolitan areas.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #D4AF37, #C5A028)'
                  }}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 mb-1">College Station & Bryan</div>
                    <p className="text-gray-600">Premier roofing services for the Brazos Valley and Aggieland</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, var(--aggie-maroon), var(--aggie-maroon-dark))'
                  }}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 mb-1">Greater Houston Area</div>
                    <p className="text-gray-600">Exceptional service throughout Houston and surrounding communities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #D4AF37, #C5A028)'
                  }}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 mb-1">Rapid Response Times</div>
                    <p className="text-gray-600">Priority service and quick arrival throughout our coverage areas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      <section className="py-24 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#C5A028' }}>
                Client Testimonials
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Texas Families
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Quote mark decoration */}
                <div className="absolute top-6 right-6 text-6xl opacity-10" style={{ color: 'var(--aggie-maroon)' }}>
                  "
                </div>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed italic relative z-10">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{
                    background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)'
                  }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxurious CTA Section */}
      <section className="relative text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div style={{
            background: 'linear-gradient(135deg, var(--aggie-maroon) 0%, var(--aggie-maroon-dark) 100%)'
          }} className="absolute inset-0"></div>
          
          {/* Elegant pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")'
            }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Protect Your
              <br />
              <span style={{ color: 'var(--aggie-maroon)' }}>
                Most Valuable Investment?
              </span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 leading-relaxed">
              Experience the Shield Roofing difference. Schedule your complimentary consultation today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg shadow-2xl hover:scale-105 transform"
                style={{ 
                  background: 'linear-gradient(135deg, #D4AF37, #C5A028)',
                  color: '#1a1a1a'
                }}
              >
                Get Your Free Quote <ArrowRight className="h-5 w-5" />
              </Link>
              
              <a
                href="tel:+19795551234"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg border-2 border-white/30 hover:bg-white/10"
              >
                <Phone className="h-5 w-5" /> Call (979) 555-1234
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>Licensed & Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>Family Owned & Operated</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>15+ Years Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>5-Star Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}