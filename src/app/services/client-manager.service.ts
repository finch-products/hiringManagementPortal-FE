import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientManagerService {
  private clientManagers = new BehaviorSubject<any[]>([]);
  clientManagers$ = this.clientManagers.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(clientManagers: any[]) {
    this.clientManagers.next(clientManagers);
  }

  // Add new record at the TOP of the list
  addClientManager(newClientManager: any) {
    const currentManagers = this.clientManagers.value;
    this.clientManagers.next([newClientManager, ...currentManagers]); // Insert at the beginning
  }
}
