import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  pieChartData = [
    { name: 'Open Positions', value: 60 },
    { name: 'Profiles Submitted', value: 20 },
    { name: 'Interview Scheduled', value: 16 },
    { name: 'Profiles Not Submitted', value: 4 }
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
