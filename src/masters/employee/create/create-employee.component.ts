import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';
import { EmployeeService } from '../../../app/services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  locationFilterControl = new FormControl('');
  roleFilterControl = new FormControl('');
  selectedFile: File | null = null;
  locations: any[] = [];
  roles: any[] = [];
  filteredLocations!: Observable<any[]>;
  filteredRoles!: Observable<any[]>;

  constructor(private fb: FormBuilder, private http: HttpClient, private validatorsService: ValidatorsService, private httpService: HttpService,private employeeService: EmployeeService, private snackBar: MatSnackBar) {
    this.employeeForm = this.fb.group({
      emp_uniqueid: ['', Validators.required],
      emp_name: ['', [Validators.required, Validators.pattern(this.validatorsService.namePattern())]],
      emp_email: ['', [Validators.required, Validators.email]],
      emp_phone: ['', Validators.pattern(this.validatorsService.phonePattern())],
      emp_lcm_id: [''],
      emp_rlm_id: [''],
      emp_isactive: [true],
      emp_keyword: [''],
      emp_insertby: ['emp_22032025_1'],
      emp_updateby: ['emp_22032025_1'],
    });
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadRoles();
    this.filteredLocations = this.locationFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLocations(value || ''))
    );
    this.employeeForm.valueChanges.subscribe(() => {
      console.log('Email Errors:', this.employeeForm.controls['emp_email'].errors);
    });

    this.filteredRoles = this.roleFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRoles(value || ''))
    );
  }

  loadLocations(): void {
    this.httpService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        console.log('Locations:', this.locations);
        this.filteredLocations = this.locationFilterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterLocations(value || ''))
        );
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
        this.filteredRoles = this.roleFilterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterRoles(value || ''))
        );
      },
      error: (err) => {
        console.error('Error fetching roles', err);
        this.showError('❌ Failed to load roles');
      }
    });
  }

  private _filterLocations(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter(location => location.lcm_name.toLowerCase().includes(filterValue));
  }

  private _filterRoles(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.roles.filter(role => role.rlm_name.toLowerCase().includes(filterValue));
  }

  onLocationSelected(event: any): void {
    const selectedLocation = this.locations.find(loc => loc.lcm_name === event.option.value);
    if (selectedLocation) {
      this.employeeForm.patchValue({ emp_lcm_id: selectedLocation.lcm_id });
      this.locationFilterControl.setValue(selectedLocation.lcm_name, { emitEvent: false });
    }
  }

  onRoleSelected(event: any): void {
    const selectedRole = this.roles.find(role => role.rlm_name === event.option.value);
    if (selectedRole) {
      this.employeeForm.patchValue({ emp_rlm_id: selectedRole.rlm_id });
      this.roleFilterControl.setValue(selectedRole.rlm_name, { emitEvent: false });
    }
  }

  onLocationBlur(): void {
    const inputValue = this.locationFilterControl.value;
    const selectedLocation = this.locations.find(loc => loc.lcm_name === inputValue);
    if (!selectedLocation) {
      this.locationFilterControl.setValue('');
      this.employeeForm.patchValue({ emp_lcm_id: '' });
    }
  }

  onRoleBlur(): void {
    const inputValue = this.roleFilterControl.value;
    const selectedRole = this.roles.find(role => role.rlm_name === inputValue);
    if (!selectedRole) {
      this.roleFilterControl.setValue('');
      this.employeeForm.patchValue({ emp_rlm_id: '' });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
        // Validate file type if needed
        if (!file.type.match(/image\/*/)) {
            this.showError('Only images are allowed');
            return;
        }
        this.selectedFile = file;
    }
}

  onSubmit(form: FormGroupDirective): void {
    if (this.employeeForm.valid) {
      const formData = new FormData();
  
      if (this.selectedFile) {
        formData.append('emp_image', this.selectedFile, this.selectedFile.name);
    }

    Object.entries(this.employeeForm.value).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    });
  
      this.httpService.addEmployee(formData).subscribe({
        next: (response) => {
          this.employeeService.addEmployee(response);
          this.snackBar.open('✅ Employee added successfully!', '', {
            duration: 4000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
  
          this.employeeForm.reset();
          form.resetForm();
          
          this.locationFilterControl.reset('');
          this.roleFilterControl.reset('');
          this.selectedFile = null;
          this.employeeForm.patchValue({
            emp_isactive: true,
            emp_insertby: 'emp_22032025_1',
            emp_updateby: 'emp_22032025_1'
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
    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  onCancel(formDirective: FormGroupDirective): void {
    formDirective.resetForm(); 
    this.employeeForm.reset();
    this.selectedFile = null;
    this.employeeForm.patchValue({
      emp_isactive: true,
      emp_insertby: 'emp_22032025_1',
      emp_updateby: 'emp_22032025_1'
    });
  
    // Clear autocomplete fields explicitly
    this.locationFilterControl.setValue('');
    this.roleFilterControl.setValue('');
  }
}
