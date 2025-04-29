import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpSentEvent } from '@angular/common/http';
import { LocationService } from '../../../app/services/location.service';
import { HttpService } from 'app/services/http.service';

@Component({
  selector: 'app-list-location',
  templateUrl: './list-location.component.html',
  styleUrl: './list-location.component.scss'
})
export class ListLocationComponent {

  displayedColumns: string[] = ['lcm_name', 'lcm_state', 'lcm_country'];
  dataSource = new MatTableDataSource<Location>([]);

  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  pages: number[] = [];
  totalPages = 0;
  allLocations: Location[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private locationService: LocationService, private httpService: HttpService) { }

  ngOnInit() {
    this.fetchLocations();
    this.locationService.locations$.subscribe(location => {
      this.allLocations=[...location];
      this.totalItems=this.allLocations.length;
      this.updatePages();
      this.updateDisplayedLocations()
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchLocations() {
    this.httpService.getLocations().subscribe({
      next: (data) => {
        this.locationService.setInitialData(data);
        // Calculate total items dynamically from backend data
        this.allLocations=[...data];
        this.totalItems = this.allLocations.length;
        this.updateDisplayedLocations()
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateDisplayedLocations() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentLocations = this.allLocations.slice(startIndex, endIndex);
    this.dataSource.data = currentLocations;
  }
  updatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];

    for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
      this.pages.push(i);
    }
    if (this.totalPages > 3) {
      this.pages.push(-1); // ellipsis
      this.pages.push(this.totalPages);
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;  // Reset to the first page
    this.updatePages();    // Update the pages based on new page size
    this.updateDisplayedLocations();
    // Fetch new data based on the updated page size and current page
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedLocations();
      // Fetch new data based on the updated page
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedLocations();
      // Fetch new data based on the updated page
    }
  }

  goToPage(page: number) {
    if (page === -1) {
      // If page is ellipsis, do nothing
      return;
    }
    this.currentPage = page;
    // Fetch new data based on the current page and page size
    this.updateDisplayedLocations();
  }

}
