"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";

const brandList = ["Razer", "Nubwo", "Logitech", "Signo", "SteelSeries", "HyperX", "Corsair", "Neolution E-sport", "Keychron", "Zowie"];
const typeList = ["Headphone", "Mouse", "Keyboard", "Streaming", "Table&Chair"];
const subTypeMap: Record<string, string[]> = {
  Headphone: ["TrueWireless", "Wireless", "Fullsize", "InEar", "Earbud", "SoundCard", "Accessory"],
  Mouse: ["Mouse", "Mousepad", "Accessory"],
  Keyboard: ["RubberDome", "Mechanical", "WristRest"],
  Streaming: ["Webcam", "Microphone", "Accessory"],
  "Table&Chair": ["Table", "Chair"]
};

interface FormData {
  name: string;
  price: number;
  type: string;
  subType: string;
  brand: string;
  isWireless: string;
  isRGB: string;
  imgPath: FileList;
  stock: number;
  description: string;
}

export default function EditProductPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedType = watch("type");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product/id/${productId}`);
        const product = res.data;

        reset({
          name: product.name,
          price: product.price,
          type: product.type,
          subType: product.subType,
          brand: product.brand,
          isWireless: product.isWireless ? "true" : "false",
          isRGB: product.isRGB ? "true" : "false",
          stock: product.stock,
          description: product.description,
        });

        setExistingImages(product.imgPath || []);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Failed to load product" });
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, reset, router]);

  const handleRemoveImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      Array.from(data.imgPath || []).forEach((file) => {
        formData.append("images", file);
      });

      let newImageUrls: string[] = [];
      if (data.imgPath && data.imgPath.length > 0) {
        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/file-upload/multiple`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        newImageUrls = uploadRes.data.image_urls;
      }

      const payload = {
        name: data.name,
        price: +data.price,
        type: data.type,
        subType: data.subType,
        brand: data.brand,
        isWireless: data.isWireless === "true",
        isRGB: data.isRGB === "true",
        imgPath: [...existingImages, ...newImageUrls],
        stock: +data.stock,
        description: data.description,
      };

      await axios.patch(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/product/${productId}`, payload);

      await Swal.fire({ icon: "success", title: "Product updated" });
      router.push("/");
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Update failed", text: err.response?.data?.message || err.message });
    }
  };

  if (loading) return <div className="text-center mt-10">Loading product...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <h1 className="text-2xl font-bold text-center mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="grid gap-6">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input {...register("name", { required: true })} className="w-full border px-4 py-2 rounded-md" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input {...register("price", { required: true, valueAsNumber: true })} type="number" className="w-full border px-4 py-2 rounded-md" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select {...register("type", { required: true })} className="w-full border px-4 py-2 rounded-md">
            {typeList.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Sub-Type</label>
          <select {...register("subType", { required: true })} className="w-full border px-4 py-2 rounded-md">
            {subTypeMap[selectedType]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <select {...register("brand", { required: true })} className="w-full border px-4 py-2 rounded-md">
            {brandList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label><input type="radio" value="true" {...register("isWireless", { required: true })} /> Wireless</label>
          <label><input type="radio" value="false" {...register("isWireless", { required: true })} /> Wired</label>
        </div>

        <div className="flex gap-4">
          <label><input type="radio" value="true" {...register("isRGB", { required: true })} /> RGB</label>
          <label><input type="radio" value="false" {...register("isRGB", { required: true })} /> No RGB</label>
        </div>

        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input {...register("stock", { required: true, valueAsNumber: true })} type="number" className="w-full border px-4 py-2 rounded-md" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload New Images</label>
          <input 
          type="file" 
          multiple 
          accept="image/*" 
          {...register("imgPath", { required: "At least one image is required" })} 
          className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded" />
        </div>

        {existingImages.length > 0 && (
          <div>
            <p className="font-medium">Existing Images:</p>
            <div className="flex flex-wrap gap-4 mt-2">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img src={url} className="object-cover w-full h-full rounded" />
                  <button type="button" onClick={() => handleRemoveImage(url)} className="absolute top-1 right-1 text-xs bg-red-600 text-white px-1 rounded">X</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea {...register("description", { required: true })} className="w-full border px-4 py-2 rounded-md" rows={5}></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">Update Product</button>
      </form>
    </div>
  );
}
