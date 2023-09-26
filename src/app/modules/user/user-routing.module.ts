import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '../../routes';
import { LayoutComponent } from "../layout/layout/layout.component";
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'profile',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: UserProfileComponent,
      },
      {
        path: 'edit',
        component: UserProfileEditComponent,
      },
    ],
  },
  {
    path: Route.default,
    redirectTo: 'profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
