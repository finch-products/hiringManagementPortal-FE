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
      this.dataSource.filterPredicate = this.createFilter();
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

  createFilter(): (data: LOB, filter: string) => boolean {
    return (data: LOB, filter: string): boolean => {
      const searchTerms = filter.toLowerCase();
      
      return (
        data.lob_name.toLowerCase().includes(searchTerms) ||
        (data.lob_description?.toLowerCase().includes(searchTerms) ?? false) ||
        (data.lob_clientpartner?.emp_name.toLowerCase().includes(searchTerms) ?? false) ||
        (data.lob_deliverymanager?.emp_name.toLowerCase().includes(searchTerms) ?? false) ||
        (data.lob_insertby_id?.emp_name.toLowerCase().includes(searchTerms) ?? false) ||  // Changed to lob_insertby_id
      (data.lob_updateby_id?.emp_name.toLowerCase().includes(searchTerms) ?? false) 
      );
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
