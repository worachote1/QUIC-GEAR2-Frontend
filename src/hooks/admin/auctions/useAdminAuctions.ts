import { useEffect, useState } from 'react';
import { IAuction } from '@/types/auction';
import api from '@/lib/axios';

export function useAdminAuctions(page: number, limit: number, searchParams: URLSearchParams) {
  const [auctions, setAuctions] = useState<IAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);

      const query = new URLSearchParams(searchParams);
      query.set('page', String(page));
      query.set('limit', String(limit));

      try {
        const res = await api.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction?${query.toString()}`);
        setAuctions(res.data.data);
        setTotalPages(res.data.meta.totalPages);
      } catch (err) {
        console.error("Failed to load auctions", err);
        setAuctions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [searchParams.toString(), page, limit]);

  return { auctions, loading, setAuctions, totalPages };
}
