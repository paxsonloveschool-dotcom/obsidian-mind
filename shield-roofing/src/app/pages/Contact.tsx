import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the data to a backend
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        serviceType: "",
        message: "",
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
      icon: Phone,
      title: "Phone",
      content: "(979) 555-1234",
      link: "tel:+19795551234",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@topshieldroofing.com",
      link: "mailto:info@topshieldroofing.com",
    },
    {
      icon: MapPin,
      title: "Service Areas",
      content: "College Station, TX & Houston Area",
      link: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Sat: 7AM - 6PM, 24/7 Emergency Service",
      link: null,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to bottom right, var(--aggie-maroon), var(--aggie-maroon-dark))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl opacity-90">
              Get in touch with us today for a free consultation and quote. We're here to help with all your roofing needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: 'rgba(128, 0, 0, 0.1)' }}>
                  <info.icon className="h-6 w-6" style={{ color: 'var(--aggie-maroon)' }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aggie-maroon)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Request a Free Quote</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible with a free, no-obligation quote.
              </p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-green-700">
                    We've received your request and will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(979) 555-1234"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Property Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, College Station, TX"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Needed *</Label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select a service</option>
                      <option value="installation">Roof Installation</option>
                      <option value="repair">Roof Repair</option>
                      <option value="replacement">Roof Replacement</option>
                      <option value="storm">Storm Damage</option>
                      <option value="inspection">Inspection</option>
                      <option value="emergency">Emergency Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your roofing needs..."
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="h-5 w-5 mr-2" />
                    Submit Request
                  </Button>
                </form>
              )}
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-lg p-8 shadow-md h-fit">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: 'var(--aggie-maroon)' }}>
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">We Review Your Request</h4>
                    <p className="text-gray-600 text-sm">
                      Our team will carefully review your information and roofing needs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: 'var(--aggie-maroon)' }}>
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Schedule Inspection</h4>
                    <p className="text-gray-600 text-sm">
                      We'll contact you to schedule a convenient time for a free inspection.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: 'var(--aggie-maroon)' }}>
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Receive Your Quote</h4>
                    <p className="text-gray-600 text-sm">
                      After the inspection, we'll provide a detailed, no-obligation quote.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: 'var(--aggie-maroon)' }}>
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Get Started</h4>
                    <p className="text-gray-600 text-sm">
                      Once approved, we'll schedule your project and complete the work.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(128, 0, 0, 0.05)' }}>
                <h4 className="font-semibold text-gray-900 mb-2">Need Immediate Help?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  For emergency roofing services, call us now:
                </p>
                <a
                  href="tel:+19795551234"
                  className="block w-full text-white text-center px-6 py-3 rounded-md transition-colors font-semibold"
                  style={{ backgroundColor: 'var(--aggie-maroon)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--aggie-maroon-dark)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--aggie-maroon)'}
                >
                  <Phone className="inline h-5 w-5 mr-2" />
                  (979) 555-1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Map */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Areas</h2>
            <p className="text-xl text-gray-600">
              Proudly serving College Station, Bryan, Houston, and surrounding areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                College Station & Brazos Valley
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  College Station
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  Bryan
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  Navasota
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  Surrounding communities
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Greater Houston Area</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  Houston
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  Katy
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  Sugar Land
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--aggie-maroon)' }} />
                  The Woodlands
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}