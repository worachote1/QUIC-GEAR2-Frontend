import axios from 'axios';
import Swal from 'sweetalert2';
import { IAuction } from '@/types/auction';
import { AuctionStatus } from '@/enum/enum';

export function useAdminAuctionActions(setAuctions: React.Dispatch<React.SetStateAction<IAuction[]>>) {
  const updateAuctionStatus = async (auctionId: number, newStatus: AuctionStatus) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction/${auctionId}`, {
        auctionStatus: newStatus,
      });

      setAuctions(prev => prev.map(a =>
        a.id === auctionId ? { ...a, auctionStatus: newStatus } : a
      ));

      Swal.fire('Success!', 'Auction status updated.', 'success');
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error!', err.response?.data?.message || 'Failed to update auction status', 'error');
    }
  };

  return { updateAuctionStatus };
}
