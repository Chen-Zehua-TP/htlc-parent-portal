import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

const FACTS = [
  'Click the WhatsApp Button at the bottom right to contact us directly',
  'Happy Tutors offer personalized tutoring for all levels — from primary and AEIS to secondary, O Levels, and JC'
];

export default function FactsLoader() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % FACTS.length);
    }, 5000); // Change fact every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8 px-6">
      <Loader className="animate-spin size-12 text-blue-600" />
      <div className="max-w-md text-center">
        <p className="text-lg text-gray-700 leading-relaxed">
          {FACTS[currentFactIndex]}
        </p>
      </div>
    </div>
  );
}
