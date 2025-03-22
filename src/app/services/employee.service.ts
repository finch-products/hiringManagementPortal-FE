import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees = new BehaviorSubject<any[]>([]);
  employees$ = this.employees.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(employee: any[]) {
    this.employees.next(employee);
  }

  // Add new record at the TOP of the list
  addEmployee(newEmployee: any) {
    const currentEmployees = this.employees.value;
    this.employees.next([newEmployee, ...currentEmployees]);
  }
}
