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
    const [remainingTime, setRemainingTime] = useState<IAuctionRemainingTime>(calculateTimeRemaining(auction.endAuctionDate));

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
    }, [onExpire])

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <img src={getPublicImageUrl(auction.product.imgPath[0])} alt={auction.product.name} className="h-48 object-cover w-full" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold">{auction.product.name}</h2>
          <p className="text-sm text-gray-500 mt-1">฿{auction.buyOutPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-500 mt-1">{displayCountDownDate(remainingTime.days, remainingTime.hours, remainingTime.minutes, remainingTime.seconds)}</p>
        </div>
        <button
          onClick={() => router.push(`/auction/${auction.id}`)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <FaGavel />
          Join Auction
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;
