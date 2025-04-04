import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from 'interfaces/client.interface'; 

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();

  constructor() {}

  setInitialData(data: Client[]) {
    this.clientsSubject.next(data);
  }

  addClient(client: Client) {
    const currentClients = this.clientsSubject.value;
    this.clientsSubject.next([client, ...currentClients]);  // Ensuring list updates
  }
}