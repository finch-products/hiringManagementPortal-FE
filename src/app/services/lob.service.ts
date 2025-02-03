import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LobService {
  private lobs = new BehaviorSubject<any[]>([]);
  lobs$ = this.lobs.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(lob: any[]) {
    this.lobs.next(lob);
  }

  // Add new record at the TOP of the list
  addLob(newLob: any) {
    const currentlob = this.lobs.value;
    this.lobs.next([newLob, ...currentlob]); // Insert at the beginning
  }
}
