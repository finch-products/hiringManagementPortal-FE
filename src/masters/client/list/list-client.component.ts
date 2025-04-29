import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Client } from '../../../interfaces/client.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
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

  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  pages: number[] = [];
  totalPages = 0;

  allClients: Client[] = []; // Store all fetched data separately

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef,
    private clientService: ClientService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.fetchClients();
    this.clientService.clients$.subscribe(clients => {
      this.allClients = [...clients];
      this.totalItems = this.allClients.length;
      this.updatePages();
      this.updateDisplayedClients(); // Only display sliced data
      this.changeDetectorRefs.detectChanges();
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

  updateDisplayedClients() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentClients = this.allClients.slice(startIndex, endIndex);
    this.dataSource.data = currentClients;
  }

  updatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];

    for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
      this.pages.push(i);
    }

    if (this.totalPages > 3) {
      this.pages.push(-1);  // Ellipsis
      this.pages.push(this.totalPages);
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePages();
    this.updateDisplayedClients();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedClients();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedClients();
    }
  }

  goToPage(page: number) {
    if (page === -1) {
      return; // Do nothing for ellipsis
    }
    this.currentPage = page;
    this.updateDisplayedClients();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
