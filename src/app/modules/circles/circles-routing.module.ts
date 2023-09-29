import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';

const routes: Routes = [
  {
	path: '',
	component: LayoutComponent,
	children: [
	  {
		path: '',
		component: CirclesOverviewComponent,
	  }
	],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CirclesRoutingModule {}
