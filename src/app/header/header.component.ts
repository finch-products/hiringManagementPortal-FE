import { Component, Input, OnInit, HostListener  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchQuery: string = '';
  @Input() isCollapsed: boolean = false;
  pageTitle: string = '';
  isDropdownOpen: boolean = false;
  isMobile: boolean = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
  }
  ngOnInit() {
    this.checkScreenSize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  

  private updatePageTitle() {
    const url = this.router.url;
    // Remove leading slash and query params/hash
    let path = url.split('?')[0].split('#')[0].substring(1);
    
    if (path === '') {
      this.pageTitle = 'Dashboard';
      return;
    }
    
    // Split into parts for nested routes
    const parts = path.split('/');
    
    // Capitalize first letter of each part while preserving underscores
    const formattedParts = parts.map(part => {
      if (part.length === 0) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    });
    
    // Join all parts with ":" for nested paths
    this.pageTitle = formattedParts.join(':');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    // Close dropdown when clicking outside
    if (profileDropdown && !profileDropdown.contains(event.target as Node) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}
