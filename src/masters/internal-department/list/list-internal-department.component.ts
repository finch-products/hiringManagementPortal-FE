import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { InternalDept } from '../../../interfaces/internal-dept.interface';
import { InternalDeptService } from '../../../app/services/internal.department.service';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'app-list-internal-department',
  templateUrl: './list-internal-department.component.html',
  styleUrl: './list-internal-department.component.scss'
})
export class ListInternalDepartmentComponent {

  displayedColumns: string[] = ['idm_id', 'idm_unitname', 'idm_unitsales', 'idm_unitdelivery', 'idm_unitsolution', 'idm_spoc_id', 'idm_deliverymanager_id', 'idm_isactive'];
  dataSource = new MatTableDataSource<InternalDept>([]);

  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  pages: number[] = [];
  totalPages = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private internalDeptService: InternalDeptService, private httpService: HttpService) { }

  ngOnInit() {
    this.loadDepts();
    this.internalDeptService.internalDepts$.subscribe(dept => {
      //this.dataSource.data = dept;
      this.dataSource.data = this.getPagedData(dept);
      this.totalItems=dept.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.updatePages();
  }

  loadDepts() {
    this.httpService.getInternalDepartmentDetails().subscribe({
      next: (data) => {
        const sortedData = (data as any[]).sort((a, b) => b.idm_id - a.idm_id);
        this.internalDeptService.setInitialData(sortedData);
        // Calculate total items dynamically from backend data
        this.totalItems = data.length;
        this.dataSource.data = this.getPagedData(sortedData);
        this.updatePages();
      },
      error: (err) => console.error('Error fetching departments', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
   
  getPagedData(data: InternalDept[]): InternalDept[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }
  
  updatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];

    // Add first three pages
    for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
      this.pages.push(i);
    }

    // Add ellipsis if necessary
    if (this.totalPages > 3) {
      this.pages.push(-1);  // -1 represents the ellipsis
    }

    // Always add the last page
    if (this.totalPages > 3) {
      this.pages.push(this.totalPages);
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePages();
    this.internalDeptService.internalDepts$.subscribe(dept => {
      this.dataSource.data = this.getPagedData(dept);
    });
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.internalDeptService.internalDepts$.subscribe(dept => {
        this.dataSource.data = this.getPagedData(dept);
      });
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.internalDeptService.internalDepts$.subscribe(dept => {
        this.dataSource.data = this.getPagedData(dept);
      });
    }
  }
  
  goToPage(page: number) {
    if (page === -1) return;
    this.currentPage = page;
    this.internalDeptService.internalDepts$.subscribe(dept => {
      this.dataSource.data = this.getPagedData(dept);
    });
  }
  

}