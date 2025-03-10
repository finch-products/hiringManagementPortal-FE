import { Component, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandComponent } from './demand/demand.component';
@Component({
  selector: 'app-demand-view',
  templateUrl: './demand-view.component.html',
  styleUrl: './demand-view.component.scss'
})
export class DemandViewComponent {
  @ViewChild(DemandComponent) demandComponent!: DemandComponent;
  selectedPdfUrl!: string 
  constructor(private route:ActivatedRoute){
  
    }

  handlePdfSelection(pdfUrl: string) {
    this.selectedPdfUrl = pdfUrl;

}
onCandidatesLinked(): void {
  const demandId = this.route.snapshot.paramMap.get('id');
  this.demandComponent.loadData(demandId);
}
}
