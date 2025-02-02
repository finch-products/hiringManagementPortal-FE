import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PracticeUnitService {
  private practiceUnits = new BehaviorSubject<any[]>([]);
  practiceUnits$ = this.practiceUnits.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(units: any[]) {
    this.practiceUnits.next(units);
  }

  // Add new record at the TOP of the list
  addPracticeUnit(newUnit: any) {
    const currentUnits = this.practiceUnits.value;
    this.practiceUnits.next([newUnit, ...currentUnits]); // Insert at the beginning
  }
}
