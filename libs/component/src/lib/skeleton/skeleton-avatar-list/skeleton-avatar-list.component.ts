import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vyf-skeleton-avatar-list',
    standalone: true,
    imports: [],
    templateUrl: './skeleton-avatar-list.component.html',
    styleUrl: './skeleton-avatar-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonAvatarListComponent {
    public itemsCount = new Array<number>(3);
}
