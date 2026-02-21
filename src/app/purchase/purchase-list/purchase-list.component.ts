import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PurchaseService } from '../../../Services/purchase/purchase.service';
import { SupplierService } from '../../../Services/supplier/supplier.service';
import { Purchase } from '../../../Models/purchaseModel';
import { Supplier } from '../../../Models/supplierModel';

@Component({
  selector: 'app-purchase-list',
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent implements OnInit {


  displayedColumns: string[] = [
    'purchaseCode',
    'supplier',
    'invoiceNumber',
    'purchaseDate',
    'grandTotal',
    'status'
  ];

  dataSource = new MatTableDataSource<Purchase>();
  suppliers: Supplier[] = [];
  isLoading = false;

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSuppliers();
    this.loadPurchases();
  }

  // ===============================
  // Initialize Filter Form
  // ===============================
  private initializeForm(): void {
    this.filterForm = this.fb.group({
      status: [''],
      supplierId: [''],
      period: [''],
      from: [''],
      to: ['']
    });
  }

  // ===============================
  // Load Suppliers
  // ===============================
  private loadSuppliers(): void {
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

  // ===============================
  // Load Purchases (Main Loader)
  // ===============================
  private loadPurchases(filters?: {
    status?: string;
    supplierId?: string;
    period?: string;
    from?: string;
    to?: string;
  }): void {

    this.isLoading = true;

    this.purchaseService.getPurchases(filters).subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load purchases');
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // Apply Filters
  // ===============================
  applyFilters(): void {

    const { status, supplierId, period, from, to } = this.filterForm.value;

    // Prevent using both period and date range
    if (period && (from || to)) {
      alert('Use either Period OR Date Range filter.');
      return;
    }

    // Prevent incomplete date selection
    if ((from && !to) || (!from && to)) {
      alert('Please select both From and To dates.');
      return;
    }

    // Validate date order
    if (from && to && new Date(from) > new Date(to)) {
      alert('From date cannot be greater than To date.');
      return;
    }

    const filters: any = {};

    if (status) filters.status = status;
    if (supplierId) filters.supplierId = supplierId;
    if (period) filters.period = period;

    if (from && to) {
      filters.from = new Date(from).toISOString();
      filters.to = new Date(to).toISOString();
    }

    this.loadPurchases(filters);
  }

  // ===============================
  // Reset Filters
  // ===============================
  resetFilters(): void {
    this.filterForm.reset();
    this.loadPurchases();
  }  



}
