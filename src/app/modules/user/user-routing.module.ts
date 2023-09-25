import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "../layout/layout/layout.component";
import { Route } from "../../routes";
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: Route.default,
    component: LayoutComponent,
    children: [
      {
        path: 'profile',
        component: UserProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
