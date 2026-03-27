import { Link } from 'react-router';
import { Palette, Trophy, Users, Star, BookOpen, Heart } from 'lucide-react';

export function AboutPage() {
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
            <Link to="/about" className="text-[#9810fa] font-medium">About</Link>
            <Link to="/contact" className="text-slate-600 hover:text-[#9810fa]">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] py-16 sm:py-24">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px] text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-lg text-[#f3e8ff] max-w-2xl mx-auto">
            Nurturing artistic talent and celebrating creativity since 1985
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4">Our Mission</h2>
              <p className="text-[#4a5565] text-lg leading-relaxed mb-4">
                The Institute of Fine Arts is dedicated to fostering artistic excellence and providing a platform for emerging and established artists to showcase their talents.
              </p>
              <p className="text-[#4a5565] leading-relaxed">
                We believe that art has the power to transform communities, inspire change, and connect people across cultures. Through our competitions, exhibitions, and educational programs, we strive to make fine arts accessible to everyone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Trophy, label: 'Annual Competitions', value: '10+', color: 'bg-yellow-50 text-yellow-600' },
                { icon: Users, label: 'Students Enrolled', value: '500+', color: 'bg-blue-50 text-blue-600' },
                { icon: Star, label: 'Awards Issued', value: '200+', color: 'bg-purple-50 text-purple-600' },
                { icon: Heart, label: 'Years of Excellence', value: '40+', color: 'bg-red-50 text-red-600' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full ${color} mb-3`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="text-2xl font-bold text-[#0a0a0a]">{value}</div>
                  <p className="text-sm text-[#717182] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px]">
          <h2 className="text-3xl font-bold text-[#0a0a0a] text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Education First', desc: 'We prioritize learning and skill development, providing students with the tools and knowledge to grow as artists.' },
              { icon: Star, title: 'Excellence', desc: 'We hold ourselves and our students to the highest standards of artistic quality and professional conduct.' },
              { icon: Heart, title: 'Inclusivity', desc: 'Art belongs to everyone. We welcome artists of all backgrounds, styles, and experience levels.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-[14px] p-8 border border-[rgba(0,0,0,0.1)]">
                <div className="bg-gradient-to-br from-[#9810fa] to-[#155dfc] p-3 rounded-full w-fit mb-4">
                  <Icon className="size-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">{title}</h3>
                <p className="text-[#4a5565] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px]">
          <h2 className="text-3xl font-bold text-[#0a0a0a] text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Dr. Emily Chen', role: 'Director', desc: 'PhD in Fine Arts with 20 years of experience in art education and curation.' },
              { name: 'Prof. James Wilson', role: 'Head of Competitions', desc: 'Award-winning artist and educator specializing in contemporary painting.' },
              { name: 'Ms. Sarah Park', role: 'Exhibition Curator', desc: 'Expert in art exhibition design with international gallery experience.' },
            ].map(({ name, role, desc }) => (
              <div key={name} className="text-center p-6 border border-[rgba(0,0,0,0.1)] rounded-[14px]">
                <div className="size-20 rounded-full bg-gradient-to-br from-[#9810fa] to-[#155dfc] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg text-[#0a0a0a]">{name}</h3>
                <p className="text-[#9810fa] text-sm font-medium mb-2">{role}</p>
                <p className="text-[#4a5565] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#9810fa] to-[#155dfc]">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-[79px] text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-[#f3e8ff] mb-8 text-lg">Be part of a vibrant artistic community that celebrates creativity and excellence.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="bg-white text-[#9810fa] px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors">
                Register Now
              </button>
            </Link>
            <Link to="/contact">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </Link>
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
