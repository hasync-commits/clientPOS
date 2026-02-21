export interface SaleItem {

  productId: string;

  productName: string;
  category?: string;
  brand?: string;

  costPrice: number;
  sellingPrice: number;

  quantity: number;

  discount: number;

  lineTotal: number;
}

export interface Sale {

  _id?: string;

  saleCode?: string;

  customerName?: string;

  items: SaleItem[];

  subtotal: number;
  totalDiscount: number;
  grandTotal: number;

  paidAmount: number;
  isFullyPaid: boolean;

  paymentMethod: 'Cash' | 'Bank Transfer' | 'Online Wallets';

  createdBy: string;

  createdAt?: Date;
  updatedAt?: Date;
}