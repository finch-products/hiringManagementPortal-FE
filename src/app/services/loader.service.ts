import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    // console.log('Loader Activated!'); 
    this.loadingSubject.next(true);
  }

  hide() {
    // console.log('Loader Deactivated!'); 
    this.loadingSubject.next(false);
  }
}
