import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { PlusCircle, XOctagon, UserCheck, Search } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    PlusCircle,
    XOctagon,
    UserCheck,
    Search
};

@NgModule({
  declarations: [],
  imports: [
	FeatherModule.pick(icons)
  ],
  exports: [
	FeatherModule
  ]
})
export class FeatherIconModule {}
