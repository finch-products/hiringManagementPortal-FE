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


  pieChartData = [
    { name: 'Open Positions', value: 60 },
    { name: 'Profiles Submitted', value: 20 },
    { name: 'Interview Scheduled', value: 16 },
    { name: 'Profiles Not Submitted', value: 4 }
  ];

  customColors = [
    { name: 'Open Positions', value: '#F7CB15' },
    { name: 'Profiles Submitted', value: '#EC3737' },
    { name: 'Interview Scheduled', value: '#15CAF7' },
    { name: 'Profiles Not Submitted', value: '#6E3A95' }
  ];

  barChartData = [
    { name: 'LOB 1', value: 40 },
    { name: 'LOB 2', value: 20 },
    { name: 'LOB 3', value: 60 },
    { name: 'LOB 4', value: 35 }
  ];

  progressData = [
    { name: 'LOB 1', value: 40 },
    { name: 'LOB 2', value: 20 },
    { name: 'LOB 3', value: 60 },
    { name: 'LOB 4', value: 35 }
  ];

}
