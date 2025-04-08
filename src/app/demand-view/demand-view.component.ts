import { Component, ViewChild,Output,EventEmitter  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandComponent } from './demand/demand.component';
import { CandidateComponent } from './candidate/candidate.component';
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
export class DemandViewComponent {
  @ViewChild(DemandComponent) demandComponent!: DemandComponent;
  @ViewChild(CandidateComponent) candidateComponent!: CandidateComponent;
  selectedPdfUrl!: string ;
  demandId: string = '';
  isPreviewOpen: boolean = false;
  showHistory = false;
  showAdvanceSearch=false;
  selectedCandidates!:Candidate;
  dem_id:string='';
  constructor(private route: ActivatedRoute) {
    // Get the demand ID in the constructor and store it as a public property
    const id = this.route.snapshot.paramMap.get('id');
    this.demandId = id ? id : ''; // Handle null case
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
