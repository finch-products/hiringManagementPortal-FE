import { Component, Input,Output, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  @Input() pdfUrl!: string ;
  @Output() close = new EventEmitter<void>(); // Emit event to parent
  isFullscreen = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pdfUrl'] && changes['pdfUrl'].currentValue) {
      console.log("PDF URL from Preview Component:", this.pdfUrl);
    }
  }

  PreviewClose() {
    this.isFullscreen = false;
    console.log("Close button clicked - Emitting event to parent"); 
    this.close.emit(); // Notify parent
  }

  toggleFullscreen() {
  this.isFullscreen = !this.isFullscreen;
}

}
