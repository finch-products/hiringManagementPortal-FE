import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = 'http://64.227.145.117/api/';
  //  private baseUrl = 'http://localhost:8000/api/';

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

  getCandidateStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}candidate-status/list`, this.getHeaders()).pipe(
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
    return this.http.get<any>(`${this.baseUrl}demand-status/demand-status`, this.getHeaders()).pipe(
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

  getNotAddedCandidatesBySearch(data: any): Observable<any> {
    console.log(data, "service")
    return this.http.post<any>(`${this.baseUrl}candidate-demand/not_added_candidatebydemandid/`, data)
  }

  getSingleDemandDetail(demandId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}demands/id/${demandId}`, this.getHeaders()).pipe(
      catchError(this.handleError));
  }

  getDemandIds(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}demands/all`, this.getHeaders()).pipe(
      catchError(this.handleError));
  }

  updateDemand(form_data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}demands/update-demand-status/`, form_data, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}departments/employee-by-role/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getDemandFulfillmentMetricsReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/demand-fulfillment-metric/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }
  getReportLOBTargetProgress(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/LOB-Target-Progress/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }
  getopenposition(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/total-open-positions-last-week/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }
  getReportagedemand(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/age-demand/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  postCandidateByDemandId(payload: any): Observable<any> {
    console.log("payload", payload)
    return this.http.post<any>(`${this.baseUrl}candidate-demand/candidateby_opendemand/`, payload, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }
  getreportclientselection(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/client-selection/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getreportoftimeforprofilesubmit(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/demand-time-taken-for-profile-submission/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getreportoftimetakenfortillfeedback(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/TimeTakenFromInterviewToFeedbackView/`, this.getHeaders()).pipe(
      catchError(this.handleError)
    );
  }
  postaddClient(clientData: any): Observable<any> {
    console.log("client data", clientData)
    return this.http.post<any>(`${this.baseUrl}clients/`, clientData, { headers: { 'Content-Type': 'application/json' } }).pipe(
      catchError(this.handleError)
    );
  }

  getcandidateselectioncustomreport(start_date: any, end_date: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/candidate-selection/?reportType=custom&start_date=${start_date}&end_date=${end_date}`, this.getHeaders()).pipe(
      catchError(this.handleError));
  }
  getcandidateselectionreports(year: any, reporttype: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/candidate-selection/?year=${year}&reportType=${reporttype}`, this.getHeaders()).pipe(
      catchError(this.handleError));
  }

  getcandidateselectionweeklyreport(year: any, month: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reports/candidate-selection/?year=${year}&month=${month}&reportType=weekly`, this.getHeaders()).pipe(
      catchError(this.handleError));
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
  postData(url: string, data: any): Observable<any> {
    return this.http.post(url, data);
  }
}
