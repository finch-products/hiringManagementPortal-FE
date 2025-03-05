import { Component } from '@angular/core';

@Component({
  selector: 'app-demand-view',
  templateUrl: './demand-view.component.html',
  styleUrl: './demand-view.component.scss'
})
export class DemandViewComponent {
  selectedPdfUrl!: string 

  handlePdfSelection(pdfUrl: string) {
    this.selectedPdfUrl = pdfUrl;

}
}
