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