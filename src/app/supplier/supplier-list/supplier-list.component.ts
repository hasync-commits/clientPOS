import { Component,OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { Supplier } from '../../../Models/supplierModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator } from '@angular/material/paginator';

import { SupplierService } from '../../../Services/supplier/supplier.service';

@Component({
  selector: 'app-supplier-list',
  imports: [MatPaginator,MatCardModule, MatTableModule, MatButtonModule, MatIconModule, CommonModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent implements OnInit,AfterViewInit {
  
  
  displayedColumns: string[] = [
    'code',
    'name',
    'phone',
    'email',
    'address',
    'city',
    'notes',
    'active',
    'action'
  ];

  dataSource = new MatTableDataSource<Supplier>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  

updateSupplier(supplier: Supplier): void {

  if (!supplier._id) return;

  this.supplierService.updateSupplier(supplier._id, supplier)
    .subscribe({
      next: (updated) => {
        const index = this.dataSource.data.findIndex(
          s => s._id === updated._id
        );

        if (index !== -1) {
          this.dataSource.data[index] = updated;
          this.dataSource._updateChangeSubscription();
        }
      },
      error: (err) => {
        console.error(err);
        alert('Update failed');
      }
    });
}

deleteSupplier(supplier: Supplier): void {

  if (!supplier._id) return;

  if (!confirm('Are you sure you want to delete this supplier?')) {
    return;
  }

  this.supplierService.deleteSupplier(supplier._id).subscribe({
    next: () => {
      this.dataSource.data = this.dataSource.data
        .filter(s => s._id !== supplier._id);
    },
    error: (err) => {
      console.error(err);
      alert('Failed to delete supplier');
    }
  });
}


getSuppliersByPeriod(period: 'week' | 'month' | 'year'): void {

  this.supplierService.getSuppliersByPeriod(period)
    .subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;  // ✅ FIXED
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load suppliers by period');
      }
    });
}


getSuppliersByDateRange(from: Date, to: Date): void {

  if (!from || !to) {
    alert('Please select both dates');
    return;
  }

  this.supplierService.getSuppliersByDateRange(from, to)
    .subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;  // ✅ FIXED
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load suppliers by date range');
      }
    });
}


resetFilter(): void {
  this.loadSuppliers();
}


loadSuppliers(): void {

  this.supplierService.getAllSupplier().subscribe({
    next: (res: any) => {
      this.dataSource.data = res.data; 
    },
    error: (err) => {
      console.error(err);
      alert('Failed to load suppliers');
    }
  });
}


toggleStatus(supplier: Supplier): void {

  if (!supplier._id) return;

  const originalStatus = supplier.isActive;
  supplier.isActive = !originalStatus;

  this.supplierService
    .toggleSupplierStatus(supplier._id, supplier.isActive)
    .subscribe({
      next: (res: any) => {
        supplier.isActive = res.data.isActive; // sync with backend
      },
      error: (err) => {
        console.error(err);
        supplier.isActive = originalStatus;
        alert('Status update failed');
      }
    });
}




}
