import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
// Import all necessary components
import { CreateOpenDemandComponent } from './open-demands/create/create-open-demands.component';
import { ListOpenDemandsComponent } from './open-demands/list/list-open-demands.component';
import { LeftSiderbarComponent } from './siderbar/left/left-siderbar.component';
import { RightSidebarComponent } from './siderbar/right/right-sidebar.component';
import { HeaderComponent } from './header/header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { CreateClientComponent } from '../masters/client/create/create-client.component';
import { ListClientComponent } from '../masters/client/list/list-client.component';
import { CreateLOBComponent } from '../masters/lob/create/create-lob.component';
import { ListLOBComponent } from '../masters/lob/list/list-lob.component';
import { CreateLocationComponent } from '../masters/location/create/create-location.component';
import { ListLocationComponent } from '../masters/location/list/list-location.component';
import { CreatePracticeUnitComponent } from '../masters/practice-unit/create/create-practice-unit.component';
import { ListPracticeUnitComponent } from '../masters/practice-unit/list/list-practice-unit.component';


@NgModule({
  declarations: [
    AppComponent,
    CreateOpenDemandComponent,
    ListOpenDemandsComponent,
    CreateClientComponent,
    ListClientComponent,
    CreateLOBComponent,
    ListLOBComponent,
    CreateLocationComponent,
    ListLocationComponent,
    CreatePracticeUnitComponent,
    ListPracticeUnitComponent,
    LeftSiderbarComponent,
    RightSidebarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FlexLayoutModule,
    RouterModule.forRoot([])
  ],
  exports: [MatSidenavModule, MatExpansionModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
