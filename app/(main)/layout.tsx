import { BottomNav } from '@/components/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      <div className="max-w-md mx-auto bg-[#f5f1ed] pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
