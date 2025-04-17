import { Component, ViewChild,Output,EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandComponent } from './demand/demand.component';
import { CandidateComponent } from './candidate/candidate.component';
import { HttpService } from '../services/http.service';
import { forkJoin } from 'rxjs'; 

interface Candidate {
  cdm_name: string;
  cdm_id: string;
  cdm_email:string;
  cdl_cdm_id: string;
  cdm_keywords: string[];
  cdm_description:string;
  location_name:number|null;
  cdm_profile: string;
  avatar?: string;
  candidate_status: {
    csm_id: number | null;
    csm_code: string;
  }
}
@Component({
  selector: 'app-demand-view',
  templateUrl: './demand-view.component.html',
  styleUrl: './demand-view.component.scss'
})
export class DemandViewComponent implements OnInit, OnDestroy{
  @ViewChild(DemandComponent) demandComponent!: DemandComponent;
  @ViewChild(CandidateComponent) candidateComponent!: CandidateComponent;
  selectedPdfUrl!: string ;
  demandId: string = '';
  isPreviewOpen: boolean = false;
  showHistory = false;
  showAdvanceSearch=false;
  selectedCandidates!:Candidate;
  dem_id:string='';
  showTimerHeader = true;
  days: number | null = null;
  hours: number | null = null;
  minutes: number | null = null;
  seconds: number | null = null;
  private timerInterval: any;
  demandOpenDate: Date | null = null;
  demandStatus: string = '';
  isDemandClosed: boolean = false;
  demandClosedText: string = '';
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private httpService: HttpService) {
    // Get the demand ID in the constructor and store it as a public property
    const id = this.route.snapshot.paramMap.get('id');
    this.demandId = id ? id : ''; // Handle null case
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.demandId = params.get('id') ?? '';
      // Show loading immediately
      this.isLoading = true;
      this.loadDemandDetails();
    });
  }

  loadDemandDetails() {
    this.isLoading = true;
    const payload = { dem_id: this.demandId };
    
    forkJoin([
      this.httpService.postCandidateByDemandId(payload),
      this.httpService.demandHistory(this.demandId)
    ]).subscribe({
      next: ([demandData, historyData]: [any, any[]]) => {
        if (demandData?.demand_details) {
          this.demandStatus = demandData.demand_details.status_details?.dsm_code || '';
          this.isDemandClosed = this.demandStatus.includes('Closed');
          
          if (this.isDemandClosed) {
            this.demandClosedText = 'Demand closed!';
            this.showTimerHeader = true;
            this.clearTimer();
          } else {
            const openingEntry = this.findMostRecentOpening(historyData);
            this.demandOpenDate = openingEntry ? new Date(openingEntry.date) : 
                              new Date(demandData.demand_details.dem_insertdate);
            this.startTimer();
            this.showTimerHeader = true;
          }
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading demand details:', err);
        this.isLoading = false;
      }
    });
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    // Reset to null instead of 0
    this.days = null;
    this.hours = null;
    this.minutes = null;
    this.seconds = null;
  }
  

  // Helper method to find the most recent "Open" status change
  private findMostRecentOpening(historyData: any[]): any | null {
    if (!historyData) return null;
    
    // Filter entries that contain status changes to "Open"
    const openingEntries = historyData.filter(entry => 
      entry.message && entry.message.includes('Status') && 
      entry.message.includes('Open') && 
      entry.date
    );
    
    if (openingEntries.length === 0) return null;
    
    // Sort by date descending and return the most recent one
    openingEntries.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return openingEntries[0];
  }

  startTimer() {
    if (!this.demandOpenDate) return;

    this.updateTimer(); // initial update
    
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    if (!this.demandOpenDate) return;

    const now = new Date();
    const diff = now.getTime() - this.demandOpenDate.getTime();
    
    // Only update values when we have actual numbers
    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
  }

  hideTimerHeader() {
    this.showTimerHeader = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  ngOnDestroy() {
    this.clearTimer()
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  handlePdfSelection(pdfUrl: string) {
    console.log("Received PDF URL:", pdfUrl);
    this.selectedPdfUrl = pdfUrl;
    this.isPreviewOpen = !!pdfUrl;

}
onCandidatesLinked(): void {
  const demandId = this.route.snapshot.paramMap.get('id');
  this.demandComponent.loadData(demandId);
}
onPreviewClose() {
  console.log("Close event received from PreviewComponent - Hiding PDF");
  this.selectedPdfUrl = '';
  this.isPreviewOpen = false;
}

onInterviewScheduled(candidateId: string) {
  if (this.candidateComponent) {
    this.candidateComponent.updateCandidateStatusToInterviewScheduled(candidateId);
  }
}

onShowHistory(demandid: string) {
  this.demandId = demandid;
  this.showHistory = true;
  console.log("Demand ID passed to history:", demandid);
}

onHistoryClose() {
  this.showHistory = false;
  this.demandId ='';
}

onshowAdvanceSearch(dem_id:string){
  this.showAdvanceSearch=true;
  this.dem_id=dem_id;
  console.log("demand id in parent component:",this.dem_id)
}
onAdvanceSearchClose(){
  this.showAdvanceSearch=false;
  this.dem_id='';
}
candidatesSelected(candidates:Candidate){
  console.log("Candidates received in parent component",candidates)
  this.selectedCandidates=candidates;
}
}
