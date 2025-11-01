'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface BottomNavbarProps {
  activeItem: 'calculator' | 'community' | 'security';
  onItemClick: (item: 'calculator' | 'community' | 'security' | 'route' | 'map') => void;
}

export default function BottomNavbar({ activeItem, onItemClick }: BottomNavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed inset-x-0 bottom-0 bg-white shadow-lg z-40">
      <div className="flex justify-around h-16">
        {/* Calculator Nav */}
        <Link href="#" className="flex flex-col items-center justify-center flex-1 text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM6 21v-7.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75V21m-12 0h12" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.75a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25V5.25a2.25 2.25 0 0 1 2.25-2.25h1.5ZM12 3v-1.5" />
          </svg>
          <span className="text-xs font-bold">Calculator</span>
        </Link>

        {/* Community Nav */}
        <Link href="#" className="flex flex-col items-center justify-center flex-1 text-gray-500 hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.51.056 1.02.086 1.5.086s.99-.03 1.5-.086m-7.5 0a48.667 48.667 0 0 0-7.5 0m7.5 0a48.667 48.667 0 0 1 7.5 0m-7.5 0a48.667 48.667 0 0 1-7.5 0m15 0a48.667 48.667 0 0 0-7.5 0m7.5 0a48.667 48.667 0 0 1 7.5 0m-7.5 0a48.667 48.667 0 0 1-7.5 0" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-2.148 0-4.076.884-5.5 2.25m11 0c-1.424-1.366-3.352-2.25-5.5-2.25m-5.5 2.25a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75Z" />
          </svg>
          <span className="text-xs font-medium">Community</span>
        </Link>

        {/* Security Nav */}
        <Link href="#" className="flex flex-col items-center justify-center flex-1 text-gray-500 hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.749m-15.4 0A11.959 11.959 0 0 1 6 3.598m0 0A11.959 11.959 0 0 1 12 2.25c1.534 0 3.022.282 4.402.818m-8.804 0a11.959 11.959 0 0 1 8.804 0m-8.804 0A11.959 11.959 0 0 1 6 3.598m0 0A11.959 11.959 0 0 1 12 2.25c1.534 0 3.022.282 4.402.818m-8.804 0a11.959 11.959 0 0 1 8.804 0" />
          </svg>
          <span className="text-xs font-medium">Security</span>
        </Link>
      </div>
    </nav>
  );
}