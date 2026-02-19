import { Component,OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Supplier } from '../../../Models/supplierModel';

import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

import { SupplierListComponent } from '../supplier-list/supplier-list.component';
import { SupplierService } from '../../../Services/supplier/supplier.service';

@Component({
  selector: 'app-supplier-order',
  imports: [SupplierListComponent,CommonModule, MatTabsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './supplier-order.component.html',
  styleUrl: './supplier-order.component.css'
})
export class SupplierOrderComponent implements OnInit {

  
  supplierForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private supplierService:SupplierService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,15}$/)
      ]],
      email: ['', [Validators.email]], // optional
      address: [''],                   // optional
      city: [''],                      // optional
      notes: [''],                     // optional
      isActive: [true]
    });
  }


  get f() {
    return this.supplierForm.controls;
  }

  onSave(): void {

    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const supplier: any = {
      name: this.f['name'].value.trim(),
      phone: this.f['phone'].value.trim(),
      email: this.f['email'].value?.trim() || '',
      address: this.f['address'].value?.trim() || '',
      city: this.f['city'].value?.trim() || '',
      notes: this.f['notes'].value?.trim() || '',
      isActive: this.f['isActive'].value,
      createdBy: 'admin'
    };



    this.supplierService.createSupplier(supplier).subscribe({
      next: (response) => {
        alert('Supplier created successfully');
        this.supplierForm.reset({ isActive: true });
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error(error);
        alert('Failed to create supplier');
        this.isSubmitting = false;
      }
    });

  }

}
