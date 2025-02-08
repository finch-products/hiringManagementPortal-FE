import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../../interfaces/client.interface';
import { ClientService } from '../../../app/services/client.service';
import { ValidatorsService } from '../../../app/services/validators.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  clientForm: FormGroup;
 
  constructor(private fb: FormBuilder, private http: HttpClient, private clientService: ClientService,private validatorsService:ValidatorsService) {
    this.clientForm = this.fb.group({
      clm_clientId: [''],
      client_name: ['',[ Validators.required,Validators.pattern(this.validatorsService.namePattern())]],
      client_manager_name: ['', [Validators.pattern(this.validatorsService.namePattern())]],
      client_email: ['', [Validators.required, Validators.email]],
      client_phone: ['',[ Validators.pattern(this.validatorsService.phonePattern())]],
      clm_address: ['',[Validators.pattern(this.validatorsService.detailPattern())]],
      client_location: ['',[ Validators.pattern(this.validatorsService.namePattern())]],
      client_department: ['',[Validators.pattern(this.validatorsService.generalPattern())]],
      activeStatus: [true]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  

  onSubmit() {
    if (this.clientForm.valid) {
      this.http.post('http://64.227.145.117/api/client-master/', this.clientForm.value).subscribe({
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
