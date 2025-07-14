'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGavel } from 'react-icons/fa';
import { IAuction, IAuctionRemainingTime } from '@/types/auction';
import { displayCountDownDate } from '@/utils/auction/displayCountDownDate';
import { calculateTimeRemaining } from '@/utils/auction/countdown';
import { getPublicImageUrl } from '@/utils/getPublicImageUrl';

interface AuctionCardProps {
  auction: IAuction;
  onExpire: (id: number) => void;
}

const AuctionCard = ({ auction, onExpire }: AuctionCardProps) => {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState<IAuctionRemainingTime>(
    calculateTimeRemaining(auction.endAuctionDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(auction.endAuctionDate);
      const nonNegativeRemaining = {
        days: Math.max(0, remaining.days),
        hours: Math.max(0, remaining.hours),
        minutes: Math.max(0, remaining.minutes),
        seconds: Math.max(0, remaining.seconds),
        total: Math.max(0, remaining.total),
      };

      setRemainingTime(nonNegativeRemaining);

      if (nonNegativeRemaining.total <= 0) {
        clearInterval(timer);
        onExpire(auction.id);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire, auction.endAuctionDate]);

  return (
    // max-w-sm bg-white rounded overflow-hidden shadow-lg flex flex-col
    <div className="w-full max-w-[280px] bg-white rounded overflow-hidden shadow-lg flex flex-col">
      <img
        src={getPublicImageUrl(auction.product.imgPath[0])}
        alt={auction.product.name}
        className="w-full h-48 object-contain"
      />

      <div className="px-6 py-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-1">{auction.product.name}</div>
          <p className="text-gray-700 text-lg mb-2">
            ฿{auction.buyOutPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-base text-gray-500 mb-2">
            ⏰ {displayCountDownDate(
              remainingTime.days,
              remainingTime.hours,
              remainingTime.minutes,
              remainingTime.seconds
            )}
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => router.push(`/auction/${auction.id}`)}
            className="w-full border border-red-500 bg-white text-red-500 font-bold py-2 px-4 rounded-md hover:cursor-pointer hover:bg-red-500 hover:text-white transition duration-300
            flex items-center justify-center gap-2
            "
          >
            <FaGavel />
            Join Auction
          </button>
        </div>
      </div>

    </div>
  );
};

export default AuctionCard;
