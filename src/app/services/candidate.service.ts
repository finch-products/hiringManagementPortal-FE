import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private candidates = new BehaviorSubject<any[]>([]);
  candidates$ = this.candidates.asObservable();

  constructor() { }
   // Store initial API data
   setInitialData(employee: any[]) {
    this.candidates.next(employee);
  }

  // Add new record at the TOP of the list
  addcandidate(newcandidate: any) {
    const currentcandidates = this.candidates.value;
    this.candidates.next([newcandidate, ...currentcandidates]);
  }
}
