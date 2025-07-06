// For fetching and listing products

import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { IProduct } from '@/types/product'

export function useAdminProducts(page: number, limit: number) {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product?page=${page}&limit=${limit}`,
        {
          withCredentials: true
        })
        setProducts(res.data.data.items)
        setTotalPages(res.data.meta.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [page, limit])

  return {
    products,
    setProducts,
    loading,
    totalPages
  }
}
