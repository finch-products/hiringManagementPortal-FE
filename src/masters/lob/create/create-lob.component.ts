import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LobService } from '../../../app/services/lob.service';
import { HttpService } from '../../../app/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-lob',
  templateUrl: './create-lob.component.html',
  styleUrls: ['./create-lob.component.scss']
})
export class CreateLOBComponent implements OnInit {
  lobForm: FormGroup;
  clientPartners: any[] = [];
  deliveryManagers: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private lobService: LobService, private httpService: HttpService, private snackBar: MatSnackBar) {
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
      const formData = this.lobForm.value;

      // Remove empty fields
      Object.keys(formData).forEach(key => {
        if (formData[key] === '' || formData[key] === null) {
          delete formData[key];
        }
      });
      this.httpService.postaddLOB(formData).subscribe({
        next: (response) => {
          console.log('Lob added:', response);
          this.lobService.addLob(response);
          this.snackBar.open('LOB added successfully!', 'Close', {
            duration: 3000, // 3 seconds
            verticalPosition: 'top' // Optional: top/bottom
          });
          this.lobForm.reset();
        },
        error: (error) => {
          console.error('Error adding client:', error);
          this.snackBar.open('Failed to add client. Try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });

    } else {
      console.warn('Form is invalid. Please check all fields.');
      this.snackBar.open('Please fill all required fields correctly.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }
}
