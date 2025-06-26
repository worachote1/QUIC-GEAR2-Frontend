"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

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

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "imgPath") {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    // TODO: Call your register API here
    console.log("Form submitted", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <input
          {...register("username", { required: true })}
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {errors.username && <span className="text-red-500 text-sm">Username is required</span>}

        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="password"
          {...register("confirmPassword", { required: true })}
          placeholder="Confirm Password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="file"
          {...register("imgPath", { required: true })}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <input {...register("address")} placeholder="Address" className="w-full p-2 border border-gray-300 rounded mb-4" />
        <input {...register("phone")} placeholder="Phone" className="w-full p-2 border border-gray-300 rounded mb-4" />
        <input {...register("bank")} placeholder="Bank" className="w-full p-2 border border-gray-300 rounded mb-4" />
        <input {...register("account_number")} placeholder="Account Number" className="w-full p-2 border border-gray-300 rounded mb-4" />
        <input {...register("account_name")} placeholder="Account Name" className="w-full p-2 border border-gray-300 rounded mb-4" />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
