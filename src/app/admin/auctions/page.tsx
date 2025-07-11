'use client';

import { useState } from 'react';
import { useAdminAuctions } from '@/hooks/admin/auctions/useAdminAuctions';
import { useAdminAuctionActions } from '@/hooks/admin/auctions/useAdminAuctionActions';
import { AUCTION_STATUS, statusTransitions } from '@/constants/auctionStatus';
import { AuctionStatus } from '@/enum/enum';

export default function AdminAuctionPage() {
  const { auctions, loading, setAuctions } = useAdminAuctions();
  const { updateAuctionStatus } = useAdminAuctionActions(setAuctions);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Auctions</h1>

      {loading ? <p>Loading…</p> : (
        <table className="w-full text-sm text-left mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Product Name</th>
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
                <td className="px-4 py-2">฿{a.startPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2">฿{a.buyOutPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2">{new Date(a.startAuctionDate).toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(a.endAuctionDate).toLocaleString()}</td>
                <td className="px-4 py-2 font-medium">{a.auctionStatus}</td>
                <td className="px-4 py-2">
                  <select
                    className="border px-2 py-1 rounded text-sm"
                    value=""
                    onChange={(e) => updateAuctionStatus(a.id, e.target.value as AuctionStatus)}
                    disabled={statusTransitions[a.auctionStatus].length === 0}
                  >
                    <option value="" disabled>Change Status</option>
                    {statusTransitions[a.auctionStatus].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
