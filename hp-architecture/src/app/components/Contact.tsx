import { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: 'Visit Us',
      content: '123 Design Street, Suite 100\nNew York, NY 10001',
    },
    {
      icon: <Phone size={24} />,
      title: 'Call Us',
      content: '(555) 123-4567\nMon-Fri 9am-6pm EST',
    },
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      content: 'hello@hparchitecture.com\ninfo@hparchitecture.com',
    },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl mb-6 text-neutral-900">Get In Touch</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Ready to transform your outdoor space? We'd love to hear about your landscape project
            and discuss how we can bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-neutral-900">{info.icon}</div>
                <h3 className="text-xl mb-2 text-neutral-900">{info.title}</h3>
                <p className="text-neutral-600 whitespace-pre-line">{info.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl mb-8 text-neutral-900">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 mb-6">
                  <p className="text-lg">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : null}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2 text-neutral-900">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 text-neutral-900">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm mb-2 text-neutral-900">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="projectType" className="block text-sm mb-2 text-neutral-900">
                    Project Type *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Select a project type</option>
                    <option value="residential">Residential Landscape</option>
                    <option value="commercial">Commercial Landscape</option>
                    <option value="site-plan">Site Plan & Drawings</option>
                    <option value="3d-rendering">3D Rendering</option>
                    <option value="consultation">Design Consultation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm mb-2 text-neutral-900">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Select a budget range</option>
                    <option value="under10k">Under $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="over100k">Over $100,000</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm mb-2 text-neutral-900">
                    Tell us about your project *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-colors w-full justify-center md:w-auto"
                >
                  Send Message
                  <Send size={20} />
                </button>
              </form>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/5] lg:aspect-auto">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758193017781-e3aee6c3e359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Modern commercial landscape architecture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-12 text-center text-neutral-900">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl mb-3 text-neutral-900">How does the landscape design process work?</h3>
              <p className="text-neutral-600">
                We begin with a site analysis and consultation to understand your goals. Then we
                develop conceptual designs with 3D renderings, create detailed site plans and
                construction drawings, and provide oversight during implementation. Projects
                typically take 2-6 months depending on scope.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3 text-neutral-900">What are your fees?</h3>
              <p className="text-neutral-600">
                Our fees vary based on project size, complexity, and services required. We offer
                hourly consultations, design packages, and full-service landscape architecture. A
                detailed proposal will be provided after our initial consultation.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3 text-neutral-900">
                Do you provide 3D renderings for all projects?
              </h3>
              <p className="text-neutral-600">
                Yes! We believe visualization is crucial for decision-making. Most of our design
                packages include photorealistic 3D renderings so you can see exactly how your
                outdoor space will look before construction begins.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3 text-neutral-900">
                Can you help with permits and approvals?
              </h3>
              <p className="text-neutral-600">
                Absolutely. We prepare comprehensive site plans and construction documents that meet
                local requirements. We can also assist with the permitting process and municipal
                approvals as needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}