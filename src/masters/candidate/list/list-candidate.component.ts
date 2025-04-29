import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from '../../../app/services/http.service';
import { Candidate } from '../../../interfaces/candidate.interface';
import { CandidateService } from '../../../app/services/candidate.service';
@Component({
  selector: 'app-list-candidate',
  templateUrl: './list-candidate.component.html',
  styleUrl: './list-candidate.component.scss'
})
export class ListCandidateComponent {

  candidates: any[] = [];
  dataSource2: any[] = [];
  displayedColumns: string[] = ['cdm_emp_id', 'cdm_name', 'cdm_email', 'cdm_phone', 'cdm_location', 'cdm_profile', 'cdm_keywords'];
  searchData = {
    emp_id: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    keywords: ''
  };
  filterserach=false;
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  pages: number[] = [];
  totalPages = 0;

  dataSource = new MatTableDataSource<Candidate>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private httpService: HttpService,private CandidateService: CandidateService) { }

  ngOnInit() {
    this.fetchCandidates();
    this.CandidateService.candidates$.subscribe(candidates => {
      //this.dataSource.data = candidates;
      this.dataSource.data = this.getPagedData(candidates); 
      this.totalItems=candidates.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.updatePages();
  }

  fetchCandidates(): void {
    this.httpService.getCandidate().subscribe({
      next: (data) => {
        this.CandidateService.setInitialData(data);
        // Calculate total items dynamically from backend data
        this.totalItems = data.length;
        this.dataSource.data = this.getPagedData(data);
        this.updatePages();
      },
      error: (err) => console.error('Error fetching Candidates', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
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
        this.dataSource2 = response.candidates.map((candidate: any) => ({
          cdm_emp_id: candidate.emp_id,  
          cdm_name: candidate.name,
          cdm_email: candidate.email,
          cdm_phone: candidate.phone,
          cdm_location: candidate.location,
          cdm_profile: candidate.profile || 'N/A', 
          cdm_keywords: candidate.keywords
        }));
      },
      error: (error: any) => {
        console.error('API Error:', error);
      }
    });
  }

  resetserachfilter(){
    this.filterserach=false;
    this.searchData = {
      emp_id: '',
      name: '',
      email: '',
      phone: '',
      location: '',
      keywords: ''
    };
  }
  extractFilename(url: string): string {
    if (!url) return 'N/A';
    return url.substring(url.lastIndexOf('/') + 1);
  }

  getPagedData(data: Candidate[]): Candidate[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }
  
  updatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];

    // Add first three pages
    for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
      this.pages.push(i);
    }

    // Add ellipsis if necessary
    if (this.totalPages > 3) {
      this.pages.push(-1);  // -1 represents the ellipsis
    }

    // Always add the last page
    if (this.totalPages > 3) {
      this.pages.push(this.totalPages);
    }
  }
  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePages();
    this.CandidateService.candidates$.subscribe(candidates => {
      this.dataSource.data = this.getPagedData(candidates);
    });
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.CandidateService.candidates$.subscribe(candidates => {
        this.dataSource.data = this.getPagedData(candidates);
      });
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.CandidateService.candidates$.subscribe(candidates => {
        this.dataSource.data = this.getPagedData(candidates);
      });
    }
  }
  
  goToPage(page: number) {
    if (page === -1) {
      return;
    }
    this.currentPage = page;
    this.CandidateService.candidates$.subscribe(candidates => {
      this.dataSource.data = this.getPagedData(candidates);
    });
  }  

}