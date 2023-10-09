import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { Plus } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
  Plus,
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
