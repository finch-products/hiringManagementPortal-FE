import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InternalDeptService } from '../../../app/services/internal.department.service';
import { HttpService } from '../../../app/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-internal-department',
  templateUrl: './create-internal-department.component.html',
  styleUrls: ['./create-internal-department.component.scss']
})
export class CreateInternalDepartmentComponent implements OnInit {
  activeStatus: string = 'yes';
  deptForm: FormGroup;
  spoc: any[] = [];
  deliveryManagers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private internalDeptService: InternalDeptService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.deptForm = this.fb.group({
      idm_unitname: ['', Validators.required],
      idm_unitsales: ['', Validators.required],
      idm_unitdelivery: ['', Validators.required],
      idm_unitsolution: ['', Validators.required],
      idm_spoc_id: [''],
      idm_deliverymanager_id: [''],
      idm_isactive: [true],
      idm_insertby: ['emp_10022025_01'],
      idm_updateby: ['emp_10022025_01']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.httpService.getEmployeeByRolesDetails().subscribe({
      next: (data) => {
        this.spoc = data.spoc;
        this.deliveryManagers = data.delivery_manager;
        console.log('SPOCs & Delivery Managers:', JSON.stringify(data));
      },
      error: (err) => console.error('Error fetching employee roles', err)
    });
  }

  onSubmit(): void {
    if (this.deptForm.valid) {
      this.httpService.postDepartment(this.deptForm.value).subscribe({
        next: (response) => {
          console.log('Department Added Successfully:', response);
          this.httpService.addDemand(response); // You might want to change this to addDepartment if available
          this.snackBar.open('✅ Department added successfully!', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.deptForm.reset();
          this.deptForm.patchValue({ idm_isactive: true, idm_insertby: 'emp_10022025_01', idm_updateby: 'emp_10022025_01' });
        },
        error: (error) => {
          console.error('Error adding department:', error);
          this.snackBar.open('❌ Failed to add department. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('⚠️ Please fill all required fields correctly.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }
  onCancel(): void {
    this.deptForm.reset();
    this.deptForm.patchValue({
      idm_isactive: true
    });
  }
}
