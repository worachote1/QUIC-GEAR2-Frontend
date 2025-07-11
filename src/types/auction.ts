import { AuctionStatus } from "@/enum/enum";
import { IUser, IUserPreview } from "./user";

export interface IAuction {
  id: number;
  startPrice: number;
  buyOutPrice: number;
  startAuctionDate: string;
  endAuctionDate: string;
  auctionStatus: AuctionStatus;
  orderStatus: string;
  trackingNumber: string;
  createdAt: string;
  productId: number;
  sellerId: number;
  product: IAuctionProduct;
  seller: IUser;
  bids: IBid[];
  winner: IUser | null;
}

export interface IAuctionProduct {
  id: number;
  name: string;
  brand: string;
  type: string;
  subType: string;
  isWireless: boolean;
  isRGB: boolean;
  imgPath: string[];
  description: string;
}

export interface IBid {
  id: number;
  amount: number;
  userId: number;
  auctionId: number;
  createdAt: string;
  user: IUserPreview; // Or full IUser
}

export interface IAuctionFormData {
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