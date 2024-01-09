import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {
    ArrowRightCircle,
    CheckCircle,
    Edit3,
    Minus,
    Plus,
    PlusCircle,
    TrendingDown,
    TrendingUp,
    Lock,
    List,
    CheckSquare
} from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    Plus,
    PlusCircle,
    CheckCircle,
    Edit3,
    ArrowRightCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    Lock,
    List,
    CheckSquare
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
