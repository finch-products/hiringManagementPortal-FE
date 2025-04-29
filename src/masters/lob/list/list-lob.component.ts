import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { LOB } from '../../../interfaces/lob.interface';
import { LobService } from '../../../app/services/lob.service';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'app-list-lob',
  templateUrl: './list-lob.component.html',
  styleUrl: './list-lob.component.scss'
})
export class ListLOBComponent {

  displayedColumns: string[] = ['lob_name', 'lob_description', 'lob_clientpartner', 'lob_deliverymanager', 'lob_insertby', 'lob_updateby'];
  dataSource = new MatTableDataSource<LOB>([]);

  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  pages: number[] = [];
  totalPages = 0;

  allLOBs: LOB[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private lobService: LobService, private httpService: HttpService) {}

  ngOnInit() {
    this.fetchLOB();
    this.lobService.lobs$.subscribe(lobs => {
      this.allLOBs = [...lobs];
      this.totalItems = this.allLOBs.length;
      this.updatePages();
      this.updateDisplayedLObs();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.createFilter();
    });
  }

  fetchLOB() {
    this.httpService.getLOBDetails().subscribe({
      next: (data) => {
        this.lobService.setInitialData(data.reverse());
        this.allLOBs = [...data];
        this.totalItems = this.allLOBs.length;
        this.updateDisplayedLObs();
      },
      error: (err) => console.error('Error fetching LOBs', err)
    });
  }

  createFilter(): (data: LOB, filter: string) => boolean {
    return (data: LOB, filter: string): boolean => {
      const searchTerms = filter.toLowerCase();
      return (
        data.lob_name.toLowerCase().includes(searchTerms) ||
        (data.lob_description?.toLowerCase().includes(searchTerms) ?? false) ||
        (data.lob_clientpartner?.emp_name.toLowerCase().includes(searchTerms) ?? false) ||
        (data.lob_deliverymanager?.emp_name.toLowerCase().includes(searchTerms) ?? false) ||
        (data.lob_insertby_id?.emp_name.toLowerCase().includes(searchTerms) ?? false) ||
        (data.lob_updateby_id?.emp_name.toLowerCase().includes(searchTerms) ?? false)
      );
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateDisplayedLObs() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentLobs = this.allLOBs.slice(startIndex, endIndex);
    this.dataSource.data = currentLobs;
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
    this.currentPage = 1;  // Reset to first page
    this.updatePages();
    this.updateDisplayedLObs();  // Update list
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedLObs(); // Update list
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedLObs(); // Update list
    }
  }

  goToPage(page: number) {
    if (page === -1) {
      return; // Ignore ellipsis
    }
    this.currentPage = page;
    this.updateDisplayedLObs(); // Update list
  }
}
