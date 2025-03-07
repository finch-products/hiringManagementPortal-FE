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

  colorScheme = {
    domain: ['#FFC0CB', '#cfc9fe', '#FFA07A', '#87CEFA', '#32CD32'] // Custom color scheme
  };

  constructor(private httpService: HttpService) {}

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
      },
      error => {
        console.error('Error fetching demand-time-taken-for-profile-submission data:', error);
      }
    );
  }

  colorSchemeProfile = [
    { name: 'default', value: '#FF5733' } // All bars will be this color
  ];
  
  colorSchemeInterview = [
    { name: 'default', value: '#6A0DAD' } // All bars will be this color
  ];

}
