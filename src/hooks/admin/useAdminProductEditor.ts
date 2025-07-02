// hooks/useAdminProductEditor.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { IProduct, IProductFormData } from "@/types/product";

export function useAdminProductEditor() {
  const [editing, setEditing] = useState<IProduct | null>(null);

  // useForm hook from react-hook-form to manage form state, validation, and interaction
  const {
    register,           // Connects input fields to form state and handles validation rules
    handleSubmit,       // Wraps your submit handler and automatically runs validation
    watch,              // Subscribes to form field changes in real-time (e.g., for conditional UI)
    reset,              // Programmatically sets or resets form values (e.g., when editing an existing record)
    formState: { errors }  // Contains current validation error messages for each field
  } = useForm<IProductFormData>();
  
  // Watch the 'type' field value in real-time (e.g., to dynamically update subType options)
  const selectedType = watch("type");

  const closeModal = () => {
    setEditing(null);
    reset();
  };

  const openEdit = (product: IProduct) => {
    setEditing(product);
    reset({
      name: product.name,
      price: product.price,
      type: product.type,
      subType: product.subType,
      brand: product.brand,
      isWireless: product.isWireless.toString(),
      isRGB: product.isRGB.toString(),
      stock: product.stock,
      description: product.description,
    });
  };

  return {
    editing,
    setEditing,
    selectedType,
    register,
    reset,
    watch,
    handleSubmit,
    errors,
    closeModal,
    openEdit,
  };
}
