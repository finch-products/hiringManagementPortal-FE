import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../../interfaces/client.interface';
import { ClientService } from '../../../app/services/client.service';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.scss'
})
export class ListClientComponent {

   displayedColumns: string[] = ['client_name', 'client_manager_name', 'client_email', 'client_phone', 'client_location', 'client_department'];
    dataSource = new MatTableDataSource<Client>([]);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(private http: HttpClient, private clientService: ClientService) { }

    ngOnInit() {
      this.fetchClients();
      this.clientService.clients$.subscribe(client => {
        this.dataSource.data = client;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  
    fetchClients() {
      this.http.get<Client[]>('http://127.0.0.1:8000/api/client-master/').subscribe({
        next: (data) => {
          this.clientService.setInitialData(data); 
        },
        error: (error) => console.error('Error fetching clients:', error)
      });
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.dataSource.filter = filterValue;
    }
}
