'use client';

import { useEffect, useState } from 'react';
import AuctionCard from '@/components/auction/AuctionCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { IAuction } from '@/types/auction';
import api from '@/lib/axios';
import { PaginationAuction } from '@/components/paginations/PaginationAuction';
import { useAuctions } from '@/hooks/auction/useAuctions';
import { AuctionFilters } from '@/components/filter/AuctionFilter';
import { AdminAuctionFilterChips } from '@/components/filter/AdminAuctionFilterChips';


export default function AuctionListPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { auctions, loading, setAuctions, totalPages } = useAuctions(page, limit, searchParams);



  // help removes auction when timer hits 0
  // Callback(pass to auctionCard component) to remove expired auction from the list
  const handleAuctionExpire = (expiredId: number) => {
    setAuctions((prev) => prev.filter((auction) => auction.id !== expiredId));
    console.log(`Auction with id ${expiredId} expired and removed.`);
  };

  if (loading) return <p className="text-center mt-10">Loading auctions...</p>;

  return (
    <div className="p-6">
      <div className='max-w-[1580px] mx-auto '>
        <h1 className="text-2xl font-bold mb-4">{`🔥 Auction Items (${auctions.length} items) 🔥`}</h1>

        {/* Filters + Tags */}
        <AuctionFilters />
        <AdminAuctionFilterChips />

        <div className="flex flex-wrap gap-6 py-6 justify-start ">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} onExpire={handleAuctionExpire} />
          ))}
        </div>

        {/* Pagination controls */}
        <PaginationAuction page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
