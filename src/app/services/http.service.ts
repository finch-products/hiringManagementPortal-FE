import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = 'http://64.227.145.117/api/';
  //private baseUrl = 'http://localhost:8000/api/';

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
    return this.http.get<any>(`${this.baseUrl}locations/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getclientpartner(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}employees/employee-by-role/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getdileverymanager(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}employees/employee-by-role/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}roles/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  addEmployee(employeeData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}employees/`, employeeData);
  }

  getEmployee(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}employees/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getOpenDemandCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/open-demand-count/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  addCandidate(candidateData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}candidates/`, candidateData);
  }

  getCandidate(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}candidates/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }


  getClientDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}clients/clients-details/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }


  getLocationDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}locations/locations-details/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  postDepartment(deptData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}departments/`, deptData);
  }

  getDeptsDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}departments/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getDemandStatusDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}demand-status/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getInternalDepartmentDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}departments/department-details/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getLOBDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}lobs/lobs-details/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getEmployeeByRolesDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}employees/employee-by-role/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  addDemand(demandData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}demands/`, demandData);
  }

  getDemands(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}demands/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getSingleDemandDetail(demandId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}demands/id/${demandId}`, this.getHeaders()).pipe(
      catchError(this.handleError));
  }

  updateDemand(form_data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}demands/update-demand-status/`, form_data, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}departments/employee-by-role/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }


  /** Handle API Errors */
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
