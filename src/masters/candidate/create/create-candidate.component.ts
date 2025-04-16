import { HttpClient } from '@angular/common/http';
import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';
import { CandidateService } from '../../../app/services/candidate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrl: './create-candidate.component.scss'
})

export class CreateCandidateComponent implements OnInit {
  candidateForm: FormGroup;
  locationFilterControl = new FormControl('');

  locations: any[] = [];
  status: any[] = [];

  selectedFile: File | null = null;
  filteredLocations!: Observable<any[]>;

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private fb: FormBuilder, private http: HttpClient, private validatorsService: ValidatorsService, private httpService: HttpService, private CandidateService: CandidateService, private snackBar: MatSnackBar) {

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
      cdm_insertby: ['emp_22032025_1'],
      cdm_updateby: ['emp_22032025_1']
    });
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCandidateStatus();
    this.filteredLocations = this.locationFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLocations(value || ''))
    );
  }

  loadLocations(): void {
    this.httpService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.filteredLocations = this.locationFilterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterLocations(value || ''))
        );
      },
      error: (err: any) => console.error('Error fetching locations', err)
    });
  }

  private _filterLocations(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter(location => location.lcm_name.toLowerCase().includes(filterValue));
  }

  onLocationSelected(event: any): void {
    const selectedLocation = this.locations.find(loc => loc.lcm_name === event.option.value);
    if (selectedLocation) {
      // Set the selected location ID in the form control
      this.candidateForm.patchValue({ cdm_location: selectedLocation.lcm_id });
      // Update the filter control to display the selected location name
      this.locationFilterControl.setValue(selectedLocation.lcm_name, { emitEvent: false });
    }
  }

  onLocationBlur(): void {
    // If the input value doesn't match any location, reset the field
    const inputValue = this.locationFilterControl.value;
    const selectedLocation = this.locations.find(loc => loc.lcm_name === inputValue);
    if (!selectedLocation) {
      this.locationFilterControl.setValue('');
      this.candidateForm.patchValue({ cdm_location: '' });
    }
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
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(form: FormGroupDirective) {
    const formData = new FormData();

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
        this.CandidateService.addcandidate(response);
        this.snackBar.open('✅ Candidate added successfully!', '', {
          duration: 4000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'

        });
        this.candidateForm.reset();
        form.resetForm();
        this.candidateForm.patchValue({
          cdm_isinternal: true,
          cdm_isactive: true,
          cdm_insertby: 'emp_22032025_1',
          cdm_updateby: 'emp_22032025_1'
        });
        this.locationFilterControl.reset();
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.selectedFile = null;        
      },
      error: (error) => {
        console.error('Error adding Candidate:', error);

        if (error.status === 400 && error.error) {
          for (const field in error.error) {
            if (this.candidateForm.controls[field]) {
              this.candidateForm.controls[field].setErrors({ serverError: error.error[field][0] });
            }
          }
          this.snackBar.open('❌ Validation Error: Please correct the highlighted fields.', '', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'

          });
        } else {
          this.snackBar.open(`❌ Failed to add candidate: ${error.message}`, '', {
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
    this.candidateForm.patchValue({
      cdm_isinternal: true,
      cdm_isactive: true,
      cdm_insertby: 'emp_22032025_1',
      cdm_updateby: 'emp_22032025_1'
    });
    this.locationFilterControl.reset();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = null;
    
  }
}