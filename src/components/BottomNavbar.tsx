'use client';

import React from 'react';

interface BottomNavbarProps {
  activeItem: 'calculator' | 'community' | 'security';
  onItemClick: (item: 'calculator' | 'community' | 'security' | 'route' | 'map') => void;
}

export default function BottomNavbar({ activeItem, onItemClick }: BottomNavbarProps) {
  const isActive = (item: 'calculator' | 'community' | 'security') =>
    activeItem === item;

  return (
    <nav className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 shadow-md z-40">
      <div className="flex justify-around h-16">
        {/* Calculator Nav */}
        <button
          onClick={() => onItemClick('calculator')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('calculator') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mb-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {/* Calculator Icon */}
            <rect x="6" y="3" width="12" height="18" rx="2" ry="2" />
            <path d="M9 7h6M9 11h6M9 15h6" />
          </svg>
          <span className="text-xs font-semibold">Calculator</span>
        </button>

        {/* Community Nav */}
        <button
          onClick={() => onItemClick('community')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('community') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mb-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {/* Community / Users Icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20H7a2 2 0 0 1-2-2v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3a2 2 0 0 1-2 2Z"
            />
            <circle cx="12" cy="7" r="3" />
          </svg>
          <span className="text-xs font-semibold">Community</span>
        </button>

        {/* Security Nav */}
        <button
          onClick={() => onItemClick('security')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('security') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mb-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {/* Shield / Security Icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2 4 5v6c0 5.523 3.806 10.74 8 12 4.194-1.26 8-6.477 8-12V5l-8-3Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4m0-6h.01" />
          </svg>
          <span className="text-xs font-semibold">Security</span>
        </button>
      </div>
    </nav>
  );
}
