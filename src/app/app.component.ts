import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  isCollapsed = false;

  togglesidenav(collapsed: boolean) {
    this.isCollapsed = collapsed;
  }
  isLoading!: Observable<boolean>;

  title = 'Internal Hiring Tool';
  showRightSidebar = false;
  constructor(private router: Router,private loaderService: LoaderService) {
    this.isLoading = this.loaderService.loading$;
    this.router.events.subscribe(() => {
      // Show right sidebar only on the Dashboard
      this.showRightSidebar = this.router.url === '/dashboard';
      
    });
  }
  ngOnInit() {
    
  }

}
