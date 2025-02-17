import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InternalDeptService } from '../../../app/services/internal.department.service';

@Component({
  selector: 'app-create-internal-department',
  templateUrl: './create-internal-department.component.html',
  styleUrls: ['./create-internal-department.component.scss']
})
export class CreateInternalDepartmentComponent implements OnInit {
  activeStatus: string = 'yes';
  practiceUnitForm: FormGroup;
  
  constructor(private fb: FormBuilder, private http: HttpClient, private internalDeptService: InternalDeptService) {
    this.practiceUnitForm = this.fb.group({
      idm_unitname: ['', Validators.required],
      idm_unitsales: ['', Validators.required],
      idm_unitdelivery: ['', Validators.required],
      idm_unitsolution: ['', Validators.required],
      idm_spoc_id: [''],
      idm_deliverymanager_id: [''],
      idm_isactive: [''],
      idm_insertby: [1],
      idm_updateby: [1]
    });
  }

  onSubmit() {
    if (this.practiceUnitForm.valid) {
      this.http.post('http://64.227.145.117/api/departments/', this.practiceUnitForm.value).subscribe({
        next: (response) => {
          console.log('Internal Dept added:', response);
          this.internalDeptService.addInternalDept(response); // Send to list component
          this.practiceUnitForm.reset();
        },
        error: (error) => console.error('Error adding Internal Dept:', error)
      });
    }
  }


  ngOnInit() { }
}
