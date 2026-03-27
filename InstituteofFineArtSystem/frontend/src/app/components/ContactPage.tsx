import { useState } from 'react';
import { Link } from 'react-router';
import { Palette, MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submit
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[rgba(0,0,0,0.1)] bg-white sticky top-0 z-10">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px] py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-[10px] bg-gradient-to-br from-[#9810fa] to-[#155dfc] p-2">
              <Palette className="size-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">Institute of Fine Arts</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-slate-600 hover:text-[#9810fa]">Home</Link>
            <Link to="/exhibitions" className="text-slate-600 hover:text-[#9810fa]">Exhibitions</Link>
            <Link to="/about" className="text-slate-600 hover:text-[#9810fa]">About</Link>
            <Link to="/contact" className="text-[#9810fa] font-medium">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] py-16 sm:py-24">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px] text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-[#f3e8ff] max-w-xl mx-auto">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">Get in Touch</h2>
                <p className="text-[#4a5565] leading-relaxed">
                  Whether you have questions about our programs, competitions, or exhibitions, our team is here to help. Don't hesitate to reach out.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: MapPin, label: 'Address', value: '123 Art Boulevard, Creative District\nNew York, NY 10001' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: Mail, label: 'Email', value: 'info@instituteoffineart.edu' },
                  { icon: Clock, label: 'Office Hours', value: 'Mon – Fri: 9:00 AM – 5:00 PM\nSat: 10:00 AM – 2:00 PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="bg-gradient-to-br from-[#9810fa] to-[#155dfc] p-3 rounded-full h-fit shrink-0">
                      <Icon className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a0a0a] mb-0.5">{label}</p>
                      <p className="text-[#4a5565] whitespace-pre-line text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed - OpenStreetMap (no API key needed) */}
              <div className="rounded-[14px] overflow-hidden border border-[rgba(0,0,0,0.1)] h-48">
                <iframe
                  title="Institute of Fine Arts Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0060%2C40.7128%2C-73.9960%2C40.7228&layer=mapnik&marker=40.7178%2C-74.0010"
                />
              </div>
              <a
                href="https://www.openstreetmap.org/?mlat=40.7178&mlon=-74.0010#map=15/40.7178/-74.0010"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#9810fa] hover:underline"
              >
                View larger map ↗
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <CheckCircle2 className="size-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Message Sent!</h3>
                  <p className="text-[#4a5565] mb-6">Thank you for reaching out. We'll get back to you within 1-2 business days.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="text-[#9810fa] font-medium hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#0a0a0a]">Full Name *</label>
                        <input required type="text" placeholder="Your name"
                          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-[rgba(0,0,0,0.15)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9810fa]/30 focus:border-[#9810fa]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#0a0a0a]">Email *</label>
                        <input required type="email" placeholder="your@email.com"
                          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-[rgba(0,0,0,0.15)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9810fa]/30 focus:border-[#9810fa]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#0a0a0a]">Subject *</label>
                      <input required type="text" placeholder="What is this about?"
                        value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-[rgba(0,0,0,0.15)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9810fa]/30 focus:border-[#9810fa]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#0a0a0a]">Message *</label>
                      <textarea required rows={6} placeholder="Tell us more..."
                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-[rgba(0,0,0,0.15)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9810fa]/30 focus:border-[#9810fa] resize-none" />
                    </div>
                    <button type="submit"
                      className="w-full bg-gradient-to-r from-[#9810fa] to-[#155dfc] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <Send className="size-4" />Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white py-8">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px] text-center text-sm text-slate-400">
          <p>© 2026 Institute of Fine Arts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
