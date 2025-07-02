// hooks/useAdmindProducts.ts
// For fetching and listing products

import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { IProduct } from '@/types/product'

export function useAdminProducts() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all products on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product`)
        setProducts(res.data.data.items)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return {
    products,
    loading,
    setProducts,
  }
}
