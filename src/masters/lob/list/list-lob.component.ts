import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { LOB } from '../../../interfaces/lob.interface';
import { LobService } from '../../../app/services/lob.service';

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

  constructor(private http: HttpClient, private lobService: LobService) { }

  ngOnInit() {
    this.fetchLOB();
    this.lobService.lobs$.subscribe(lob => {
      this.dataSource.data = lob;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchLOB() {
    this.http.get<LOB[]>('http://64.227.145.117/api/lob-master/').subscribe({
      next: (data) => {
        this.lobService.setInitialData(data); 
      },
      error: (error) => console.error('Error fetching lobs:', error)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
