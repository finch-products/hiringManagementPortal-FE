import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
interface Candidate {
  cdm_name: string;
  cdm_id: string;
  cdl_cdm_id: string;
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
  statusList: any[] = [];
  showInterviewForm: boolean = false;
selectedCandidateForInterview: any = null;


  showPopup: boolean = false;
  statusedit: boolean = false; 
  demands: any;
  selectedCandidate: any = null;
  selectedStatus: string = '';
  cdm_comment: string = '';
  csm_code: string = '';
  dem_id: string = '';

  readonly cdm_updateby_id = 'emp_22032025_1';

  constructor(private httpService: HttpService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.filteredCandidates = [...this.candidates]; // Ensure it loads with all candidates initially
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      if (demandId) {
        this.dem_id = demandId;
        this.loadData(demandId);
      }
    });

    this.httpService.getCandidateStatuses().subscribe(
      (response) => {
        this.statusList = response;
      },
      (error) => {
        console.error('Error fetching global candidate statuses:', error);
      }
    );

    console.log("Demand ID on Init:", this.dem_id);
  }

  onSubmit() {
    this.onStatusFormSubmit();
  }

  onCancel() {
    this.onPopupClose();
  }

  onStatusChange(candidate: any, event: any) {
    const newStatus = event.target.value;
    candidate.selectedStatus = newStatus;
    if (!candidate.candidate_status) {
      console.error('Candidate status is undefined');
      return;
    }
  
    if (newStatus !== candidate.candidate_status.csm_code) {
      // Store the original status before showing popup
      candidate.originalStatus = candidate.candidate_status.csm_code;
      this.selectedCandidate = candidate;
      this.selectedStatus = newStatus;
      this.csm_code = newStatus;
      this.showPopup = true;
      console.log('showPopup:', this.showPopup);
    }
  }

  onPopupClose() {
    if (this.selectedCandidate) {
      // Reset to original status
      this.selectedCandidate.selectedStatus = this.selectedCandidate.originalStatus;
      delete this.selectedCandidate.originalStatus;
    }
    
    this.showPopup = false;
    this.selectedCandidate = null;
    this.selectedStatus = '';
    this.cdm_comment = '';
    this.csm_code = '';
  }

  onStatusFormSubmit() {
    if (!this.selectedCandidate || !this.selectedStatus) {
      this.snackBar.open("Invalid data. Please try again.", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const csm_id = this.statusList.find(status => status.csm_code === this.selectedStatus)?.csm_id;

    if (!csm_id) {
      this.snackBar.open("Invalid status selected. Please try again.", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload = {
      cdm_id: this.selectedCandidate.cdl_cdm_id,
      csm_id: csm_id,
      cdm_comment: this.cdm_comment,
      cdm_updateby_id: this.cdm_updateby_id
    };
    this.onCancel();
    this.httpService.updateCandidateStatus(payload).subscribe({
      next: (response) => {
        this.snackBar.open("✅ Candidate status updated successfully!", "Close", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.onPopupClose();
        this.loadData(this.dem_id);
      },
      error: (error) => {
        if (this.selectedCandidate?.originalStatus) {
          this.selectedCandidate.selectedStatus = this.selectedCandidate.originalStatus;
          delete this.selectedCandidate.originalStatus;
        }
        this.snackBar.open(` ${error.message}`, "❌", {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error("Error updating candidate status", error);
        this.loadData(this.dem_id);
      }
    });
  }


  public loadData(demandId: any) {
    const payload = { dem_id: demandId };

    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        this.demands = data;
        this.candidates = data.candidates ? [...data.candidates].reverse() : [];

        this.candidates.forEach(candidate => {
          this.loadCandidateStatusesById(candidate.cdl_cdm_id).subscribe(
            (statuses) => {
              candidate.statusList = statuses && statuses.length > 0 ? statuses : this.statusList;
              candidate.selectedStatus = candidate.candidate_status.csm_code;
            },
            (error) => {
              console.error('Error fetching candidate statuses:', error);
              candidate.statusList = this.statusList;
            }
          );
        });
      }
    });
  }

  loadCandidateStatusesById(cdm_id: string): Observable<any> {
    return this.httpService.getCandidateStatusesbyid(cdm_id).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching statuses for candidate ${cdm_id}:`, error);
        return this.httpService.getCandidateStatuses();
      })
    );
  }

  handleNullValues(candidate: any): Candidate {
    return {
      cdm_name: candidate.cdm_name || 'Not Provided',
      cdm_id: candidate.cdm_id || 'Not Provided',
      cdl_cdm_id:candidate.cdl_cdm_id,
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
      this.filteredCandidates = [];
      console.log("No demand ID provided.");
      return;
    }

    const requestBody = { dem_id: this.dem_id };

    this.httpService.getNotAddedCandidatesBySearch(requestBody).subscribe({
      next: (data) => {
        console.log("API Response:", data);
        const allCandidates: Candidate[] = data?.candidates_not_added || [];
  
        // Filter candidates based on search input
        const term = this.searchTerm.trim().toLowerCase();
        this.filteredCandidates = term
          ? allCandidates.filter(candidate =>
              (candidate?.cdm_name || '').toLowerCase().includes(term)
            )
          : allCandidates;
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
    this.router.navigate(['candidate-tracking']);
    /*this.snackBar.open("Filter feature coming soon!!", "Close", {
      duration: 3000,
      panelClass: ['success-snackbar']
    });*/
  }

  redirectToAddCandidates() {
    this.router.navigate(['candidate-master']);
  }

  redirectTocandidateHistory(){
    this.router.navigate(['candidate-history']);
  }

  toggleSelection(candidate: Candidate) {
    const index = this.selectedCandidates.indexOf(candidate);
    if (index > -1) {
      this.selectedCandidates.splice(index, 1);
    } else {
      console.log('pushing candidate:', candidate)
      this.selectedCandidates.push(candidate);
    }
  }

  submitSelectedCandidates() {
    if (this.selectedCandidates.length === 0) {
      this.snackBar.open("No candidates selected..!", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload = this.selectedCandidates.map(candidate => ({
      cdl_cdm_id: candidate.cdl_cdm_id,
      cdl_dem_id: this.dem_id
    }));


    console.log('payload for linking :', payload);
    if (payload.length === 0) {
      this.snackBar.open("No candidates with valid status selected.!", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        this.snackBar.open("✅ Candidates linked successfully!", "Close", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.candidatesLinked.emit();

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
    console.log("PDF selected in CandidateComponent:", pdfUrl);
  }

  trackByFn(index: number, candidate: any) {
    return candidate.id; // Uses a unique ID to avoid re-rendering
}


  getStatusClass(statusCode: string): string {
    if (!statusCode) return '';
    return statusCode.replace(/\s+/g, '_');
  }
  
  getStatusClasses(candidate: any, isSearchMode: boolean): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      'no-arrow': isSearchMode,
      'status': true
    };
    
    const statusClass = this.getStatusClass(candidate.selectedStatus);
    if (statusClass) {
      classes[statusClass] = true;
    }
    
    return classes;
  }

  openInterviewForm(candidate: any) {
    this.selectedCandidateForInterview = candidate;
    this.showInterviewForm = true;
  }
  
  closeInterviewForm() {
    this.showInterviewForm = false;
    this.selectedCandidateForInterview = null;}
    
  toggleStatusEdit() {
    this.statusedit = !this.statusedit; 
    console.log("Status Edit Clicked: ", this.statusedit);
  }

  updateCandidateStatusToInterviewScheduled(candidateId: string) {
    // Find the candidate in your list
    const candidate = this.candidates.find(c => c.cdl_cdm_id === candidateId);
    if (!candidate) return;
  
    // Find the "INTERVIEW_SCHEDULED" status in your status list
    const interviewScheduledStatus = this.statusList.find(status => 
      status.csm_code === 'Interview Scheduled');
    
    if (!interviewScheduledStatus) {
      console.error('Interview Scheduled status not found');
      return;
    }
  
    // Prepare payload for status update
    const payload = {
      cdm_id: candidateId,
      csm_id: interviewScheduledStatus.csm_id,
      cdm_comment: 'Status updated automatically after scheduling interview',
      cdm_updateby_id: this.cdm_updateby_id
    };
  
    // Update the status
    this.httpService.updateCandidateStatus(payload).subscribe({
      next: (response) => {
        this.snackBar.open("✅ Candidate status updated to INTERVIEW_SCHEDULED!", "Close", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Refresh the candidate list
        this.loadData(this.dem_id);
      },
      error: (error) => {
        this.snackBar.open(`Failed to update status: ${error.message}`, "❌", {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
