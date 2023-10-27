import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { ListResolver } from './services/resolver/list.resolver';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: ':id',
                component: RankingListComponent,
                resolve: {
                    _: (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => inject(ListResolver).resolve(r, s)
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RankingRoutingModule {}
