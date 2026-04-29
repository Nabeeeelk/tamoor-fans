import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Phone, Mail, MapPin, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-secondary text-white pt-12 pb-16 md:pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="text-brand-primary w-6 h-6 fill-brand-primary" />
            <span className="text-2xl font-bold tracking-tight">
              TAIMOOR<span className="text-brand-primary">FANS</span>
            </span>
          </Link>
          <p className="text-gray-400 max-w-xs">
            Pakistan's leading manufacturer of high-performance, energy-efficient BLDC fans. Saving your electricity since 1995.
          </p>
          <div className="flex items-center gap-4">
            {[FaFacebook, FaInstagram, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="bg-white/5 hover:bg-brand-primary transition-colors p-3 rounded-full flex items-center justify-center"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Shop Fans</h4>
          <ul className="space-y-4">
            {['Ceiling Fans', 'Pedestal Fans', 'Exhaust Fans', 'Bracket Fans', 'New Arrivals'].map((link) => (
              <li key={link}>
                <Link href="/products" className="text-gray-400 hover:text-brand-primary transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help & Info */}
        <div>
          <h4 className="text-lg font-bold mb-6">Customer Care</h4>
          <ul className="space-y-4">
            {['Track Order', 'Warranty Policy', 'Shipping Info', 'Savings Calculator', 'Contact Us'].map((link) => (
              <li key={link}>
                <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-brand-primary transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-lg font-bold mb-6">Get In Touch</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-gray-400">
              <Phone className="w-5 h-5 text-brand-primary shrink-0 mt-1" />
              <span>+92-XXX-XXXXXXX</span>
            </div>
            <div className="flex items-start gap-3 text-gray-400">
              <Mail className="w-5 h-5 text-brand-primary shrink-0 mt-1" />
              <span>info@tamoorfans.com</span>
            </div>
            <div className="flex items-start gap-3 text-gray-400">
              <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-1" />
              <span>G.T. Road, Gujrat, Pakistan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Tamoor Fans. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
