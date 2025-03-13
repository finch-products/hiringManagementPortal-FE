import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemandComponent } from '../demand/demand.component';
interface Candidate {
  cdm_name: string;
  cdm_id: string;
  cdm_keywords: string[];
  cdm_profile: string;
  avatar?: string;
  candidate_status: {
    csm_id: number | null;
    csm_code: string;
  }
}

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.scss'
})
export class CandidateComponent {
  @Output() candidatesLinked = new EventEmitter<void>();
  @Output() pdfSelected = new EventEmitter<string>();
  candidates: any[] = [];
  filteredCandidates: Candidate[] = [];
  searchTerm: string = '';
  selectedCandidates: any[] = [];
  dem_id: string = '';
  statusList: any[] = [];
  demands: any;
  constructor(private httpService: HttpService, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      if (demandId) {
        this.dem_id = demandId; // ✅ Ensure demand ID is stored
        this.loadData(demandId);
        this.loadCandidateStatuses();
      }
    });
    console.log("Demand ID on Init:", this.dem_id);
  }

  public loadData(demandId: any) {
    const payload = { dem_id: demandId };

    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        this.demands = data;
        // const existingCandidateIds = new Set((data.candidates || []).map((c: { cdl_id: string }) => c.cdl_id));
        // this.candidates = data.candidates || [];
        this.candidates = data.candidates ? [...data.candidates].reverse() : [];
        // console.log("candidates linked", this.candidates);

        //     console.log("existingCandidateIds",existingCandidateIds)

        //     this.candidates = data.candidates
        // ? [...data.candidates]
        //     .reverse()
        //     .map(candidate => ({
        //       ...candidate, // Keeps all existing properties dynamically
        //       isNew: !existingCandidateIds.has(candidate.cdl_id)
        //     }))
        // : [];
        console.log("Updated candidates list:", this.candidates);

      }
    })
  }

  loadCandidateStatuses() {
    this.httpService.getCandidateStatuses().subscribe(
      (response) => {
        this.statusList = response;
      },
      (error) => {
        console.error('Error fetching candidate statuses:', error);
      }
    );
  }

  handleNullValues(candidate: any): Candidate {
    return {
      cdm_name: candidate.cdm_name || 'Not Provided',
      cdm_id: candidate.cdm_id || 'Not Provided',
      candidate_status: {
        csm_id: candidate?.candidate_status?.csm_id ?? null,
        csm_code: candidate.candidate_status ? candidate.candidate_status.csm_code : 'Unknown'
      },
      cdm_keywords: candidate.cdm_keywords ? candidate.cdm_keywords.split(',') : ['Not Provided'],
      cdm_profile: candidate.cdm_profile || '#'
    };
  }

  filterCandidates(): void {
    if (!this.dem_id) {
      this.filteredCandidates = [...this.candidates];
      console.log("No demand ID provided. Showing all candidates.");
      return;
    }
  
    const requestBody = { dem_id: this.dem_id };
  
    this.httpService.getNotAddedCandidatesBySearch(requestBody).subscribe({
      next: (data) => {
        console.log("Full API Response:", data);
        const allCandidates: Candidate[] = data?.candidates_not_added || [];
  
        if (this.searchTerm?.trim()) {
          const term = this.searchTerm.trim().toLowerCase();
          this.filteredCandidates = allCandidates.filter(candidate =>
            (candidate?.cdm_name || '').toLowerCase().includes(term)
          );
        } else {
          this.filteredCandidates = [...allCandidates];
        }
  
        console.log("Filtered Candidates:", this.filteredCandidates);
      },
      error: (err) => {
        console.error("Error fetching candidates:", err);
        this.filteredCandidates = [];
      }
    });
  }
  
  getSafeValue(value: any): string {
    return value && value.trim() ? value : 'Not Provided';
  }

  openFilter() {
    // alert('Filter feature coming soon!');
    this.snackBar.open("Filter feature coming soon!!", "Close", {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /*redirectToAddCandidates() {
    // Change this URL if needed
    window.location.href = 'http://64.227.145.117/candidate-master';
  }*/


  toggleSelection(candidate: Candidate) {
    const index = this.selectedCandidates.indexOf(candidate);
    if (index > -1) {
      this.selectedCandidates.splice(index, 1);
    } else {
      this.selectedCandidates.push(candidate);
    }
  }

  submitSelectedCandidates() {
    if (this.selectedCandidates.length === 0) {
      // alert('No candidates selected.');
      this.snackBar.open("No candidates selected..!", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload = this.selectedCandidates
      .filter(candidate => candidate.candidate_status.csm_id !== null) // Skip if status is null
      .map(candidate => ({
        cdl_cdm_id: candidate.cdm_id,
        cdl_dem_id: this.dem_id,
        cdl_csm_id: candidate.candidate_status.csm_id
      }));

    if (payload.length === 0) {
      this.snackBar.open("No candidates with valid status selected.!", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      // alert('No candidates with valid status selected.');
      return;
    }

    this.httpService.postData('http://64.227.145.117/api/candidate-demand/', payload).subscribe({
      next: (response) => {
        this.snackBar.open("✅ Candidates linked successfully!", "Close", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.candidatesLinked.emit();
        // this.router.navigate(['/list']);
      },
      error: (error) => {
        this.snackBar.open("❌ Failed to link candidates. Try again.", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error("Error submitting data", error);
      }
    });
  }

  openPdf(pdfUrl: string) {
    this.pdfSelected.emit(pdfUrl); // Emit the clicked PDF file name
    console.log("pdfUrl", pdfUrl)
  }
}