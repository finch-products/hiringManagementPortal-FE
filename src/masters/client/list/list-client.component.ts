import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../../interfaces/client.interface';
import { ClientService } from '../../../app/services/client.service';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.scss'
})
export class ListClientComponent {

  displayedColumns: string[] = ['clm_clientid', 'clm_name', 'clm_managername', 'clm_clientemail', 'clm_clientphone', 'clm_lcm_id', 'clm_isactive'];
  dataSource = new MatTableDataSource<Client>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private changeDetectorRefs: ChangeDetectorRef,private clientService: ClientService, private httpService: HttpService) { }

  ngOnInit() {
    this.fetchClients();
    this.clientService.clients$.subscribe(client => {
      this.dataSource.data = [...client];  // Create a new array reference
      this.changeDetectorRefs.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchClients() {
    this.httpService.getClientDetails().subscribe({
      next: (data) => {
        this.clientService.setInitialData(data.reverse());
      },
      error: (err) => console.error('Error fetching clients', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
