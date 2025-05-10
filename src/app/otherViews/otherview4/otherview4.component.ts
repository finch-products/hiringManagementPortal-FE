import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-otherview4',
  templateUrl: './otherview4.component.html',
  styleUrls: ['./otherview4.component.scss']
})
export class Otherview4Component implements OnInit {

  clientselection: any[] = [];
  view: [number, number] = [500, 300];
  demand_timetaken:any[]=[];
  interviewFeedbackData:any[]=[];

  colorScheme: string = 'cool'; 
  customColors = (name: string): string => {
    const colorMap: {[key: string]: string} = {
      'default': '#d2f55b', 
      'alternative': '#cbd2f7' 
    };
    return colorMap[name] || this.getRandomColorFromScheme();
  };

   legendItems: { name: string; value: string }[] = [];

  colorMap: { [key: string]: string } = {}; // To store dynamically generated colors

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadClientSelectionData();
    this.loadprofileSubmissionData();
    this.loadinterviewFeedbackData();
  }

  private getRandomColorFromScheme(): string {
    // Fallback colors if no specific mapping exists
    const fallbackColors = ['#d2f55b', '#cbd2f7', '#f8fce5', '#f3f3ff'];
    return fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
  }

  loadClientSelectionData() {
    this.httpService.getreportclientselection().subscribe(
      (data: any[]) => {
        this.clientselection = data.map(client => ({
          name: client.client_name,
          value: parseFloat(client.selection_percentage)
        }));
      },
      error => {
        console.error('Error fetching client selection data:', error);
      }
    );
  }

  loadprofileSubmissionData() {
    this.httpService.getreportoftimeforprofilesubmit().subscribe(
      (data: any[]) => {
        this.demand_timetaken = data.map(demand => ({
          name: demand.demand_id,
          value: parseFloat(demand.time_taken)
        }));
      },
      error => {
        console.error('Error fetching profile submission data:', error);
      }
    );
  }

  loadinterviewFeedbackData() {
    this.httpService.getreportoftimetakenfortillfeedback().subscribe(
      (data: any[]) => {
        this.interviewFeedbackData = data.map(data => ({
          name: data.client_name,
          value: parseFloat(data.time_taken)
        }));
      },
      error => {
        console.error('Error fetching interview feedback data:', error);
      }
    );
  }

 

}
