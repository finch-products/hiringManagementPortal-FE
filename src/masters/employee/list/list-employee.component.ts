import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../app/services/http.service';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../../interfaces/employee.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.scss'
})
export class ListEmployeeComponent {
  employees: any[] = [];
  displayedColumns: string[] = ['emp_uniqueid', 'emp_name', 'emp_email', 'emp_phone', 'emp_lcm_id', 'emp_rlm_id', 'emp_keyword'];
  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private httpService: HttpService) { }

  ngOnInit() {
    this.fetchEmployees();
    // this.clientService.clients$.subscribe(client => {
    //   this.dataSource.data = client;
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }

  fetchEmployees(): void {
    this.httpService.getEmployee().subscribe({
      next: (data) => {
        this.employees = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('Employees:', this.employees);
      },
      error: (err) => console.error('Error fetching employees', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
