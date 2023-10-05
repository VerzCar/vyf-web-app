import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "../layout/layout/layout.component";
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserXComponent } from './user-x/user-x.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'profile',
        component: UserProfileComponent,
        pathMatch: 'full'
      },
      {
        path: 'profile/edit',
        component: UserProfileEditComponent,
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: UserXComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
