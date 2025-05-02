import { Component ,Input,Output,EventEmitter,OnChanges, SimpleChanges} from '@angular/core';
import { HttpService } from '../../../app/services/http.service';
import {  Router } from '@angular/router';
interface Candidate {
  cdm_name: string;
  cdm_id: string;
  cdm_email:string;
  cdl_cdm_id: string;
  cdm_keywords: string[];
  cdm_description:string;
  location_name:number|null;
  cdm_profile: string;
  avatar?: string;
  candidate_status: {
    csm_id: number | null;
    csm_code: string;
  }
}


@Component({
  selector: 'app-advance-search-candidates',
  templateUrl: './advance-search-candidates.component.html',
  styleUrl: './advance-search-candidates.component.scss'
})

export class AdvanceSearchCandidatesComponent implements OnChanges {

  @Input() dem_id: string='';
  @Output() candidates = new EventEmitter<Candidate>();
  @Output() close = new EventEmitter<void>();
  @Output() pdfSelected = new EventEmitter<string>();

  searchData = {
    emp_id: '',
    name: '',
    email: '',
    location: '',
    keywords: ''
  };
  filterserach=false;
  allcandidates: Candidate[] = [];
  filteredcandidates:any[]=[];
  selectedCandidates:any[]=[];

  constructor(private httpService: HttpService,private router:Router) { }
  
  ngOnInit(): void {
    console.log("got demand id :",this.dem_id)
    this.filterCandidates();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dem_id'] && this.dem_id) {
      console.log("got demand id in ngOnChanges:", this.dem_id);
      this.filterCandidates();
    }
  }
  filterCandidates(): void {
    if (!this.dem_id) {
      console.log("No demand ID provided.");
      return;
    }

    const requestBody = { dem_id: this.dem_id };

    this.httpService.getNotAddedCandidatesBySearch(requestBody).subscribe({
      next: (data) => {
        console.log("API Response:", data);
        this.allcandidates = (data?.candidates_not_added || []).map((candidate: any) => ({
          ...candidate,
          cdm_keywords: this.normalizeKeywords(candidate) // Normalize the keywords
        }));
        
        this.filteredcandidates = [...this.allcandidates]; 
        console.log("not added Candidates:", this.allcandidates);
      },
      error: (err) => {
        console.error("Error fetching candidates:", err);
        this.allcandidates = [];
      }
    });
  }

  search(): void {
    this.filterserach = true;
    // Remove empty values before sending to API
    const filteredData = Object.fromEntries(
      Object.entries(this.searchData).filter(([_, value]) => value.trim() !== '')
    );

    if (Object.keys(filteredData).length === 0) {
      console.log('No valid search parameters provided.');
      return;
    }

    console.log('Searching with:', filteredData);
    
    this.httpService.SearchCandidates(filteredData).subscribe({
      next: (response: { candidates: any[] }) => {
        if (!response.candidates || response.candidates.length === 0) {
          console.log('No candidates found.');
          this.filteredcandidates = [];
          return;
        }
  
        this.filteredcandidates = response.candidates.map((candidate: any) => ({
          cdl_emp_id: candidate.emp_id,
          cdm_name: candidate.name,
          cdm_email: candidate.email,
          cdm_keywords: candidate.keywords ? candidate.keywords.split(',') : [],
          cdm_description: candidate.profile || 'N/A',
          location_name: candidate.location || 'N/A',
        }));
      },
      error: (error: any) => {
        console.error('API Error:', error);
        this.filteredcandidates = [];
      }
    });
  }

  resetserachfilter(){
    this.filterserach=false;
    this.searchData = {
      emp_id: '',
      name: '',
      email: '',
      location: '',
      keywords: ''
    };
    this.filteredcandidates = [...this.allcandidates]; 
  }

  toggleSelection(candidate: Candidate) {
    const index = this.selectedCandidates.indexOf(candidate);
    if (index > -1) {
      this.selectedCandidates.splice(index, 1);
    } else {
      console.log('pushing candidates from child component:', candidate)
      this.candidates.emit(candidate);
    }
  }

  openPdf(pdfUrl: string) {

    this.pdfSelected.emit(pdfUrl); // Emit the clicked PDF file name
    console.log("PDF selected in CandidateComponent:", pdfUrl);
  }

  redirectTocandidateHistory(candidateId:string){
    this.router.navigate(['candidate-history',candidateId]);
  }

  normalizeKeywords(candidate: any): string[] {
    if (Array.isArray(candidate.cdm_keywords)) {
      return candidate.cdm_keywords;
    } else if (typeof candidate.cdm_keywords === 'string') {
      // Splitting and trimming the keywords
      return candidate.cdm_keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k);
    } else {
      return [];
    }
  }  
  closesearch(){
    this.close.emit();
  }
  
}
