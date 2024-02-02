import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { Check, PlusCircle, Search, Slash, UserCheck, XOctagon, AlertCircle, X } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    PlusCircle,
    XOctagon,
    UserCheck,
    Search,
    Check,
    Slash,
    AlertCircle,
    X
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
