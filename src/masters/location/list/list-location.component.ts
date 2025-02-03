import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../../../app/services/location.service';

@Component({
  selector: 'app-list-location',
  templateUrl: './list-location.component.html',
  styleUrl: './list-location.component.scss'
})
export class ListLocationComponent {
  displayedColumns: string[] = ['location_name', 'state', 'country'];
    dataSource = new MatTableDataSource<Location>([]);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(private http: HttpClient, private locationService: LocationService) { }
  
    ngOnInit() {
      this.fetchLOB();
      this.locationService.locations$.subscribe(location => {
        this.dataSource.data = location;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  
    fetchLOB() {
      this.http.get<Location[]>('http://127.0.0.1:8000/api/location-master/').subscribe({
        next: (data) => {
          this.locationService.setInitialData(data); 
        },
        error: (error) => console.error('Error fetching location:', error)
      });
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.dataSource.filter = filterValue;
    }
}
