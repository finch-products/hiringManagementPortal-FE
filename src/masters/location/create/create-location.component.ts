import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../../../app/services/location.service';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss']
})
export class CreateLocationComponent implements OnInit {
  locationForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private locationService: LocationService) {
    this.locationForm = this.fb.group({
      lcm_name: ['', Validators.required],
      lcm_state: ['', Validators.required],
      lcm_country: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      this.http.post('http://64.227.145.117/locations/', this.locationForm.value).subscribe({
        next: (response) => {
          console.log('Location added:', response);
          this.locationService.addLocation(response);
          this.locationForm.reset();
        },
        error: (error) => console.error('Error adding location:', error)
      });
    }
  }

  ngOnInit() { }
}
