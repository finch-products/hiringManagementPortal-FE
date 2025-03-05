import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  @Input() pdfUrl!: string ;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['pdfUrl'] && changes['pdfUrl'].currentValue) {
      console.log("PDF URL from Preview Component:", this.pdfUrl);
    }
  }
}
