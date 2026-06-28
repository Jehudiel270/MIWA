'use client';

import { Home, Search, QrCode, CreditCard, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e1db] px-2 py-3 shadow-lg z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link href="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-[#d4643f]' : 'text-[#786f69]'}`}>
          <Home className="w-6 h-6" />
          <span className="text-xs">Accueil</span>
        </Link>

        <Link href="/search" className={`flex flex-col items-center gap-1 ${isActive('/search') ? 'text-[#d4643f]' : 'text-[#786f69]'}`}>
          <Search className="w-6 h-6" />
          <span className="text-xs">Recherche</span>
        </Link>

        <Link href="/qr" className="flex items-center justify-center w-16 h-16 -mt-8 bg-[#d4643f] rounded-full shadow-xl text-white hover:bg-[#c25838] transition-colors">
          <QrCode className="w-7 h-7" />
        </Link>

        <Link href="/payments" className={`flex flex-col items-center gap-1 ${isActive('/payments') ? 'text-[#d4643f]' : 'text-[#786f69]'}`}>
          <CreditCard className="w-6 h-6" />
          <span className="text-xs">Paiements</span>
        </Link>

        <Link href="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-[#d4643f]' : 'text-[#786f69]'}`}>
          <User className="w-6 h-6" />
          <span className="text-xs">Profil</span>
        </Link>
      </div>
    </div>
  );
}
