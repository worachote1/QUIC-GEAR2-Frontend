import { AuctionStatus } from "@/enum/enum";

export const getAuctionStatusClass = (status: AuctionStatus) => {
  switch (status) {
    case "WAITING_APPROVED":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "CANCELED":
      return "bg-red-100 text-red-800";
    case "END":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};