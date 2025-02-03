import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients = new BehaviorSubject<any[]>([]);
  clients$ = this.clients.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(client: any[]) {
    this.clients.next(client);
  }

  // Add new record at the TOP of the list
  addClient(newclient: any) {
    const currentclient = this.clients.value;
    this.clients.next([newclient, ...currentclient]); // Insert at the beginning
  }
}
