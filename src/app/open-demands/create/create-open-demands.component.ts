import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { OpenDemandService } from '../../services/open.demand.service';

@Component({
  selector: 'app-create-open-demands',
  templateUrl: './create-open-demands.component.html',
  styleUrls: ['./create-open-demands.component.scss']
})
export class CreateOpenDemandComponent implements OnInit {
  demandForm: FormGroup;
  clientManagers = ["John Doe", "Jane Smith", "Michael Brown"];
  locations = ["New York", "San Francisco", "Los Angeles"];
  lobNames = ["Technology Services", "AI & ML", "Cloud Computing"];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private openDemandService: OpenDemandService) {
    this.demandForm = this.fb.group({
      ctool_number: [''],
      ctool_date: [''],
      client_manager_name: [''],
      client_location: [''],
      position_location: [''],
      tentative_required_by: [''],
      skillset: [''],
      lob_name: [''],
      practice_unit_name: [''],
      job_description: [null],
      no_of_positions: [''],
      rr_numbers: [''],
      rr_grade: [''],
      gcb_level: ['']
    });
  }

  onFileSelected(event: any) {
    // this.selectedFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // onSubmit() {
  //   const formData = new FormData();
  //   console.log("Form Values:", this.demandForm.value);
  //   Object.keys(this.demandForm.value).forEach(key => {
  //     formData.append(key, this.demandForm.value[key]);
  //   });

  //   if (this.selectedFile) {
  //     formData.append("job_description", this.selectedFile);
  //   }

  //   console.log(JSON.stringify(formData));
  //   this.http.post('http://64.227.145.117/api/open-demands/', formData).subscribe(response => {
  //     console.log('Success:', response);
  //   });
  // }

  onSubmit() {
    alert('inside')
    const formData = new FormData();

    // Debug: Check if form values exist before appending
    console.log("Form Values:", this.demandForm.value);

    Object.keys(this.demandForm.value).forEach(key => {
      let value = this.demandForm.value[key];
      if (value instanceof Date) {
        value = this.formatDate(value); // Extract YYYY-MM-DD
        console.log(`Formatted Date for ${key}: ${value}`);
      }

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
      formData.append("job_description", this.selectedFile);
    } else {
      console.warn("No file selected");
    }

    // Debug: Check contents of `formData`
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    // Send API request
    this.http.post('http://64.227.145.117/api/open-demands/', formData).subscribe({
      next: (response) => {
        alert('inside http')
        console.log('Success:', response);
        this.openDemandService.addDemand(response);
      },
      error: (error) => {
        console.error('Error in API call:', error);
      }
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
  }

  ngOnInit() { }
}
