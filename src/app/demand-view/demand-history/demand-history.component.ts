import { Component,Input,Output,EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-demand-history2',
  templateUrl: './demand-history.component.html',
  styleUrl: './demand-history.component.scss'
})
export class DemandHistoryComponent2 {
  @Input() demandid!: string;
  @Output() close = new EventEmitter<boolean>();
  demandHistoryData:any=[];
  constructor(private httpService: HttpService, private snackBar: MatSnackBar) {
  
  }
  ngOnInit() {
    console.log('DemandHistory loaded with ID:', this.demandid);
    this.demandhistory();
  }
  closeHistory() {
    this.close.emit(); 
    console.log("notified parent")// Notify parent to close the history panel
  }

  demandhistory(){
    this.httpService.demandHistory(this.demandid).subscribe({
      next: (response: any[]) => {
        this.demandHistoryData = response;
        console.log('History fetched successfully:', response);
      },
      error: (error) => {
        this.snackBar.open('Failed to fetch demand history', 'Close', {
          duration: 3000
        });
        console.error('Error fetching history:', error);
      }
    });
  }
}
