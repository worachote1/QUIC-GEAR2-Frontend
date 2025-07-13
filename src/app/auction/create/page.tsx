"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import { brandList, subTypeMap, typeList } from "@/constants/productOptions";
import { validateEndDate, validateStartDate } from "@/utils/auction/auctionValidation";
import { useAuth } from "@/context/AuthContext";
import { IAuctionFormData } from "@/types/auction";

export default function CreateAuctionPage() {
  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IAuctionFormData>();

  const router = useRouter();
  const selectedType = watch("type");

  const onSubmit = async (data: IAuctionFormData) => {
    try {
      // Upload images first
      const formData = new FormData();
      Array.from(data.imgPath).forEach((file) => {
        formData.append("images", file);
      });

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/file-upload/multiple`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const image_urls = uploadRes.data.image_urls;

      // Create AuctionProduct
      const productPayload = {
        name: data.name,
        brand: data.brand,
        type: data.type,
        subType: data.subType,
        isWireless: data.isWireless === "true",
        isRGB: data.isRGB === "true",
        imgPath: image_urls,
        description: data.description || "",
      };

      const productRes = await axios.post(
        `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction-products`,
        productPayload
      );

      const productId = productRes.data.data.id;
      const sellerId = user?.id
      // Create Auction
      const auctionPayload = {
        productId,
        sellerId,
        startPrice: +data.startPrice,
        buyOutPrice: +data.buyOutPrice,
        startAuctionDate: data.startAuctionDate,
        endAuctionDate: data.endAuctionDate,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction`, auctionPayload);

      await Swal.fire({
        icon: "success",
        title: "Auction Created",
        confirmButtonText: "OK",
      });

      reset();
      // router.push("/auction/list");
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
      <h1 className="text-2xl font-bold text-center mb-6">Create Auction</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6" encType="multipart/form-data">
        {/* name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input {...register("name", { required: "Name is required" })} className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500" placeholder="Enter product name" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* brand */}
        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <select {...register("brand", { required: "Brand is required" })} className="w-full border px-4 py-2 rounded-md">
            <option value="">Select Brand</option>
            {brandList.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        {/* type */}
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select {...register("type", { required: "Type is required" })} className="w-full border px-4 py-2 rounded-md">
            <option value="">Select Type</option>
            {typeList.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        {/* subType */}
        <div>
          <label className="block mb-1 font-medium">Sub-Type</label>
          <select {...register("subType", { required: "Sub-Type is required" })} className="w-full border px-4 py-2 rounded-md">
            <option value="">Select Sub-Type</option>
            {subTypeMap[selectedType]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          {errors.subType && <p className="text-red-500 text-sm mt-1">{errors.subType.message}</p>}
        </div>

        {/* isWireless */}
        <div>
          <label className="block mb-1 font-medium">Is Wireless</label>
          <div className="flex gap-6">
            <label><input type="radio" value="true" {...register("isWireless", { required: "Select wireless option" })} /> Yes</label>
            <label><input type="radio" value="false" {...register("isWireless", { required: "Select wireless option" })} /> No</label>
          </div>
          {errors.isWireless && <p className="text-red-500 text-sm mt-1">{errors.isWireless.message}</p>}
        </div>

        {/* isRGB */}
        <div>
          <label className="block mb-1 font-medium">Is RGB</label>
          <div className="flex gap-6">
            <label><input type="radio" value="true" {...register("isRGB", { required: "Select RGB option" })} /> Yes</label>
            <label><input type="radio" value="false" {...register("isRGB", { required: "Select RGB option" })} /> No</label>
          </div>
          {errors.isRGB && <p className="text-red-500 text-sm mt-1">{errors.isRGB.message}</p>}
        </div>

        {/* startPrice */}
        <div>
          <label className="block mb-1 font-medium">Start Price</label>
          <input type="number" {...register("startPrice", { required: "Start Price is required", valueAsNumber: true, min: { value: 0, message: "Start Price must be non-negative" } })} className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500" placeholder="Enter start price" />
          {errors.startPrice && <p className="text-red-500 text-sm mt-1">{errors.startPrice.message}</p>}
        </div>

        {/* buyOutPrice */}
        <div>
          <label className="block mb-1 font-medium">Buy Out Price</label>
          <input type="number" {...register("buyOutPrice", { required: "Buy Out Price is required", valueAsNumber: true, min: { value: 0, message: "Buy Out Price must be non-negative" } })} className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500" placeholder="Enter buy out price"/>
          {errors.buyOutPrice && <p className="text-red-500 text-sm mt-1">{errors.buyOutPrice.message}</p>}
        </div>

        {/* startAuctionDate */}
        <div>
          <label className="block mb-1 font-medium">Start Auction Date</label>
          <Controller
            name="startAuctionDate"
            control={control}
            rules={{
              required: "Start date is required",
              validate: validateStartDate(getValues),
            }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                dateFormat="Pp"
                className="w-full border px-4 py-2 rounded-md"
              />
            )}
          />
          {errors.startAuctionDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startAuctionDate.message}</p>
          )}
        </div>

        {/* endAuctionDate */}
        <div>
          <label className="block mb-1 font-medium">End Auction Date</label>
          <Controller
            name="endAuctionDate"
            control={control}
            rules={{
              required: "End date is required",
              validate: validateEndDate(getValues),
            }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                dateFormat="Pp"
                className="w-full border px-4 py-2 rounded-md"
              />
            )}
          />
          {errors.endAuctionDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endAuctionDate.message}</p>
          )}
        </div>

        {/* image upload */}
        <div>
          <label className="block mb-1 font-medium">Upload Product Image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("imgPath", { required: "At least one image is required" })}
            className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded"
          />
          <p className="text-xs text-slate-500 mt-2">PNG, JPG, JPEG and WEBP are allowed.</p>
          {errors.imgPath && <p className="text-red-500 text-sm mt-1">{errors.imgPath.message}</p>}
        </div>

        {/* description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea rows={4} {...register("description")} className="w-full border px-4 py-2 rounded-md" />
        </div>

        {/* submit */}
        <button type="submit" className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
          Create Auction
        </button>
      </form>
    </div>
  );
}
