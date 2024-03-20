import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Vyf404Component } from '../../shared/components/vyf-404/vyf-404.component';
import { LayoutComponent } from '../layout/layout/layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: Vyf404Component
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FourZeroFourRoutingModule {}
