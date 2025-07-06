// File: app/auth/sign-up/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  address?: string;
  phone?: string;
  bank?: string;
  account_number?: string;
  account_name?: string;
  imgPath: FileList;
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match",
      });
      return;
    }

  try {
      // 1. Upload image
      const imageFormData = new FormData();
      imageFormData.append("image", data.imgPath[0]);
      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/file-upload/single`,
        imageFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = uploadRes.data.image_url;

      // 2. Submit user registration
      const userPayload = {
        username: data.username,
        email: data.email,
        password: data.password,
        address: data.address || "",
        phone: data.phone || "",
        bank: data.bank || "",
        account_number: data.account_number || "",
        account_name: data.account_name || "",
        imgPath: imageUrl,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user`, userPayload);

      await Swal.fire({
        icon: "success",
        title: "Registration Successful",
        confirmButtonText: "Go to Login",
      });
      router.push("/auth/sign-in");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6">
      <div className="text-center mb-12 sm:mb-16">
        <h4 className="text-slate-600 text-base mt-6">Sign up into your account</h4>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter username"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
                },
              })}
              type="password"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Confirm Password</label>
            <input
              {...register("confirmPassword", { required: "Please confirm your password" })}
              type="password"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter confirm password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Address</label>
            <input
              {...register("address")}
              type="text"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Phone</label>
            <input
              {...register("phone", {
                pattern: {
                  value: /^\+66[0-9]{8,9}$/, // +66 followed by 8 or 9 digits (Thailand mobile numbers are usually 9 digits)
                  message: "Phone number must be in format +66XXXXXXXXX",
                },
              })}
              type="tel"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="+66912345678"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Bank</label>
            <input
              {...register("bank")}
              type="text"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter bank name"
            />
          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Account Number</label>
            <input
              {...register("account_number")}
              type="text"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">Account Name</label>
            <input
              {...register("account_name")}
              type="text"
              className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter account name"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-base text-slate-900 font-medium mb-3 block">Upload profile image</label>
            <input
              type="file"
              accept="image/*"
              {...register("imgPath", { required: "Image is required" })}
              className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded"
            />
            <p className="text-xs text-slate-500 mt-2">PNG, JPG, JPEG and WEBP are allowed.</p>
            {errors.imgPath && <p className="text-red-500 text-sm">{errors.imgPath.message}</p>}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            type="submit"
            className="mx-auto block min-w-32 py-3 px-6 text-sm font-medium tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:opacity-50"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
