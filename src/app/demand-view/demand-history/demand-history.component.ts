import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-demand-history2',
  templateUrl: './demand-history.component.html',
  styleUrls: ['./demand-history.component.scss']
})
export class DemandHistoryComponent2 {
  @Input() demandid!: string;
  @Output() close = new EventEmitter<boolean>();
  demandHistoryData: any[] = [];
  
  constructor(private httpService: HttpService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.demandhistory();
  }

  closeHistory() {
    this.close.emit();
  }

  demandhistory() {
    this.httpService.demandHistory(this.demandid).subscribe({
      next: (response: any[]) => {
        this.demandHistoryData = response
          .filter(item => {
            const message = item.Message || item.message;
            return ![
              'Update Date', 
              'Update By', 
              'Insert Date', 
              'Inserted By'
            ].some(term => message.includes(term));
          })
          .map(item => ({
            message: item.Message || item.message,
            date: new Date(item.Date || item.date),
            history: {
              updateby_emp_id: item['Updated by'] || item['updated by'] || 'Not available'
            }
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending

        console.log('Processed history data:', this.demandHistoryData);
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