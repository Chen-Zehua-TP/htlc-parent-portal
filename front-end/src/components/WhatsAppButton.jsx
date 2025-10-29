import React from 'react';
import whatsappLogo from '../assets/whatsapp.jpg';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/message/NBVYUC7BQ57MD1?src=qr"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 transition-transform duration-300 hover:scale-110 active:scale-95"
      title="Contact us on WhatsApp"
    >
      <img
        src={whatsappLogo}
        alt="WhatsApp"
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl"
      />
    </a>
  );
}
