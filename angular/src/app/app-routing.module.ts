import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTweetsComponent } from './all-tweets/all-tweets.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path: 'table/all-tweets', component: AllTweetsComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  // {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
