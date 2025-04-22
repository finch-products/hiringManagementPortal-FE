import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Status {
  dsm_code: string;
  dsm_id: string;
}

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrl: './demand.component.scss'
})
export class DemandComponent implements OnInit {
  @Output() pdfSelected = new EventEmitter<string>();
  demandForm = new FormGroup({
    status: new FormControl<string | null>(null)
  });

  demands: any;
  demandId: any;
  stat: any;
  candidates: any;
  statusList: any[] = [];
  showPopup: boolean = false;
  selectedStatus: string = '';
  originalStatus: string | null = null;
  dem_comment: string = '';
  @Output() showHistoryRequested  = new EventEmitter<string>();
  readonly dem_updateby_id = 'emp_1';
  constructor(private route: ActivatedRoute, private httpService: HttpService, private snackBar: MatSnackBar, private router: Router) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.demandId = params.get('id') ?? '';
      this.loadData(this.demandId);
      this.loadStatus(this.demandId);
      this.loadCandidateStatuses();
    });
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

  public loadData(demandId: any) {
    const payload = { dem_id: demandId };

    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        this.demands = data;

        this.candidates = data.candidates ? [...data.candidates].reverse() : [];
        console.log("Updated candidates list:", this.candidates);
        const currentStatus = this.demands?.demand_details?.status_details?.dsm_code;
        this.demandForm.patchValue({ status: currentStatus });
        this.selectedStatus = this.demands?.demand_details?.status_details?.dsm_code || '';
        // Store the original status
        this.originalStatus = currentStatus;
      }
    });

  }


  loadStatus(dem_id: string): void {
    if (!dem_id) {
      console.error('No demand ID provided');
      return;
    }

    this.httpService.getDemandStatusDetails(dem_id).subscribe({
      next: (data) => {
        this.stat = data;
      },
      error: (err) => console.error('Error fetching demand status', err)
    });
  }
  // Add this method to your component
getJobDescriptionUrl(): string | null {
  if (!this.demands?.demand_details?.dem_jd) {
    return null;
  }
  
  try {
    // Remove /api/ from the base URL for file downloads
    const baseUrl = this.httpService.baseUrl.replace('/api', '');
    
    // Handle path construction
    const jdPath = this.demands.demand_details.dem_jd.startsWith('/') 
      ? this.demands.demand_details.dem_jd.substring(1)
      : this.demands.demand_details.dem_jd;
    
    return `${baseUrl}/${jdPath}`;
  } catch (e) {
    console.error('Error constructing JD URL:', e);
    return null;
  }
}

// Update your openPdf method
openPdf(pdfUrl: string, event: Event) {
  event.preventDefault(); // Prevent default anchor behavior
  
  if (!pdfUrl) {
    this.snackBar.open("No job description available", "❌", {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    return;
  }

  try {
    this.pdfSelected.emit(pdfUrl);
    console.log("Job Description selected:", pdfUrl);
  } catch (e) {
    console.error("Error opening job description:", e);
    this.snackBar.open("Unable to open job description", "❌", {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}

getJDFilename(): string {
  if (!this.demands?.demand_details?.dem_jd) return 'Download';
  try {
    return this.demands.demand_details.dem_jd.split('/').pop() || 'job_description.pdf';
  } catch (e) {
    return 'job_description.pdf';
  }
}

  onStatusChange(newStatus: string) {
    if (newStatus !== this.demands?.demand_details?.status_details?.dsm_code) {
      this.selectedStatus = newStatus; // Store the selected status
      this.showPopup = true; // Show the pop-up
    }
  }

  onCancel() {
    this.showPopup = false;
    this.selectedStatus = '';
    this.dem_comment = '';
  }


  onSubmit() {
    if (!this.selectedStatus) {
      this.snackBar.open("Invalid status selected. Please try again.", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dsm_id = this.stat.find((status: Status) => status.dsm_code === this.selectedStatus)?.dsm_id;

    if (!dsm_id) {
      this.snackBar.open("Invalid status selected. Please try again.", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload: { 
      dem_id: any; 
      dem_dsm_id: any; 
      dem_updateby_id: string; 
      dem_comment?: string 
    } = {
      dem_id: this.demands.cdl_dem_id,
      dem_dsm_id: dsm_id,
      dem_updateby_id: this.dem_updateby_id
    };

    if (this.dem_comment) {
      payload.dem_comment = this.dem_comment;
    }
    

    this.onCancel();
    this.httpService.updateDemand(payload).subscribe({
      next: (response) => {
        this.snackBar.open("✅ Demand status updated successfully!", "", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.onCancel();
        this.loadData(this.demands.cdl_dem_id); // Reload data to reflect changes
        this.loadStatus(this.demands.cdl_dem_id);
      },
      error: (error) => {
        this.snackBar.open(`${error.message}`, "❌", {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error("Error updating demand status", error);
        console.log(this.originalStatus)
        this.demandForm.patchValue({ status: this.originalStatus ?? null });
      }
    });
  }

  openStatusPopup() {
    this.selectedStatus = this.demands?.demand_details?.status_details?.dsm_code || '';
    this.showPopup = true;
  }

  show_demand_history(){
    this.showHistoryRequested.emit(this.demandId);
    console.log("passed demand id from parent")
  }

  getFormattedLocations(): string {
    if (!this.demands?.demand_details?.position_locations || 
        this.demands.demand_details.position_locations.length === 0) {
      return 'N/A';
    }
    return this.demands.demand_details.position_locations
      .map((loc: any) => loc.lcm_name)
      .join(', ');
  }

  getClientLogoUrl(): string {
    if (!this.demands?.demand_details?.client_details?.clm_logo) {
      return '../../../assets/img/profile_img.png'; // Fallback if no logo
    }
  
    try {
      // Construct URL safely (handles double slashes automatically)
      const base = this.httpService.baseUrl.endsWith('/') 
        ? this.httpService.baseUrl 
        : this.httpService.baseUrl + '/';
      
      const fullUrl = new URL(this.demands.demand_details.client_details.clm_logo, base).href;
      return fullUrl;
    } catch (e) {
      console.error('Error constructing logo URL:', e);
      return '../../../assets/img/profile_img.png'; // Fallback on error
    }
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../assets/img/profile_img.png';
  }
}