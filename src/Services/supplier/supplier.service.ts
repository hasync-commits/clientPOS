import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../../Models/supplierModel';
import { environment as testingEnvironment } from '../../environment/testingEnvironment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private testingBaseUrl = testingEnvironment.testingBaseUrl + '/suppliers';

  constructor(private http:HttpClient) { }


  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.testingBaseUrl, supplier);
  }

  getAllSupplier(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.testingBaseUrl);
  }

  getSupplierById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.testingBaseUrl}/${id}`);
  }

  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.testingBaseUrl}/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${this.testingBaseUrl}/${id}`);
  }

  //By Period
  getSuppliersByPeriod(period: 'week' | 'month' | 'year'): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.testingBaseUrl}?period=${period}`);
  }

  //By Custom Range
  getSuppliersByDateRange(from: Date, to: Date): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(
      `${this.testingBaseUrl}?from=${from.toISOString()}&to=${to.toISOString()}`
    );
  }
  
  toggleSupplierStatus(id: string, isActive: boolean): Observable<Supplier> {
    const url = `${this.testingBaseUrl}/${id}/status`;
    return this.http.patch<Supplier>(url, { isActive });
  }



}
