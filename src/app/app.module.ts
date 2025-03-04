import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';
 // Import your component

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
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
// client manager master component
import { CreateClientManagerComponent } from '../masters/client-manager/components/create/create-client-manager/create-client-manager.component';
import { ListClientManagerComponent } from '../masters/client-manager/components/list/list-client-manager/list-client-manager.component';
import { CreateLocationComponent } from '../masters/location/create/create-location.component';
import { ListLocationComponent } from '../masters/location/list/list-location.component';
import { CreateInternalDepartmentComponent } from '../masters/internal-department/create/create-internal-department.component';
import { ListInternalDepartmentComponent } from '../masters/internal-department/list/list-internal-department.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import {MatRadioModule} from '@angular/material/radio';
import { FormErrorComponent } from './shared/form-error/form-error.component';
import { ReportComponent } from '../report/report.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CreateEmployeeComponent } from '../masters/employee/create/create-employee.component';
import { ListEmployeeComponent } from '../masters/employee/list/list-employee.component';
import { CreateCandidateComponent } from '../masters/candidate/create/create-candidate.component';
import { ListCandidateComponent } from '../masters/candidate/list/list-candidate.component';
import { Otherview1Component } from './otherViews/otherview1/otherview1.component';
import { Otherview2Component } from './otherViews/otherview2/otherview2.component';
import { Otherview3Component } from './otherViews/otherview3/otherview3.component';
import { Otherview4Component } from './otherViews/otherview4/otherview4.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DemandHistoryComponent } from './open-demands/history/demand.history.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DemandViewComponent } from './demand-view/demand-view.component';
import { DemandComponent } from './demand-view/demand/demand.component';
import { CandidateComponent } from './demand-view/candidate/candidate.component';
import { PreviewComponent } from './demand-view/preview/preview.component';

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
    CreateInternalDepartmentComponent,
    ListInternalDepartmentComponent,
    LeftSiderbarComponent,
    RightSidebarComponent,
    HeaderComponent,
    DashboardComponent,
    CreateEmployeeComponent,
    ListEmployeeComponent,
    CreateCandidateComponent,
    ListCandidateComponent,
    FormErrorComponent,
    ReportComponent,
    Otherview1Component,
    Otherview2Component,
    Otherview3Component,
    DemandHistoryComponent,
    DemandViewComponent,
    DemandComponent,
    CandidateComponent,
    PreviewComponent,
    Otherview4Component
  ],
  imports: [
    MatRadioModule,
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
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FlexLayoutModule,
    FormsModule,
    NgxChartsModule,
    MatRadioModule ,
    MatAutocompleteModule,
    CreateClientManagerComponent,
    ListClientManagerComponent,
    RouterModule.forRoot([]),
    MatCheckboxModule,
    MatTooltipModule,
  ],
  exports: [MatSidenavModule, MatExpansionModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
