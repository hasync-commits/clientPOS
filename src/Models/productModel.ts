export interface Product {

  _id?: string;

  name: string;
  category?: string;
  brand?: string;

  costPrice: number;
  sellingPrice: number;

  currentStock: number;
  lowStockQuantity?: number;

  supplierId: string;
  purchaseId: string;

  createdAt?: Date;
  updatedAt?: Date;
}
