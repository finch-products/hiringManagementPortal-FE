import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective , AbstractControl, ValidationErrors} from '@angular/forms';
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
      lcm_name: ['', [Validators.required, this.stringOnlyValidator]],
      lcm_state: ['', [Validators.required, this.stringOnlyValidator]],
      lcm_country: ['', [Validators.required, this.stringOnlyValidator]],
    });  
  }
  
  stringOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string' || /\d/.test(value)) {
      return { stringOnly: true }; 
    }
    return null;
  }
  ngOnInit(): void {
    this.locationForm.valueChanges.subscribe(() => {
      console.log('Location Form Errors:', this.locationForm.errors);
    });
  }

  onSubmit(form: FormGroupDirective): void {
    if (this.locationForm.valid) {
      this.httpService.postaddLocation(this.locationForm.value).subscribe({
        next: (response) => {
          console.log('Location added:', response);
          this.locationService.addLocation(response);
          this.snackBar.open('✅ Location added successfully!', '', {
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
          this.handleFieldErrors(error);
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

  onCancel(): void {
    this.locationForm.reset({ lcm_isactive: true });
  }

  private handleFieldErrors(error: any): void {
    console.log("Full error object:", error);

    if (error && typeof error === 'object') {
        Object.keys(error).forEach(field => {
            const fieldErrors = error[field];

            if (this.locationForm.controls[field] && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                const errorMessage = fieldErrors[0];
                
                // Ensure setErrors is setting a string, not an object
                this.locationForm.controls[field].setErrors({ serverError: errorMessage });

                console.log(`Set error for ${field}:`, errorMessage);
                console.log(`Final error for ${field}:`, typeof errorMessage, errorMessage);

            } else {
                console.warn(`Field not found in form or no valid errors: ${field}`);
            }
        });
    } else {
        this.showError('❌ Failed to add location: An unknown error occurred.');
    }
}
}
