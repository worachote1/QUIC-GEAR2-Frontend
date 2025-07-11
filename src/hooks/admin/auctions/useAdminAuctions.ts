import { useEffect, useState } from 'react';
import axios from 'axios';
import { IAuction } from '@/types/auction';

export function useAdminAuctions() {
  const [auctions, setAuctions] = useState<IAuction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction`);
        setAuctions(res.data.auctions);
      } catch (err) {
        console.error("Failed to load auctions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return { auctions, loading, setAuctions };
}
