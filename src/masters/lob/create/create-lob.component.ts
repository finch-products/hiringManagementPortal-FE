import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-lob',
  templateUrl: './create-lob.component.html',
  styleUrls: ['./create-lob.component.scss']
})
export class CreateLOBComponent implements OnInit {
  lobForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.lobForm = this.fb.group({
      lob_name: ['', Validators.required],
      lob_delivery_manager: ['', Validators.required],
      lob_client_partner: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.lobForm.valid) {
      this.http.post('http://127.0.0.1:8000/api/lob-master/', this.lobForm.value).subscribe({
        next: (response) => {
          console.log('Client added:', response);
          this.lobForm.reset();
        },
        error: (error) => console.error('Error adding client:', error)
      });
    }
  }

  ngOnInit() { }
}
