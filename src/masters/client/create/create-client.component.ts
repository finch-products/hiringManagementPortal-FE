import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientService } from '../../../app/services/client.service';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  clientForm: FormGroup;
  locations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private clientService: ClientService,
    private validatorsService: ValidatorsService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      clm_clientid: [''],
      clm_name: ['', [Validators.required, Validators.pattern(this.validatorsService.namePattern())]],
      clm_managername: ['', [Validators.pattern(this.validatorsService.namePattern())]],
      clm_clientemail: ['', [Validators.email]],
      clm_clientphone: ['', [Validators.pattern(this.validatorsService.phonePattern())]],
      clm_address: ['', [Validators.pattern(this.validatorsService.detailPattern())]],
      clm_lcm_id: [''],
      clm_isactive: [true],
      clm_insertby: ['emp_10022025_01']
    });
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.httpService.getLocationDetails().subscribe({
      next: (data) => {
        this.locations = data;
        console.log('Locations:', this.locations);
      },
      error: (err) => {
        console.error('Error fetching locations:', err);
        this.showError('❌ Failed to fetch locations.');
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formData = { ...this.clientForm.value };

      // Remove empty/null fields
      Object.keys(formData).forEach(key => {
        if (formData[key] === '' || formData[key] === null) {
          delete formData[key];
        }
      });

      console.log('Sending cleaned formData:', formData);

      this.httpService.postaddClient(formData).subscribe({
        next: (response) => {
          console.log('Client added successfully:', response);
          this.clientService.addClient(response);

          this.snackBar.open('✅ Client added successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
          });

          this.clientForm.reset();
          this.clientForm.patchValue({
            clm_isactive: true,
            clm_insertby: 'emp_10022025_01'
          });
        },
        error: (error) => {
          console.error('Error adding client:', error);
          this.showError(`❌ Failed to add client: ${error.message}`);
        }
      });
    } else {
      console.warn('Form is invalid.');
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
    this.clientForm.reset();
    this.clientForm.patchValue({
      clm_isactive: true,
      clm_insertby: 'emp_10022025_01'
    });
  }
}
