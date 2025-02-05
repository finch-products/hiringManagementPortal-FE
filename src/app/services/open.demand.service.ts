import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenDemandService {
  private demands = new BehaviorSubject<any[]>([]);
  demands$ = this.demands.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(demand: any[]) {
    this.demands.next(demand);
  }

  // Add new record at the TOP of the list
  addDemand(newdemand: any) {
    const currentdemand = this.demands.value;
    this.demands.next([newdemand, ...currentdemand]); // Insert at the beginning
  }
}
