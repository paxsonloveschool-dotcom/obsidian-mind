import { Link } from 'react-router';
import { Trees, Building2, PenTool, Lightbulb, Palette, MonitorPlay } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Services() {
  const services = [
    {
      icon: <Trees size={32} />,
      title: 'Residential Landscape Design',
      description:
        'Transform your outdoor living spaces with custom landscape designs. From concept to completion, we create beautiful, functional gardens and yards.',
      features: ['Garden design', 'Outdoor living areas', 'Plant selection', 'Hardscape design'],
    },
    {
      icon: <Building2 size={32} />,
      title: 'Commercial Landscape Architecture',
      description:
        'Create impactful commercial landscapes that enhance your property value and brand identity. We design parks, plazas, corporate campuses, and more.',
      features: [
        'Site planning',
        'Public spaces',
        'Corporate campuses',
        'Sustainable design',
      ],
    },
    {
      icon: <PenTool size={32} />,
      title: 'Site Plans & Drawings',
      description:
        'Professional site plans and construction drawings for permits and implementation. Detailed technical documentation for contractors and municipalities.',
      features: [
        'Construction documents',
        'Grading plans',
        'Planting plans',
        'Permit drawings',
      ],
    },
    {
      icon: <MonitorPlay size={32} />,
      title: '3D Renderings & Visualization',
      description:
        'Bring your project to life before breaking ground. Our photorealistic 3D renderings help you visualize the final design and make informed decisions.',
      features: [
        'Photorealistic renderings',
        '3D modeling',
        'Virtual walkthroughs',
        'Design presentations',
      ],
    },
    {
      icon: <Palette size={32} />,
      title: 'Master Planning',
      description:
        'Comprehensive long-term planning for large-scale developments. We create cohesive visions that balance aesthetics, function, and sustainability.',
      features: [
        'Community planning',
        'Phasing strategies',
        'Zoning analysis',
        'Vision development',
      ],
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Design Consultation',
      description:
        'Expert guidance for your landscape project. We provide professional advice on design decisions, plant selection, and project feasibility.',
      features: [
        'Design review',
        'Plant consultation',
        'Feasibility studies',
        'Project guidance',
      ],
    },
  ];

  const process = [
    {
      number: '01',
      title: 'Discovery',
      description: 'We analyze your site, understand your vision, and identify opportunities and constraints for the project.',
    },
    {
      number: '02',
      title: 'Concept',
      description: 'Our team develops conceptual designs and 3D renderings that bring your vision to life.',
    },
    {
      number: '03',
      title: 'Documentation',
      description: 'We create detailed site plans, construction drawings, and specifications for implementation.',
    },
    {
      number: '04',
      title: 'Implementation',
      description: 'We provide construction oversight and support to ensure the design is executed to perfection.',
    },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl mb-6 text-neutral-900">Our Services</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Comprehensive landscape architecture services including outdoor design, 3D renderings,
            and site plans for residential and commercial projects.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <div key={index} className="space-y-4">
                <div className="text-neutral-900">{service.icon}</div>
                <h3 className="text-2xl text-neutral-900">{service.title}</h3>
                <p className="text-neutral-600">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-neutral-600">
                      <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6">Our Process</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              A streamlined approach that ensures your project runs smoothly from start to finish
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="space-y-4">
                <div className="text-6xl text-white/20">{step.number}</div>
                <h3 className="text-2xl">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758193017781-e3aee6c3e359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwY29tbWVyY2lhbCUyMGJ1aWxkaW5nJTIwZGVzaWdufGVufDF8fHx8MTc3MTQ4OTMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Upscale commercial building design"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl text-neutral-900">
                Why Choose HP Landscape Architecture?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2 text-neutral-900">Expert Design Team</h3>
                  <p className="text-neutral-600">
                    Our licensed landscape architects combine creativity with technical expertise
                    to deliver exceptional outdoor spaces.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-neutral-900">3D Visualization</h3>
                  <p className="text-neutral-600">
                    See your project before it's built with photorealistic renderings and virtual
                    walkthroughs that bring designs to life.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-neutral-900">Complete Documentation</h3>
                  <p className="text-neutral-600">
                    From conceptual designs to detailed construction drawings, we provide
                    comprehensive site plans for seamless implementation.
                  </p>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-block bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-colors"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}