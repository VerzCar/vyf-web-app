import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { ArrowRightCircle, CheckCircle, Edit3, Minus, Plus, TrendingDown, TrendingUp } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    Plus,
    CheckCircle,
    Edit3,
    ArrowRightCircle,
    TrendingUp,
    TrendingDown,
    Minus
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
