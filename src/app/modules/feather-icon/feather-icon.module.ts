import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { CheckCircle, Plus } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    Plus,
    CheckCircle
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
