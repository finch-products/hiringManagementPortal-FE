import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Internal Hiring Tool';
  showRightSidebar = false;
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // Show right sidebar only on the Dashboard
      this.showRightSidebar = this.router.url === '/dashboard';
    });
  }
}
