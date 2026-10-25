import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const team = [
    {
      name: 'Sarah Mitchell',
      role: 'Founder & Lead Landscape Architect',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      bio: 'With 15 years of experience, Sarah leads our team with a passion for creating sustainable, beautiful outdoor spaces.',
    },
    {
      name: 'Michael Chen',
      role: 'Senior Landscape Architect',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Michael specializes in commercial projects and brings innovative site planning solutions to every design.',
    },
    {
      name: 'Emily Rodriguez',
      role: '3D Visualization Specialist',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      bio: 'Emily creates stunning photorealistic renderings that help clients envision their landscape projects.',
    },
  ];

  const values = [
    {
      title: 'Creativity',
      description:
        'We approach each project with fresh eyes and innovative ideas, pushing boundaries while respecting timeless design principles.',
    },
    {
      title: 'Collaboration',
      description:
        'Your vision is at the heart of everything we do. We work closely with you to ensure the final design exceeds expectations.',
    },
    {
      title: 'Quality',
      description:
        'We never compromise on quality. From materials to craftsmanship, we ensure every element meets our high standards.',
    },
    {
      title: 'Sustainability',
      description:
        'We prioritize eco-friendly materials and practices, creating beautiful spaces that are kind to the planet.',
    },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl mb-6 text-neutral-900">About Us</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            We're a team of passionate landscape architects dedicated to creating outdoor spaces
            that inspire, connect people with nature, and enhance communities.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl text-neutral-900">Our Story</h2>
              <p className="text-lg text-neutral-600">
                HP Landscape Architecture was founded in 2011 with a mission to transform outdoor spaces
                through exceptional landscape architecture. What started as a small studio has
                grown into a full-service firm serving clients nationwide.
              </p>
              <p className="text-lg text-neutral-600">
                We specialize in outdoor design, creating detailed 3D renderings and comprehensive
                site plans for residential gardens, commercial developments, public parks, and
                corporate campuses. Our approach combines artistic vision with technical precision.
              </p>
              <p className="text-lg text-neutral-600">
                Every project, whether a intimate backyard retreat or a large commercial plaza,
                receives our full attention and expertise. We believe great landscape design
                enhances quality of life and creates lasting value.
              </p>
            </div>
            <div className="relative aspect-square">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1728149580639-5911ca2f6e1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwb2ZmaWNlJTIwcGFyayUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzE0ODkzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Premium office park landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 text-neutral-900">Our Values</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              The principles that guide our work and define who we are
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-2xl text-neutral-900">{value.title}</h3>
                <p className="text-lg text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 text-neutral-900">Meet Our Team</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Talented designers who bring creativity, expertise, and passion to every project
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative aspect-square mb-6 overflow-hidden bg-neutral-200">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-2xl mb-2 text-neutral-900">{member.name}</h3>
                <p className="text-neutral-500 mb-4">{member.role}</p>
                <p className="text-neutral-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Let's Create Something Beautiful Together</h2>
          <p className="text-xl mb-8 text-white/80">
            Ready to transform your outdoor space? We'd love to hear about your landscape project.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 hover:bg-neutral-100 transition-colors"
          >
            Get In Touch
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}