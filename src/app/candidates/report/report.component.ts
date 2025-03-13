import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-report',
  standalone: true,
  imports: [],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class CandidadteReportComponent {
  displayedColumns: string[] = ['profile', 'name', 'score', 'status'];

  candidates = [
    { image: 'assets/profile1.jpg', name: 'Anthony Dias', source: 'Jobsite', score: 50, status: 'New' },
    { image: 'assets/profile2.jpg', name: 'Carlos Dunn', source: 'Facebook', score: 50, status: 'New' },
    { image: 'assets/profile3.jpg', name: 'Daniel Klein', source: 'Jobsite', score: 40, status: 'In Review' },
    { image: 'assets/profile4.jpg', name: 'Hera Nutman', source: 'Jobsite', score: 40, status: 'In Review' },
    { image: 'assets/profile5.jpg', name: 'John Smith', source: 'LinkedIn', score: 40, status: 'Interview' },
    { image: 'assets/profile6.jpg', name: 'Johnson Patricio', source: 'Jobsite', score: 30, status: 'Hired' },
    { image: 'assets/profile7.jpg', name: 'Michael Lobo', source: 'Jobsite', score: 30, status: 'Hired' },
    { image: 'assets/profile8.jpg', name: 'Stacy Demello', source: 'Facebook', score: 30, status: 'Offered' },
  ];
}
