export interface Supplier {

  _id?: string;
  code?: string;

  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;

  notes?: string;

  isActive: boolean;

  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;

}
