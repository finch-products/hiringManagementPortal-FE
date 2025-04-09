import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LobService } from '../../../app/services/lob.service';
import { HttpService } from '../../../app/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-lob',
  templateUrl: './create-lob.component.html',
  styleUrls: ['./create-lob.component.scss']
})

export class CreateLOBComponent implements OnInit {
  lobForm: FormGroup;
  clientPartnerFilterControl = new FormControl('');
  deliveryManagerFilterControl = new FormControl('');

  clientPartners: any[] = [];
  deliveryManagers: any[] = [];

  filteredClientPartners!: Observable<any[]>;
  filteredDeliveryManagers!: Observable<any[]>;
 

  constructor(private fb: FormBuilder, private http: HttpClient, private lobService: LobService, private httpService: HttpService, private snackBar: MatSnackBar) {
    this.lobForm = this.fb.group({
      lob_name: ['', Validators.required],
      lob_description: [''],
      lob_clientpartner: ['', Validators.required],
      lob_deliverymanager: ['', Validators.required],
      lob_insertby: ['emp_22032025_1'],
      lob_updateby: ['emp_22032025_1']
    });
  }

  ngOnInit(): void {
    this.loadEmpByRoles();
    this.filteredClientPartners = this.clientPartnerFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClientPartners(value || ''))
    );
    this.filteredDeliveryManagers = this.deliveryManagerFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDeliveryManagers(value || ''))
    );
  }

  loadEmpByRoles(): void {
    this.httpService.getEmployeeByRolesDetails().subscribe({
      next: (data) => {

        this.clientPartners = data.client_partner;
        this.deliveryManagers = data.delivery_manager;

        this.filteredClientPartners = this.clientPartnerFilterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterClientPartners(value || ''))
        );
        this.filteredDeliveryManagers = this.deliveryManagerFilterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterDeliveryManagers(value || ''))
        );
      },
      error: (err) => {
        console.error('Error fetching CP & DM:', err);
        this.showError('❌ Failed to fetch Client Partners and Delivery Managers.');
      }
    });
  }

  private _filterClientPartners(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.clientPartners.filter(cp => cp.emp_name.toLowerCase().includes(filterValue));
  }

  private _filterDeliveryManagers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.deliveryManagers.filter(dm => dm.emp_name.toLowerCase().includes(filterValue));
  }

  onClientPartnerSelected(event: any): void {
    const selectedClientPartner = this.clientPartners.find(cp => cp.emp_name === event.option.value);
    if (selectedClientPartner) {
      this.lobForm.patchValue({ lob_clientpartner: selectedClientPartner.emp_id });
      this.clientPartnerFilterControl.setValue(selectedClientPartner.emp_name, { emitEvent: false });
    }
  }

  onDeliveryManagerSelected(event: any): void {
    const selectedDeliveryManager = this.deliveryManagers.find(dm => dm.emp_name === event.option.value);
    if (selectedDeliveryManager) {
      this.lobForm.patchValue({ lob_deliverymanager: selectedDeliveryManager.emp_id });
      this.deliveryManagerFilterControl.setValue(selectedDeliveryManager.emp_name, { emitEvent: false });
    }
  }

  onClientPartnerBlur(): void {
    const inputValue = this.clientPartnerFilterControl.value;
    const selectedClientPartner = this.clientPartners.find(cp => cp.emp_name === inputValue);
    if (!selectedClientPartner) {
      this.clientPartnerFilterControl.setValue('');
      this.lobForm.patchValue({ lob_clientpartner: '' });
    }
  }

  onDeliveryManagerBlur(): void {
    const inputValue = this.deliveryManagerFilterControl.value;
    const selectedDeliveryManager = this.deliveryManagers.find(dm => dm.emp_name === inputValue);
    if (!selectedDeliveryManager) {
      this.deliveryManagerFilterControl.setValue('');
      this.lobForm.patchValue({ lob_deliverymanager: '' });
    }
  }

  onSubmit(form: FormGroupDirective) {
    if (this.lobForm.valid) {
      const formData = this.lobForm.value;

      Object.keys(formData).forEach(key => {
        if (formData[key] === '' || formData[key] === null) {
          delete formData[key];
        }
      });
      this.httpService.postaddLOB(formData).subscribe({
        next: (response) => {
          const enrichedLob = {
            ...response,
            lob_clientpartner: {
                emp_id: this.lobForm.value.lob_clientpartner,
                emp_name: this.clientPartnerFilterControl.value
            },
            lob_deliverymanager: {
                emp_id: this.lobForm.value.lob_deliverymanager,
                emp_name: this.deliveryManagerFilterControl.value
            },
            lob_insertby_id: {
                emp_id: 'emp_22032025_1',
                emp_name: 'System User' // Or whatever name you want to display
            },
            lob_updateby_id: {
                emp_id: 'emp_22032025_1',
                emp_name: 'System User'
            }
        };
        
        this.lobService.addLob(enrichedLob);
          this.snackBar.open('✅ LOB added successfully!', '', {
            duration: 4000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.lobForm.reset();
          form.resetForm();
          this.clientPartnerFilterControl.reset();
          this.deliveryManagerFilterControl.reset();
          this.lobForm.patchValue({
            lob_insertby: 'emp_22032025_1',
            lob_updateby: 'emp_22032025_1'
          });
        },
        error: (error) => {
          console.error('Error adding LOB:', error);
          this.showError(`❌ Failed to add LOB. ${error.message || 'Please try again.'}`);
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
    this.lobForm.reset();
    this.clientPartnerFilterControl.reset();
    this.deliveryManagerFilterControl.reset();
  }
}