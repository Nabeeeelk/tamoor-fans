"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: '+92 300 1234567',
      link: 'tel:+923001234567'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'WhatsApp',
      details: 'Chat with us 24/7',
      link: 'https://wa.me/923001234567'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: 'support@taimoorfans.com',
      link: 'mailto:support@taimoorfans.com'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Factory',
      details: 'S.I.E, Gujrat, Pakistan',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column: Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-5xl font-black text-slate-900 mb-6">Get in <span className="text-emerald-500">Touch</span></h1>
                <p className="text-xl text-slate-500 leading-relaxed">
                  Have questions about our products or need technical support? 
                  Our team is here to help you choose the right energy-saving solution for your home.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info, i) => (
                  <a 
                    key={i} 
                    href={info.link}
                    className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {info.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{info.title}</h3>
                    <p className="text-slate-500">{info.details}</p>
                  </a>
                ))}
              </div>

              <div className="p-8 rounded-[32px] bg-slate-900 text-white overflow-hidden relative">
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Clock className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Business Hours</h4>
                    <p className="text-slate-400">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] p-10 md:p-14 shadow-2xl border border-slate-100"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Ahmed Khan" 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+92 300 0000000" 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none">
                  <option>General Inquiry</option>
                  <option>Sales Question</option>
                  <option>Technical Support</option>
                  <option>Warranty Claim</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                <textarea 
                  rows={5} 
                  placeholder="How can we help you?" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full py-5 rounded-2xl shadow-xl shadow-emerald-500/20 text-lg font-bold"
              >
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
