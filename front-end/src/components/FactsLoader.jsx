import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

const FACTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  'Vestibulum tortor quam, feugiat vitae, ultricies eget, fermentum sit amet, justo.',
  'Donec eu libero sit amet quam egestas semper aenean ultricies mi vitae est.',
  'Mauris placerat eleifend leo quisque sit amet est et sapien ullamcorper pharetra.',
  'Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.',
];

export default function FactsLoader() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % FACTS.length);
    }, 4000); // Change fact every 4 seconds

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
