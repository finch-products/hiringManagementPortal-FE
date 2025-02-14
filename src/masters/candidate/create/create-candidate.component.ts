import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';


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

  constructor(private fb: FormBuilder, private http: HttpClient, private validatorsService: ValidatorsService, private httpService: HttpService) {
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
      cdm_insertby: [1],
      cdm_updateby: [1]
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

    // Debug: Check if form values exist before appending
    console.log("Form Values:", this.candidateForm.value);

    Object.keys(this.candidateForm.value).forEach(key => {
      let value = this.candidateForm.value[key];

      if (value) {
        formData.append(key, value);
      } else {
        console.warn(`Skipping empty field: ${key}`);
      }


      // if (this.demandForm.value[key]) {  // Ensure value is not null or undefined
      //   formData.append(key, this.demandForm.value[key]);
      // } else {
      //   console.warn(`Skipping empty field: ${key}`);
      // }
    });

    // Debug: Check if file exists before appending
    if (this.selectedFile) {
      console.log("Selected File:", this.selectedFile);
      formData.append("profile", this.selectedFile);
    } else {
      console.warn("No file selected");
    }

    // Debug: Check contents of `formData`
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    // Send API request
    this.httpService.addCandidate(formData).subscribe({
      next: (response) => {
        console.log('Candidate Added Successfully:', response);
        this.candidateForm.reset();
      },
      error: (error) => {
        console.error('Error adding Candidate:', error);
        alert('Failed to add Candidate. Check console for details.');
      }
    });
  }

}
