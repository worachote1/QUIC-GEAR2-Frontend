'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { profile_default_imgPath } from '@/constants/profileImgPath'

interface Product {
  id: string
  name: string
  description: string
  imgPath: string
  price: number
  createdAt: string
}

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const truncateWords = (text: string | null, maxWords: number): string => {
    if (!text) return ''
    const words = text.trim().split(/\s+/)
    if (words.length <= maxWords) return text
    return words.slice(0, maxWords).join(' ') + '...'
  }

  const getPublicImageUrl = (imgPath: string | undefined) => {
    const publicMinioHost = process.env.NEXT_PUBLIC_MINIO_HOST || 'http://localhost:9001'
    if (!imgPath) return profile_default_imgPath
    return imgPath.replace('minio:9001', publicMinioHost)
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product`)
      setProducts(res.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (!result.isConfirmed) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
      await Swal.fire('Deleted!', 'The product has been deleted.', 'success')
    } catch (error) {
      console.error('Failed to delete product:', error)
      await Swal.fire('Error!', 'Could not delete the product.', 'error')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const closeModal = () => setEditingProduct(null)

  const handleSaveEdit = async () => {
    if (!editingProduct) return
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product/${editingProduct.id}`, editingProduct)
      fetchProducts()
      closeModal()
      Swal.fire('Updated!', 'Product has been updated.', 'success')
    } catch (err) {
      console.error('Update error:', err)
      Swal.fire('Error!', 'Update failed.', 'error')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-3">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">
                    <img
                      src={getPublicImageUrl(product.imgPath)}
                      alt="product"
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{truncateWords(product.description, 10)}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">{new Date(product.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full border rounded p-2"
                value={editingProduct.name}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                placeholder="Product Name"
              />
              <textarea
                className="w-full border rounded p-2"
                value={editingProduct.description}
                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                placeholder="Description"
              />
              <input
                type="number"
                className="w-full border rounded p-2"
                value={editingProduct.price}
                onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                placeholder="Price"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
