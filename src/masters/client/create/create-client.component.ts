import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormControl, FormGroupDirective} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientService } from '../../../app/services/client.service';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {

  clientForm: FormGroup;
  locationFilterControl = new FormControl('');

  locations: any[] = [];
  filteredLocations!: Observable<any[]>;
  selectedLogo: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;

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
      clm_insertby: ['emp_1']
    });

  }

  ngOnInit(): void {
    this.loadLocations();
    this.filteredLocations = this.locationFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLocations(value || ''))
    );
  }

  loadLocations(): void {
    this.httpService.getLocationDetails().subscribe({
      next: (data) => {
        this.locations = data;
        this.locationFilterControl.setValue('');
      },
      error: (err) => {
        console.error('Error fetching locations:', err);
        this.showError('❌ Failed to fetch locations.');
      }
    });
  }

  // Add this to your component if not already present
  initLocationFilter(): void {
  this.filteredLocations = this.locationFilterControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filterLocations(value || ''))
  );
}

private _filterLocations(value: string): any[] {
  const filterValue = value.toLowerCase();
  return this.locations.filter(location => 
    location.lcm_name.toLowerCase().includes(filterValue)
  );
}
  onLocationSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value;
    const selectedLocation = this.locations.find(loc => loc.lcm_name === selectedValue);
    
    if (selectedLocation) {
      // Update the form with the selected location's ID
      this.clientForm.patchValue({ clm_lcm_id: selectedLocation.lcm_id });
    }
  }
  
  onLocationInput(event: any): void {
    const inputValue = event.target.value;
    
    // If the input is empty, clear the location ID
    if (!inputValue) {
      this.clientForm.patchValue({ clm_lcm_id: '' });
    }
  }
  
  onLocationBlur(): void {
    // If the input value doesn't match any location, reset the field
    const inputValue = this.locationFilterControl.value;
    
    if (inputValue) {
      const selectedLocation = this.locations.find(loc => loc.lcm_name === inputValue);
      if (!selectedLocation) {
        this.locationFilterControl.setValue('');
        this.clientForm.patchValue({ clm_lcm_id: '' });
      }
    }
  }

  onLogoSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/*/)) {
        this.showError('Only image files are allowed');
        return;
      }
      
      // Validate file size (optional, e.g., 2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        this.showError('File size should be less than 2MB');
        return;
      }
  
      this.selectedLogo = file;
  
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeLogo(): void {
    this.selectedLogo = null;
    this.logoPreview = null;
    // Clear the file input value to allow re-selecting the same file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(form: FormGroupDirective): void {
    if (this.clientForm.valid) {
      const formData = new FormData();
  
      if (this.selectedLogo) {
        formData.append('clm_logo', this.selectedLogo, this.selectedLogo.name);
      }
  
      // Append all form fields
      Object.entries(this.clientForm.value).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append all form fields manually
      Object.entries(this.clientForm.value).forEach(([key, value]) => {
     if (value !== '' && value !== null && value !== undefined) {
    // If it's a file or Blob (e.g., for clm_logo), append it with filename
     if (key === 'clm_logo' && value instanceof File) {
      formData.append(key, value, value.name);
    } else {
      formData.append(key, value.toString());
    }
  }
});
      this.httpService.postaddClient(formData).subscribe({
        next: (response) => {
          this.clientService.addClient(response);
          this.snackBar.open('✅ Client added successfully!', '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
          });
  
          form.resetForm();
          this.removeLogo(); 
          this.clientForm.patchValue({
            clm_isactive: true,
            clm_insertby: 'emp_3'
          });
          this.locationFilterControl.setValue('');
        },
        error: (error) => {
          console.error('Error adding client:', error);
          this.handleFieldErrors(error.error);
        }
      });
    } else {
      this.showError('⚠ Please fill all required fields correctly.');
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
    this.clientForm.reset();
    this.clientForm.patchValue({
      clm_isactive: true,
      clm_insertby: 'emp_3'
    });
    this.clientForm.markAsPristine(); // Mark the form as pristine
    this.clientForm.markAsUntouched();
    this.locationFilterControl.setValue('');
    this.removeLogo(); 
  }
  
  private handleFieldErrors(error: any): void {
    console.log("Full error object:", error);

    if (error && typeof error === 'object') {
        Object.keys(error).forEach(field => {
            const fieldErrors = error[field];

            if (this.clientForm.controls[field] && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                const errorMessage = fieldErrors[0];
                
                // Ensure setErrors is setting a string, not an object
                this.clientForm.controls[field].setErrors({ serverError: errorMessage });

                console.log(`Set error for ${field}:`, errorMessage);
                console.log(`Final error for ${field}:, typeof errorMessage`, errorMessage);

            } else {
                console.warn(`Field not found in form or no valid errors: ${field}`);
            }
        });
    } else {
        this.showError('❌ Failed to add client: An unknown error occurred.');
    }
}

}