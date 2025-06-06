import { Component, ViewChild,ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Candidate } from 'interfaces/candidate.interface';

@Component({
  selector: 'app-tracking',
  templateUrl: './candidate-tracking.component.html',
  styleUrl: './candidate-tracking.component.scss'
})

export class CandidateTrackingComponent {
  displayedColumns: string[] = ['select', 'name', 'location', 'status', 'schedule'];
  candidates: any[] = [];
  filteredCandidates = new MatTableDataSource<any>([]);
  selectedStatuses: string[] = [];
  candidateStatuses: any[] = [];
  selectedCandidates: Set<string> = new Set();

  pageSizeOptions = [5, 10, 20];
    pageSize = 5;
    currentPage = 1;
    totalItems = 0;
    pages: number[] = [];
    totalPages = 0;
    allCandidates:Candidate[]=[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private httpService: HttpService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCandidateStatuses();
    this.loadCandidates();
  }

  ngAfterViewInit() {
    this.filteredCandidates.paginator = this.paginator;
  }

  loadCandidateStatuses() {
    this.httpService.getCandidateStatuses().subscribe(
      (data: { csm_code: string }[]) => {
        this.candidateStatuses = data.map((status) => status.csm_code).filter(Boolean);
      },
      (error) => {
        console.error('Error fetching candidate statuses:', error);
      }
    );
  }


  loadCandidates() {
    this.httpService.getCandidate().subscribe(
      (data) => {
        this.candidates = data;
        this.filteredCandidates.data = data;
        this.allCandidates=[...data];
        this.totalItems=this.allCandidates.length;
        this.updateDisplayedCandidates();
        this.updatePages();
      },
      (error) => {
        console.error('Error fetching candidates:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.filteredCandidates.filterPredicate = (data: any, filter: string) => {
      const columnsToSearch = ['cdm_name', 'lcm_name', 'candidate_status.csm_code']; // Add more columns if needed
      return columnsToSearch.some(column => {
        const columnValue = this.getNestedValue(data, column)?.toString().toLowerCase();
        return columnValue?.includes(filter);
      });
    };
  
    this.filteredCandidates.filter = filterValue;
  }
  
  getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

 
  getStatusClass(status: string | null | undefined): string {
    if (!status) return 'status-default';
    return `status-${status.replace(/\s+/g, '-').toLowerCase()}`;
  }

  viewCandidateHistory(candidate: any) {
    this.router.navigate(['/candidate-history', candidate.id]);
  }


  scheduleInterview(candidate: any) {
    console.log('Scheduling interview for:', candidate);
  }

  addCandidate() {
    this.router.navigate(['/candidate-master']);
  }

  filterCandidates() {
    if (!this.candidates || this.candidates.length === 0) {
      console.error("No candidates available for filtering! Data might not be loaded yet.");
      return;
    }
  
    console.log("Filtering by:", JSON.stringify(this.selectedStatuses));
    console.log("Before filtering:", this.candidates);
  
    this.filteredCandidates.data = this.candidates.filter(candidate => {
      if (!candidate.candidate_status || !candidate.candidate_status.csm_code) {
        return false;
      }
  
      const candidateStatus = candidate.candidate_status.csm_code.trim().toLowerCase();
      console.log(`Checking candidate: ${candidate.cdm_name}, Status: ${candidateStatus}`);
      
      return this.selectedStatuses.some(status => 
        status.trim().toLowerCase() === candidateStatus
      );
    });
    console.log("After filtering:", this.filteredCandidates.data);
  }
  
  resetFilters() {
    this.selectedStatuses = [];
    this.filteredCandidates.data = this.candidates;
    this.loadCandidates();
  }
// Toggle individual selection
toggleCandidateSelection(event: MatCheckboxChange, cdm_id: string): void {
  if (event.checked) {
    this.selectedCandidates.add(cdm_id);
  } else {
    this.selectedCandidates.delete(cdm_id);
  }
  
  // Mark for check
  this.cdr.markForCheck();
}

isSelected(cdm_id: string): boolean {
  return this.selectedCandidates.has(cdm_id);
}

// Check if all candidates are selected
isAllSelected(): boolean {
  const numSelected = this.selectedCandidates.size;
  const numRows = this.filteredCandidates.data.length;
  return numRows > 0 && numSelected === numRows;
}

// Toggle all selections from header checkbox
toggleAllSelections(event: MatCheckboxChange): void {
  if (event.checked) {
    this.filteredCandidates.data.forEach(row => {
      if (row.cdm_id) {
        this.selectedCandidates.add(row.cdm_id);
      }
    });
  } else {
    this.selectedCandidates.clear();
  }
  
  // Mark for check
  this.cdr.markForCheck();
}

// For handling row clicks
onRowClick(row: any, event: Event): void {
  // Check if click was on a checkbox or its container
  const target = event.target as HTMLElement;
  if (target.closest('mat-checkbox') || target.classList.contains('mat-checkbox')) {
    // Don't navigate if clicked on checkbox
    return;
  }
  
  this.viewCandidateHistory(row);
}

updateDisplayedCandidates() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  const currentCandidates= this.allCandidates.slice(startIndex, endIndex);
  this.filteredCandidates.data = currentCandidates;
}

updatePages() {
  this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  this.pages = [];

  for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
    this.pages.push(i);
  }
  if (this.totalPages > 3) {
    this.pages.push(-1); // ellipsis
    this.pages.push(this.totalPages);
  }
}

onPageSizeChange() {
  this.currentPage = 1;  // Reset to the first page
  this.updatePages();    // Update the pages based on new page size
  this.updateDisplayedCandidates();
  // Fetch new data based on the updated page size and current page
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateDisplayedCandidates();
    // Fetch new data based on the updated page
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updateDisplayedCandidates();
    // Fetch new data based on the updated page
  }
}

goToPage(page: number) {
  if (page === -1) {
    // If page is ellipsis, do nothing
    return;
  }
  this.currentPage = page;
  this.updateDisplayedCandidates();
  // Fetch new data based on the current page and page size
}
}