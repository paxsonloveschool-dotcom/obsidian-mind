import { Link } from "react-router";
import { ArrowRight, CheckCircle, Shield, Award, Clock, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Services() {
  const services = [
    {
      title: "Premium Roof Installation",
      image: "https://images.unsplash.com/photo-1665865516592-0219db6d04e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYW5zaW9uJTIwYXNwaGFsdCUyMHNoaW5nbGUlMjByb29mfGVufDF8fHx8MTc3MTU1NDUxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Experience unparalleled craftsmanship with our premium roof installation services. We utilize the finest materials and most advanced techniques to create roofing systems that combine beauty, durability, and lasting value.",
      features: [
        "Designer Asphalt Shingles",
        "Architectural Metal Roofing",
        "Premium Tile Systems",
        "Advanced Flat Roofing",
        "Energy-Efficient Solutions",
        "Lifetime Warranty Protection",
      ],
    },
    {
      title: "Expert Roof Repair",
      image: "https://images.unsplash.com/photo-1758193431353-87812fbff5cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwZXh0ZXJpb3IlMjBtb2Rlcm4lMjByb29maW5nfGVufDF8fHx8MTc3MTU1NDUxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Swift, sophisticated repair solutions that restore your roof's integrity and preserve your home's elegance. Our master craftsmen address every issue with precision and care.",
      features: [
        "Advanced Leak Detection",
        "Premium Shingle Replacement",
        "Custom Flashing Solutions",
        "Seamless Gutter Integration",
        "Ventilation Optimization",
        "Priority Emergency Response",
      ],
    },
    {
      title: "Complete Roof Replacement",
      image: "https://images.unsplash.com/photo-1760972543716-eb03ada2adb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWFuc2lvbiUyMHJvb2YlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNTU0NTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Transform your property with a comprehensive roof replacement that enhances both protection and prestige. From concept to completion, we deliver excellence at every stage.",
      features: [
        "Complete Professional Tear-Off",
        "Structural Deck Assessment",
        "Premium Material Selection",
        "Meticulous Debris Management",
        "Comprehensive Property Protection",
        "Industry-Leading Warranties",
      ],
    },
    {
      title: "Storm Damage Restoration",
      image: "https://images.unsplash.com/photo-1632974059045-a1a14d356f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwcmVzaWRlbnRpYWwlMjByb29maW5nJTIwY29udHJhY3RvcnxlbnwxfHx8fDE3NzE1NTQ1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "When severe weather strikes, our rapid response team provides immediate protection and expert restoration services to return your property to its pristine condition.",
      features: [
        "Immediate Emergency Tarping",
        "Comprehensive Damage Analysis",
        "Full Insurance Coordination",
        "Hail Damage Specialists",
        "Wind Damage Expertise",
        "24/7 Emergency Availability",
      ],
    },
    {
      title: "Professional Roof Inspection",
      image: "https://images.unsplash.com/photo-1669215526577-c25a8f063677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwaG9tZSUyMHJvb2YlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzcxNTU0NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Protect your investment with our thorough, professional inspections. Our detailed assessments identify potential concerns before they become costly problems.",
      features: [
        "Detailed Visual Assessment",
        "Advanced Moisture Detection",
        "Structural Integrity Analysis",
        "Comprehensive Digital Reports",
        "Maintenance Strategy Planning",
        "Pre-Purchase Inspections",
      ],
    },
    {
      title: "Concierge Maintenance",
      image: "https://images.unsplash.com/photo-1612945666535-7b9eb0916ab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwaG91c2UlMjByb29maW5nfGVufDF8fHx8MTc3MTU1NDUxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Preserve your roof's beauty and performance with our exclusive maintenance programs. Enjoy peace of mind knowing your investment is expertly cared for year-round.",
      features: [
        "Professional Debris Removal",
        "Premium Gutter Service",
        "Advanced Algae Prevention",
        "Seal & Caulk Maintenance",
        "Proactive Care Programs",
        "VIP Annual Service Plans",
      ],
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Premium Materials",
      description: "We source only the finest roofing materials from the industry's most trusted manufacturers"
    },
    {
      icon: Award,
      title: "Master Craftsmen",
      description: "Licensed, insured professionals with decades of combined expertise"
    },
    {
      icon: Star,
      title: "Guaranteed Excellence",
      description: "Comprehensive warranties backing both our workmanship and materials"
    },
    {
      icon: Clock,
      title: "White-Glove Service",
      description: "Responsive communication and meticulous attention to every detail"
    }
  ];

  return (
    <div className="bg-white">
      {/* Luxurious Hero Section */}
      <section className="relative text-white py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-6 py-2 rounded-full mb-8" style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#D4AF37' }}>
                Premium Roofing Excellence
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Exceptional Roofing<br />
              <span style={{ 
                background: 'linear-gradient(135deg, #D4AF37, #F4E5B8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Crafted to Perfection
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Elevating homes throughout College Station and Houston with unparalleled craftsmanship, premium materials, and a commitment to excellence
            </p>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg shadow-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 transform"
              style={{ 
                background: 'linear-gradient(135deg, #D4AF37, #C5A028)',
                color: '#1a1a1a'
              }}
            >
              Schedule Your Consultation <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Services Grid - Luxurious Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  {/* Premium Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
                    background: 'linear-gradient(135deg, rgba(128, 0, 0, 0.1), rgba(128, 0, 0, 0.05))',
                    border: '1px solid rgba(128, 0, 0, 0.2)'
                  }}>
                    <Star className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--aggie-maroon)' }}>
                      Premium Service
                    </span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {service.title}
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-4 mb-10">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-4 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{
                          background: 'linear-gradient(135deg, #D4AF37, #C5A028)'
                        }}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg text-gray-700 group-hover:text-gray-900 transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-lg transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform"
                    style={{ 
                      backgroundColor: 'var(--aggie-maroon)',
                      color: 'white'
                    }}
                  >
                    Request This Service <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
                
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="relative group">
                    {/* Image container with luxury effects */}
                    <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Decorative border */}
                    <div className="absolute -inset-1 rounded-2xl opacity-50 blur-xl" style={{
                      background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)',
                      zIndex: -1
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Premium Section */}
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
                The Shield Difference
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Discerning Homeowners
              <br />
              Choose Shield Roofing
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've built our reputation on delivering exceptional results that exceed expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="relative group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Premium icon container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto relative" style={{
                    background: 'linear-gradient(135deg, var(--aggie-maroon), var(--aggie-maroon-dark))'
                  }}>
                    <benefit.icon className="h-10 w-10 text-white relative z-10" />
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl opacity-50 blur-xl group-hover:blur-2xl transition-all" style={{
                    background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)'
                  }}></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed">
                  {benefit.description}
                </p>

                {/* Decorative bottom accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background: 'linear-gradient(90deg, var(--aggie-maroon), #D4AF37)'
                }}></div>
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
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")'
            }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Experience
              <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #D4AF37, #F4E5B8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Roofing Excellence?
              </span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 leading-relaxed">
              Join the families across College Station and Houston who trust Shield Roofing to protect their most valuable investment
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
                Get Your Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              
              <a
                href="tel:979-123-4567"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg border-2 border-white/30 hover:bg-white/10"
              >
                <span>Call (979) 123-4567</span>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>15+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
