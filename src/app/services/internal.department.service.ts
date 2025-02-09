import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternalDeptService {
  private internalDepts = new BehaviorSubject<any[]>([]);
  internalDepts$ = this.internalDepts.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(units: any[]) {
    this.internalDepts.next(units);
  }

  // Add new record at the TOP of the list
  addInternalDept(newUnit: any) {
    const currentUnits = this.internalDepts.value;
    this.internalDepts.next([newUnit, ...currentUnits]); // Insert at the beginning
  }
}
