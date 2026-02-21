import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase } from '../../Models/purchaseModel';
import { environment as testingEnvironment } from '../../environment/testingEnvironment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  
  private testingBaseUrl = testingEnvironment.testingBaseUrl + '/purchases';

  constructor(private http: HttpClient) { }

  //CREATE PURCHASE (Draft or Confirmed)
  createPurchase(purchase: Purchase): Observable<any> {
    return this.http.post(this.testingBaseUrl, purchase);
  }

  //UPDATE PURCHASE (Only Draft)
  updatePurchase(id: string, purchase: Purchase): Observable<any> {
    return this.http.put(`${this.testingBaseUrl}/${id}`, purchase);
  }

  // ===============================
  // 3️⃣ CONFIRM PURCHASE
  // ===============================
  confirmPurchase(id: string): Observable<any> {
    return this.http.patch(`${this.testingBaseUrl}/${id}/confirm`, {});
  }

  // ===============================
  // 4️⃣ DELETE PURCHASE (Only Draft)
  // ===============================
  deletePurchase(id: string): Observable<any> {
    return this.http.delete(`${this.testingBaseUrl}/${id}`);
  }

  // ===============================
  // 5️⃣ GET ALL PURCHASES (With Filters)
  // ===============================
  getAllPurchases(filters?: {
    status?: string;
    supplierId?: string;
    from?: string;
    to?: string;
  }): Observable<Purchase[]> {

    let params = new HttpParams();

    if (filters) {
      if (filters.status) {
        params = params.set('status', filters.status);
      }

      if (filters.supplierId) {
        params = params.set('supplierId', filters.supplierId);
      }

      if (filters.from) {
        params = params.set('from', filters.from);
      }

      if (filters.to) {
        params = params.set('to', filters.to);
      }
    }

    return this.http.get<Purchase[]>(this.testingBaseUrl, { params });
  }

  // ===============================
  // 6️⃣ GET PURCHASE BY ID
  // ===============================
  getPurchaseById(id: string): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.testingBaseUrl}/${id}`);
  }

  // ===============================
  // 7️⃣ GET PURCHASES BY PERIOD
  // ===============================
  getPurchasesByPeriod(type: 'daily' | 'weekly' | 'monthly'): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.testingBaseUrl}/period`, {
      params: { type }
    });
  }

  // ===============================
  // 8️⃣ GET PURCHASES BY DATE RANGE
  // ===============================
  getPurchasesByDateRange(from: Date, to: Date): Observable<Purchase[]> {

    const params = new HttpParams()
      .set('from', from.toISOString())
      .set('to', to.toISOString());

    return this.http.get<Purchase[]>(`${this.testingBaseUrl}/date-range`, { params });
  }

  //GET PURCHASES BY SUPPLIER
  getPurchasesBySupplier(supplierId: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.testingBaseUrl, {
      params: { supplierId }
    });
  }


getPurchases(filters?: {
  status?: string;
  supplierId?: string;
  from?: string;
  to?: string;
  period?: string;
}): Observable<Purchase[]> {

  let params = new HttpParams();

  if (filters) {

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    if (filters.supplierId) {
      params = params.set('supplierId', filters.supplierId);
    }

    if (filters.period) {
      params = params.set('period', filters.period);
    }

    if (filters.from && filters.to) {
      params = params.set('from', filters.from);
      params = params.set('to', filters.to);
    }
  }

  return this.http.get<Purchase[]>(this.testingBaseUrl, { params });
}

}
