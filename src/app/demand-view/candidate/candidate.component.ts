import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemandComponent } from '../demand/demand.component';
import { catchError } from 'rxjs/operators'; 
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
  showPopup: boolean = false;
  selectedCandidate: any = null; 
  selectedStatus: string = ''; 
  cdm_comment: string = ''; 
  csm_code: string = ''; 

  // Define cdm_updateby_id as a constant
  readonly cdm_updateby_id = 'emp_10022025_01';
  constructor(private httpService: HttpService,private cdr: ChangeDetectorRef, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      if (demandId) {
        this.dem_id = demandId; // ✅ Ensure demand ID is stored
        this.loadData(demandId);
      }
    });

    this.httpService.getCandidateStatuses().subscribe(
      (response) => {
        this.statusList = response;
        console.log('Global Status List:', this.statusList); // Debugging
      },
      (error) => {
        console.error('Error fetching global candidate statuses:', error);
      }
    );
    console.log("Demand ID on Init:", this.dem_id);
  }

  onSubmit() {
    this.onStatusFormSubmit(); // Call the existing method
  }

  onCancel() {
    this.onPopupClose(); // Call the existing method
  }

  onStatusChange(candidate: any, event: any) {
    console.log('Candidate:', candidate); // Debugging
    console.log('Status changed:', event.target.value); // Debugging
    const newStatus = event.target.value;
  
    // Ensure candidate.candidate_status is defined
    if (!candidate.candidate_status) {
      console.error('Candidate status is undefined');
      return;
    }
  
    console.log('Current Status:', candidate.candidate_status.csm_code); // Debugging
    console.log('New Status:', newStatus); // Debugging
  
    if (newStatus !== candidate.candidate_status.csm_code) {
      this.selectedCandidate = candidate;
      this.selectedStatus = newStatus;
      this.csm_code = newStatus;
      this.showPopup = true; // Show the pop-up
      console.log('showPopup:', this.showPopup);
    }
  }

  onPopupClose() {
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
      cdm_updateby_id: this.cdm_updateby_id // Use the constant here
    };
    this.onCancel();
    this.httpService.updateCandidateStatus(payload).subscribe({
      next: (response) => {
        this.snackBar.open("✅ Candidate status updated successfully!", "Close", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.onPopupClose();
        this.loadData(this.dem_id); // Reload data to reflect changes
      },
      error: (error) => {
        // Display the error message returned by the API
        this.snackBar.open(` ${error.message}`, "❌", {
          duration: 5000, // Increase duration for better readability
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
  
        // Load dropdown values for each candidate
        this.candidates.forEach(candidate => {
          this.loadCandidateStatusesById(candidate.cdl_cdm_id).subscribe(
            (statuses) => {
              // If statuses are returned, use them; otherwise, use the global statusList
              candidate.statusList = statuses && statuses.length > 0 ? statuses : this.statusList;
              candidate.selectedStatus = candidate.candidate_status.csm_code;
            },
            (error) => {
              console.error('Error fetching candidate statuses:', error);
              // Fallback to global statusList if there's an error
              candidate.statusList = this.statusList;
            }
          );
        });
      }
    });
  }
  
  loadCandidateStatusesById(cdm_id: string): Observable<any> {
    return this.httpService.getCandidateStatusesbyid(cdm_id).pipe(
      catchError((error) => {
        console.error(`Error fetching statuses for candidate ${cdm_id}:`, error);
        // Fallback to get all statuses if the specific request fails
        return this.httpService.getCandidateStatuses();
      })
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
      console.log('pushing candidate:',candidate)
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

    /*const payload = this.selectedCandidates
      //.filter(candidate => candidate.candidate_status.csm_id !== null) // Skip if status is null
      .map(candidate => ({
        cdl_cdm_id: candidate.cdl_cdm_id,
        cdl_dem_id: this.dem_id
        //cdl_csm_id: candidate.candidate_status.csm_id
      }));*/
      const payload = this.selectedCandidates.map(candidate => ({
        cdl_cdm_id: candidate.cdl_cdm_id,
        cdl_dem_id: this.dem_id
      }));
      

      console.log('payload for linking :',payload);
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