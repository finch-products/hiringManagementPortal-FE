import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface InterviewType {
  value: number;
  label: string;
}

interface InterviewStatus {
  value: number;
  label: string;
}

interface Interviewer {
  name: string;
  email: string;
}

@Component({
  selector: 'app-interview-schedule',
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.scss']
})
export class InterviewScheduleComponent implements OnInit {
  @Input() candidateId: string = '';
  @Input() demandId: string = '';
  @Output() closeForm = new EventEmitter<void>();

  interviewForm: FormGroup;
  isLoading: boolean = false;
  cdlId: number | null = null;

  interviewStatusOptions: InterviewStatus[] = [];
  interviewTypeOptions: InterviewType[] = [];
  timezones: string[] = [];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.interviewForm = this.fb.group({
      interviewDate: ['', [Validators.required, (control: FormControl) => this.validateDateTime(control)]],
      interviewStartTime: ['', [Validators.required, (control: FormControl) => this.validateDateTime(control)]],
      interviewEndTime: ['', [Validators.required, (control: FormControl) => this.validateDateTime(control)]],
      timezone: ['', Validators.required],
      interviewType: ['', Validators.required],
      interviewRound: ['', [Validators.required, Validators.min(1)]],
      interviewStatus: ['', Validators.required],
      meetingDetails: ['', Validators.required],
      interviewers: this.fb.array([this.createInterviewer()]),
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.fetchCdlId();
    this.fetchInterviewTypes();
    this.fetchInterviewStatuses();
    this.fetchTimezones();
  }

  fetchTimezones() {
    this.httpService.getTimezones().subscribe({
      next: (response: any[]) => {
        this.timezones = response.map(item => item.label);
        
        const defaultTz = this.timezones.find(tz => tz.includes('Asia/Kolkata'));
        if (defaultTz) {
          this.interviewForm.patchValue({ timezone: defaultTz });
        }
      },
      error: (error) => {
        console.error('Error fetching timezones:', error);
        this.showSnackbar('Error fetching timezones', 'error');
      }
    });
  }

  get interviewers(): FormArray {
    return this.interviewForm.get('interviewers') as FormArray;
  }

  createInterviewer(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  addInterviewer(): void {
    this.interviewers.push(this.createInterviewer());
  }

  removeInterviewer(index: number): void {
    if (this.interviewers.length > 1) {
      this.interviewers.removeAt(index);
    } else {
      this.showSnackbar('At least one interviewer is required', 'error');
    }
  }

  fetchInterviewTypes() {
    this.httpService.getInterviewTypes().subscribe({
      next: (response) => {
        this.interviewTypeOptions = response;
      },
      error: (error) => {
        console.error('Error fetching interview types:', error);
        this.showSnackbar('Error fetching interview types', 'error');
      }
    });
  }

  fetchInterviewStatuses() {
    this.httpService.getInterviewStatuses().subscribe({
      next: (response) => {
        this.interviewStatusOptions = response;
      },
      error: (error) => {
        console.error('Error fetching interview statuses:', error);
        this.showSnackbar('Error fetching interview statuses', 'error');
      }
    });
  }

  fetchCdlId() {
    this.httpService.getCdlId(this.candidateId, this.demandId).subscribe({
      next: (response) => {
        this.cdlId = response.cdl_id;
      },
      error: (error) => {
        console.error('Error fetching CDL ID:', error);
        this.snackBar.open('Error getting CDL ID', 'Close', {
          duration: 5000
        });
      }
    });
  }

  onSubmit() {
    if (this.interviewForm.invalid || !this.cdlId) {
      return;
    }

    this.isLoading = true;
    const formValue = this.interviewForm.value;
    
    const formatTime = (time: string) => {
      return time ? `${time}:00` : '';
    };

    const payload = {
      ist_interviewdate: formValue.interviewDate,
      ist_interview_start_time: formatTime(formValue.interviewStartTime),
      ist_interview_end_time: formatTime(formValue.interviewEndTime),
      ist_timezone: formValue.timezone,
      ist_interviewtype: formValue.interviewType,
      ist_interviewround: formValue.interviewRound,
      ist_interviewstatus: formValue.interviewStatus,
      ist_interviewers: formValue.interviewers,
      ist_meeting_details: formValue.meetingDetails,
      ist_remarks: formValue.remarks,
      ist_cdl: this.cdlId
    };

    this.httpService.scheduleInterview(payload).subscribe({
      next: (response) => {
        this.showSnackbar('Interview scheduled successfully!', 'success');
        this.closeForm.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.showSnackbar(`Error scheduling interview: ${error.message}`, 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private showSnackbar(message: string, panelClass: 'success' | 'error' | 'warning' | 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: `${panelClass}-snackbar`
    });
  }

  onCancel() {
    this.closeForm.emit();
  }

  onreset() {
    this.interviewForm.reset();
    // Reset interviewers to one
    while (this.interviewers.length > 1) {
      this.interviewers.removeAt(1);
    }
    this.interviewers.at(0).reset();
  }
  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Add this method to your component
// Update the validateDateTime method in your component
validateDateTime(control: FormControl): { [key: string]: boolean } | null {
  if (!control.parent) return null;
  
  const now = new Date();
  const interviewDateCtrl = control.parent.get('interviewDate');
  const interviewStartTimeCtrl = control.parent.get('interviewStartTime');
  
  // Date validation
  if (control === interviewDateCtrl && interviewDateCtrl?.value) {
    const selectedDate = new Date(interviewDateCtrl.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate < today ? { pastDate: true } : null;
  }
  
  // Time validation
  if ((control === interviewStartTimeCtrl || control === control.parent.get('interviewEndTime')) && 
      interviewDateCtrl?.value && control.value) {
    const [hours, minutes] = control.value.split(':');
    const selectedDateTime = new Date(interviewDateCtrl.value);
    selectedDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    return selectedDateTime < now ? { pastTime: true } : null;
  }
  
  return null;
}


}