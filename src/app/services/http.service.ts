import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Available globally
})
export class HttpService {
  private baseUrl = 'http://64.227.145.117:8000/api/'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  // Common HTTP Headers
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getLocations(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}location-master/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}role-master/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  addEmployee(employeeData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}employee-master/`, employeeData);
  }

  getEmployee(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}employee-master/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  addCandidate(candidateData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}candiadte-master/`, candidateData);
  }

  getCandidate(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Candidate-master/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // /** 🔹 GET Request */
  // get<T>(endpoint: string): Observable<T> {
  //   return this.http.get<T>(this.baseUrl + endpoint, this.getHeaders()).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // /** 🔹 POST Request */
  // post<T>(endpoint: string, data: any): Observable<T> {
  //   return this.http.post<T>(this.baseUrl + endpoint, data, this.getHeaders()).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // /** 🔹 PUT Request */
  // put<T>(endpoint: string, data: any): Observable<T> {
  //   return this.http.put<T>(this.baseUrl + endpoint, data, this.getHeaders()).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // /** 🔹 DELETE Request */
  // delete<T>(endpoint: string): Observable<T> {
  //   return this.http.delete<T>(this.baseUrl + endpoint, this.getHeaders()).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  /** 🔹 Handle API Errors */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
