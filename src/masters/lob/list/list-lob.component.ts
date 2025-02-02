import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { LOB } from '../../../interfaces/lob.interface';

@Component({
  selector: 'app-list-lob',
  templateUrl: './list-lob.component.html',
  styleUrl: './list-lob.component.scss'
})
export class ListLOBComponent {
  displayedColumns: string[] = ['lob_name', 'lob_delivery_manager', 'lob_client_partner'];
  dataSource = new MatTableDataSource<LOB>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchLOB();
  }

  fetchLOB() {
    this.http.get<LOB[]>('http://127.0.0.1:8000/api/lob-master/').subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => console.error('Error fetching lobs:', error)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
