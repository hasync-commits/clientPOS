import { Component, OnInit,ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { MatExpansionPanel } from '@angular/material/expansion';

import { PurchaseService } from '../../../Services/purchase/purchase.service';
import { SupplierService } from '../../../Services/supplier/supplier.service';
import { Purchase } from '../../../Models/purchaseModel';
import { Supplier } from '../../../Models/supplierModel';


@Component({
  selector: 'app-purchase-report',
  imports: [CommonModule,MatExpansionPanel, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatExpansionModule, MatChipsModule, MatIconModule],
  templateUrl: './purchase-report.component.html',
  styleUrl: './purchase-report.component.css'
})
export class PurchaseReportComponent implements OnInit {


  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;

  purchases: Purchase[] = [];
  suppliers: Supplier[] = [];

  isLoading = false;

  totalPurchases = 0;
  totalConfirmed = 0;
  totalDraft = 0;
  totalAmount = 0;
  totalItems = 0;

  // 🔥 Toggle states
  activePeriod: 'daily' | 'weekly' | 'monthly' | null = null;
  statusFilter: 'draft' | 'confirmed' | null = null;

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

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      supplierId: [''],
      from: [''],
      to: ['']
    });
  }

  private loadSuppliers(): void {
    this.supplierService.getAllSupplier().subscribe({
      next: (res:any) => this.suppliers = res.data
    });
  }

  private loadPurchases(filters?: any): void {
    this.isLoading = true;

    this.purchaseService.getPurchases(filters).subscribe({
      next: (res) => {
        this.purchases = res;
        this.calculateSummary();
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load purchases');
        this.isLoading = false;
      }
    });
  }

  private calculateSummary(): void {
    this.totalPurchases = this.purchases.length;
    this.totalConfirmed = this.purchases.filter(p => p.status === 'confirmed').length;
    this.totalDraft = this.purchases.filter(p => p.status === 'draft').length;
    this.totalAmount = this.purchases.reduce((sum, p) => sum + p.grandTotal, 0);
    this.totalItems = this.purchases.reduce((sum, p) =>
      sum + p.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
  }

  /* ================= PERIOD TOGGLE ================= */

  togglePeriod(period: 'daily' | 'weekly' | 'monthly'): void {

    if (this.activePeriod === period) {
      this.activePeriod = null;
    } else {
      this.activePeriod = period;
    }

    this.applyFilters();
  }

  /* ================= STATUS TOGGLE ================= */

  toggleStatus(status: 'draft' | 'confirmed'): void {

    if (this.statusFilter === status) {
      this.statusFilter = null;
    } else {
      this.statusFilter = status;
    }

    this.applyFilters();
  }

  /* ================= FILTER APPLY ================= */

  applyFilters(): void {

    const { supplierId, from, to } = this.filterForm.value;

    const filters: any = {};

    if (this.activePeriod) {
      filters.period = this.activePeriod;
    }

    if (this.statusFilter) {
      filters.status = this.statusFilter;
    }

    if (supplierId) {
      filters.supplierId = supplierId;
    }

    if (from && to) {
      filters.from = new Date(from).toISOString();
      filters.to = new Date(to).toISOString();
    }

    this.loadPurchases(filters);
  }

  resetFilters(): void {
    this.activePeriod = null;
    this.statusFilter = null;
    this.filterForm.reset();
    this.loadPurchases();
  }

  /* ================= EXPANSION ================= */

  expandAll(): void {
    this.panels.forEach(panel => panel.open());
  }

  collapseAll(): void {
    this.panels.forEach(panel => panel.close());
  }

  /* ================= CONFIRM ================= */

  confirmPurchase(purchase: Purchase): void {
    if (!purchase._id) return;
    if (!confirm('Confirm this purchase?')) return;

    this.purchaseService.confirmPurchase(purchase._id).subscribe({
      next: () => this.loadPurchases(),
      error: () => alert('Failed to confirm purchase')
    });
  }

  /* ================= DELETE ================= */

  deletePurchase(purchase: Purchase): void {
    if (!purchase._id) return;
    if (!confirm('Delete this draft purchase?')) return;

    this.purchaseService.deletePurchase(purchase._id).subscribe({
      next: () => this.loadPurchases(),
      error: () => alert('Failed to delete purchase')
    });
  }

  getSupplierName(purchase: Purchase): string {
    if (!purchase.supplierId) return '';
    if (typeof purchase.supplierId === 'string') return purchase.supplierId;
    return purchase.supplierId.name;
  }

  printPurchase(): void {
    window.print();
  }


}
