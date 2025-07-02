export interface IProduct {
  id: string
  name: string
  price: number
  type: string
  subType: string
  brand: string
  isWireless: boolean
  isRGB: boolean
  imgPath?: string[]
  stock: number
  rating?: number
  description?: string
  totalOrder?: number
}

export interface IProductFormData {
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