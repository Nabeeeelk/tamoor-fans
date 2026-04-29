import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Users, Shield, Target } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Years of Excellence', value: '25+' },
    { label: 'Satisfied Customers', value: '500k+' },
    { label: 'Dealers Nationwide', value: '150+' },
    { label: 'Energy Savings', value: '60%' },
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: 'Quality First',
      description: 'We never compromise on the quality of our motors and materials, ensuring long-lasting performance.'
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: 'Innovation',
      description: 'Leading the market with advanced BLDC motor technology that saves maximum electricity.'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: 'Customer Centric',
      description: 'Our support team is always ready to help our customers across Pakistan.'
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      title: 'Reliability',
      description: 'Tested in the toughest Pakistani summers to ensure consistent performance under load.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/about-hero.jpg" 
            alt="Taimoor Fans Factory" 
            fill 
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Our Story of <span className="text-emerald-400">Excellence</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Manufacturing Pakistan's most energy-efficient fans since 1998. Committed to quality, driven by innovation.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <Image 
                src="/factory.jpg" 
                alt="Production Line" 
                fill 
                className="object-cover"
              />
            </div>
            
            <div className="space-y-8">
              <div className="inline-flex px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold uppercase tracking-wider">
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Saving Energy, One Home at a Time.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Taimoor Fans started with a simple vision: to provide Pakistani households with cooling solutions that don't burn a hole in their pockets. In an era of rising electricity costs, we pioneered the development of 30W BLDC motor fans.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Today, we are proud to be one of Pakistan's leading manufacturers of energy-saving fans, helping thousands of families save over 60% on their electricity bills every year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-6">Our Core Values</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            What makes Taimoor Fans different is our commitment to these fundamental principles.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <div key={i} className="p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="mb-6">{value.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
              <p className="text-slate-500 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
