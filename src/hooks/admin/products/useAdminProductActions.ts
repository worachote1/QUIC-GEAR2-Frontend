// for actions like update, delete
import Swal from 'sweetalert2'
import { IProduct } from '@/types/product'
import { IProductFormData } from '@/types/product'
import api from '@/lib/axios'

export function useAdminProductActions(setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>, closeModal: () => void) {
  const handleDeleteProduct = async (prod: IProduct) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirm delete',
      text: 'Cannot undo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    })
    if (!isConfirmed) return

    try {
      // Delete images if exist
      if (prod.imgPath?.length) {
        await api.post(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/file-upload/delete`, {
          paths: prod.imgPath,
        }, 
        {
          withCredentials: true
        })
      }

      // Delete product
      await api.delete(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product/${prod.id}`, 
      {
        withCredentials: true
      })
      setProducts(prev => prev.filter(p => p.id !== prod.id))
      Swal.fire('Deleted!', '', 'success')
    } catch {
      Swal.fire('Error!', 'Failed to delete product', 'error')
    }
  }

  const handleUpdateProduct = async (data: IProductFormData, editing: IProduct) => {
    if (!editing) return;

    // Construct base payload
    const payload: any = {
      name: data.name,
      price: +data.price,
      type: data.type,
      subType: data.subType,
      brand: data.brand,
      isWireless: data.isWireless === 'true',
      isRGB: data.isRGB === 'true',
      stock: +data.stock,
      description: data.description || '',
    }

    try {
      const files = data.imgPath
      const hasNewImages = files && files.length > 0

      // Upload new images
      if (hasNewImages) {
        const formData = new FormData()
        Array.from(files).forEach(file => formData.append('images', file))

        const uploadRes = await api.post(
          `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/file-upload/multiple`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        )

        const newImagePaths = uploadRes.data.image_urls || []

        // Delete old images
        await api.post(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/file-upload/delete`, {
          paths: editing.imgPath ?? [],
        }, 
        {
          withCredentials: true
        })

        payload.imgPath = newImagePaths
      }

      // Update the product
      await api.patch(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product/${editing.id}`, payload,
      {
        withCredentials: true
      })

      // Update UI state
      setProducts(prev =>
        prev.map(p => (p.id === editing.id ? { ...p, ...payload } : p))
      )

      Swal.fire('Updated!', '', 'success')
      closeModal()
    } catch (err) {
      console.error(err)
      Swal.fire('Error!', 'Failed to update', 'error')
    }
  }

  return {
    handleDeleteProduct,
    handleUpdateProduct,
  }
}
