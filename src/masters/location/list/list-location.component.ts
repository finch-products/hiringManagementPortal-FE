import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpSentEvent } from '@angular/common/http';
import { LocationService } from '../../../app/services/location.service';
import { HttpService } from 'app/services/http.service';

@Component({
  selector: 'app-list-location',
  templateUrl: './list-location.component.html',
  styleUrl: './list-location.component.scss'
})
export class ListLocationComponent {

  displayedColumns: string[] = ['lcm_name', 'lcm_state', 'lcm_country'];
  dataSource = new MatTableDataSource<Location>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private locationService: LocationService, private httpService: HttpService) { }

  ngOnInit() {
    this.fetchLocations();
    this.locationService.locations$.subscribe(location => {
      this.dataSource.data = location;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchLocations() {
    this.httpService.getLocationDetails().subscribe({
      next: (data) => {
        this.locationService.setInitialData(data);
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
