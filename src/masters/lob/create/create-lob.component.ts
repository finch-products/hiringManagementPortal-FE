import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LobService } from '../../../app/services/lob.service';

@Component({
  selector: 'app-create-lob',
  templateUrl: './create-lob.component.html',
  styleUrls: ['./create-lob.component.scss']
})
export class CreateLOBComponent {
  lobForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private lobService: LobService) {
    this.lobForm = this.fb.group({
      lob_name: ['', Validators.required],
      lob_description: [''],
      lob_clientpartner: ['', Validators.required],
      lob_deliverymanager: ['', Validators.required],
      lob_insertby: [1],
      lob_updateby: [1]
    });
  }

  onSubmit() {
    if (this.lobForm.valid) {
      this.http.post('http://64.227.145.117/api/lob-master/', this.lobForm.value).subscribe({
        next: (response) => {
          console.log('Client added:', response);
          this.lobService.addLob(response);
          this.lobForm.reset();
        },
        error: (error) => console.error('Error adding client:', error)
      });
    }
  }
}
