import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Supplier } from '../../../Models/supplierModel';
import { SupplierService } from '../../../Services/supplier/supplier.service';
import { PurchaseService } from '../../../Services/purchase/purchase.service';
import { Purchase } from '../../../Models/purchaseModel';

import { PurchaseListComponent } from '../purchase-list/purchase-list.component';

@Component({
  selector: 'app-purchase-order',
  imports: [CommonModule, PurchaseListComponent, MatCardModule, ReactiveFormsModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
})
export class PurchaseOrderComponent implements OnInit {


  purchaseForm!: FormGroup;
  suppliers: Supplier[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSuppliers();
  }

  // ===============================
  // Load Suppliers from Backend
  // ===============================
  loadSuppliers(): void {
    this.supplierService.getAllSupplier().subscribe({
      next: (res:any) => {
        this.suppliers = res.data;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load suppliers');
      }
    });
  }


  private initializeForm(): void {
    this.purchaseForm = this.fb.group({
      supplierId: ['', Validators.required],
      invoiceNumber: ['', Validators.maxLength(50)],
      purchaseDate: [new Date(), Validators.required],
      status: ['draft'],
      items: this.fb.array([]),
      subtotal: [0],
      totalDiscount: [0, [Validators.min(0)]],
      grandTotal: [0],
      createdBy: ['admin']
    });

    this.purchaseForm.get('totalDiscount')?.valueChanges.subscribe(() => {
      this.calculateTotals();
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.purchaseForm.get('items') as FormArray;
  }

  addItem(): void {
    const item = this.fb.group({
      productName: ['', Validators.required],
      category: [''],
      brand: [''],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      itemTotal: [0]
    });

    item.valueChanges.subscribe(() => this.calculateItemTotal(item));
    this.items.push(item);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  removeAll(): void {
    while (this.items.length !== 0) {
      this.items.removeAt(0);
    }
    this.calculateTotals();
  }

  private calculateItemTotal(item: FormGroup): void {
    const cost = Number(item.get('costPrice')?.value) || 0;
    const qty = Number(item.get('quantity')?.value) || 0;

    const total = cost * qty;
    item.get('itemTotal')?.setValue(total, { emitEvent: false });

    this.calculateTotals();
  }

  private calculateTotals(): void {

    const subtotal = this.items.controls
      .map(item => Number(item.get('itemTotal')?.value) || 0)
      .reduce((a, b) => a + b, 0);

    const discount = Number(this.purchaseForm.get('totalDiscount')?.value) || 0;

    let grandTotal = subtotal - discount;
    if (grandTotal < 0) grandTotal = 0;

    this.purchaseForm.patchValue({
      subtotal,
      grandTotal
    }, { emitEvent: false });
  }

  private validateBeforeSubmit(): boolean {

    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      return false;
    }

    if (this.items.length === 0) {
      alert('At least one product is required');
      return false;
    }

    if (this.purchaseForm.value.grandTotal <= 0) {
      alert('Grand total must be greater than zero');
      return false;
    }

    return true;
  }

  // ===============================
  // Save Draft
  // ===============================
  saveDraft(): void {

    if (!this.validateBeforeSubmit()) return;

    this.isSubmitting = true;

    const purchase: Purchase = {
      ...this.purchaseForm.value,
      status: 'draft'
    };

    this.purchaseService.createPurchase(purchase).subscribe({
      next: () => {
        alert('Purchase saved as Draft');
        this.purchaseForm.reset({
          purchaseDate: new Date(),
          status: 'draft',
          totalDiscount: 0,
          subtotal: 0,
          grandTotal: 0,
          createdBy: 'admin'
        });
        this.items.clear();
        this.addItem();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to save draft');
        this.isSubmitting = false;
      }
    });
  }

  // ===============================
  // Confirm Purchase
  // ===============================
  confirmPurchase(): void {

    if (!this.validateBeforeSubmit()) return;

    this.isSubmitting = true;

    const purchase: Purchase = {
      ...this.purchaseForm.value,
      status: 'confirmed'
    };

    this.purchaseService.createPurchase(purchase).subscribe({
      next: () => {
        alert('Purchase confirmed successfully');
        this.purchaseForm.reset({
          purchaseDate: new Date(),
          status: 'draft',
          totalDiscount: 0,
          subtotal: 0,
          grandTotal: 0,
          createdBy: 'admin'
        });
        this.items.clear();
        this.addItem();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to confirm purchase');
        this.isSubmitting = false;
      }
    });
  }


}
