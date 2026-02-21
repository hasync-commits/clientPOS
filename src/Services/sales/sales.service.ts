import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sale } from '../../Models/saleModel';
import { environment as testingEnvironment } from '../../environment/testingEnvironment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  
  private testingBaseUrl = testingEnvironment.testingBaseUrl + '/sales';

  constructor(private http: HttpClient) {}

  createSale(sale: Sale): Observable<any> {
    return this.http.post(`${this.testingBaseUrl}/newSale`, sale)
      .pipe(catchError(this.handleError));
  }

  getAllSales(): Observable<any> {
    return this.http.get(`${this.testingBaseUrl}/allSales`)
      .pipe(catchError(this.handleError));
  }

  getSaleById(id: string): Observable<any> {
    return this.http.get(`${this.testingBaseUrl}/sale/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateSale(id: string, sale: Sale): Observable<any> {
    return this.http.put(`${this.testingBaseUrl}/updateSale/${id}`, sale)
      .pipe(catchError(this.handleError));
  }

  deleteSale(id: string): Observable<any> {
    return this.http.delete(`${this.testingBaseUrl}/deleteSale/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Something went wrong';

    if (error.error?.message) {
      message = error.error.message;
    }

    return throwError(() => new Error(message));
  }



}
