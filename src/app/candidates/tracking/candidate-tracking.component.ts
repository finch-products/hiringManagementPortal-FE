import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './candidate-tracking.component.html',
  styleUrl: './candidate-tracking.component.scss'
})

export class CandidateTrackingComponent {
  displayedColumns: string[] = ['select', 'name', 'location', 'status', 'schedule'];
  candidates: any[] = [];
  filteredCandidates = new MatTableDataSource<any>([]);
  selectedStatuses: string[] = [];
  candidateStatuses: any[] = [];
  selectedCandidates: Set<string> = new Set();

  constructor(private router: Router, private httpService: HttpService) {}

  ngOnInit() {
    this.loadCandidateStatuses();
    this.loadCandidates();
  }

  loadCandidateStatuses() {
    this.httpService.getCandidateStatuses().subscribe(
      (data: { csm_code: string }[]) => {
        this.candidateStatuses = data.map((status) => status.csm_code).filter(Boolean);
      },
      (error) => {
        console.error('Error fetching candidate statuses:', error);
      }
    );
  }


  loadCandidates() {
    this.httpService.getCandidate().subscribe(
      (data) => {
        this.filteredCandidates.data = data;
      },
      (error) => {
        console.error('Error fetching candidates:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredCandidates.filter = filterValue;
  }

 
  getStatusClass(status: string | null | undefined): string {
    if (!status) return 'status-default';
    return `status-${status.replace(/\s+/g, '-').toLowerCase()}`;
  }

  viewCandidateHistory(candidate: any) {
    this.router.navigate(['/candidate-history', candidate.id]);
  }


  scheduleInterview(candidate: any) {
    console.log('Scheduling interview for:', candidate);
  }

  addCandidate() {
    this.router.navigate(['/add-candidate']);
  }

  filterCandidates() {
    if (!this.candidates || this.candidates.length === 0) {
      console.error("No candidates available for filtering! Data might not be loaded yet.");
      return;
    }
  
    console.log("Filtering by:", JSON.stringify(this.selectedStatuses));
    console.log("Before filtering:", this.candidates);
  
    this.filteredCandidates.data = this.candidates.filter(candidate => {
      if (!candidate.candidate_status || !candidate.candidate_status.csm_code) {
        return false;
      }
  
      const candidateStatus = candidate.candidate_status.csm_code.trim().toLowerCase();
      console.log(`Checking candidate: ${candidate.cdm_name}, Status: ${candidateStatus}`);
      
      return this.selectedStatuses.some(status => 
        status.trim().toLowerCase() === candidateStatus
      );
    });
    console.log("After filtering:", this.filteredCandidates.data);
  }
  
  resetFilters() {
    this.selectedStatuses = [];
    this.loadCandidates();
  }

  toggleCandidateSelection(cdm_id: string) {
    if (this.selectedCandidates.has(cdm_id)) {
      this.selectedCandidates.delete(cdm_id);
    } else {
      this.selectedCandidates.add(cdm_id);
    }
  }
}
