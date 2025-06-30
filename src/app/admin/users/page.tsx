'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { profile_default_imgPath } from '@/constants/profileImgPath'

interface User {
  id: string
  username: string
  email: string
  imgPath: string
  coins: number
  createdAt: string
  role: string
  address: string
  phone: string
  bank: string
  account_number: string
  account_name: string
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const truncateWords =(text: string | null, maxWords: number): string => {
        if (!text) return '';
        const words = text.trim().split(/\s+/);
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    }

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user`)
            setUsers(res.data.data)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }
        fetchUsers()
    }, [])


    const getPublicImageUrl = (imgPath: string | undefined) => {
        const publicMinioHost = process.env.NEXT_PUBLIC_MINIO_HOST || 'http://localhost:9001'
        if (!imgPath) return '/default-user.png'
        return imgPath.replace('minio:9001', publicMinioHost)
    }

    const handleDelete = async (id: string) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
    })

    if (!result.isConfirmed) return

    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user/${id}`)
        setUsers(prev => prev.filter(user => user.id !== id))

        await Swal.fire({
        title: 'Deleted!',
        text: 'The user has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        })
    } catch (error) {
        console.error('Failed to delete user:', error)

        await Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the user.',
        icon: 'error',
        })
    }
    }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin: Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-3">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Coins</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Bank</th>
                <th className="px-6 py-3">Account No.</th>
                <th className="px-6 py-3">Account Name</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-2">{user.id}</td>
                  <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.imgPath ? `${getPublicImageUrl(user.imgPath)}` : profile_default_imgPath}
                      alt="profile"
                    />
                    <div className="pl-3">
                      <div className="text-base font-semibold">{user.username}</div>
                      <div className="font-normal text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">{user.coins}</td>
                  <td className="px-6 py-4">{user.role || '-'}</td>
                  <td className="px-6 py-4">{user.phone || '-'}</td>
                  <td className="px-6 py-4">{truncateWords(user.address, 10) || '-'}</td>
                  <td className="px-6 py-4">{user.bank || '-'}</td>
                  <td className="px-6 py-4">{user.account_number || '-'}</td>
                  <td className="px-6 py-4">{user.account_name || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                        onClick={() => handleDelete(user.id)}
                        className="px-5 py-2.5 rounded-lg text-sm cursor-pointer tracking-wider font-medium border-2 border-current outline-none bg-red-700 hover:bg-transparent text-white hover:text-red-700 transition-all duration-300">
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
