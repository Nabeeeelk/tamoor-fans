"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const phoneNumber = "923000000000"; // Placeholder
  const message = "Hi, I want to buy Tamoor Fans. Can you help me?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-28 md:bottom-8 right-4 md:right-8 z-40 bg-[#25D366] text-white p-3.5 md:p-4 rounded-full shadow-2xl flex items-center justify-center group border-4 border-white/20 hover:border-white/40 transition-all"
    >
      <MessageCircle className="w-7 h-7 fill-white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap font-bold">
        Chat with us
      </span>
      
      {/* Pulse animation background */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
    </motion.a>
  );
};

export default WhatsAppButton;
