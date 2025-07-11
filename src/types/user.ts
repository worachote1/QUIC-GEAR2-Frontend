import { Role } from "@/enum/enum"

export interface IUser {
  id: string
  username: string
  email: string
  imgPath: string
  coins: number
  createdAt: string
  role: Role
  address: string
  phone: string
  bank: string
  account_number: string
  account_name: string
}

// Optional Preview version (smaller user object, if needed)
export interface IUserPreview {
  id: number;
  username: string;
  imgPath: string;
  role: Role;
}