"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";

interface IAuctionFormData {
  name: string;
  brand: string;
  type: string;
  subType: string;
  isWireless: string;
  isRGB: string;
  imgPath: FileList;
  description?: string;
  startPrice: number;
  buyOutPrice: number;
  startAuctionDate: Date;
  endAuctionDate: Date;
}

export default function CreateAuctionPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IAuctionFormData>();
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const onSubmit = async (data: IAuctionFormData) => {
    try {
      // === Upload Images ===
      const imageFormData = new FormData();
      Array.from(data.imgPath).forEach((file) => {
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

      // === Create AuctionProduct ===
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

      const prodRes = await axios.post(
        `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction-product`,
        productPayload
      );

      const productId = prodRes.data.id;

      // === Create Auction ===
      const auctionPayload = {
        productId,
        startPrice: +data.startPrice,
        buyOutPrice: +data.buyOutPrice,
        startAuctionDate: data.startAuctionDate,
        endAuctionDate: data.endAuctionDate,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auction`, auctionPayload);

      await Swal.fire("Success", "Auction created", "success");
      reset();
      router.push("/auction/list");
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <h1 className="text-2xl font-bold text-center mb-6">Create Auction</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <input {...register("name", { required: "Name is required" })} placeholder="Name" className="border p-2" />
        <input {...register("brand", { required: "Brand is required" })} placeholder="Brand" className="border p-2" />
        <input {...register("type", { required: "Type is required" })} placeholder="Type" className="border p-2" />
        <input {...register("subType", { required: "SubType is required" })} placeholder="SubType" className="border p-2" />

        <div className="flex gap-4">
          <label><input type="radio" value="true" {...register("isWireless", { required: true })} /> Wireless</label>
          <label><input type="radio" value="false" {...register("isWireless", { required: true })} /> Wired</label>
        </div>

        <div className="flex gap-4">
          <label><input type="radio" value="true" {...register("isRGB", { required: true })} /> RGB</label>
          <label><input type="radio" value="false" {...register("isRGB", { required: true })} /> No RGB</label>
        </div>

        <textarea {...register("description")} placeholder="Description" className="border p-2" />

        <input type="file" {...register("imgPath", { required: true })} multiple className="border p-2" />

        <input type="number" {...register("startPrice", { required: true })} placeholder="Start Price" className="border p-2" />
        <input type="number" {...register("buyOutPrice", { required: true })} placeholder="Buy Out Price" className="border p-2" />

        <Controller
          control={control}
          name="startAuctionDate"
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              placeholderText="Select start date"
              selected={field.value}
              onChange={field.onChange}
              showTimeSelect
              dateFormat="Pp"
              className="border p-2 w-full"
            />
          )}
        />
        <Controller
          control={control}
          name="endAuctionDate"
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              placeholderText="Select end date"
              selected={field.value}
              onChange={field.onChange}
              showTimeSelect
              dateFormat="Pp"
              className="border p-2 w-full"
            />
          )}
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Create Auction</button>
      </form>
    </div>
  );
}
