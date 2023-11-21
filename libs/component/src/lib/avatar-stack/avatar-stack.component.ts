import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { ShortNamePipe } from '@vyf/component';
import { User } from '@vyf/user-service';

@Component({
    selector: 'vyf-avatar-stack',
    standalone: true,
    imports: [
        RouterLink,
        RxIf,
        ShortNamePipe,
        RxFor,
        NgOptimizedImage
    ],
    templateUrl: 'avatar-stack.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarStackComponent {
    @Input({ required: true }) users!: User[];
    @Input() plusCount: number = 0;
    @Output() stackClicked = new EventEmitter<MouseEvent>();

    public onStackClicked(event: MouseEvent) {
        this.stackClicked.emit(event);
    }
}
