'use client'

import { brandList, subTypeMap, typeList } from '@/constants/productOptions'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useAdminProductActions } from '@/hooks/admin/useAdminProductActions'
import { useAdminProducts } from '@/hooks/admin/useAdminProducts'
import { useAdminProductEditor } from '@/hooks/admin/useAdminProductEditor'
import { useState } from 'react';
import { PaginationAdmin } from '@/components/paginations/PaginationAdmin';

export default function AdminProductPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { products, loading, setProducts, totalPages } = useAdminProducts(page, limit)

  const {
    editing,
    setEditing,
    register,
    handleSubmit,
    selectedType,
    errors,
    openEdit,
    closeModal,
  } = useAdminProductEditor();

  const { handleDeleteProduct, handleUpdateProduct } = useAdminProductActions(setProducts, closeModal)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Products</h1>

      {loading ? <p>Loading…</p> : (
        <table className="w-full text-sm text-left mt-4">
          <thead className="bg-gray-50">
            <tr>
              {['ID','Name','brand', 'type', 'subType', 'Price','Stock','Wireless','RGB','Actions'].map(h => (
                <th key={h} className="px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.brand}</td>
                <td className="px-4 py-2">{p.type}</td>
                <td className="px-4 py-2">{p.subType}</td>
                {/* {p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
                <td className="px-4 py-2">฿{p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2">{p.stock.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2">{p.isWireless ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{p.isRGB ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => openEdit(p)} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                  <button onClick={() => handleDeleteProduct(p)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      {/* Pagination controls */}
      <PaginationAdmin page={page} setPage={setPage} totalPages={totalPages} />

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit((data) => handleUpdateProduct(data, editing))} className="space-y-4">
              {/* name */}
              <div>
                <label>Name</label>
                <input {...register('name', { required: 'Name is required' })} className="w-full border px-2 py-1"/>
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>

              {/* price */}
              <div>
                <label>Price</label>
                <input type="number"
                  {...register("price", { required: "Price is required", valueAsNumber: true, min: { value: 0, message: "Price must be non-negative" } })}
                  className="w-full border px-2 py-1"/>
                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
              </div>

              {/* type */}
              <div>
                <label>Type</label>
                <select {...register('type', { required: 'Type is required' })} className="w-full border px-2 py-1">
                  <option value="">--</option>
                  {typeList.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.type && <p className="text-red-500">{errors.type.message}</p>}
              </div>

              {/* subType */}
              <div>
                <label>Sub-Type</label>
                <select {...register('subType', { required: 'Sub-Type is required' })} className="w-full border px-2 py-1">
                  <option value="">--</option>
                  {selectedType && subTypeMap[selectedType]?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.subType && <p className="text-red-500">{errors.subType.message}</p>}
              </div>

              {/* brand */}
              <div>
                <label>Brand</label>
                <select {...register('brand', { required: 'Brand is required' })} className="w-full border px-2 py-1">
                  <option value="">--</option>
                  {brandList.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.brand && <p className="text-red-500">{errors.brand.message}</p>}
              </div>

              {/* isWireless */}
              <div>
                <label>Wireless</label>
                <div className="space-x-4">
                  <label><input type="radio" value="true" {...register('isWireless', { required: "Select wireless option" })}/> Yes</label>
                  <label><input type="radio" value="false" {...register('isWireless', { required: "Select wireless option" })}/> No</label>
                </div>
              </div>

              {/* isRGB */}
              <div>
                <label>RGB</label>
                <div className="space-x-4">
                  <label><input type="radio" value="true" {...register('isRGB', { required: "Select RGB option" })}/> Yes</label>
                  <label><input type="radio" value="false" {...register('isRGB', { required: "Select RGB option" })}/> No</label>
                </div>
              </div>

              {/* stock */}
              <div>
                <label>Stock</label>
                <input type="number"
                  {...register("stock", { required: "Stock is required", valueAsNumber: true, min: { value: 0, message: "Stock must be non-negative" } })}
                  className="w-full border px-2 py-1"/>
                {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
              </div>

                {/* upload images */}
                {/* will upload updated images */}
                {/* *** there will be delete previous image --> fix mino controller in backend later... */}
                <div>
                    <label className="block mb-1 font-medium">Upload Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        {...register("imgPath", { required: false })}
                        // w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded
                        className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded"
                    />
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, JPEG and WEBP are allowed.</p>
                    {errors.imgPath && <p className="text-red-500 text-sm mt-1">{errors.imgPath.message}</p>}
                </div>

              {/* description */}
              <div>
                <label>Description</label>
                <textarea rows={4}
                  {...register('description')}
                  className="w-full border px-2 py-1"/>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditing(null)} className="px-3 py-1 border rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
