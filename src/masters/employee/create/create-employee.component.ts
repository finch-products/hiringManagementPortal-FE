import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';
import { EmployeeService } from '../../../app/services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  locations: any[] = [];
  roles: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private validatorsService: ValidatorsService, private httpService: HttpService,private employeeService: EmployeeService) {
    this.employeeForm = this.fb.group({
      emp_uniqueid: [''],
      emp_name: ['', [Validators.required, Validators.pattern(this.validatorsService.namePattern())]],
      emp_email: ['', [Validators.required, Validators.email]],
      emp_phone: ['', [Validators.required, Validators.pattern(this.validatorsService.phonePattern())]],
      emp_lcm_id: ['', Validators.required],
      emp_rlm_id: ['', Validators.required],
      emp_isactive: [true],
      emp_keyword: ['', Validators.required],
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
      error: (err) => {
        console.error('Error fetching locations', err);
        this.showError('❌ Failed to load locations');
      }
    });
  }

  loadRoles(): void {
    this.httpService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        console.log('Roles:', this.roles);
      },
      error: (err) => {
        console.error('Error fetching roles', err);
        this.showError('❌ Failed to load roles');
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.httpService.addEmployee(this.employeeForm.value).subscribe({
        next: (response) => {
          console.log('Employee Added Successfully:', response);
          this.employeeService.addEmployee(response);
          this.snackBar.open('✅ Employee added successfully!', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.employeeForm.reset();
          this.employeeForm.patchValue({
            emp_isactive: true,
            emp_insertby: 'emp_10022025_01',
            emp_updateby: 'emp_10022025_01'
          });
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          if (error.status === 400 && error.error) {
            for (const field in error.error) {
              if (this.employeeForm.controls[field]) {
                this.employeeForm.controls[field].setErrors({ serverError: error.error[field][0] });
              }
            }
            this.showError('⚠️ Please correct the highlighted fields.');
          } else {
            this.showError('❌ Failed to add employee. Please try again.');
          }
        }
      });
    } else {
      this.showError('⚠️ Please fill all required fields correctly.');
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  onCancel(): void {
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      emp_isactive: true
    });
  }
}
