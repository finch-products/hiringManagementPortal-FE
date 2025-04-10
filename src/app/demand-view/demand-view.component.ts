import { Component, ViewChild,Output,EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandComponent } from './demand/demand.component';
import { CandidateComponent } from './candidate/candidate.component';
import { HttpService } from '../services/http.service';

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
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  private timerInterval: any;
  private demandOpenDate: Date | null = null;

  constructor(private route: ActivatedRoute, private httpService: HttpService) {
    // Get the demand ID in the constructor and store it as a public property
    const id = this.route.snapshot.paramMap.get('id');
    this.demandId = id ? id : ''; // Handle null case
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.demandId = params.get('id') ?? '';
      this.loadDemandDetails();
    });
  }

  loadDemandDetails() {
    const payload = { dem_id: this.demandId };
    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        if (data?.demand_details?.dem_insertdate) {
          this.demandOpenDate = new Date(data.demand_details.dem_insertdate);
          this.startTimer();
        }
      }
    });
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
    
    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
  }

  hideTimerHeader() {
    this.showTimerHeader = false;
    clearInterval(this.timerInterval);
  }

  ngOnDestroy() {
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
