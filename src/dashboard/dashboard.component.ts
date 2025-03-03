import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { HttpService } from '../app/services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  legendPosition: LegendPosition = LegendPosition.Right;
  total_open_demands: any[] = [];
  total_non_open_demands: any[] = [];
  total_india_open_demands: any[] = [];;
  total_non_india_open_demands: any[] = [];


  
  ngOnInit() {
    this.loadOpemnDemands();
    this.loadDemandfullfilment();
    this.loadReportLOBTargetProgress();
    this.loadOpenposition();
    this.loadReportagedemand()
  }

  constructor(private httpService: HttpService) {

  }

  loadOpemnDemands() {

    this.httpService.getOpenDemandCount().subscribe({
      next: (data) => {
        this.total_open_demands = data.total_open_demands;
        this.total_non_open_demands = data.total_non_open_demands;
        this.total_india_open_demands = data.total_india_open_demands;
        this.total_non_india_open_demands = data.total_non_india_open_demands;
      },
      error: (err) => console.error('Error fetching clients', err)
    });
  }
    open_positions: any[] = [];
    profiles_submitted: any[] = [];
    interview_scheduled: any[] = [];;
    profiles_not_submitted: any[] = [];
    pieChartData: any[] = [];
  
    loadDemandfullfilment() {
      this.httpService.getDemandFulfillmentMetricsReport().subscribe({
        next: (data) => {
          this.open_positions = data.open_positions;
          this.profiles_submitted = data.profiles_submitted;
          this.interview_scheduled = data.interview_scheduled;
          this.profiles_not_submitted = data.profiles_not_submitted;
    
          // Convert API response to Pie Chart format
          this.pieChartData = [
            { name: 'Open Positions', value: parseFloat(data.open_positions) },
            { name: 'Profiles Submitted', value: parseFloat(data.profiles_submitted) },
            { name: 'Interview Scheduled', value: parseFloat(data.interview_scheduled) },
            { name: 'Profiles Not Submitted', value: parseFloat(data.profiles_not_submitted) }
          ];
        },
        error: (err) => console.error('Error fetching demand', err)
      });
    }

    progressData: any[] = [];

loadReportLOBTargetProgress() {
  this.httpService.getReportLOBTargetProgress().subscribe({
    next: (data) => {
      this.progressData = data.map((item: any) => ({
        name: String(item.LOB_name), 
        value: parseFloat(item.percentage) 
      }));
    },
    error: (err) => console.error('Error fetching demand', err)
  });
}

total_positions_opened_last_week: any[] = [];
loadOpenposition() {
  this.httpService.getopenposition().subscribe({
    next: (data) => {
      this.total_positions_opened_last_week = data.total_positions_opened_last_week;
    },
    error: (err) => console.error('Error fetching clients', err)
  });
}

agedata: any[] = [];
colorScheme = {
  domain: ['#007bff', '#17a2b8', '#28a745', '#ffc107', '#dc3545']
};

loadReportagedemand() {
  this.httpService.getReportagedemand().subscribe({
    next: (data) => {
      this.agedata = data.map((item: any) => ({
        name: String(item.age),  // Updated for better axis labeling
        value: parseInt(item.count)
      }));
    },
    error: (err) => console.error('Error fetching age data', err)
  });
}

  customColors = [
    { name: 'Open Positions', value: '#F7CB15' },
    { name: 'Profiles Submitted', value: '#EC3737' },
    { name: 'Interview Scheduled', value: '#15CAF7' },
    { name: 'Profiles Not Submitted', value: '#6E3A95' }
  ];
  /*barChartData = [
    { name: 'LOB 1', value: 40 },
    { name: 'LOB 2', value: 20 },
    { name: 'LOB 3', value: 60 },
    { name: 'LOB 4', value: 35 }
  ];*/

}