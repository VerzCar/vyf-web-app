import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { CircleCreateComponent } from './circle-create/circle-create.component';
import { CircleDetailComponent } from './circle-detail/circle-detail.component';
import { CircleEditComponent } from './circle-edit/circle-edit.component';
import { CircleMembersComponent } from './circle-members/circle-members.component';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';
import { DetailsResolver } from './services/details.resolver';
import { EditResolver } from './services/edit.resolver';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: CirclesOverviewComponent
            },
            {
                path: ':id',
                component: CircleDetailComponent,
                resolve: {
                    _: (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => inject(DetailsResolver).resolve(r, s)
                }
            },
            {
                path: 'create',
                component: CircleCreateComponent
            },
            {
                path: `:id/edit`,
                component: CircleEditComponent,
                resolve: {
                    _: (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => inject(EditResolver).resolve(r, s)
                }
            },
            {
                path: ':id/members',
                component: CircleMembersComponent,
                resolve: {
                    _: (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => inject(DetailsResolver).resolve(r, s)
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CirclesRoutingModule {}
