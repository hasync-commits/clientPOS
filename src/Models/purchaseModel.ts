import { Supplier } from "./supplierModel";

export interface PurchaseItem {

  productName: string;
  category?: string;
  brand?: string;

  costPrice: number;
  sellingPrice: number;

  quantity: number;

  itemTotal: number;
}


export interface Purchase {

  _id?: string;
  purchaseCode?: string;

  supplierId: string | Supplier;
  invoiceNumber?: string;

  purchaseDate: Date;

  status: 'draft' | 'confirmed';

  items: PurchaseItem[];

  subtotal: number;
  totalDiscount: number;
  grandTotal: number;

  createdBy: string;

  createdAt?: Date;
  updatedAt?: Date;
}
