import { IAuctionFormData } from "@/types/auction";
import { FieldValues, UseFormGetValues } from "react-hook-form";

export const validateStartDate = (getValues: UseFormGetValues<IAuctionFormData>) => (startDate: Date) => {
  const now = new Date();
  const endDate = getValues("endAuctionDate") as Date | undefined;

  if (startDate <= now) return "Start date must be in the future";
  if (endDate && startDate >= endDate) return "Start date must be before end date";

  return true;
};

export const validateEndDate = (getValues: UseFormGetValues<IAuctionFormData>) => (endDate: Date) => {
  const startDate = getValues("startAuctionDate") as Date | undefined;
  const now = new Date();

  if (endDate <= now) return "End date must be in the future";
  if (startDate && endDate <= startDate) return "End date must be after start date";

  return true;
};