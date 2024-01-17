import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { ArrowRightCircle, Award, CheckCircle, CheckSquare, Edit3, List, Lock, Minus, Plus, PlusCircle, TrendingDown, TrendingUp } from 'angular-feather/icons';

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
    CheckSquare,
    Award
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
