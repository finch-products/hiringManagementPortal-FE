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
  selectedDemandId: string | null = null; // To track highlighted demand
  searchText: string = '';
  candidates: any[] = [];

  constructor(private http: HttpClient, private httpService: HttpService) { }

  ngOnInit(): void {
    this.fetchDemandIds();
  }

  fetchCandidateByDemandId(demandId?: string) {
    if (!demandId) {
        console.error('Demand ID is required');
        return;
    }
    const payload = { dem_id: demandId };
    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data: { cdl_dem_id: string; demand_details: any; candidates: any[] }) => {
        if (data) {
          this.selectedDemand = { ...data.demand_details };
          this.candidates = data.candidates || [];
          this.selectedDemandId = demandId; // Highlight the selected demand
        }
      },
      error: (err: any) => console.error('Error fetching demand and candidate details', err)
    });
  }

  fetchDemandIds() {
    this.httpService.getDemandIds().subscribe({
      next: (data: any) => {
        this.demandIds = data;
        if (this.demandIds.length > 0) {
          this.selectDemand(this.demandIds[0].dem_id); // Auto-select first demand
        }
      },
      error: (err: any) => console.error('Error fetching demands', err)
    });
  }

  filteredDemands() {
    return this.demandIds?.filter((demand: { dem_id: string }) =>
        demand.dem_id.toLowerCase().includes(this.searchText?.toLowerCase() || '')
    ) || [];
  }

  selectDemand(demandId: string) {
    this.selectedDemand = null; // Reset selected demand
    this.candidates = [];       // Clear candidates list
    this.fetchCandidateByDemandId(demandId);
  }
}