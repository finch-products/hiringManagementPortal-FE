import { Component, EventEmitter,OnChanges,SimpleChanges, Output, ChangeDetectorRef,Input, HostListener, ElementRef, Renderer2  } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
interface Candidate {
  cdm_name: string;
  cdm_id: string;
  cdl_cdm_id: string;
  cdm_keywords: string[],
  cdm_profile: string;
  avatar?: string;
  cdm_email: string;
  cdm_description: string;
  candidate_status: {
    csm_id: number | null;
    csm_code: string;
  }
}
@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.scss'
})
export class CandidateComponent implements OnChanges{

  @Output() candidatesLinked = new EventEmitter<void>();
  @Output() pdfSelected = new EventEmitter<string>();
  @Output() ShowAdvancSearch= new EventEmitter<string>();
  @Input() isPreviewOpen = false;
  @Input() showhistory = false;
  @Input() showsearch =false;
  @Input() candidatesSelected!:Candidate;

  candidates: any[] = [];
  filteredCandidates: Candidate[] = [];
  searchTerm: string = '';
  selectedCandidates: any[] = [];
  statusList: any[] = [];
  showInterviewForm: boolean = false;
  selectedCandidateForInterview: any = null;
  showFilter: boolean = false;
  selectedStatusFilters: string[] = [];
  skillsFilter: string = '';
  originalCandidates: any[] = [];
  nameFilter: string = '';
  emailFilter: string = '';
  isDragging = false;
  startX = 0;
  startWidth = 0;
  widthSteps = [49, 39, 29, 24]; 
  currentStepIndex = 0; 
  nameFilterExpanded = false;
  emailFilterExpanded = false;
  statusFilterExpanded = false;
  skillsFilterExpanded = false;
  loading: boolean = false;

  showPopup: boolean = false;
  statusedit: boolean = false; 
  demands: any;
  selectedCandidate: any = null;
  selectedStatus: string = '';
  cdm_comment: string = '';
  csm_code: string = '';
  dem_id: string = '';
  interviewTypes: any[] = [];
  interviewDetailsMap: Map<string, any[]> = new Map();

  readonly cdm_updateby_id = 'emp_1';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['candidatesSelected'] && changes['candidatesSelected'].currentValue) {
      console.log('Candidates selected changed:', changes['candidatesSelected'].currentValue);
      this.selectedCandidates.push(this.candidatesSelected);
    }
  }

  constructor(private httpService: HttpService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router,private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.filteredCandidates = [...this.candidates]; // Ensure it loads with all candidates initially
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      if (demandId) {
        this.dem_id = demandId;
        this.loadData(demandId);
      }
    });
    this.loadInterviewTypes();
    this.httpService.getCandidateStatuses().subscribe(
      (response) => {
        this.statusList = response;
      },
      (error) => {
        console.error('Error fetching global candidate statuses:', error);
      }
    );

    console.log("Demand ID on Init:", this.dem_id);
  }

  onSubmit() {
    this.onStatusFormSubmit();
  }

  onCancel() {
    this.onPopupClose();
  }

  openStatusEditPopup(candidate: any) {
    this.selectedCandidate = candidate;
    this.csm_code = candidate.candidate_status?.csm_code || '';
    this.showPopup = true;
}

  onPopupClose() {
    if (this.selectedCandidate) {
      // Reset to original status
      this.selectedCandidate.selectedStatus = this.selectedCandidate.originalStatus;
      delete this.selectedCandidate.originalStatus;
    }
    
    this.showPopup = false;
    this.selectedCandidate = null;
    this.selectedStatus = '';
    this.cdm_comment = '';
    this.csm_code = '';
  }

  onStatusFormSubmit() {
    // Change this check from selectedStatus to csm_code
    if (!this.selectedCandidate || !this.csm_code) {
        this.snackBar.open("Invalid data. Please try again.", "❌", {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
        console.error('Validation failed:', {
            candidate: this.selectedCandidate,
            status: this.csm_code,
            comment: this.cdm_comment
        });
        return;
    }

    const csm_id = this.statusList.find(status => status.csm_code === this.csm_code)?.csm_id;

    if (!csm_id) {
        this.snackBar.open("Invalid status selected. Please try again.", "❌", {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
        console.error('Status not found:', this.csm_code);
        return;
    }

    const payload = {
        cdm_id: this.selectedCandidate.cdl_cdm_id,
        csm_id: csm_id,
        cdm_comment: this.cdm_comment,
        cdm_updateby_id: this.cdm_updateby_id
    };
    
    console.log('Submitting payload:', payload); // Log the payload before sending
    
    this.httpService.updateCandidateStatus(payload).subscribe({
        next: (response) => {
            this.snackBar.open("✅ Candidate status updated successfully!", "", {
                duration: 3000,
                panelClass: ['success-snackbar']
            });
            console.log('Update successful:', response);
            this.onPopupClose();
            this.loadData(this.dem_id);
            this.loadCandidateStatusesById(this.selectedCandidate.cdl_cdm_id);
        },
        error: (error) => {
            console.error("Error updating candidate status", error);
            this.snackBar.open(`Error: ${error.message}`, "❌", {
                duration: 5000,
                panelClass: ['error-snackbar']
            });
            this.loadData(this.dem_id);
        }
    });
}


  public loadData(demandId: any) {
    const payload = { dem_id: demandId };

    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        this.demands = data.demand_details;
        this.candidates = data.candidates ? [...data.candidates].reverse() : [];
        this.originalCandidates = [...this.candidates];
        
      console.log("Demands", this.demands);
        this.candidates.forEach(candidate => {
          this.loadInterviewDetailsForCandidate(candidate);
          this.loadCandidateStatusesById(candidate.cdl_cdm_id).subscribe(
            (statuses) => {
              candidate.statusList = statuses && statuses.length > 0 ? statuses : this.statusList;
              candidate.selectedStatus = candidate.candidate_status.csm_code;
            },
            (error) => {
              console.error('Error fetching candidate statuses:', error);
              candidate.statusList = this.statusList;
            }
          );
        });
      }
    });
  }

  loadCandidateStatusesById(cdm_id: string): Observable<any> {
    return this.httpService.getCandidateStatusesbyid(cdm_id).pipe(
      
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching statuses for candidate ${cdm_id}:`, error);
        return this.httpService.getCandidateStatuses();
      })
    );
  }

  handleNullValues(candidate: any): Candidate {
    return {
      cdm_name: candidate.cdm_name || 'Not Provided',
      cdm_id: candidate.cdm_id || 'Not Provided',
      cdl_cdm_id:candidate.cdl_cdm_id,
      candidate_status: {
        csm_id: candidate?.candidate_status?.csm_id ?? null,
        csm_code: candidate.candidate_status ? candidate.candidate_status.csm_code : 'Unknown'
      },
      cdm_profile: candidate.cdm_profile || '#',
      cdm_description: candidate.cdm_description ||"N/A",
      cdm_email:candidate.cdm_email || "N/A",
      cdm_keywords:candidate.cdm_keywords || "N/A"
    };
  }

  filterCandidates(): void {
    if (!this.dem_id) {
      this.filteredCandidates = [];
      console.log("No demand ID provided.");
      return;
    }

    this.loading = true; // Start loading
    const requestBody = { dem_id: this.dem_id };

    this.httpService.getNotAddedCandidatesBySearch(requestBody).subscribe({
      next: (data) => {
        console.log("API Response:", data);
        const allCandidates: Candidate[] = data?.candidates_not_added || [];
  
        // Filter candidates based on search input
        const term = this.searchTerm.trim().toLowerCase();
        this.filteredCandidates = term
          ? allCandidates.filter(candidate =>
              (candidate?.cdm_name || '').toLowerCase().includes(term)
            )
          : allCandidates;
        console.log("Filtered Candidates:", this.filteredCandidates);
        this.loading = false; // Stop loading
      },
      error: (err) => {
        console.error("Error fetching candidates:", err);
        this.filteredCandidates = [];
        this.loading = false; // Stop loading
      }
    });
  }

  getSafeValue(value: any): string {
    return value && value.trim() ? value : 'Not Provided';
  }

  openFilter() {
  }

  redirectToAddCandidates() {
    this.router.navigate(['candidate-master']);
  }

  redirectTocandidateHistory(candidateId:string){
    this.router.navigate(['candidate-history',candidateId]);
  }

  toggleSelection(candidate: Candidate) {
    const index = this.selectedCandidates.findIndex(c => c.cdl_cdm_id === candidate.cdl_cdm_id);
    if (index > -1) {
      this.selectedCandidates.splice(index, 1);
    } else {
      this.selectedCandidates.push(candidate);
      console.log('pushing candidate:', candidate);
    }
  }
  

  isSelected(candidate: Candidate): boolean {
    return this.selectedCandidates.some(c => c.cdl_cdm_id === candidate.cdl_cdm_id);
  }
  
  submitSelectedCandidates() {
    // Add candidatesSelected from @Input() if not already in selectedCandidates
  if (this.candidatesSelected && !this.selectedCandidates.includes(this.candidatesSelected)) {
    this.selectedCandidates.push(this.candidatesSelected);
    console.log("✅ Input candidate added to selectedCandidates:", this.candidatesSelected);
  }

    if (this.selectedCandidates.length === 0) {
      this.snackBar.open("No candidates selected..!", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload = this.selectedCandidates.map(candidate => ({
      cdl_cdm_id: candidate?.cdl_cdm_id,
      cdl_dem_id: this.dem_id
    }));


    console.log('payload for linking :', payload);
    if (payload.length === 0) {
      this.snackBar.open("No candidates with valid status selected.!", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.httpService.postCandidateDemand(payload).subscribe({
      next: (data) => {
        this.snackBar.open("✅ Candidates linked successfully!", "", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.selectedCandidates = [];
        this.candidatesLinked.emit();
        this.loadData(this.dem_id);

      },
      error: (error) => {
        if(this.demands.status_details.dsm_id== 4 || this.demands.status_details.dsm_inactive==true){
          this.snackBar.open("❌ Failed to link candidates. demand is closed or status inactive .", "❌", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }else{
        this.snackBar.open("❌ Failed to link candidates. Try again.", "❌", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });}
        console.error("Error submitting data", error);
      }
    });
  }

  openPdf(pdfUrl: string | null, event: Event) {
    event.preventDefault(); // Always prevent default anchor behavior
    
    if (!pdfUrl) {
      this.snackBar.open("No profile available", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    try {
      // Emit the event to open in preview panel
      this.pdfSelected.emit(pdfUrl);
      console.log("PDF selected in CandidateComponent:", pdfUrl);
    } catch (e) {
      console.error("Error opening profile:", e);
      this.snackBar.open("Unable to open profile file", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
  

  trackByFn(index: number, candidate: any) {
    return candidate.id; // Uses a unique ID to avoid re-rendering
}


  getStatusClass(statusCode: string): string {
    if (!statusCode) return '';
    return statusCode.replace(/\s+/g, '_');
  }
  
  getStatusClasses(candidate: any, isSearchMode: boolean): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      'no-arrow': isSearchMode,
      'status': true
    };
    
    const statusClass = this.getStatusClass(candidate.selectedStatus);
    if (statusClass) {
      classes[statusClass] = true;
    }
    
    return classes;
  }

  openInterviewForm(candidate: any) {
    if(this.demands.status_details.dsm_id==4){
      this.snackBar.open("❌ Failed to open interview form. demand is closed .", "❌", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }else{
    this.selectedCandidateForInterview = candidate;
    this.showInterviewForm = true;
    }
  }
  
  closeInterviewForm() {
    this.showInterviewForm = false;
    this.selectedCandidateForInterview = null;}
    
  toggleStatusEdit() {
    this.statusedit = !this.statusedit; 
    console.log("Status Edit Clicked: ", this.statusedit);
  }

  updateCandidateStatusToInterviewScheduled(candidateId: string) {
    // Find the candidate in your list
    const candidate = this.candidates.find(c => c.cdl_cdm_id === candidateId);
    if (!candidate) return;
  
    // Find the "INTERVIEW_SCHEDULED" status in your status list
    const interviewScheduledStatus = this.statusList.find(status => 
      status.csm_code === 'Interview Scheduled');
    
    if (!interviewScheduledStatus) {
      console.error('Interview Scheduled status not found');
      return;
    }
  
    // Prepare payload for status update
    const payload = {
      cdm_id: candidateId,
      csm_id: interviewScheduledStatus.csm_id,
      cdm_comment: 'Status updated automatically after scheduling interview',
      cdm_updateby_id: this.cdm_updateby_id
    };
  
    // Update the status
    this.httpService.updateCandidateStatus(payload).subscribe({
      next: (response) => {
        this.snackBar.open("✅ Candidate status updated to INTERVIEW_SCHEDULED!", "", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Refresh the candidate list
        this.loadData(this.dem_id);
      },
      error: (error) => {
        this.snackBar.open(`Failed to update status: ${error.message}`, "❌", {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  @HostListener('document:click', ['$event'])
handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedOnFilterIcon = target.closest('.search-bar button:first-child');
    const clickedInsideFilter = target.closest('.filter-container');
    
    if (this.showFilter && !clickedOnFilterIcon && !clickedInsideFilter) {
        this.closeFilter();
    }
}
  
  // Modify your filter methods
  closeFilter(event?: Event): void {
      if (event) {
          event.stopPropagation();
      }
      this.showFilter = false;
  }
  
  toggleFilter(event: Event): void {
    event.stopPropagation();
    this.showFilter = !this.showFilter;
    if (!this.showFilter) {
        this.resetFilters();
    }
  }


// Modify the applyFilters method
applyFilters(): void {
    // Only show candidates that match ALL active filters
    this.candidates = this.originalCandidates.filter(candidate => {
        // Name filter - case insensitive partial match
        const nameMatch = !this.nameFilter || 
            (candidate.name && candidate.name.toLowerCase().includes(this.nameFilter.toLowerCase()));
        
        // Email filter - case insensitive partial match
        const emailMatch = !this.emailFilter || 
            (candidate.email && candidate.email.toLowerCase().includes(this.emailFilter.toLowerCase()));
        
        // Status filter - must match if status filters are selected
        const statusMatch = this.selectedStatusFilters.length === 0 || 
            this.selectedStatusFilters.includes(candidate.candidate_status?.csm_code);
        
        // Skills filter - must match if skills are specified
        let skillsMatch = true;
        if (this.skillsFilter.trim()) {
          const searchSkills = this.skillsFilter.split(',').map(s => s.trim().toLowerCase());
          const candidateSkills = (candidate.keywords || '').toLowerCase();
          skillsMatch = searchSkills.every(skill => 
              candidateSkills.includes(skill)
          );
        }
        
        return nameMatch && emailMatch && statusMatch && skillsMatch;
    });
}

// Update resetFilters to clear the new filters
resetFilters(): void {
    this.selectedStatusFilters = [];
    this.skillsFilter = '';
    this.nameFilter = '';
    this.emailFilter = '';
    this.candidates = [...this.originalCandidates];
    this.closeFilter();
}

// Add these methods
toggleFilterExpansion(filterType: string, event?: Event) {
  if (event) {
    event.stopPropagation(); // Prevent the click from reaching document
  }
    switch(filterType) {
        case 'name':
            this.nameFilterExpanded = !this.nameFilterExpanded;
            this.emailFilterExpanded = false;
            this.statusFilterExpanded = false;
            this.skillsFilterExpanded = false;
            break;
        case 'email':
            this.emailFilterExpanded = !this.emailFilterExpanded;
            this.nameFilterExpanded = false;
            this.statusFilterExpanded = false;
            this.skillsFilterExpanded = false;
            break;
        case 'status':
            this.statusFilterExpanded = !this.statusFilterExpanded;
            this.nameFilterExpanded = false;
            this.emailFilterExpanded = false;
            this.skillsFilterExpanded = false;
            break;
        case 'skills':
            this.skillsFilterExpanded = !this.skillsFilterExpanded;
            this.nameFilterExpanded = false;
            this.emailFilterExpanded = false;
            this.statusFilterExpanded = false;
            break;
    }
}

hasActiveFilters(): boolean {
    return !!this.nameFilter || !!this.emailFilter || 
           this.selectedStatusFilters.length > 0 || !!this.skillsFilter;
}

getActiveFilters(): any[] {
    const filters = [];
    
    if (this.nameFilter) {
        filters.push({ type: 'name', label: 'Name', value: this.nameFilter });
    }
    
    if (this.emailFilter) {
        filters.push({ type: 'email', label: 'Email', value: this.emailFilter });
    }
    
    if (this.selectedStatusFilters.length > 0) {
        filters.push({ 
            type: 'status', 
            label: 'Status', 
            value: this.selectedStatusFilters.join(', ') 
        });
    }
    
    if (this.skillsFilter) {
        filters.push({ type: 'skills', label: 'Skills', value: this.skillsFilter });
    }
    
    return filters;
}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const newWidth = this.startWidth + (event.clientX - this.startX);
    const viewportWidth = window.innerWidth;
    const newWidthVW = (newWidth / viewportWidth) * 100;

    // Find the closest step to the current width
    let closestStep = this.widthSteps[0];
    let closestIndex = 0;

    for (let i = 0; i < this.widthSteps.length; i++) {
      if (Math.abs(newWidthVW - this.widthSteps[i]) < Math.abs(newWidthVW - closestStep)) {
        closestStep = this.widthSteps[i];
        closestIndex = i;
      }
    }

    // Apply the closest step width
    this.currentStepIndex = closestIndex;
    this.renderer.setStyle(this.el.nativeElement.querySelector('.candidates-container'), 'width', `${closestStep}vw`);

    // Apply preview-open class if width reduces below a threshold
    this.isPreviewOpen = closestStep <= 28;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
    document.body.style.cursor = "default";
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startWidth = this.el.nativeElement.querySelector('.candidates-container').offsetWidth;
    document.body.style.cursor = "ew-resize";
  }

  toggleStatusSelection(statusCode: string): void {
    const index = this.selectedStatusFilters.indexOf(statusCode);
    if (index > -1) {
      this.selectedStatusFilters.splice(index, 1);
    } else {
      this.selectedStatusFilters.push(statusCode);
    }
    this.applyFilters();
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside1(event: MouseEvent) {
    // Check if the click was outside the status filter
    const statusFilterElement = this.el.nativeElement.querySelector('.filter-control.status-filter');
    const clickedInsideStatusFilter = statusFilterElement?.contains(event.target as Node);
    
    if (this.statusFilterExpanded && !clickedInsideStatusFilter) {
      this.statusFilterExpanded = false;
      this.cdr.detectChanges(); // Trigger change detection if needed
    }
  }

loadInterviewTypes() {
  this.httpService.getInterviewTypes().subscribe(
    (response) => {
      this.interviewTypes = response;
    },
    (error) => {
      console.error('Error fetching interview types:', error);
    }
  );
}

loadInterviewDetailsForCandidate(candidate: any) {
  if (!candidate.cdl_cdm_id || !this.dem_id) {
    console.log('Missing candidate ID or demand ID');
    return;
  }
  this.httpService.getInterviewDetails(
    candidate.cdl_cdm_id,
    this.dem_id,
    'next_one'
  ).subscribe({
    next: (response) => {
      console.log('Interview details response:', response);
      if (response && response.length > 0) {
        this.interviewDetailsMap.set(candidate.cdl_cdm_id, response);
      }
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error fetching interview details:', error);
    }
  });
}

getInterviewTypeLabel(typeId: number): string {
  const type = this.interviewTypes.find(t => t.value === typeId);
  return type ? type.label : 'Unknown';
}

formatInterviewDate(dateStr: string, timeStr: string): string {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let dateText = '';
  
  if (date.toDateString() === today.toDateString()) {
    dateText = 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    dateText = 'Tomorrow';
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateText = 'Yesterday';
  } else {
    dateText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  
  if (timeStr) {
    const timeParts = timeStr.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    dateText += `, ${displayHours}:${minutes} ${ampm}`;
  }
  
  return dateText;
}

toggleInterviewDetails(candidateId: string) {
  const candidate = this.candidates.find(c => c.cdl_cdm_id === candidateId);
  if (candidate) {
    candidate.showInterviewDetails = !candidate.showInterviewDetails;
    if (candidate.showInterviewDetails && !this.interviewDetailsMap.has(candidateId)) {
      this.loadInterviewDetailsForCandidate(candidate);
    }
  }
}

hasInterviewDetails(candidateId: string): boolean {
  return this.interviewDetailsMap.has(candidateId);
}

isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}


getInterviewerNames(interviewers: any[]): string {
  if (!interviewers || !interviewers.length) return '';
  return interviewers.map(i => i.name).join(', ');
}

getInterviewDetailsForDisplay(candidateId: string): any[] {
  const interviews = this.interviewDetailsMap.get(candidateId);
  if (!interviews) return [];
  
  return interviews.map(interview => ({
    ...interview,
    formattedDate: this.formatInterviewDate(interview.ist_interviewdate, interview.ist_interview_start_time),
    interviewerNames: this.getInterviewerNames(interview.ist_interviewers),
    typeLabel: this.getInterviewTypeLabel(interview.ist_interviewtype),
    isToday: this.isToday(interview.ist_interviewdate)
  }));
}


  OpenAdvanceSearch(){
    this.ShowAdvancSearch.emit(this.dem_id);
    console.log("request for advance search from candidate component for demand-id:",this.dem_id);
  }

  // Add these methods to your component class
  getCandidateImageUrl(candidate: any): string {
    if (!candidate?.cdm_image) {
      return '../../../assets/img/profile_img.png'; // Default avatar
    }
    
    try {
      // Remove /api/ from the base URL temporarily for images
      const baseUrl = this.httpService.baseUrl.replace('/api', '');
      
      // Handle path construction
      const imagePath = candidate.cdm_image.startsWith('/uploads/') 
        ? candidate.cdm_image.substring('/uploads/'.length)
        : candidate.cdm_image;
      
      return `${baseUrl}/uploads/${imagePath}`;
    } catch (e) {
      console.error('Error constructing image URL:', e);
      return '../../../assets/img/profile_img.png';
    }
  }

  getCandidateProfileUrl(candidate: any): string | null {
    if (!candidate?.cdm_profile) {
      return null;
    }
  
    try {
      // Get base URL and remove /api/ part
      const baseUrl = this.httpService.baseUrl.replace('/api', '');
      
      // Remove any leading slashes from the profile path
      let profilePath = candidate.cdm_profile.replace(/^\//, '');
      
      // Construct the final URL
      return `${baseUrl}/${profilePath}`;
    } catch (e) {
      console.error('Error constructing profile URL:', e);
      return null;
    }
  }

handleImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = '../../../assets/img/profile_img.png';
}

getProfileFilename(candidate: any): string {
  if (!candidate?.cdm_profile) return 'Download';
  try {
    return candidate.cdm_profile.split('/').pop() || 'Download';
  } catch (e) {
    return 'Download';
  }
}

getKeywords(keywords: any): string[] {
  if (!keywords) return [];
  if (Array.isArray(keywords)) return keywords;
  if (typeof keywords === 'string') return keywords.split(',').map(k => k.trim());
  return [];
}
}