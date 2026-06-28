import { GreetingHeader } from '@/components/GreetingHeader';
import { ActiveReservation } from '@/components/ActiveReservation';
import { TrendingPlaces } from '@/components/TrendingPlaces';

export default function HomePage() {
  return (
    <div className="pb-6">
      <GreetingHeader />
      <ActiveReservation />
      <TrendingPlaces />
    </div>
  );
}
