import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss']
})
export class CreateLocationComponent implements OnInit {
  locationForm: FormGroup;
constructor(private fb: FormBuilder, private http: HttpClient) {
    this.locationForm = this.fb.group({
      location_name: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      this.http.post('http://127.0.0.1:8000/api/location-master/', this.locationForm.value).subscribe({
        next: (response) => {
          console.log('Location added:', response);
          this.locationForm.reset();
        },
        error: (error) => console.error('Error adding location:', error)
      });
    }
  }

  ngOnInit() { }
}
