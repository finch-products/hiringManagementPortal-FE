import { Component } from '@angular/core';

@Component({
  selector: 'app-left-siderbar',
  templateUrl: './left-siderbar.component.html',
  styleUrl: './left-siderbar.component.scss'
})
export class LeftSiderbarComponent {
  setActive(event: Event) {
    // Remove active class from all links
    const allLinks = document.querySelectorAll('mat-nav-list a, mat-action-list button');
    allLinks.forEach(link => link.classList.remove('active'));

    // Add active class to the clicked item
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }
}
