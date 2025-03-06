import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss'
})
export class CreateEmployeeComponent {
  employeeForm: FormGroup;
  locations: any[] = [];
  roles: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private validatorsService: ValidatorsService, private httpService: HttpService) {
    this.employeeForm = this.fb.group({
      emp_uniqueid: [''],  
      emp_name: ['', [Validators.required, Validators.pattern(this.validatorsService.namePattern())]],
      emp_email: ['', [Validators.required, Validators.email]],
      emp_phone: ['', [Validators.required, Validators.pattern(this.validatorsService.phonePattern())]],
      emp_lcm_id: ['', Validators.required],  // Ensure required field
      emp_rlm_id: ['', Validators.required],  // Ensure required field
      emp_isactive: [true],
      emp_keyword: ['', Validators.required], // Ensure required field
      emp_insertby: ['emp_10022025_01'],
      emp_updateby: ['emp_10022025_01'],
    });    
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadRoles();
  }

  loadLocations(): void {
    this.httpService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        console.log('Locations:', this.locations);
      },
      error: (err) => console.error('Error fetching locations', err)
    });
  }

  loadRoles(): void {
    this.httpService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        console.log('roles:', this.roles);
      },
      error: (err) => console.error('Error fetching roles', err)
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.httpService.addEmployee(this.employeeForm.value).subscribe({
        next: (response) => {
          console.log('Employee Added Successfully:', response);
          alert('Employee added successfully!');  // Show success alert
          this.employeeForm.reset();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
  
          if (error.status === 400 && error.error) {
            // Loop through the error object and set errors on form controls
            for (const field in error.error) {
              if (this.employeeForm.controls[field]) {
                this.employeeForm.controls[field].setErrors({ serverError: error.error[field][0] });
              }
            }
          } else {
            alert('Failed to add employee. Check console for details.');
          }
        }
      });
    } else {
      console.log('Form is invalid:', this.employeeForm.errors);
      alert('Please fill in all required fields correctly.');
    }
  }  
  
}
