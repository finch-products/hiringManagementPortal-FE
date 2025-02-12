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
      emp_email: ['', Validators.email],
      emp_phone: ['', [Validators.required, Validators.pattern(this.validatorsService.phonePattern())]],
      emp_lcm_id: ['', Validators.required],
      emp_rlm_id: [''],
      emp_isactive: [true],
      emp_keyword: [],
      emp_insertby: [1],
      emp_updateby: [1],
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
          this.employeeForm.reset();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          alert('Failed to add employee. Check console for details.');
        }
      });
    }
  }
}
