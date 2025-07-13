// File: app/product/create/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { IProductFormData } from "@/types/product";
import { brandList, subTypeMap, typeList } from "@/constants/product/productOptions";

export default function CreateProductPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IProductFormData>();

  const router = useRouter();
  const selectedType = watch("type");

  const onSubmit = async (data: IProductFormData) => {
    try {
      const imageFormData = new FormData();
      Array.from(data.imgPath).forEach(file => {
        imageFormData.append("images", file);
      });

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/file-upload/multiple`,
        imageFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const image_urls = uploadRes.data.image_urls;

      const productPayload = {
        name: data.name,
        price: +data.price,
        type: data.type,
        subType: data.subType,
        brand: data.brand,
        isWireless: data.isWireless === "true",
        isRGB: data.isRGB === "true",
        imgPath: image_urls,
        stock: +data.stock,
        description: data.description || "",
      };

      await axios.post(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product`, productPayload);

      await Swal.fire({
        icon: "success",
        title: "Product Created",
        confirmButtonText: "Go back",
      });

      reset();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <h1 className="text-2xl font-bold text-center mb-6">Create Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="grid gap-6">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input {...register("name", { required: "Name is required" })} type="text" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500" placeholder="Enter product name" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input {...register("price", { required: "Price is required", valueAsNumber: true, min: { value: 0, message: "Price must be non-negative" } })} type="number" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500" placeholder="Enter price" />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select {...register("type", { required: "Type is required" })} className="w-full border border-gray-300 px-4 py-2 rounded-md">
            <option value="">Select Type</option>
            {typeList.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Sub-Type</label>
          <select {...register("subType", { required: "Sub-Type is required" })} className="w-full border border-gray-300 px-4 py-2 rounded-md">
            <option value="">Select Sub-Type</option>
            {subTypeMap[selectedType]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          {errors.subType && <p className="text-red-500 text-sm mt-1">{errors.subType.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <select {...register("brand", { required: "Brand is required" })} className="w-full border border-gray-300 px-4 py-2 rounded-md">
            <option value="">Select Brand</option>
            {brandList.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Is Wireless</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2"><input type="radio" value="true" {...register("isWireless", { required: "Select wireless option" })} /> Yes</label>
            <label className="flex items-center gap-2"><input type="radio" value="false" {...register("isWireless", { required: "Select wireless option" })} /> No</label>
          </div>
          {errors.isWireless && <p className="text-red-500 text-sm mt-1">{errors.isWireless.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Is RGB</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2"><input type="radio" value="true" {...register("isRGB", { required: "Select RGB option" })} /> Yes</label>
            <label className="flex items-center gap-2"><input type="radio" value="false" {...register("isRGB", { required: "Select RGB option" })} /> No</label>
          </div>
          {errors.isRGB && <p className="text-red-500 text-sm mt-1">{errors.isRGB.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input {...register("stock", { required: "Stock is required", valueAsNumber: true, min: { value: 0, message: "Stock must be non-negative" } })} type="number" className="w-full border border-gray-300 px-4 py-2 rounded-md" placeholder="Enter stock amount" />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Product Image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("imgPath", { required: "At least one image is required" })}
            className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded"
          />
          <p className="text-xs text-slate-500 mt-2">PNG, JPG, JPEG and WEBP are allowed.</p>
          {errors.imgPath && <p className="text-red-500 text-sm mt-1">{errors.imgPath.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea rows={5} className="w-full border border-gray-300 px-4 py-2 rounded-md" placeholder="Enter product description"></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <button type="submit" className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">Create Product</button>
      </form>
    </div>
  );
}
