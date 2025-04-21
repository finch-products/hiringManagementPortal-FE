import { Component, EventEmitter, Output, ViewChild, HostListener,ChangeDetectorRef  } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-siderbar',
  templateUrl: './left-siderbar.component.html',
  styleUrls: ['./left-siderbar.component.scss']
})
export class LeftSiderbarComponent {
  @Output() collapseChange = new EventEmitter<boolean>();
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isCollapsed = false;
  activeTooltip: string | null = null;
  isMobile = false;

  expandedPanels = {
    candidates: false,
    views: false,
    masters: false
  };

  constructor(private router: Router,private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (!this.sidenav) {
      console.error('sidenav reference is missing');
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isCollapsed && this.activeTooltip) {
      this.activeTooltip = null;
    }
  }

  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const previousIsMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    // Auto-collapse sidebar on mobile
    if (this.isMobile && !this.isCollapsed) {
      this.isCollapsed = true;
    }
    
    // When transitioning between mobile and desktop
    if (previousIsMobile !== this.isMobile) {
      if (!this.isMobile) {
        // Going from mobile to desktop
        this.isCollapsed = false;
      }
      this.cd.detectChanges();
    }
    
    // Update content class
    this.updateContentClass();
  }
  
  togglesidenav() {
    this.isCollapsed = !this.isCollapsed;
    this.updateContentClass();
    this.cd.detectChanges(); // Force UI refresh
    this.collapseChange.emit(this.isCollapsed);
    this.activeTooltip = null;
    this.activeTooltip = null; // Close all tooltips when collapsing/expanding
  }

  updateContentClass() {
    // Get the sidenav content element
    const content = document.querySelector('.mat-sidenav-content');
    if (!content) return;
    
    // Remove all state classes
    content.classList.remove('collapsed-content', 'mobile-sidebar-open');
    
    // Add appropriate classes based on state
    if (this.isCollapsed) {
      content.classList.add('collapsed-content');
    }
    
    if (this.isMobile && !this.isCollapsed) {
      content.classList.add('mobile-sidebar-open');
    }
  }

  setActive(event: Event) {
    // Remove active class from all links
    const allLinks = document.querySelectorAll('mat-nav-list a, mat-action-list button');
    allLinks.forEach(link => link.classList.remove('active'));

    // Add active class to the clicked item
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.activeTooltip = null; // Close tooltip after navigation
    // Auto-collapse sidenav on mobile after navigation
    if (this.isMobile) {
      this.isCollapsed = true;
      this.updateContentClass();
    }
  }

  showTooltip(panelName: string) {
    if (this.isCollapsed) {
      this.activeTooltip = panelName;
    }
  }

  hideTooltip() {
    if (this.isCollapsed) {
      setTimeout(() => {
        this.activeTooltip = null;
      }, 200);
    }
  }

  togglePanel(panel: keyof typeof this.expandedPanels): void {
    // Toggle the panel state
    this.expandedPanels[panel] = !this.expandedPanels[panel];
    
    // Close other panels when one is opened (optional)
    if (this.expandedPanels[panel]) {
      for (const key in this.expandedPanels) {
        if (key !== panel) {
          this.expandedPanels[key as keyof typeof this.expandedPanels] = false;
        }
      }
    }

    // Auto-expand sidenav if it was collapsed and we're expanding a panel
    if (this.isCollapsed && this.expandedPanels[panel] && !this.isMobile) {
      this.isCollapsed = false;
      this.updateContentClass();
    }
  }
  

  positionTooltip(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const tooltip = target.querySelector('.custom-tooltip') as HTMLElement;
    
    if (tooltip) {
      const targetRect = target.getBoundingClientRect();
      const tooltipHeight = tooltip.offsetHeight;
      
      // Calculate position relative to the target item
      const topPosition = targetRect.top + (targetRect.height - tooltipHeight) / 2;
      
      // Apply the position
      tooltip.style.top = `${topPosition}px`;
      tooltip.style.left =`${targetRect.left + targetRect.width + 10}px`;
    }
  }

closeAllPanels() {
  Object.keys(this.expandedPanels).forEach(panel => {
    this.expandedPanels[panel as keyof typeof this.expandedPanels] = false;
  });
}
}