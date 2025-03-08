import { Component } from '@angular/core';

@Component({
  selector: 'app-otherview4',
  templateUrl: './otherview4.component.html',
  styleUrls: ['./otherview4.component.scss']
})
export class Otherview4Component {
  // Profile Submission Chart Data (Vertical Bar)
  profileSubmissionData = [
    { name: 'Demand1', value: 4 },
    { name: 'Demand2', value: 10 },
    { name: 'Demand3', value: 3 },
    { name: 'Demand4', value: 2 },
    { name: 'Demand5', value: 5 }
  ];

  // Interview Feedback Chart Data (Vertical Bar)
  interviewFeedbackData = [
    { name: 'Client1', value: 5 },
    { name: 'Client2', value: 10 },
    { name: 'Client3', value: 3 },
    { name: 'Client4', value: 2 },
    { name: 'Client5', value: 5 }
  ];

  // Selection Percentage Chart Data (Doughnut)
  selectionChartData = [
    { name: 'Client1', value: 20 },
    { name: 'Client2', value: 30 },
    { name: 'Client3', value: 40 },
    { name: 'Client4', value: 50 },
    { name: 'Client5', value: 60 }
  ];

//   // Chart Color Scheme
// colorScheme = {
//   domain: ['#FFC0CB'] // Light Pink for bars
// };

// colorScheme2 = {
//   domain: ['#cfc9fe'] // Light Purple for secondary usage (if needed)
// };
customColors = [
  { name: 'Demand1', value: '#FF9999' },
  { name: 'Demand2', value: '#FF9999' },
  { name: 'Demand3', value: '#FF9999' },
  { name: 'Demand4', value: '#FF9999' },
  { name: 'Demand5', value: '#FF9999' }
];

customColors2 = [
  { name: 'Client1', value: '#B399FF' },
  { name: 'Client2', value: '#B399FF' },
  { name: 'Client3', value: '#B399FF' },
  { name: 'Client4', value: '#B399FF' },
  { name: 'Client5', value: '#B399FF' }
];
customColors3=[
  { name: 'Client1', value: '#8979FF'},
    { name: 'Client2', value: '#FF928A' },
    { name: 'Client3', value: '#3CC3DF' },
    { name: 'Client4', value: '#FFAE4C' },
    { name: 'Client5', value: '#537FF1'}
]
  // Chart View Dimensions
  view: [number, number] = [500, 300];
}
