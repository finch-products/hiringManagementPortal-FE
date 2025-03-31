import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private lobService: LobService, private httpService: HttpService) { }

  ngOnInit() {
    this.fetchLOB();
    this.lobService.lobs$.subscribe(lob => {
      this.dataSource.data = lob;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchLOB() {
    this.httpService.getLOBDetails().subscribe({
      next: (data) => {
        this.lobService.setInitialData(data.reverse());
      },
      error: (err) => console.error('Error fetching LOBs', err)
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
