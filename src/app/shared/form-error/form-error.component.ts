import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss']
})
export class FormErrorComponent implements OnChanges {
  @Input() errors: any;
  @Input() fieldType: string = '';
  
  message: string = "";

  ngOnChanges(): void {
    if (!this.errors || Object.keys(this.errors).length === 0) {
      this.message = "";
      return;
    }

    if (this.fieldType === 'phone') {
      this.handlePhoneNumberErrors();
    } else {
      this.handleGeneralErrors();
    }
  }

  private handlePhoneNumberErrors(): void {
    if (this.errors.required) {
      this.message = "This field is required.";
    } else if (this.errors.pattern) {
      this.message = "Enter a valid phone number.";
    } else if (this.errors.serverError) {
      this.message = this.errors.serverError; // Display server error
    } else {
      this.message = JSON.stringify(this.errors); // Convert unknown errors to readable format
    }
  }

  private handleGeneralErrors(): void {
    if (this.errors.required) {
      this.message = "This field is required.";
    } else if (this.errors.email) {
      this.message = "Invalid email format.";
    } else if (this.errors.pattern) {
      this.message = "Invalid format.";
    } else if (this.errors.serverError) {
      this.message = this.errors.serverError; // Display server error
    } else {
      this.message = JSON.stringify(this.errors); // Convert unknown errors to readable format
    }
  }
}
