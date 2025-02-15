import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../../interfaces/client.interface';
import { ClientService } from '../../../app/services/client.service';
import { ValidatorsService } from '../../../app/services/validators.service';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  clientForm: FormGroup;
  locations: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private clientService: ClientService, private validatorsService: ValidatorsService, private httpService: HttpService) {
    this.clientForm = this.fb.group({
      clm_clientid: [''],
      clm_name: ['', [Validators.required, Validators.pattern(this.validatorsService.namePattern())]],
      clm_managername: ['', [Validators.pattern(this.validatorsService.namePattern())]],
      clm_clientemail: ['', [Validators.required, Validators.email]],
      clm_clientphone: ['', [Validators.required, Validators.pattern(this.validatorsService.phonePattern())]],
      clm_address: ['', [Validators.required, Validators.pattern(this.validatorsService.detailPattern())]],
      clm_lcm_id: [''],
      clm_isactive: [true],
      clm_insertby: [1]
    });
  }

  ngOnInit(): void {
    this.loadLocations();
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

  onSubmit() {
    if (this.clientForm.valid) {
      this.http.post('http://64.227.145.117/api/clients/', this.clientForm.value).subscribe({
        next: (response) => {
          console.log('Client added:', response);
          this.clientService.addClient(response);
          this.clientForm.reset();
        },
        error: (error) => console.error('Error adding client:', error)
      });
    }
  }
}
