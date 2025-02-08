import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent implements OnChanges  {
  @Input() errors: any;
  @Input() fieldType: string = '';
  
  message: string = "";
  ngOnChanges(): void {
    if (!this.errors) {
      this.message = "";
      return;
      alert(this.errors)
    }

    if (this.fieldType === 'phone') {
      alert(this.fieldType)
      this.handlePhoneNumberErrors();
    } else {
      this.handleGeneralErrors();
    }
  }

  private handlePhoneNumberErrors(): void {
    if (this.errors.required) {
      this.message = "This field is required.";
    } else if (this.errors.pattern) {
      this.message = "Enter valid phone number.";
    } else {
      this.message = this.errors;
    }
  }

  private handleGeneralErrors(): void {
    if (this.errors.required) {
      this.message = "This field is required.";
    } else if (this.errors.email) {
      this.message = "Invalid email.";
    } else if (this.errors.pattern) {
      this.message = "Invalid format.";
    } else {
      this.message = this.errors;
    }
  }
}


