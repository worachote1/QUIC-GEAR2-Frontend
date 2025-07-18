'use client';

import { useState } from 'react';
import { useAdminAuctions } from '@/hooks/admin/auctions/useAdminAuctions';
import { useAdminAuctionActions } from '@/hooks/admin/auctions/useAdminAuctionActions';
import { AUCTION_STATUS, statusTransitions } from '@/constants/auction/auctionStatus';
import { AuctionStatus } from '@/enum/enum';
import { getAuctionStatusClass } from '@/utils/auction/auctionStyle';
import { PaginationAdmin } from '@/components/paginations/PaginationAdmin';
import { useSearchParams } from 'next/navigation';
import { AdminAuctionFilters } from '@/components/filter/AdminAuctionFilters';
import { AdminAuctionFilterChips } from '@/components/filter/AdminAuctionFilterChips';

export default function AdminAuctionPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { auctions, loading, setAuctions, totalPages } = useAdminAuctions(page, limit, searchParams);
  const { updateAuctionStatus } = useAdminAuctionActions(setAuctions);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Auctions</h1>

      {/* Filters + Tags */}
      <AdminAuctionFilters />
      <AdminAuctionFilterChips />

      {loading ? <p>Loading…</p> : (
        <table className="w-full text-sm text-left mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Sub-Type</th>
              <th className="px-4 py-2">Wireless</th>
              <th className="px-4 py-2">RGB</th>
              <th className="px-4 py-2">Start Price</th>
              <th className="px-4 py-2">Buy Out Price</th>              
              <th className="px-4 py-2">Start</th>
              <th className="px-4 py-2">End</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{a.id}</td>
                <td className="px-4 py-2">{a.product?.name}</td>
                <td className="px-4 py-2">{a.product?.id}</td>
                <td className="px-4 py-2">{a.product?.name}</td>
                <td className="px-4 py-2">{a.product?.brand}</td>
                <td className="px-4 py-2">{a.product?.type}</td>
                <td className="px-4 py-2">{a.product?.subType}</td>
                <td className="px-4 py-2">฿{a.startPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2">฿{a.buyOutPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2">{new Date(a.startAuctionDate).toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(a.endAuctionDate).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getAuctionStatusClass(a.auctionStatus)}`}>
                    {a.auctionStatus.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <select
                    className="border px-3 py-1 rounded text-sm bg-white text-gray-800 shadow-sm hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    defaultValue=""
                    onChange={(e) => updateAuctionStatus(a.id, e.target.value as AuctionStatus)}
                    disabled={statusTransitions[a.auctionStatus].length === 0}
                  >
                    <option value="" disabled>Change Status</option>
                    {statusTransitions[a.auctionStatus].map(status => (
                      <option key={status} value={status}>{status.replace("_", " ")}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination controls */}
      <PaginationAdmin page={page} setPage={setPage} totalPages={totalPages} />

    </div>
  );
}
