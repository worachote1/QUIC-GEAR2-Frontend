// hooks/useAdmindProducts.ts
// For fetching and listing products

import { useState, useEffect } from 'react'
import axios from 'axios'
import { IUser } from '@/types/user'

export function useAdminUsers() {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user`)
        setUsers(res.data.data)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return {
    users,
    setUsers,
    loading,
  }
}
