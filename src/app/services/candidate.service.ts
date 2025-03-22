import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private candidates = new BehaviorSubject<any[]>([]);
  candidates$ = this.candidates.asObservable();

  constructor() { }
   setInitialData(employee: any[]) {
    this.candidates.next(employee);
  }

  addcandidate(newcandidate: any) {
    const currentcandidates = this.candidates.value;
    this.candidates.next([newcandidate, ...currentcandidates]);
  }
}
