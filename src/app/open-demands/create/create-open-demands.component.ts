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
      dem_position_location: ['']
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
        console.log("editmode", this.isEditMode)
        this.loadData(demandId);
      }
      this.loadClients();
      this.loadLocations();
      this.loadLOBs();
      this.loadInternalDepts();
      this.demandForm.get('isInternal')?.valueChanges.subscribe(value => {
        this.isInternal = value === 'yes';
      });
    })
  }
  onHiringManagerChange(event: MatSelectChange) {

    const selectedId = event.value;

    if (selectedId === 'custom') {
      this.customEntryEnabled = true;
      this.selectedEmail = '';
    } else {
      this.isCustomManager = false;
      const selectedClient = this.clients.find(client => client.clm_id === selectedId);
      this.selectedEmail = selectedClient ? selectedClient.clm_clientemail : '';
    }
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
        this.demandForm.patchValue({
          isInternal: this.demands.isInternal,
          dem_id: this.demands.dem_id,
          // dem_updateby_id:this.demands.updateby_id,
          dem_ctoolnumber: this.demands?.dem_ctoolnumber,
          dem_ctooldate: this.demands?.dem_ctooldate,
          dem_clm_id: this.demands.client_details?.clm_id,
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
          dem_position_location: this.demands?.dem_position_location,
          
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
      },
      error: (err) => console.error('Error fetching lobs', err)
    });
  }

  loadInternalDepts(): void {
    this.httpService.getDeptsDetails().subscribe({
      next: (data) => {
        this.depts = data;
        console.log('Departments:', this.depts);
      },
      error: (err) => console.error('Error fetching departments', err)
    });
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
        }
      });
  
      // 🔹 Ensure `dem_position_location` is always an array
      // updatedFields["dem_position_location"] = this.demandForm.value.dem_position_location?.length
      //   ? this.demandForm.value.dem_position_location
      //   : [];
  
      // Append file only if changed
      if (this.selectedFile) {
        formData.append("job_description", this.selectedFile);
      }
  
      console.log("Final Update Request Body:", updatedFields);
  
      // 🔹 Update API Call
      this.httpService.updateDemand(updatedFields).subscribe({
        next: (response) => {
          this.snackBar.open("✅ Demand Updated Successfully!", "Close", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/list']);
        },
        error: (error) => {
          this.snackBar.open("❌ Failed to update demand. Check console for details.", "Close", {
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
  
        // 🔹 Ensure `dem_position_location` is always an array
        // if (key === "dem_position_location") {
        //   value = value?.length ? value : [];
        // }
  
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
          this.snackBar.open("✅ Demand Added Successfully!", "Close", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.openDemandService.addDemand(response);
          this.demandForm.reset();
          this.router.navigate(['/list']);
        },
        error: (error) => {
          this.snackBar.open("❌Failed to add demand. Check console for details", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
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
    this.router.navigate(['/dashboard']);
  }
}

