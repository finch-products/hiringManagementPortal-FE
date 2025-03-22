import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  isLoading$!: Observable<boolean>;

  isCollapsed = false;
  showRightSidebar = false;

  title = 'Internal Hiring Tool';

  constructor(private router: Router, private loaderService: LoaderService) {
    // this.isLoading = this.loaderService.loading$;
    // this.router.events.subscribe(() => {
    //   // Show right sidebar only on the Dashboard
    //   this.showRightSidebar = this.router.url === '/dashboard';

    // });
  }
  ngOnInit() {
    this.isLoading$ = this.loaderService.loading$; // ✅ Move inside ngOnInit()

    this.router.events.subscribe(() => {
      this.showRightSidebar = this.router.url === '/dashboard';
    });
  }

  togglesidenav(collapsed: boolean) {
    this.isCollapsed = collapsed;
  }

}
