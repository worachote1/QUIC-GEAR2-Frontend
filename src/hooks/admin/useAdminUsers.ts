// For fetching and listing products

import { useState, useEffect } from 'react'
import { IUser } from '@/types/user'
import api from '@/lib/axios'

export function useAdminUsers() {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user`)
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
