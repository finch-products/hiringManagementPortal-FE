import { Component } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  legendPosition: LegendPosition = LegendPosition.Right;

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
