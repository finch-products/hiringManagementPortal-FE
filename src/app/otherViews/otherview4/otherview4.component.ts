import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // colorScheme = {
  //   domain: ['#FFC0CB', '#cfc9fe', '#FFA07A', '#87CEFA', '#32CD32'] // Custom color scheme
  // };

  colorMap: { [key: string]: string } = {}; // To store dynamically generated colors

  constructor(private httpService: HttpService) {}

  barGraphColor1 = [{ name: 'default', value: '#6A0DAD' }]; // Purple for profile submission
  barGraphColor2 = [{ name: 'default', value: '#FF5733' }];
  ngOnInit() {
    this.loadClientSelectionData();
    this.loadprofileSubmissionData();
    this.loadinterviewFeedbackData();
  }

  loadClientSelectionData() {
    this.httpService.getreportclientselection().subscribe(
      (data: any[]) => {
        this.clientselection = data.map(client => ({
          name: client.client_name,
          value: parseFloat(client.selection_percentage)
        }));
        this.generateColors(this.clientselection);
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
        this.barGraphColor1 = this.demand_timetaken.map(demand => ({
          name: demand.name,
          value: '#FF928A' // Purple for all bars
        }));
        // this.generateColors(this.demand_timetaken);
      },
      error => {
        console.error('Error fetching demand-time-taken-for-profile-submission data:', error);
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
        this.barGraphColor2 = this.interviewFeedbackData.map(client => ({
          name: client.name,
          value: '#8979FF' // Red for all bars
        }));
        // this.generateColors(this.interviewFeedbackData);
      },
      error => {
        console.error('Error fetching demand-time-taken-for-profile-submission data:', error);
      }
    );
  }

  generateColors(data: any[]) {
    const predefinedColors = ['#537FF1', '#FFAE4C', '#3CC3DF', '#FF928A', '#8979FF'];

    data.forEach((item, index) => {
      if (!this.colorMap[item.name]) {
        this.colorMap[item.name] = predefinedColors[index % predefinedColors.length]; // Assign colors cyclically
      }
    });
  }

  customColors = (name: string) => {
    return this.colorMap[name] || '#CCCCCC'; // Default color if not found
  };
  // colorSchemeProfile = [
  //   { name: 'default', value: '#FF5733' } // All bars will be this color
  // ];
  
  // colorSchemeInterview = [
  //   { name: 'default', value: '#6A0DAD' } // All bars will be this color
  // ];

}
