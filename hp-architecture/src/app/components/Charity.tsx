import { Heart, Users, TreePine, Handshake } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Charity() {
  const charityInitiatives = [
    {
      icon: <TreePine size={32} />,
      title: 'Green Spaces for All',
      description: 'We donate our design services to create accessible green spaces in underserved communities, improving quality of life and environmental health.',
    },
    {
      icon: <Users size={32} />,
      title: 'Community Garden Projects',
      description: 'Partnering with local organizations to design and develop community gardens that bring neighbors together and promote urban agriculture.',
    },
    {
      icon: <Handshake size={32} />,
      title: 'Pro Bono Design Work',
      description: 'Every year, we dedicate 10% of our services to nonprofit organizations working to improve outdoor spaces in our communities.',
    },
    {
      icon: <Heart size={32} />,
      title: 'Educational Programs',
      description: 'We provide free landscape architecture workshops and mentorship programs for students from underrepresented backgrounds.',
    },
  ];

  const impactStats = [
    { number: '25+', label: 'Community Projects' },
    { number: '50,000+', label: 'Sq Ft Designed' },
    { number: '$2M+', label: 'Services Donated' },
    { number: '15', label: 'Partner Organizations' },
  ];

  const featuredProjects = [
    {
      id: 1,
      title: 'Urban Community Garden',
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1759702132757-3f6dc69e5189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjBwYXJrJTIwY29tbXVuaXR5JTIwZ2FyZGVufGVufDF8fHx8MTc3MTQ5MDAwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Transformed vacant lot into thriving community garden',
    },
    {
      id: 2,
      title: 'Neighborhood Green Space',
      location: 'Seattle, WA',
      image: 'https://images.unsplash.com/photo-1763377283987-cbaf02cda64a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBsYW5kc2NhcGUlMjBncmVlbiUyMHNwYWNlfGVufDF8fHx8MTc3MTQ5MDAwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Created accessible outdoor space for local residents',
    },
    {
      id: 3,
      title: 'Youth Recreation Area',
      location: 'Portland, OR',
      image: 'https://images.unsplash.com/photo-1763463060293-1bb150061791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub25wcm9maXQlMjBvdXRkb29yJTIwc3BhY2UlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzE0OTAwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Designed safe outdoor play spaces for youth programs',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <Heart size={32} className="text-red-600" />
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-neutral-900">
              Giving Back Through Design
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              At HP Landscape Architecture, we believe everyone deserves access to beautiful, functional outdoor
              spaces. That's why we're committed to using our expertise to strengthen communities
              and create positive environmental impact.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl mb-2 text-white">{stat.number}</div>
                <div className="text-sm text-neutral-400 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Initiatives */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 text-neutral-900">Our Charitable Initiatives</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We're dedicated to making a meaningful difference through strategic partnerships
              and community-focused design projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {charityInitiatives.map((initiative, index) => (
              <div
                key={index}
                className="bg-white border border-neutral-200 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-red-600 mb-4">{initiative.icon}</div>
                <h3 className="text-2xl mb-4 text-neutral-900">{initiative.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charity Projects */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 text-neutral-900">Featured Community Projects</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Explore some of the transformative projects we've completed in partnership with
              community organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-white overflow-hidden group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-2 text-neutral-900">{project.title}</h3>
                  <p className="text-sm text-neutral-500 mb-3">{project.location}</p>
                  <p className="text-neutral-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-900 text-white p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl mb-6">Partner With Us</h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              Are you a nonprofit organization looking for landscape architecture support?
              We'd love to hear about your project and explore how we can help.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-neutral-900 px-8 py-3 text-lg hover:bg-neutral-100 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Values Statement */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6 text-neutral-900">
            Design as a Force for Good
          </h2>
          <p className="text-lg text-neutral-600 leading-relaxed">
            We believe that exceptional design shouldn't be limited to those who can afford it.
            Through our charitable work, we're committed to creating outdoor spaces that serve
            entire communities, promote environmental sustainability, and demonstrate the
            transformative power of thoughtful landscape architecture.
          </p>
        </div>
      </section>
    </div>
  );
}