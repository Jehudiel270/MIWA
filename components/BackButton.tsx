'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = '' }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#f5f1ed] transition-colors ${className}`}
    >
      <ChevronLeft className="w-6 h-6 text-[#2d2520]" />
    </button>
  );
}
