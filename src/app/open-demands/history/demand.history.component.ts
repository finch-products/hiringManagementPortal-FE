import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-demand-history',
  templateUrl: './demand.history.component.html',
  styleUrl: './demand.history.component.scss'
})
export class DemandHistoryComponent implements OnInit {
  demandIds: any[] = [];


  selectedDemand: any = null; // To store selected demand details

  demands = [
    { id: 1, name: "Demand 1" },
    { id: 2, name: "Demand 2" },
    { id: 3, name: "Demand 3" },
    { id: 4, name: "Demand 4" },
  ];

  constructor(private http: HttpClient, private httpService: HttpService) { }

  ngOnInit(): void {
    this.fetchDemandIds();
  }


  fetchDemandIds() {
    this.httpService.getDemandIds().subscribe({
      next: (data) => {
        this.demandIds = data;
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }


  historyDetails = {
    ctoolNumber: "1001",
    skillset: "Adobe Photoshop, Figma",
    positions: 2,
    rrGrade: "Grade 1",
    active: "Yes",
    ctoolDate: "12/2/2025",
    candidate: {
      name: "SWATHI",
      position: "Software Engineer",
      experience: 2,
      skillset: "Java, Python",
      status: "Selected",
      l1Schedule: "Intermediate",
      joiningDate: "22/10/2025",
      profile: "resume.pdf"
    },
    jobDescription: "doctor.pdf"
  };

  selectDemand(demand: any) {
    this.selectedDemand = this.historyDetails; // For now, show mock details
  }
}
