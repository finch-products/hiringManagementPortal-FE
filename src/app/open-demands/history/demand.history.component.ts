import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-demand-history',
  templateUrl: './demand.history.component.html',
  styleUrl: './demand.history.component.scss'
})
export class DemandHistoryComponent implements OnInit {
  type!: string;
  demandIds: any[] = [];
  selectedDemand: any = null;
  selectedDemandId: string | null = null; // To track highlighted demand
  searchText: string = '';
  // candidates: any[] = [];
  selectedCandidate: any = null;
  selectedCandidateId: string | null = null;
  candidateIds : any[]=[]
  associatedDemands: any
  displayedColumns: string[] = ['date', 'status'];
  candidates = [
    {
      id: 'CAND123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      location_name: 'Bangalore',
      description: 'Experienced Frontend Developer',
      skills: ['Angular', 'TypeScript', 'HTML', 'CSS'],
      keywords: ['frontend', 'developer', 'Angular'],
      cdl_joiningdate: '2024-05-10',
      demands: [
        {
          dem_id: 'DEM123',
          position: 'Frontend Developer',
          skillset: 'Angular, TypeScript',
          valid_till: '2025-06-30',
        },
        {
          dem_id: 'DEM124',
          position: 'UI Designer',
          skillset: 'Figma, CSS',
          valid_till: '2025-07-15',
        },
      ],
      status: [
        { date: '2025-03-01', value: 'Application Submitted' },
        { date: '2025-03-05', value: 'Interview Scheduled' },
        { date: '2025-03-10', value: 'Interview Completed' },
        { date: '2025-03-12', value: 'Offer Extended' },
      ],
    },
    {
      id: 'CAND124',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+9876543210',
      location_name: 'Hyderabad',
      description: 'Full Stack Developer with 5+ years of experience',
      skills: ['Node.js', 'Angular', 'MongoDB', 'Express'],
      cdl_joiningdate: '2024-04-15',
      demands: [
        {
          dem_id: 'DEM125',
          position: 'Full Stack Developer',
          skillset: 'Node.js, Angular',
          valid_till: '2025-08-01',
        },
      ],
      status: [
        { date: '2025-02-20', value: 'Application Submitted' },
        { date: '2025-02-25', value: 'Technical Interview' },
        { date: '2025-03-01', value: 'HR Discussion' },
        { date: '2025-03-07', value: 'Offer Released' },
      ],
    }
  ];
  
  

  constructor(private http: HttpClient, private httpService: HttpService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.type = data['type']; 
      console.log("type",this.type)
      this.loadData();
    });
   
  }

  loadData(){
    if (this.type === 'demand') {
      this.fetchDemandIds();
    } else {
       this.fetchCandidateIds();
    }
  }

  fetchCandidateByDemandId(demandId?: string) {
    if (!demandId) {
        console.error('Demand ID is required');
        return;
    }
    const payload = { dem_id: demandId };
    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data: { cdl_dem_id: string; demand_details: any; candidates: any[] }) => {
        if (data) {
          this.selectedDemand = { ...data.demand_details };
          this.candidates = data.candidates || [];
          this.selectedDemandId = demandId; // Highlight the selected demand
        }
      },
      error: (err: any) => console.error('Error fetching demand and candidate details', err)
    });
  }

  fetchDemandIds() {
    this.httpService.getDemandIds().subscribe({
      next: (data: any) => {
        this.demandIds = data;
        if (this.demandIds.length > 0) {
          this.selectDemand(this.demandIds[0].dem_id); // Auto-select first demand
        }
      },
      error: (err: any) => console.error('Error fetching demands', err)
    });
  }

  filteredDemands() {
    return this.demandIds?.filter((demand: { dem_id: string }) =>
        demand.dem_id.toLowerCase().includes(this.searchText?.toLowerCase() || '')
    ) || [];
  }

  selectDemand(demandId: string) {
    this.selectedDemand = null; // Reset selected demand
    this.candidates = [];       // Clear candidates list
    this.fetchCandidateByDemandId(demandId);
  }

// candidate history
  fetchCandidateIds(){
    this.candidateIds=[
      {
          "c_id": "dem_03032025_1"
      },
      {
          "c_id": "dem_04032025_1"
      },
      {
          "c_id": "dem_04032025_2"
      }]
        
    if (this.candidateIds.length > 0) {
      console.log("selected candidate",this.candidateIds[0])
      this.selectCandidate(this.candidateIds[0].c_id); // Auto-select first candidate
    }
  }

  filteredCandidates() {
    return this.candidates?.filter((candidate) =>
      candidate.name.toLowerCase().includes(this.searchText?.toLowerCase() || '')
    ) || [];
  }

  selectCandidate(candidateId: string) {
    console.log("candidateId", candidateId);

  this.selectedCandidateId = candidateId;

  // Ensure candidates list is populated before searching
  if (!this.candidates || this.candidates.length === 0) {
    console.warn("Candidates list is empty!");
    return;
  }

  // Find the candidate by ID
  this.selectedCandidate = this.candidates.find(candidate => candidate.id === candidateId) || null;

  // Reset associatedDemands if no candidate is found
  this.associatedDemands = this.selectedCandidate ? this.selectedCandidate.demands || [] : [];

  console.log("Selected Candidate1:", this.selectedCandidate);
  }

  

}