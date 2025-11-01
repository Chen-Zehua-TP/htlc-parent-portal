import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import whatsappLogo from '../assets/whatsapp.jpg';

export default function WhatsAppButton() {
  const { authUser } = useAuthStore();
  const [whatsappLink, setWhatsappLink] = useState('#');

  // All hooks must be called before any early returns
  useEffect(() => {
    if (!authUser?.studentId) {
      setWhatsappLink('#');
      return;
    }

    // Get first letter of student ID
    const studentIdFirstLetter = authUser.studentId.charAt(0).toUpperCase();

    // Determine WhatsApp link based on student ID prefix
    let link = '#';
    switch (studentIdFirstLetter) {
      case 'S':
        link = 'https://wa.me/message/NBVYUC7BQ57MD1?src=qr';
        break;
      case 'B':
        link = 'https://wa.me/message/KB5IFHZM2QQBD1?src=qr';
        break;
      case 'G':
        link = 'https://wa.me/message/D7DEALLSQPIYF1?src=qr';
        break;
      case 'T':
        link = 'https://wa.me/message/66V4EJ6XWEGEC1?src=qr';
        break;
      case 'L':
        link = 'https://wa.me/message/LDR7JCZ7OWCVL1?src=qr';
        break;
      case 'H':
        link = 'https://wa.me/88010944';
        break;
      case 'R':
        link = 'https://wa.me/message/LDR7JCZ7OWCVL1?src=qr';
        break;
      default:
        link = '#';
    }

    setWhatsappLink(link);
  }, [authUser?.studentId]);

  // Early returns must come after all hook calls
  if (!authUser) {
    return null;
  }

  if (whatsappLink === '#') {
    return null;
  }

  return (
    <a
      href={whatsappLink}
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
