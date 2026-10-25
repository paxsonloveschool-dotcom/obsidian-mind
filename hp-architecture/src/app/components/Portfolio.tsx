import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Residential', 'Commercial', 'Renovation'];

  const projects = [
    {
      id: 1,
      title: 'Luxury Commercial Plaza',
      category: 'Commercial',
      description: 'High-end commercial landscape architecture',
      image: 'https://images.unsplash.com/photo-1690199827089-9690e82ada14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb21tZXJjaWFsJTIwbGFuZHNjYXBlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MTQ4NzkwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      title: 'Corporate Campus Design',
      category: 'Commercial',
      description: 'Sophisticated corporate landscape architecture',
      image: 'https://images.unsplash.com/photo-1761714499942-51c65c6122da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjYW1wdXMlMjBsYW5kc2NhcGUlMjBkZXNpZ258ZW58MXx8fHwxNzcxNDg3OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 3,
      title: 'Modern Plaza Architecture',
      category: 'Residential',
      description: 'Contemporary public plaza design',
      image: 'https://images.unsplash.com/photo-1766792235532-5f97ddf87979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwbGF6YSUyMGxhbmRzY2FwZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzE0ODc5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 4,
      title: 'High-End Residential Landscape',
      category: 'Commercial',
      description: 'Luxury residential landscape design',
      image: 'https://images.unsplash.com/photo-1758448617677-2f8bebc56d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwcmVzaWRlbnRpYWwlMjBsYW5kc2NhcGUlMjBkZXNpZ258ZW58MXx8fHwxNzcxNDg3OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 5,
      title: 'Urban Landscape Architecture',
      category: 'Renovation',
      description: 'Complex urban landscape project',
      image: 'https://images.unsplash.com/photo-1759591433709-461a8091b3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGxhbmRzY2FwZSUyMGFyY2hpdGVjdHVyZSUyMHByb2plY3R8ZW58MXx8fHwxNzcxNDg3OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 6,
      title: 'Luxury Hotel Landscape',
      category: 'Commercial',
      description: 'Prestigious hotel landscape architecture',
      image: 'https://images.unsplash.com/photo-1759923594358-1028f5ef3895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxhbmRzY2FwZSUyMGRlc2lnbnxlbnwxfHx8fDE3NzE0ODc5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 7,
      title: 'Public Park Design',
      category: 'Residential',
      description: 'Large-scale public park landscape architecture',
      image: 'https://images.unsplash.com/photo-1759702131138-b2656713bfb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjBwYXJrJTIwbGFuZHNjYXBlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MTQ4NzkwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 8,
      title: 'Contemporary Landscape Design',
      category: 'Residential',
      description: 'Modern landscape architecture project',
      image: 'https://images.unsplash.com/photo-1761971975930-ea1cc22ac44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBsYW5kc2NhcGUlMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzcxNDg3OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl mb-6 text-neutral-900">Our Portfolio</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Explore our portfolio of luxury commercial landscape architecture featuring modern office complexes,
            corporate campuses, retail centers, and mixed-use developments.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 transition-colors ${
                  activeFilter === category
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-900 border-2 border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200 mb-4">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500 tracking-wide">{project.category}</p>
                  <h3 className="text-2xl text-neutral-900">{project.title}</h3>
                  <p className="text-neutral-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}