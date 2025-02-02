import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOpenDemandComponent } from './open-demands/create/create-open-demands.component';
import { ListOpenDemandsComponent } from './open-demands/list/list-open-demands.component';
import { CreateClientComponent } from '../masters/client/create/create-client.component';
import { CreateLOBComponent } from '../masters/lob/create/create-lob.component';
import { CreateLocationComponent } from '../masters/location/create/create-location.component';
import { CreatePracticeUnitComponent } from '../masters/practice-unit/create/create-practice-unit.component';
// import { ClientMasterComponent } from './client-master/client-master.component';
// import { LobMasterComponent } from './lob-master/lob-master.component';
// import { LocationMasterComponent } from './location-master/location-master.component';
// import { PracticeUnitMasterComponent } from './practice-unit-master/practice-unit-master.component';

const routes: Routes = [
  { path: '', redirectTo: '/open-demands', pathMatch: 'full' },
  { path: 'open-demands', component: CreateOpenDemandComponent },
  { path: 'client-master', component: CreateClientComponent},
  { path: 'lob-master', component: CreateLOBComponent},
  { path: 'location-master', component: CreateLocationComponent},
  { path: 'practice-unit-master', component: CreatePracticeUnitComponent}
  // { path: 'client-master', component: ClientMasterComponent },
  // { path: 'lob-master', component: LobMasterComponent },
  // { path: 'location-master', component: LocationMasterComponent },
  // { path: 'practice-unit-master', component: PracticeUnitMasterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
