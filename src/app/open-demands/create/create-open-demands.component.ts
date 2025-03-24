import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OpenDemandService } from '../../services/open.demand.service';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
@Component({
  selector: 'app-create-open-demands',
  templateUrl: './create-open-demands.component.html',
  styleUrls: ['./create-open-demands.component.scss']
})

export class CreateOpenDemandComponent implements OnInit {

  clients: any[] = [];
  locations: any[] = [];
  lobs: any[] = [];
  depts: any[] = [];

  demandForm: FormGroup;
  hiringManagerControl = new FormControl('');
  form!: FormGroup;

  selectedFile: File | null = null;
  newClient = { clm_name: '', clm_clientemail: '' };
  demands: any;
  selectedEmail: string = '';
  minDate: Date;
  filteredClients!: any;
  filteredLOBs!: Observable<any[]>;
  filteredDepts!: Observable<any[]>;

  isInternal: boolean = true;
  isEditMode: boolean = false;
  customEntryEnabled: boolean = false;
  isCustomManager: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private openDemandService: OpenDemandService,
    private httpService: HttpService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {


    this.minDate = new Date();

    this.demandForm = this.fb.group({
      isInternal: ['yes'],
      dem_id: [''],
      dem_updateby_id: [''],
      dem_ctoolnumber: [''],
      dem_ctooldate: [''],
      dem_clm_id: [''],
      clm_clientemail: [{ value: '', disabled: true }], // Initially disabled
      dem_lcm_id: [''],
      dem_validtill: [''],
      dem_skillset: [''],
      dem_lob_id: [''],
      dem_idm_id: [''],
      dem_position_name: [''],
      dem_positions: [''],
      dem_rrnumber: [''],
      dem_jrnumber: [''],
      dem_rrgade: [''],
      dem_gcblevel: [''],
      dem_jd: [''],
      dem_comment: [''],
      dem_isactive: [true],
      dem_insertby: ['emp_22032025_1'],
      dem_updateby: ['emp_22032025_1'],
      dem_mandatoryskill: [''],
      dem_position_location: [[]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadLOBs();
    this.loadLocations();
    this.loadInternalDepts();
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      if (demandId) {
        this.isEditMode = true;
        this.loadData(demandId);
      }
    })

    this.filteredClients = this.demandForm.get('dem_clm_id')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.clm_name || '')),
      map(name => this._filter(name)),
      map(filteredList => {
        return filteredList;
      })
    );
    this.filteredLOBs = this.demandForm.get('dem_lob_id')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.lob_name || '')),
      map(name => this._filterLOBs(name))
    );

    this.filteredDepts = this.demandForm.get('dem_idm_id')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.idm_unitname || '')),
      map(name => this._filterDepts(name))
    );


  }

  private _filter(name: string): any[] {
    if (!name) return this.clients;

    const filterValue = name.toLowerCase();

    return this.clients.filter(client => {
      const clientId = client.clm_id?.toString().toLowerCase() || '';
      const clientName = client.clm_name?.toLowerCase() || '';
      const managerName = client.clm_managername?.toLowerCase() || '';

      return clientId.includes(filterValue) || clientName.includes(filterValue) || managerName.includes(filterValue);
    });
  }

  private _filterLOBs(name: string): any[] {
    if (!name) return this.lobs; 
    const filterValue = name.toLowerCase();
    return this.lobs.filter(lob => lob.lob_name.toLowerCase().includes(filterValue));
  }

  private _filterDepts(name: string): any[] {
    if (!name) return this.depts;
    const filterValue = name.toLowerCase();
    return this.depts.filter(dept => dept.idm_unitname.toLowerCase().includes(filterValue));
  }

  displayClient(client: any): string {
    if (!client) return '';
    if (typeof client === 'string') return client;
    let clientId = client.clm_clientid ? client.clm_clientid + ' - ' : '';
    let clientName = client.clm_name ? client.clm_name : '';
    let managerName = client.clm_managername ? ' (' + client.clm_managername + ')' : '';

    return `${clientId}${clientName}${managerName}`.trim();

  }

  displayLOB(lob: any): string {
    if (!lob) return '';
    return typeof lob === 'object' ? lob.lob_name : lob; // Handle both object and ID
  }
  
  displayDept(dept: any): string {
    if (!dept) return '';
    return typeof dept === 'object' ? dept.idm_unitname : dept; // Handle both object and ID
  }

  onHiringManagerChange(event: MatAutocompleteSelectedEvent) {
    const selectedClient = event.option.value;
    if (selectedClient === 'custom') {
      this.customEntryEnabled = true;
      this.demandForm.controls['dem_clm_id'].setValue('Other (Enter New)');
      this.demandForm.get('clm_clientemail')?.enable();
      this.selectedEmail = '';
    } else {
      this.isCustomManager = false;
      this.demandForm.controls['dem_clm_id'].setValue(selectedClient);
      this.selectedEmail = selectedClient.clm_clientemail || '';
    }
  }
  onLOBChange(event: any): void {
    const selectedLOB = event.option.value;
    this.demandForm.controls['dem_lob_id'].setValue(selectedLOB);
    
  }

  onDeptChange(event: any): void {
    const selectedDept = event.option.value;
    this.demandForm.controls['dem_idm_id'].setValue(selectedDept);
  }
  checkCustomEntry() {
    if (this.customEntryEnabled) {
      this.demandForm.get('dem_clm_id')?.setValue('');
      this.demandForm.get('clm_clientemail')?.setValue(null); 
    }
  }

  addClient() {
    const clientName = this.demandForm.get('dem_clm_id')?.value;
    const clientEmail = this.demandForm.get('clm_clientemail')?.value;
    console.log("newClient",this.newClient)
    if (!clientName) {
      this.snackBar.open("Please enter valid details", "", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });

      return;
    }
     this.newClient = {
      clm_name: clientName,
      clm_clientemail: clientEmail
    };
    console.log("Submitting client data:",this.newClient)
    this.httpService.postaddClient(this.newClient).subscribe({
      next: (response: any) => {
        this.snackBar.open("Client added successfully!", "", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        const newClmId = response.clm_id;
        console.log("response",response)
        this.clients.push({ clm_id: newClmId, clm_name: this.newClient.clm_name, clm_clientemail: this.newClient.clm_clientemail });

        // Auto-select newly added client
        this.demandForm.get('dem_clm_id')?.setValue(clientName);
        this.demandForm.get('clm_clientemail')?.setValue(this.newClient.clm_clientemail);

        // Reset the input fields
        this.newClient = { clm_name: '', clm_clientemail: '' };
        this.customEntryEnabled = false;
      },
      error: (error: any) => {
        console.error('Error adding client:', error);
        this.snackBar.open("❌Failed to add client.", "", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        alert('Failed to add client.');
      }
    });
  }

  loadData(demandId: string) {
    this.httpService.getSingleDemandDetail(demandId).subscribe({
      next: (data) => {

        this.demands = data;

        this.demandForm.patchValue({
          isInternal: this.demands.isInternal,
          dem_id: this.demands.dem_id,
          dem_ctoolnumber: this.demands?.dem_ctoolnumber,
          dem_ctooldate: this.demands?.dem_ctooldate,
          dem_clm_id: this.demands.client_details,
          dem_lcm_id: this.demands.location_details?.lcm_id,
          dem_validtill: this.demands?.dem_validtill,
          dem_skillset: this.demands?.dem_skillset,
          dem_lob_id: this.demands.lob_details?.lob_id,
          dem_idm_id: this.demands.department_details?.idm_id,
          dem_position_name: this.demands?.dem_position_name,
          dem_positions: this.demands?.dem_positions,
          dem_rrnumber: this.demands?.dem_rrnumber,
          dem_jrnumber: this.demands?.dem_jrnumber,
          dem_rrgade: this.demands?.dem_rrgade,
          dem_gcblevel: this.demands?.dem_gcblevel,
          dem_isreopened: this.demands?.dem_isreopened,
          dem_isactive: this.demands?.dem_isactive,
          dem_comment: this.demands?.dem_comment,
          dem_position_location: this.demands?.dem_position_location
            ? this.demands.dem_position_location
            : []
        });
      },
      error: (err) => console.error('Error fetching a sinlge demand', err)
    })
  }

  loadClients(selectedId?: number): void {
    this.httpService.getClientDetails().subscribe((clients: any[]) => {
      this.clients = clients;

      this.filteredClients = this.demandForm.get('dem_clm_id')!.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.clm_name)),
        map(name => name ? this._filter(name) : [...this.clients])
      );
      if (selectedId) {
        const foundClient = clients.find(client => client.clm_id === selectedId);
        if (foundClient) {
          this.form.get('dem_clm_id')?.setValue(selectedId);
        }
      }
    });
  }


  loadLocations(): void {
    this.httpService.getLocationDetails().subscribe({
      next: (data) => {
        this.locations = data;
        console.log('Locations:', this.locations);
      },
      error: (err) => console.error('Error fetching locations', err)
    });
  }

  loadLOBs(): void {
    this.httpService.getLOBDetails().subscribe({
      next: (data) => {
        this.lobs = data;
        console.log('LOBs:', this.lobs);
        this.filteredLOBs = this.demandForm.get('dem_lob_id')!.valueChanges.pipe(
          startWith(''), // Initialize with empty string
          map(value => (typeof value === 'string' ? value : value?.lob_name || '')),
          map(name => this._filterLOBs(name))
        );
      },
      error: (err) => console.error('Error fetching lobs', err)
    });
  }

  loadInternalDepts(): void {
    this.httpService.getDeptsDetails().subscribe({
      next: (data) => {
        this.depts = data;
        console.log('Departments:', this.depts);
        this.filteredDepts = this.demandForm.get('dem_idm_id')!.valueChanges.pipe(
          startWith(''), // Initialize with empty string
          map(value => (typeof value === 'string' ? value : value?.idm_unitname || '')),
          map(name => this._filterDepts(name))
        );
      },
      error: (err) => console.error('Error fetching departments', err)
    });
  }

  onBlur(controlName: string) {
    const control = this.demandForm.get(controlName);
    if (control) {
      const currentValue = control.value;
      let isValid = false;
  
      switch (controlName) {
        case 'dem_clm_id':
          // Compare display value of the selected client with the list of clients
          isValid = this.clients.some(client => this.displayClient(client) === this.displayClient(currentValue));
          break;
        case 'dem_lob_id':
          // Compare display value of the selected LOB with the list of LOBs
          isValid = this.lobs.some(lob => this.displayLOB(lob) === this.displayLOB(currentValue));
          break;
        case 'dem_idm_id':
          // Compare display value of the selected department with the list of departments
          isValid = this.depts.some(dept => this.displayDept(dept) === this.displayDept(currentValue));
          break;
      }
  
      // If the value is not valid, reset the control to null
      if (!isValid) {
        control.setValue(null);
      }
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    const updatedFields: any = {};
    const formData = new FormData();

    if (this.isEditMode) {
      updatedFields["dem_id"] = this.demandForm.value.dem_id;
      updatedFields["dem_updateby_id"] = 'emp_11022025_02';

      Object.keys(this.demandForm.controls).forEach((field) => {
        if (this.demandForm.controls[field].dirty) {
          updatedFields[field] = this.demandForm.value[field];
          let value = this.demandForm.value[field];

          if (field === "dem_lob_id" && typeof value === "object") {
            value = value.lob_id;
          }
          if (field === "dem_idm_id" && typeof value === "object") {
            value = value.idm_id;
          }

          if (field === "dem_position_location" && Array.isArray(value)) {
            value = JSON.stringify(value);
          }
          updatedFields[field] = value;
        }
      });

      if (this.selectedFile) {
        formData.append("job_description", this.selectedFile);
      }

      console.log("Final Update Request Body:", updatedFields);
      this.httpService.updateDemand(updatedFields).subscribe({
        next: (response) => {
          this.snackBar.open("✅ Demand Updated Successfully!", "", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/list']);
        },
        error: (error) => {
          this.snackBar.open("❌ Failed to update demand. Check console for details.", "", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });

    } else {
      // 🟢 Create Mode: Send all fields
      Object.keys(this.demandForm.value).forEach(key => {
        let value = this.demandForm.value[key];

        // Format date fields
        if (value instanceof Date) {
          value = this.formatDate(value);
        }

        if (key === "dem_lob_id" && typeof value === "object") {
          value = value.lob_id;
        }
        if (key === "dem_idm_id" && typeof value === "object") {
          value = value.idm_id;
        }

        if (key === "dem_clm_id" && typeof value === "object" && value !== null) {
          value = value.clm_id; // Extract only the ID
        }

        // ✅ Convert multi-select field to JSON array
        if (key === "dem_position_location" && Array.isArray(value)) {
          value = JSON.stringify(value);
        }
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      // Append file if available
      if (this.selectedFile) {
        formData.append("job_description", this.selectedFile);
      }

      console.log("Final Create Request Body:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.httpService.addDemand(formData).subscribe({
        next: (response) => {
          const demId = response.dem_id;
          this.snackBar.open(`✅ Demand ${demId} Added Successfully!`, "Close", {
            duration: 4000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'

          });

          this.openDemandService.addDemand(response);
          this.demandForm.reset();
          this.router.navigate(['/list']);
        },

        error: (error) => {
          const errorMessage = error?.error?.message || error.message || 'Something went wrong';
          console.error("Create Demand Error:", error);

          this.snackBar.open("❌ Failed to add demand: ${errorMessage", "Close", {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'

          });

        }
      });
    }
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}T00:00:00Z`;
  }


  navigateToClientMaster() {
    this.router.navigate(['client-master']);
  }

  cancel() {
    this.router.navigate(['entry']);
  }
}