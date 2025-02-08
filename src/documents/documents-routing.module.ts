import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { JobDescriptionsComponent } from './job-descriptions/job-descriptions.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { SowsComponent } from './sows/sows.component';
import { RateCardsComponent } from './rate-cards/rate-cards.component';
import { OthersComponent } from './others/others.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsComponent,
    children: [
      { path: 'job-descriptions', component: JobDescriptionsComponent },
      { path: 'profiles', component: ProfilesComponent },
      { path: 'sows', component: SowsComponent },
      { path: 'rate-cards', component: RateCardsComponent },
      { path: 'others', component: OthersComponent },
      { path: '', redirectTo: 'job-descriptions', pathMatch: 'full' } // Default Route
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule {}
