import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {
    ArrowRightCircle,
    Award,
    CheckCircle,
    Check,
    CheckSquare,
    Edit3,
    List,
    Lock,
    Minus,
    Plus,
    PlusCircle,
    TrendingDown,
    TrendingUp,
    Slash,
    X,
    HelpCircle
} from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    Plus,
    PlusCircle,
    CheckCircle,
    Check,
    Edit3,
    ArrowRightCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    Lock,
    List,
    CheckSquare,
    Award,
    Slash,
    X,
    HelpCircle
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
