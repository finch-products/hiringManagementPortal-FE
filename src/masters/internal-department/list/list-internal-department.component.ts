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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private internalDeptService: InternalDeptService, private httpService: HttpService) { }

  ngOnInit() {
    this.loadDepts();
    this.internalDeptService.internalDepts$.subscribe(dept => {
      this.dataSource.data = dept;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadDepts() {
    this.httpService.getInternalDepartmentDetails().subscribe({
      next: (data) => {
        const sortedData = (data as any[]).sort((a, b) => b.idm_id - a.idm_id);
        this.internalDeptService.setInitialData(sortedData);
      },
      error: (err) => console.error('Error fetching departments', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}