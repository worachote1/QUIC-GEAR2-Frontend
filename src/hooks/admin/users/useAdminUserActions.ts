// hooks/useProductActions.ts
import Swal from 'sweetalert2'
import { IUser } from '@/types/user'
import api from '@/lib/axios'

export function useAdminUserActions(setUsers: React.Dispatch<React.SetStateAction<IUser[]>>) {
  const handleUserDelete = async (id: string) => {
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
        await api.delete(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user/${id}`)
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

  return {
    handleUserDelete
  }
}
