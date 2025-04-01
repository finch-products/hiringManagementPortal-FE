import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
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
  stat: any;
  candidates: any;
  statusList: any[] = [];
  showPopup: boolean = false;
  selectedStatus: string = '';
  originalStatus: string | null = null;
  dem_comment: string = '';
  readonly dem_updateby_id = 'emp_22032025_1';
  constructor(private route: ActivatedRoute, private httpService: HttpService, private snackBar: MatSnackBar,private router: Router) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id') ?? '';
      this.loadData(demandId);
      this.loadStatus(demandId); 
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

public  loadData(demandId: any) {
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
  openPdf(pdfUrl: string) {
    this.pdfSelected.emit(pdfUrl); // Emit the clicked PDF file name
    console.log("PDF selected in DemandComponent:", pdfUrl);
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

    const payload = {
      dem_id: this.demands.cdl_dem_id,
      dem_dsm_id: dsm_id,
      dem_comment: this.dem_comment,
      dem_updateby_id: this.dem_updateby_id
    };
    this.onCancel();
    this.httpService.updateDemand(payload).subscribe({
      next: (response) => {
        this.snackBar.open("✅ Demand status updated successfully!", "Close", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.onCancel();
        this.loadData(this.demands.cdl_dem_id); // Reload data to reflect changes
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

  redirectTodemand_history(){
    this.router.navigate(['history']);
  }
}