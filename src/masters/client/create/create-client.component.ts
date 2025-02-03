import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../../interfaces/client.interface';
import { ClientService } from '../../../app/services/client.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  clientForm: FormGroup;
 
  constructor(private fb: FormBuilder, private http: HttpClient, private clientService: ClientService) {
    this.clientForm = this.fb.group({
      client_name: ['', Validators.required],
      client_manager_name: ['', Validators.required],
      client_email: ['', [Validators.required, Validators.email]],
      client_phone: ['', Validators.required],
      client_location: ['', Validators.required],
      client_department: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  

  onSubmit() {
    if (this.clientForm.valid) {
      this.http.post('http://127.0.0.1:8000/api/client-master/', this.clientForm.value).subscribe({
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
