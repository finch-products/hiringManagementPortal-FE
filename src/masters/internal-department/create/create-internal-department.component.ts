import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InternalDeptService } from '../../../app/services/internal.department.service';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'app-create-internal-department',
  templateUrl: './create-internal-department.component.html',
  styleUrls: ['./create-internal-department.component.scss']
})
export class CreateInternalDepartmentComponent implements OnInit {
  activeStatus: string = 'yes';
  deptForm: FormGroup;
  spoc:any[]=[];
  deliveryManagers: any[] = [];
  spocs: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private internalDeptService: InternalDeptService, private httpService: HttpService) {
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

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.httpService.getEmployeeByRolesDetails().subscribe({
      next: (data) => {
        this.spoc = data.spoc;
        this.deliveryManagers = data.delivery_manager;
        console.log('Client Partners & Delivery Managers:' + JSON.stringify(data));
      },
      error: (err) => console.error('Error fetching CP DM', err)
    });
  }

  onSubmit() {
    if (this.deptForm.valid) {
      this.httpService.postDepartment(this.deptForm.value).subscribe({
        next: (response) => {
          console.log('Department Added Successfully:', response);
          this.httpService.addDemand(response);
          this.deptForm.reset();
        },
        error: (error) => {
          console.error('Error adding demands:', error);
          alert('Failed to add department. Check console for details.');
        }
      });
    }

  }
}
