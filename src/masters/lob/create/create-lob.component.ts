import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LobService } from '../../../app/services/lob.service';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'app-create-lob',
  templateUrl: './create-lob.component.html',
  styleUrls: ['./create-lob.component.scss']
})
export class CreateLOBComponent implements OnInit {
  lobForm: FormGroup;
  clientPartners: any[] = []; 
  deliveryManagers: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private lobService: LobService, private httpService: HttpService) {
    this.lobForm = this.fb.group({
      lob_name: ['', Validators.required],
      lob_description: [''],
      lob_clientpartner: ['', Validators.required],
      lob_deliverymanager: ['', Validators.required],
      lob_insertby: ['emp_10022025_01'],
      lob_updateby: ['emp_10022025_01']
    });
  }

  ngOnInit(): void {
    this.loadEmpByRoles();
  }

  loadEmpByRoles(): void {
    this.httpService.getEmployeeByRolesDetails().subscribe({
      next: (data) => {
        this.clientPartners = data.client_partner;
        this.deliveryManagers = data.delivery_manager;
        console.log('Client Partners & Delivery Managers:' + JSON.stringify(data));
      },
      error: (err) => console.error('Error fetching CP DM', err)
    });
  }

  onSubmit() {
    if (this.lobForm.valid) {
      this.http.post('http://64.227.145.117/api/lobs/', this.lobForm.value).subscribe({
        next: (response) => {
          console.log('Client added:', response);
          this.lobService.addLob(response);
          this.lobForm.reset();
        },
        error: (error) => console.error('Error adding client:', error)
      });
    }
  }
}
