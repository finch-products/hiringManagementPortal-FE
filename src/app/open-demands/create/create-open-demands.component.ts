import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { OpenDemandService } from '../../services/open.demand.service';
import { HttpService } from '../../services/http.service';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private openDemandService: OpenDemandService, private httpService: HttpService) {
    this.demandForm = this.fb.group({
      isInternal: ['yes'],
      dem_ctoolnumber: [''],
      dem_ctooldate: [''],
      dem_cmm_id: [{ value: '', disabled: true }],
      dem_clm_id: [''],
      dem_lcm_id: [''],
      dem_validtill: [''],
      dem_skillset: [''],
      dem_lob_id: [''],
      dem_idm_id: [''],
      dem_positions: [''],
      dem_rrnumber: [''],
      dem_jrnumber: [''],
      dem_rrgade: [''],
      dem_gcblevel: [''],
      dem_jd: [''],
      dem_comment: [''],
      dem_isreopened: [''],
      dem_isactive: [''],
      dem_insertby: [''],
      dem_updateby: [''],
    });
  }

  ngOnInit() {
    this.loadClients();
    this.loadLocations();
    this.loadLOBs();
    this.loadInternalDepts();
    this.demandForm.get('isInternal')?.valueChanges.subscribe(value => {
      this.isInternal = value === 'yes';
    });
  }

  loadClients(): void {
    this.httpService.getClientDetails().subscribe({
      next: (data) => {
        this.clients = data;
        console.log('Clients:', this.clients);
        this.demandForm.get('dem_clm_id')?.valueChanges.subscribe(selectedClientId => {
          const selectedClient = this.clients.find(client => client.clm_id === selectedClientId);
          if (selectedClient) {
            this.demandForm.patchValue({ dem_cmm_id: selectedClient.clm_managername });
          } else {
            this.demandForm.patchValue({ dem_cmm_id: '' });
          }
        });
      },
      error: (err) => console.error('Error fetching clients', err)
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
    this.httpService.getInternalDepartmentDetails().subscribe({
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
    const formData = new FormData();

    // Debug: Check if form values exist before appending
    console.log("Form Values:", this.demandForm.value);

    Object.keys(this.demandForm.value).forEach(key => {
      let value = this.demandForm.value[key];
      if (value instanceof Date) {
        value = this.formatDate(value); // Extract YYYY-MM-DD
        console.log(`Formatted Date for ${key}: ${value}`);
      }

      if (value) {
        formData.append(key, value);
      } else {
        console.warn(`Skipping empty field: ${key}`);
      }


      // if (this.demandForm.value[key]) {  // Ensure value is not null or undefined
      //   formData.append(key, this.demandForm.value[key]);
      // } else {
      //   console.warn(`Skipping empty field: ${key}`);
      // }
    });

    // Debug: Check if file exists before appending
    if (this.selectedFile) {
      console.log("Selected File:", this.selectedFile);
      formData.append("job_description", this.selectedFile);
    } else {
      console.warn("No file selected");
    }

    // Debug: Check contents of `formData`
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    // Send API request
    this.http.post('http://64.227.145.117/demands/', formData).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.openDemandService.addDemand(response);
        this.demandForm.reset();
      },
      error: (error) => {
        console.error('Error in API call:', error);
      }
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
  }
}
