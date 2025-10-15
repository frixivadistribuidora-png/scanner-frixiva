export interface ProductRecord {
  barcode: string;
  name: string;
  quantity: number;
  description?: string;
  cost?: number;
  price?: number;
  location?: string;
  imageUrl?: string;
}
