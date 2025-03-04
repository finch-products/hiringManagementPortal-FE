import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-demand-history',
  templateUrl: './demand.history.component.html',
  styleUrl: './demand.history.component.scss'
})
export class DemandHistoryComponent implements OnInit {
  demandIds: any[] = [];
  selectedDemand: any = null;
  searchText: string = '';

  constructor(private http: HttpClient, private httpService: HttpService) { }

  ngOnInit(): void {
    this.fetchDemandIds();
  }

  fetchDemandIds() {
    this.httpService.getDemandIds().subscribe({
      next: (data) => {
        this.demandIds = data;
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }

  filteredDemands() {
    return this.demandIds.filter(demand =>
      demand.dem_id.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
  selectDemand(demand: string) {
    this.httpService.getSingleDemandDetail(demand).subscribe({
      next: (data) => {
        this.selectedDemand = data;
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }
}
