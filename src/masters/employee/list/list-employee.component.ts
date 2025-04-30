import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../app/services/http.service';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../../interfaces/employee.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeService } from '../../../app/services/employee.service';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.scss'
})
export class ListEmployeeComponent {

  employees: any[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  pages: number[] = [];
  totalPages = 0;
  allEmployees:Employee[]=[]
  displayedColumns: string[] = ['emp_uniqueid', 'emp_name', 'emp_email', 'emp_phone', 'emp_lcm_id', 'emp_rlm_id', 'emp_keyword'];
  dataSource = new MatTableDataSource<Employee>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private httpService: HttpService,private employeeService: EmployeeService) { }

  ngOnInit() {
    this.fetchEmployees();
    this.employeeService.employees$.subscribe(employees => {
      this.allEmployees=[...employees];
      this.totalItems=this.allEmployees.length;
      this.updatePages();
      this.updateDisplayedEmployees();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchEmployees(): void {
    this.httpService.getEmployee().subscribe({
      next: (data) => {
        this.employeeService.setInitialData(data);
        // Calculate total items dynamically from backend data
        this.allEmployees = [...data];
        this.totalItems = this.allEmployees.length;
        this.updateDisplayedEmployees();
      },
      error: (err) => console.error('Error fetching employees', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateDisplayedEmployees() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentEmployees= this.allEmployees.slice(startIndex, endIndex);
    this.dataSource.data = currentEmployees;
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
    this.updateDisplayedEmployees();
    // Fetch new data based on the updated page size and current page
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedEmployees();
      // Fetch new data based on the updated page
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedEmployees();
      // Fetch new data based on the updated page
    }
  }

  goToPage(page: number) {
    if (page === -1) {
      // If page is ellipsis, do nothing
      return;
    }
    this.currentPage = page;
    this.updateDisplayedEmployees();
    // Fetch new data based on the current page and page size
  }

}
