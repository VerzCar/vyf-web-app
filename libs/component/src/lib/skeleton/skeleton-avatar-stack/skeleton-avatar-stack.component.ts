import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vyf-skeleton-avatar-stack',
    standalone: true,
    imports: [],
    templateUrl: './skeleton-avatar-stack.component.html',
    styleUrl: './skeleton-avatar-stack.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonAvatarStackComponent {
    public itemsCount = new Array<number>(3);
}
