import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { OpenDemandService } from '../../services/open.demand.service';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-create-open-demands',
  templateUrl: './create-open-demands.component.html',
  styleUrls: ['./create-open-demands.component.scss']
})
export class CreateOpenDemandComponent implements OnInit {
  demandForm: FormGroup;
  clients: any[] = [];
  locations: any[] = [];
  lobs: any[] = [];
  depts: any[] = [];
  selectedFile: File | null = null;
  isInternal = true;
  isEditMode: boolean = false;
  demands: any;
  customEntryEnabled = false;
  newClient = { clm_name: '', clm_clientemail: '' };
  hiringManagerControl = new FormControl('');
  form!: FormGroup;
  minDate: Date;
  selectedEmail: string = '';  // To hold the selected email
  isCustomManager: boolean = false;
  filteredClients!: any;
  filteredLOBs!: Observable<any[]>;
  filteredDepts!: Observable<any[]>;

  constructor(private fb: FormBuilder, private http: HttpClient, private openDemandService: OpenDemandService, private httpService: HttpService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
    this.minDate = new Date();
    console.log(this.minDate)
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
      // dem_isreopened: ['no'],
      dem_isactive: [true],
      dem_insertby: ['emp_10022025_01'],
      dem_updateby: ['emp_10022025_01'],
      dem_mandatoryskill: [''],
      dem_position_location: [[]]
    });
  }

  ngOnInit(): void {
    // Initialize form
    this.form = this.fb.group({
      dem_clm_id: [null]
    });
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      if (demandId) {
        this.isEditMode = true;
        // console.log("editmode", this.isEditMode)
        this.loadData(demandId);
      }
    })
    this.loadClients();
    this.loadLocations();
    this.loadLOBs();
    this.loadInternalDepts();
    this.demandForm.get('isInternal')?.valueChanges.subscribe(value => {
      this.isInternal = value === 'yes';
    });
    this.filteredClients = this.demandForm.get('dem_clm_id')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.clm_name || '')),
      map(name => this._filter(name)),
      map(filteredList => {
        console.log('Filtered Clients:', filteredList); // Debugging
        return filteredList;
      })
    );
    this.filteredLOBs = this.demandForm.get('dem_lob_id')!.valueChanges.pipe(
      startWith(''), // Initialize with empty string
      map(value => (typeof value === 'string' ? value : value?.lob_name || '')),
      map(name => this._filterLOBs(name))
    );

    this.filteredDepts = this.demandForm.get('dem_idm_id')!.valueChanges.pipe(
      startWith(''), // Initialize with empty string
      map(value => (typeof value === 'string' ? value : value?.idm_unitname || '')),
      map(name => this._filterDepts(name))
    );


  }
  private _filter(name: string): any[] {
    if (!name) return this.clients; // Return full list if input is empty

    const filterValue = name.toLowerCase();

    return this.clients.filter(client => {
      // Ensure all values are strings before calling `toLowerCase()`
      const clientId = client.clm_id?.toString().toLowerCase() || '';
      const clientName = client.clm_name?.toLowerCase() || '';
      const managerName = client.clm_managername?.toLowerCase() || '';

      return clientId.includes(filterValue) || clientName.includes(filterValue) || managerName.includes(filterValue);
    });
  }

  private _filterLOBs(name: string): any[] {
    if (!name) return this.lobs; // Return full list if input is empty
    const filterValue = name.toLowerCase();
    return this.lobs.filter(lob => lob.lob_name.toLowerCase().includes(filterValue));
  }

  private _filterDepts(name: string): any[] {
    if (!name) return this.depts; // Return full list if input is empty
    const filterValue = name.toLowerCase();
    return this.depts.filter(dept => dept.idm_unitname.toLowerCase().includes(filterValue));
  }
  displayClient(client: any): string {
    console.log("client received in displayClient:", client);
    if (!client) return '';
    if (typeof client === 'string') return client; // If it's a string, return as is
    // return `${client.clm_clientid} - ${client.clm_name} (${client.clm_managername})`;
    
  let clientId = client.clm_clientid ? client.clm_clientid + ' - ' : '';
  let clientName = client.clm_name ? client.clm_name : '';
  let managerName = client.clm_managername ? ' (' + client.clm_managername + ')' : '';

  return `${clientId}${clientName}${managerName}`.trim();

  }

  displayLOB(lob: any): string {
    return lob && lob.lob_name ? lob.lob_name : '';
  }

  displayDept(dept: any): string {
    return dept && dept.idm_unitname ? dept.idm_unitname : '';
  }

  onHiringManagerChange(event: MatAutocompleteSelectedEvent) {
    const selectedClient = event.option.value;
    if (selectedClient === 'custom') {
      this.customEntryEnabled = true;
      this.demandForm.controls['dem_clm_id'].setValue('Other (Enter New)');
      this.selectedEmail = '';
    } else {
      this.isCustomManager = false;
      this.demandForm.controls['dem_clm_id'].setValue(selectedClient); // Store the full object
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

  // Add new client
  addClient() {
    if (!this.newClient.clm_name || !this.newClient.clm_clientemail) {
      alert('Please enter valid details.');
      return;
    }

    this.httpService.postaddClient(this.newClient).subscribe({
      next: (response: any) => {
        alert('Client added successfully!');
        const newClmId = response.clm_id;

        // Add new client to the list
        this.clients.push({ clm_id: newClmId, clm_name: this.newClient.clm_name, clm_clientemail: this.newClient.clm_clientemail });

        // Auto-select newly added client
        this.demandForm.get('dem_clm_id')?.setValue(newClmId);
        this.demandForm.get('clm_clientemail')?.setValue(this.newClient.clm_clientemail);

        // Reset the input fields
        this.newClient = { clm_name: '', clm_clientemail: '' };
        this.customEntryEnabled = false;
      },
      error: (error: any) => {
        console.error('Error adding client:', error);
        alert('Failed to add client.');
      }
    });
  }

  loadData(demandId: string) {
    this.httpService.getSingleDemandDetail(demandId).subscribe({
      next: (data) => {
        this.demands = data;
        console.log("demands", this.demands)
        console.log("active", this.demands.dem_isactive)
        console.log("Client Details:", this.demands.client_details);
        this.demandForm.patchValue({
          isInternal: this.demands.isInternal,
          dem_id: this.demands.dem_id,
          // dem_updateby_id:this.demands.updateby_id,
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
        console.log("Set dem_clm_id to:", data.client_details.clm_id);
        //Ensure correct visibility for RR/JR fields
        this.isInternal = data.isInternal === 'yes';
        console.log("Clients list after setting value:", this.demands);
      },
      error: (err) => console.error('Error fetching a sinlge demand', err)
    })
  }

  loadClients(selectedId?: number): void {
    this.httpService.getClientDetails().subscribe((clients: any[]) => {
      this.clients = clients; // Assuming 'clients' holds the client list used in form dropdown

      this.filteredClients = this.demandForm.get('dem_clm_id')!.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.clm_name)),
        map(name => name ? this._filter(name) : [...this.clients])
      );
      if (selectedId) {
        const foundClient = clients.find(client => client.clm_id === selectedId);
        if (foundClient) {
          console.log("auto selecting :", foundClient)
          this.form.get('dem_clm_id')?.setValue(selectedId); // Set form value only if found
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
          isValid = this.clients.some(client => this.displayClient(client) === currentValue);
          break;
        case 'dem_lob_id':
          isValid = this.lobs.some(lob => this.displayLOB(lob) === currentValue);
          break;
        case 'dem_idm_id':
          isValid = this.depts.some(dept => this.displayDept(dept) === currentValue);
          break;
      }
  
      if (!isValid) {
        control.setValue(null);
      }
    }
  }
  onFileSelected(event: any) {
    // this.selectedFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // onSubmit() {
  //   const formData = new FormData();
  //   console.log("Form Values:", this.demandForm.value);
  //   Object.keys(this.demandForm.value).forEach(key => {
  //     formData.append(key, this.demandForm.value[key]);
  //   });

  //   if (this.selectedFile) {
  //     formData.append("job_description", this.selectedFile);
  //   }

  //   console.log(JSON.stringify(formData));
  //   this.http.post('http://64.227.145.117/api/open-demands/', formData).subscribe(response => {
  //     console.log('Success:', response);
  //   });
  // }

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
          // ✅ Convert multi-select field to JSON array
          if (field === "dem_position_location" && Array.isArray(value)) {
            value = JSON.stringify(value);
          }
          updatedFields[field] = value;
        }
      });

      // Append file only if changed
      if (this.selectedFile) {
        formData.append("job_description", this.selectedFile);
      }

      console.log("Final Update Request Body:", updatedFields);
      // 🔹 Update API Call
      this.httpService.updateDemand(updatedFields).subscribe({
        next: (response) => {
          // console.log('Demand Updated Successfully:', response);
          // alert('Demand updated successfully!');
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

      // 🔹 Create API Call
      this.httpService.addDemand(formData).subscribe({
        next: (response) => {
          const demId = this.demandForm.get('dem_id')?.value || response?.dem_id || 'N/A';
      
          this.snackBar.open("✅ Demand ID: ${demId} Added Successfully!" , "Close", {
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
    return `${year}-${month}-${day}`;

  }


  navigateToClientMaster() {
    this.router.navigate(['client-master']);
  }
  cancel() {
    this.demandForm.reset();
  }
}