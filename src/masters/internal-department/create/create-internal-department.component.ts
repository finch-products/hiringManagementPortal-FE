import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InternalDeptService } from '../../../app/services/internal.department.service';
import { HttpService } from '../../../app/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-create-internal-department',
  templateUrl: './create-internal-department.component.html',
  styleUrls: ['./create-internal-department.component.scss']
})

export class CreateInternalDepartmentComponent implements OnInit {

  activeStatus: string = 'yes';

  deptForm: FormGroup;
  spocFilterControl = new FormControl('');
  deliveryManagerFilterControl = new FormControl('');

  spoc: any[] = [];
  deliveryManagers: any[] = [];

  filteredSpocs!: Observable<any[]>;
  filteredDeliveryManagers!: Observable<any[]>;

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
      idm_insertby: ['emp_1'],
      idm_updateby: ['emp_1']
    });

  }

  ngOnInit(): void {
    this.loadEmployees();
    this.filteredSpocs = this.spocFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployees(value || '', this.spoc))
    );
    this.filteredDeliveryManagers = this.deliveryManagerFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployees(value || '', this.deliveryManagers))
    );
  }

  loadEmployees(): void {
    this.httpService.getEmployeeByRolesDetails().subscribe({
      next: (data) => {
        this.spoc = data.spoc;
        this.deliveryManagers = data.delivery_manager;
        this.filteredSpocs = this.spocFilterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterEmployees(value || '', this.spoc))
        );
        this.filteredDeliveryManagers = this.deliveryManagerFilterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterEmployees(value || '', this.deliveryManagers))
        );
      },
      error: (err) => console.error('Error fetching employee roles', err)
    });
  }

  private _filterEmployees(value: string, employees: any[]): any[] {
    const filterValue = value.toLowerCase();
    return employees.filter(emp => emp.emp_name.toLowerCase().includes(filterValue));
  }

  onSpocSelected(event: any): void {
    const selectedSpoc = this.spoc.find(emp => emp.emp_name === event.option.value);
    if (selectedSpoc) {
      this.deptForm.patchValue({ idm_spoc_id: selectedSpoc.emp_id });
      this.spocFilterControl.setValue(selectedSpoc.emp_name, { emitEvent: false });
    }
  }

  onSpocBlur(): void {
    const inputValue = this.spocFilterControl.value;
    const selectedSpoc = this.spoc.find(emp => emp.emp_name === inputValue);
    if (!selectedSpoc) {
      this.spocFilterControl.setValue('');
      this.deptForm.patchValue({ idm_spoc_id: '' });
    }
  }

  onDeliveryManagerSelected(event: any): void {
    const selectedDeliveryManager = this.deliveryManagers.find(emp => emp.emp_name === event.option.value);
    if (selectedDeliveryManager) {
      this.deptForm.patchValue({ idm_deliverymanager_id: selectedDeliveryManager.emp_id });
      this.deliveryManagerFilterControl.setValue(selectedDeliveryManager.emp_name, { emitEvent: false });
    }
  }

  onDeliveryManagerBlur(): void {
    const inputValue = this.deliveryManagerFilterControl.value;
    const selectedDeliveryManager = this.deliveryManagers.find(emp => emp.emp_name === inputValue);
    if (!selectedDeliveryManager) {
      this.deliveryManagerFilterControl.setValue('');
      this.deptForm.patchValue({ idm_deliverymanager_id: '' });
    }
  } 
  onSubmit(form: FormGroupDirective): void {
    if (this.deptForm.valid) {
      console.log("payload :",this.deptForm.value)
          const spocName = this.spocFilterControl.value;
          const deliveryManagerName = this.deliveryManagerFilterControl.value;
          this.httpService.postDepartment(this.deptForm.value).subscribe({
        next: (response) => {
            // Enrich the response to pass emp_name for listing/display purposes
            const enrichedDepartment = {
              ...response,
              idm_spoc_id: {
                emp_id: this.deptForm.value.idm_spoc_id,
                emp_name: spocName
              },
              idm_deliverymanager_id: {
                emp_id: this.deptForm.value.idm_deliverymanager_id,
                emp_name: deliveryManagerName
              }
            };
            console.log(enrichedDepartment);
          this.internalDeptService.addInternalDept(enrichedDepartment);
          this.snackBar.open('✅ Department added successfully!', '', {
            duration: 4000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.deptForm.reset();
          form.resetForm();
          this.spocFilterControl.setValue('');
          this.deliveryManagerFilterControl.setValue('');
          this.deptForm.patchValue({ idm_isactive: true, idm_insertby: 'emp_1', idm_updateby: 'emp_1' });
        },
        error: (error) => {
          console.error('Error adding department:', error);
          this.snackBar.open('❌ Failed to add department. Please try again.', '', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('⚠ Please fill all required fields correctly.', '', {
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
      idm_isactive: true,
      idm_insertby: 'emp_1',
      idm_updateby: 'emp_1'
    });
  
    this.deptForm.markAsPristine();
    this.deptForm.markAsUntouched();
  
    this.spocFilterControl.setValue('');
    this.deliveryManagerFilterControl.setValue('');
  }

}