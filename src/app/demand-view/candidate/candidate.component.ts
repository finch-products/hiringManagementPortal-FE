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
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  searchTerm: string = '';
  selectedCandidates: any[] = [];
  dem_id: string = '';
  statusList: any[] = [];
  constructor(private httpService: HttpService, private route: ActivatedRoute,private snackBar: MatSnackBar, private router:Router ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.dem_id = params.get('id') || '';
    });
    this.loadCandidateStatuses();
    this.fetchCandidates();
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

  fetchCandidates(): void {
    this.httpService.getCandidate().subscribe({
      next: (data: any[]) => {
        this.candidates = data.map((candidate: any) => this.handleNullValues(candidate));
        this.filteredCandidates = [...this.candidates];
      },
      error: (err) => console.error('Error fetching candidates', err)
    });
  }

  handleNullValues(candidate: any): Candidate {
    return {
      cdm_name: candidate.cdm_name || 'Not Provided',
      cdm_id: candidate.cdm_id || 'Not Provided',
      candidate_status: {
        csm_id : candidate?.candidate_status?.csm_id ?? null,
        csm_code: candidate.candidate_status ? candidate.candidate_status.csm_code : 'Unknown'
      }, 
      cdm_keywords: candidate.cdm_keywords ? candidate.cdm_keywords.split(',') : ['Not Provided'],
      cdm_profile: candidate.cdm_profile || '#'
    };
  }

  filterCandidates(): void {
    this.filteredCandidates = this.candidates.filter(candidate =>
      candidate.cdm_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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


  redirectToAddCandidates() {
    // Change this URL if needed
    window.location.href = 'http://64.227.145.117/candidate-master';
  }


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
    console.log("pdfUrl",pdfUrl)
  }
}