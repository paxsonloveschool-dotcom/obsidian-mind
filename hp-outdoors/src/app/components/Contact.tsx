import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - in a real app, this would send to a backend
    alert("Thank you for your inquiry! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      budget: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Begin Your Journey
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 text-primary uppercase tracking-tight">Schedule A Consultation</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto tracking-wide leading-relaxed">
            Transform your property into an extraordinary outdoor sanctuary. Connect with our design specialists today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <div className="space-y-10">
              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className="mb-3 text-primary uppercase tracking-[0.15em] text-xs">Phone</h3>
                  <p className="text-muted-foreground text-lg">(555) 123-4567</p>
                  <p className="text-sm text-muted-foreground tracking-wide mt-1">Monday - Friday, 8:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className="mb-3 text-primary uppercase tracking-[0.15em] text-xs">Email</h3>
                  <p className="text-muted-foreground text-lg">info@hpoutdoors.com</p>
                  <p className="text-sm text-muted-foreground tracking-wide mt-1">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className="mb-3 text-primary uppercase tracking-[0.15em] text-xs">Location</h3>
                  <p className="text-muted-foreground text-lg">Houston, Texas</p>
                  <p className="text-sm text-muted-foreground tracking-wide mt-1">Proudly serving Greater Houston for four generations</p>
                </div>
              </div>

              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className="mb-3 text-primary uppercase tracking-[0.15em] text-xs">Office Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Saturday: 9:00 AM - 4:00 PM</p>
                  <p className="text-muted-foreground">Sunday: By Appointment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted p-10 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-3 uppercase tracking-[0.15em] text-xs text-primary">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-3 uppercase tracking-[0.15em] text-xs text-primary">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-3 uppercase tracking-[0.15em] text-xs text-primary">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="service" className="block mb-3 uppercase tracking-[0.15em] text-xs text-primary">
                  Service Interest
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="">Select a service</option>
                  <option value="design">Landscape Architecture</option>
                  <option value="maintenance">Estate Maintenance</option>
                  <option value="tree-care">Tree & Plant Care</option>
                  <option value="irrigation">Smart Irrigation</option>
                  <option value="hardscaping">Luxury Hardscaping</option>
                  <option value="lighting">Outdoor Lighting</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block mb-3 uppercase tracking-[0.15em] text-xs text-primary">
                  Project Budget *
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="">Select budget range</option>
                  <option value="30-50">$30,000 - $50,000</option>
                  <option value="50-100">$50,000 - $100,000</option>
                  <option value="100-150">$100,000 - $150,000</option>
                  <option value="150-200">$150,000 - $200,000</option>
                  <option value="200-250">$200,000 - $250,000</option>
                  <option value="250+">$250,000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block mb-3 uppercase tracking-[0.15em] text-xs text-primary">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-5 py-4 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-5 transition-all uppercase tracking-[0.2em] text-sm border-2 border-primary"
              >
                Request Consultation
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}