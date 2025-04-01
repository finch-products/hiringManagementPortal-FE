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
  candidates: any[] = [];
  selectedCandidate: any = null;
  selectedCandidateId: string | null = null;
  candidateIds : any[]=[]
  associatedDemands: any
  displayedColumns: string[] = ['date', 'status','comment'];
  // candidates = [
  //   {
  //     id: "dem_03032025_1", // Changed to match candidateIds
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     phone: "+1234567890",
  //     location_name: "Bangalore",
  //     description: "Experienced Frontend Developer",
  //     skills: ["Angular", "TypeScript", "HTML", "CSS"],
  //     keywords: ["frontend", "developer", "Angular"],
  //     cdl_joiningdate: "2024-05-10",
  //     demands: [
  //       {
  //         dem_id: "dem_03032025_1", // Matches candidate ID
  //         position: "Frontend Developer",
  //         skillset: "Angular, TypeScript",
  //         valid_till: "2025-06-30"
  //       }
  //     ],
  //     status: [
  //       { date: "2025-03-01", value: "Application Submitted", comment: "Resume received" },
  //       { date: "2025-03-05", value: "Interview Scheduled", comment: "Interview on March 7 at 10 AM" },
  //       { date: "2025-03-10", value: "Interview Completed", comment: "Candidate performed well" },
  //       { date: "2025-03-12", value: "Offer Extended", comment: "Offer sent, awaiting response" }
  //     ]
  //   },
  //   {
  //     id: "dem_04032025_1",
  //     name: 'Jane Smith',
  //     email: 'jane.smith@example.com',
  //     phone: '+9876543210',
  //     location_name: 'Hyderabad',
  //     description: 'Full Stack Developer with 5+ years of experience',
  //     skills: ['Node.js', 'Angular', 'MongoDB', 'Express'],
  //     keywords: ['fullstack', 'developer', 'Angular'],
  //     cdl_joiningdate: '2024-04-15',
  //     demands: [
  //       {
  //         dem_id: 'DEM125',
  //         position: 'Full Stack Developer',
  //         skillset: 'Node.js, Angular',
  //         valid_till: '2025-08-01',
  //       },
  //     ],
  //     status: [
  //       { date: '2025-02-20', value: 'Application Submitted',comment: 'Resume received'},
  //       { date: '2025-02-25', value: 'Technical Interview' , comment: 'Interview on March 7 at 10 AM' },
  //       { date: '2025-03-01', value: 'HR Discussion', comment: 'Candidate performed well' },
  //       { date: '2025-03-07', value: 'Offer Released' , comment: 'Offer sent, awaiting response'},
  //     ],
  //   }
  // ];
  
  data: any;
  demands:any[] = [];
  demandStatus: any;
  candidateStatus:any;
 
  

  constructor(private http: HttpClient, private httpService: HttpService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.type = data['type']; 
      console.log("type",this.type)
      this.loadData();
    });

    this.route.paramMap.subscribe(params => {
      const demandId = params.get('demandId');
      const candidateId = params.get('candidateId');
  
      if (demandId) {
        this.selectedDemand = null; // Reset previous data
        this.candidates = [];
        this.selectedDemandId = null;
        this.fetchCandidateByDemandId(demandId); // Fetch new data
      }
  
      if (candidateId) {
        this.selectedCandidate = null;
        this.demands = [];
        this.selectedCandidateId = null;
        this.fetchDemandByCandidateId(candidateId);
      }
    });
  }

  loadData(){
    if (this.type === 'demand') {
      this.fetchDemandIds();
    } else {
       this.fetchCandidateIds();
    }
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

  selectDemand(demandId: string) {
    this.selectedDemand = null; // Reset selected demand
    this.candidates = [];       // Clear candidates list
    this.fetchCandidateByDemandId(demandId);
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

  filteredDemands() {
    return this.demandIds?.filter((demand: { dem_id: string }) =>
        demand.dem_id.toLowerCase().includes(this.searchText?.toLowerCase() || '')
    ) || [];
  }


fetchCandidateIds() {
  this.httpService.getCandidateIds().subscribe({
    next: (data: any) => {
      console.log("candidateIDs", data);
      this.candidateIds = data;

      // Check if a candidateId exists in the URL
      const candidateIdFromUrl = this.route.snapshot.paramMap.get('candidateId');

      if (this.candidateIds.length > 0) {
        if (candidateIdFromUrl) {
          // Select the candidate from the URL if present
          this.selectCandidate(candidateIdFromUrl);
        } else {
          // Otherwise, select the first one
          this.selectCandidate(this.candidateIds[0].cdm_id);
        }
      }
    },
    error: (err: any) => console.error('Error fetching candidate IDs', err)
  });
}

  selectCandidate(candidateId: string) {
    this.selectedCandidate = null;
    this.demands = [];     
    this.fetchDemandByCandidateId(candidateId);
  }

  fetchDemandByCandidateId(candidateId?: string) {
    if (!candidateId) {
      console.error('Candidate ID is required');
      return;
    }
    
    console.log("candidate Id", candidateId);
    this.httpService.DemandByCadidateId(candidateId).subscribe({
      next: (data) => {
        if (data) {
          this.selectedCandidate = data;
          this.demands = data.demands || [];
          this.demandStatus = this.demands.flatMap(demand => demand.demand_status_history || []);
          this.candidateStatus = this.demands.flatMap(demand => demand.candidate_status_history || []);
          this.selectedCandidateId = candidateId; // Ensure the selected candidate is highlighted
        }
      },
      error: (err: any) => console.error('Error fetching demand and candidate details', err)
    });
  }  
  

  filteredCandidates() {
    return this.candidateIds?.filter((candidate:{ cdm_id: string }) =>
      candidate.cdm_id.toLowerCase().includes(this.searchText?.toLowerCase() || '')
    ) || [];
  }
}