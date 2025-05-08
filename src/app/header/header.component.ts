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
    
     const formattedParts = parts.map(part => {
    const lowerPart = part.toLowerCase();

    // Special override: 'candidate-history'
    if (lowerPart.includes('candidate-history')) {
      return 'Candidate History';
    }

    // Special override: 'other-view' like other-view1, other-viewX
    if (lowerPart.includes('other-view')) {
      const afterHyphen = part.split('-')[1];
      if (afterHyphen) {
        return afterHyphen.charAt(0).toUpperCase() + afterHyphen.slice(1);
      }
      return 'View'; // fallback
    }

    // General rule: extract keyword before hyphen
    const keyword = lowerPart.includes('-') ? lowerPart.split('-')[0] : '';

    // Special case: 'internal' becomes 'Departments'
    if (keyword === 'internal') {
      return 'Departments';
    }

    if (keyword.length > 0) {
      return keyword.charAt(0).toUpperCase() + keyword.slice(1) + 's';
    } else {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
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
