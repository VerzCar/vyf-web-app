import { Routes } from '@angular/router';
import { Vyf404Component } from './modules/vyf/vyf-404/vyf-404.component';
import { Route } from './routes';

export const appRoutes: Routes = [
  {
	path: Route.default,
	loadChildren: () => import('./modules/vyf/vyf.module').then(m => m.VyfModule)
  },
  {
	path: Route.user,
	loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
	path: Route.circles,
	loadChildren: () => import('./modules/circles/circles.module').then(m => m.CirclesModule)
  },
  {
	path: '**',
	component: Vyf404Component
  }
];
