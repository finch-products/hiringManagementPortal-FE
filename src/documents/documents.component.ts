import { Component } from '@angular/core';

@Component({
  selector: 'app-document',
  template: `
    <div class="documents-container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class DocumentsComponent {
}