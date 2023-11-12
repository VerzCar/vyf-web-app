import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { MemberListRankingComponent } from './member-list-ranking/member-list-ranking.component';
import { ListResolver } from './services/resolver/list-resolver.resolver';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'ranking/:id',
                component: MemberListRankingComponent,
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
export class MemberRoutingModule {}
