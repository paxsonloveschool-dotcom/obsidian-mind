import { Link } from "react-router";
import { CheckCircle, Shield, Award, Users, ArrowRight, Heart, Target, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const values = [
    {
      icon: Shield,
      title: "Uncompromising Quality",
      description: "We never compromise on excellence. Every project receives meticulous attention to detail and superior craftsmanship that exceeds industry standards.",
    },
    {
      icon: Heart,
      title: "Client-Centric Approach",
      description: "Your satisfaction and peace of mind are paramount. We listen intently, communicate transparently, and consistently exceed expectations.",
    },
    {
      icon: Award,
      title: "Unwavering Integrity",
      description: "Honest assessments, transparent pricing, and reliable service built on a foundation of trust and Texas values.",
    },
  ];

  const whyChooseUs = [
    "Licensed, bonded & fully insured",
    "15+ years of proven excellence",
    "Premium materials from industry leaders",
    "Comprehensive lifetime warranties",
    "Complimentary inspections & consultations",
    "24/7 emergency response services",
    "Outstanding 5-star client reviews",
    "Proud family-owned Texas business",
  ];

  return (
    <div className="bg-white">
      {/* Luxurious Hero Section */}
      <section className="relative text-white py-32 overflow-hidden">
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-6 py-2 rounded-full mb-8" style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#D4AF37' }}>
                Our Story
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              About
              <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #D4AF37, #F4E5B8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Shield Roofing
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed">
              Your trusted partner for premium roofing excellence in College Station and the Houston area
            </p>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Our Story - Premium Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ 
                background: 'linear-gradient(135deg, rgba(128, 0, 0, 0.1), rgba(128, 0, 0, 0.05))',
                border: '1px solid rgba(128, 0, 0, 0.2)'
              }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--aggie-maroon)' }}>
                  Our Legacy
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Building a Legacy of
                <br />
                <span style={{ color: 'var(--aggie-maroon)' }}>Excellence</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Shield Roofing was founded with a singular vision: to elevate the standard of roofing services throughout Central Texas. For over 15 years, we've built our reputation on exceptional craftsmanship, unwavering integrity, and an uncompromising commitment to client satisfaction.
                </p>
                <p>
                  As a locally owned and operated business, we intimately understand the unique challenges that Texas weather presents. From intense summer heat to severe storms and everything in between, our expertise has been honed through years of successfully protecting properties across College Station, Bryan, and the Greater Houston area.
                </p>
                <p>
                  Our team of master craftsmen doesn't just install roofs—we create comprehensive protection systems using premium materials and proven techniques. Whether addressing a minor repair or orchestrating a complete replacement, every project receives our signature attention to detail and dedication to perfection.
                </p>
                <p>
                  When you choose Shield Roofing, you're not simply hiring a contractor. You're partnering with a team that genuinely cares about protecting your most valuable investment and delivering peace of mind that lasts for generations.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1635424709845-3a85ad5e1f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByb29maW5nJTIwdGVhbSUyMGV4Y2VsbGVuY2V8ZW58MXx8fHwxNzcxNTU0NjYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional roofing team at work"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative border */}
              <div className="absolute -inset-2 rounded-2xl opacity-30 blur-2xl" style={{
                background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)',
                zIndex: -1
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values - Luxurious Cards */}
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
                Core Values
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              The Principles That
              <br />
              <span style={{ 
                background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Define Our Work
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These core values guide every decision we make and every project we undertake
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <div key={index} className="relative group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Icon container with premium styling */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto relative" style={{
                    background: 'linear-gradient(135deg, var(--aggie-maroon), var(--aggie-maroon-dark))'
                  }}>
                    <value.icon className="h-10 w-10 text-white relative z-10" />
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl opacity-50 blur-xl group-hover:blur-2xl transition-all" style={{
                    background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)'
                  }}></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed">
                  {value.description}
                </p>

                {/* Decorative bottom accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background: 'linear-gradient(90deg, var(--aggie-maroon), #D4AF37)'
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Premium Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1764670486366-1a2fd0dd502a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwY3JhZnRzbWFuc2hpcCUyMGRldGFpbHxlbnwxfHx8fDE3NzE1NTQ2NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Beautiful luxury home exterior"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative border */}
              <div className="absolute -inset-2 rounded-2xl opacity-30 blur-2xl" style={{
                background: 'linear-gradient(135deg, #D4AF37, var(--aggie-maroon))',
                zIndex: -1
              }}></div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ 
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}>
                <span className="text-sm font-semibold" style={{ color: '#C5A028' }}>
                  The Shield Advantage
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Why Discerning
                <br />
                <span style={{ color: 'var(--aggie-maroon)' }}>Homeowners Choose Us</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                We're more than a roofing company—we're your neighbors, committed to protecting the homes and businesses in our Texas community with unwavering dedication.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{
                      background: 'linear-gradient(135deg, #D4AF37, #C5A028)'
                    }}>
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas - Premium Layout */}
      <section className="py-24 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ 
              background: 'linear-gradient(135deg, rgba(128, 0, 0, 0.1), rgba(128, 0, 0, 0.05))',
              border: '1px solid rgba(128, 0, 0, 0.2)'
            }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--aggie-maroon)' }}>
                Service Coverage
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Proudly Serving
              <br />
              <span style={{ color: 'var(--aggie-maroon)' }}>Central Texas</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Bringing premium craftsmanship and exceptional service to communities throughout the region
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity" style={{
                background: 'linear-gradient(135deg, var(--aggie-maroon), #D4AF37)',
                borderRadius: '0 1rem 0 100%'
              }}></div>

              <h3 className="text-3xl font-bold text-gray-900 mb-6">College Station & Brazos Valley</h3>
              <ul className="space-y-3 text-lg text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--aggie-maroon)' }}></div>
                  College Station
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--aggie-maroon)' }}></div>
                  Bryan
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--aggie-maroon)' }}></div>
                  Navasota
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--aggie-maroon)' }}></div>
                  Hearne
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--aggie-maroon)' }}></div>
                  Caldwell
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--aggie-maroon)' }}></div>
                  Surrounding communities
                </li>
              </ul>
            </div>
            
            <div className="relative group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity" style={{
                background: 'linear-gradient(135deg, #D4AF37, var(--aggie-maroon))',
                borderRadius: '0 1rem 0 100%'
              }}></div>

              <h3 className="text-3xl font-bold text-gray-900 mb-6">Greater Houston Area</h3>
              <ul className="space-y-3 text-lg text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                  Houston
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                  Katy
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                  Sugar Land
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                  The Woodlands
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                  Cypress
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                  Surrounding communities
                </li>
              </ul>
            </div>
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
                The Shield Difference?
              </span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 leading-relaxed">
              Partner with a team that genuinely cares about protecting your investment. Schedule your complimentary consultation today.
            </p>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-lg transition-all font-semibold text-lg shadow-2xl hover:scale-105 transform"
              style={{ 
                background: 'linear-gradient(135deg, #D4AF37, #C5A028)',
                color: '#1a1a1a'
              }}
            >
              Get Started Today <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>15+ Years Excellence</span>
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
