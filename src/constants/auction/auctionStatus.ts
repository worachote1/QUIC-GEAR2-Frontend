export const AUCTION_STATUS = ["WAITING_APPROVED", "IN_PROGRESS", "CANCELED", "END"]

export const statusTransitions: Record<string, string[]> = {
  "WAITING_APPROVED": ["IN_PROGRESS", "CANCELED"],
  "IN_PROGRESS": ["CANCELED"],
  "CANCELED": [],
  "END": [],
};
