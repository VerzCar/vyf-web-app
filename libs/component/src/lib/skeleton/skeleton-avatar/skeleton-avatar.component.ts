import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vyf-skeleton-avatar',
    standalone: true,
    imports: [],
    templateUrl: './skeleton-avatar.component.html',
    styleUrl: './skeleton-avatar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonAvatarComponent {}
