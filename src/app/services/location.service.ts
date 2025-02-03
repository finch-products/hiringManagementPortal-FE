import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations = new BehaviorSubject<any[]>([]);
  locations$ = this.locations.asObservable();

  constructor() {}

  // Store initial API data
  setInitialData(location: any[]) {
    this.locations.next(location);
  }

  // Add new record at the TOP of the list
  addLocation(newlocation: any) {
    const currentlocation = this.locations.value;
    this.locations.next([newlocation, ...currentlocation]); // Insert at the beginning
  }
}
