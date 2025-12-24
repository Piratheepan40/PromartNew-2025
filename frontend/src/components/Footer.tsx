import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import logo from '@/assets/promart-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Browse Listings', href: '/listings' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content - Single Row Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Brand & Contact */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="mb-3">
              <img
                src={logo}
                alt="ProMart"
                className="h-24 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-slate-300 mb-3 max-w-xs">
              Connecting businesses worldwide with premium B2B solutions.
            </p>

            {/* Contact Info - Horizontal on desktop */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-400 mt-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <a href="mailto:promartlk@gmail.com" className="hover:text-white transition-colors">promartlk@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <a href="tel:+94779520933" className="hover:text-white transition-colors">077 952 0933</a>
              </div>
            </div>
          </div>

          {/* Quick Links - Horizontal */}
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-sky-500 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-blue-500 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-pink-600 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <Separator className="my-6 bg-slate-700" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-xs text-slate-400">
            © {currentYear} ProMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Chavakachcheri, Jaffna</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              SSL Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;