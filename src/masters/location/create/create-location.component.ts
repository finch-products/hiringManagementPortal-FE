import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../../../app/services/location.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/services/http.service';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss']
})
export class CreateLocationComponent implements OnInit {
  locationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private locationService: LocationService,
    private snackBar: MatSnackBar,
    private httpService: HttpService
  ) {
    this.locationForm = this.fb.group({
      lcm_name: ['', Validators.required],
      lcm_state: ['', Validators.required],
      lcm_country: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  onSubmit(form: FormGroupDirective): void {
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      this.httpService.postaddLocation(formData).subscribe({
        next: (response) => {
          console.log('Location added:', response);
          this.locationService.addLocation(response);
          this.snackBar.open('✅ Location added successfully!', 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.locationForm.reset();
          form.resetForm();
        },
        error: (error) => {
          console.error('Error adding location:', error);
          this.snackBar.open('❌ Failed to add location. Please try again.', 'Close', {
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
    this.locationForm.reset({ lcm_isactive: true });
  }
}
