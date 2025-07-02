// hooks/useAdmindProducts.ts
// For fetching and listing products

import { useState, useEffect } from 'react'
import axios from 'axios'

export function useAdminUsers() {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product`)
        setProducts(res.data.data.items)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    setProducts,
  }
}
