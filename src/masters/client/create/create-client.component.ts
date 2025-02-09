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

  constructor(private fb: FormBuilder, private http: HttpClient, private clientService: ClientService, private validatorsService: ValidatorsService) {
    this.clientForm = this.fb.group({
      clm_clientid: [''],
      clm_name: ['', [Validators.required, Validators.pattern(this.validatorsService.namePattern())]],
      clm_managername: ['', [Validators.pattern(this.validatorsService.namePattern())]],
      clm_clientemail: ['', [Validators.required, Validators.email]],
      clm_clientphone: ['', [Validators.pattern(this.validatorsService.phonePattern())]],
      clm_address: ['', [Validators.pattern(this.validatorsService.detailPattern())]],
      clm_location: ['', [Validators.pattern(this.validatorsService.namePattern())]],
      clm_isactive: [true],
      clm_insertby: [1]
    });
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  onSubmit() {
    alert(JSON.stringify(this.clientForm.value))
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
