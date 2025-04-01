import { Component, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandComponent } from './demand/demand.component';
import { CandidateComponent } from './candidate/candidate.component';
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
}
