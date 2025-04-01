import { Component, Input,Output, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  @Input() pdfUrl!: string ;
  @Output() close = new EventEmitter<void>(); // Emit event to parent

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pdfUrl'] && changes['pdfUrl'].currentValue) {
      console.log("PDF URL from Preview Component:", this.pdfUrl);
    }
  }

  PreviewClose() {
    console.log("Close button clicked - Emitting event to parent"); 
    this.close.emit(); // Notify parent
  }
  
}
