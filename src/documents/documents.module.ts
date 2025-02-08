import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import { JobDescriptionsComponent } from './job-descriptions/job-descriptions.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { SowsComponent } from './sows/sows.component';
import { RateCardsComponent } from './rate-cards/rate-cards.component';
import { OthersComponent } from './others/others.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DocumentsComponent,
    JobDescriptionsComponent,
    ProfilesComponent,
    SowsComponent,
    RateCardsComponent,
    OthersComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatIconModule,
    DocumentsRoutingModule
  ]
})
export class DocumentsModule { }
