// For fetching and listing products

import { useState, useEffect } from 'react'
import { IProduct } from '@/types/product'
import api from '@/lib/axios'

export function useAdminProducts(page: number, limit: number, searchParams: URLSearchParams) {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const query = new URLSearchParams(searchParams);
      query.set('page', String(page));
      query.set('limit', String(limit));

      try {
        const res = await api.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product?${query.toString()}`)

        setProducts(res.data.data.items)
        setTotalPages(res.data.meta.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err)
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchParams.toString(), page, limit])

  return {
    products,
    setProducts,
    loading,
    totalPages
  }
}
