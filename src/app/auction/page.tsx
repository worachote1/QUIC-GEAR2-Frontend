'use client';

import { useEffect, useState } from 'react';
import AuctionCard from '@/components/auction/AuctionCard';
import { useRouter } from 'next/navigation';
import { IAuction } from '@/types/auction';
import api from '@/lib/axios';


export default function AuctionListPage() {
  const [auctions, setAuctions] = useState<IAuction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await api.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction`);
        setAuctions(res.data.data);
      } catch (err) {
        console.error("Failed to load auctions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // help removes auction when timer hits 0
  // Callback(pass to auctionCard component) to remove expired auction from the list
  const handleAuctionExpire = (expiredId: number) => {
    setAuctions((prev) => prev.filter((auction) => auction.id !== expiredId));
    console.log(`Auction with id ${expiredId} expired and removed.`);
  };

  if (loading) return <p className="text-center mt-10">Loading auctions...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} onExpire={handleAuctionExpire} />
      ))}
    </div>
  );
}
