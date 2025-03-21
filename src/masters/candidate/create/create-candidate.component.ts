import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';
import { CandidateService } from '../../../app/services/candidate.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrl: './create-candidate.component.scss'
})

export class CreateCandidateComponent implements OnInit {
  candidateForm: FormGroup;
  locations: any[] = [];
  status: any[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private validatorsService: ValidatorsService, private httpService: HttpService,private CandidateService: CandidateService) {

    this.candidateForm = this.fb.group({
      cdm_emp_id: [''],
      cdm_name: ['', [Validators.required, Validators.pattern(this.validatorsService.namePattern())]],
      cdm_email: ['', Validators.email],
      cdm_phone: ['', [Validators.required, Validators.pattern(this.validatorsService.phonePattern())]],
      cdm_location: ['', Validators.required],
      cdm_profile: [''],
      cdm_description: [],
      cdm_csm_id: [],
      cdm_keywords: [],
      cdm_isinternal: [true],
      cdm_isactive: [true],
      cdm_insertby: ['emp_10022025_01'],
      cdm_updateby: ['emp_10022025_01']
    });
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCandidateStatus();
  }

  loadLocations(): void {
    this.httpService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        console.log('Locations:', this.locations);
      },
      error: (err: any) => console.error('Error fetching locations', err)
    });
  }

  loadCandidateStatus(): void {
    this.httpService.getRoles().subscribe({
      next: (data) => {
        this.status = data;
        console.log('roles:', this.status);
      },
      error: (err) => console.error('Error fetching roles', err)
    });
  }


  onFileSelected(event: any) {
    // this.selectedFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    console.log("Form Values:", this.candidateForm.value);

    Object.keys(this.candidateForm.value).forEach(key => {
      const value = this.candidateForm.value[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      } else {
        console.warn(`Skipping empty field: ${key}`);
      }
    });

    if (this.selectedFile) {
      formData.append("profile", this.selectedFile);
    }

    this.httpService.addCandidate(formData).subscribe({
      next: (response) => {
        console.log('Candidate Added Successfully:', response);
        this.CandidateService.addcandidate(response);
        this.snackBar.open('✅ Candidate added successfully!', 'Close', {
          duration: 4000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'

        });
        this.candidateForm.reset();
      },
      error: (error) => {
        console.error('Error adding Candidate:', error);

        if (error.status === 400 && error.error) {
          for (const field in error.error) {
            if (this.candidateForm.controls[field]) {
              this.candidateForm.controls[field].setErrors({ serverError: error.error[field][0] });
            }
          }
          this.snackBar.open('❌ Validation Error: Please correct the highlighted fields.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'

          });
        } else {
          this.snackBar.open(`❌ Failed to add candidate: ${error.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'

          });
        }
      }
    });
  }
  onCancel(): void {
    this.candidateForm.reset();
  }
}
