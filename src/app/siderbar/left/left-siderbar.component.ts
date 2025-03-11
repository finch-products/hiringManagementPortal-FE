import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-left-siderbar',
  templateUrl: './left-siderbar.component.html',
  styleUrl: './left-siderbar.component.scss'
})
export class LeftSiderbarComponent {
  @Output() collapseChange = new EventEmitter<boolean>();
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isCollapsed = false;
  ngAfterViewInit() {

    if (!this.sidenav) {
      console.error('sidenav reference is missing');
    }
  }

  togglesidenav() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChange.emit(this.isCollapsed);
  }

  setActive(event: Event) {
    // Remove active class from all links
    const allLinks = document.querySelectorAll('mat-nav-list a, mat-action-list button');
    allLinks.forEach(link => link.classList.remove('active'));

    // Add active class to the clicked item
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');

  }
}
