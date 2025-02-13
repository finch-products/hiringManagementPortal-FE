import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { InternalDept } from '../../../interfaces/internal-dept.interface';
import { InternalDeptService } from '../../../app/services/internal.department.service';

@Component({
  selector: 'app-list-internal-department',
  templateUrl: './list-internal-department.component.html',
  styleUrl: './list-internal-department.component.scss'
})
export class ListInternalDepartmentComponent {
  displayedColumns: string[] = ['idm_id', 'idm_unitname', 'idm_unitsales', 'idm_unitdelivery', 'idm_unitsolution', 'idm_spoc_id', 'idm_deliverymanager_id', 'idm_isactive'];
  dataSource = new MatTableDataSource<InternalDept>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private internalDeptService: InternalDeptService) { }

  ngOnInit() {
    this.fetchPracticeUnits();
    this.internalDeptService.internalDepts$.subscribe(dept => {
      this.dataSource.data = dept;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchPracticeUnits() {
    this.http.get<InternalDept[]>('http://64.227.145.117/api/departments/').subscribe({
      next: (data) => {
        // this.dataSource.data = data;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.internalDeptService.setInitialData(data); 
      },
      error: (error) => console.error('Error fetching practice units:', error)
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['newRecord'] && changes['newRecord'].currentValue) {
  //     this.addNewPracticeUnit(changes['newRecord'].currentValue);
  //   }
  // }

  // addNewPracticeUnit(newRecord: InternalDept) {
  //   this.dataSource.data = [...this.dataSource.data, newRecord]; // Append new record
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
