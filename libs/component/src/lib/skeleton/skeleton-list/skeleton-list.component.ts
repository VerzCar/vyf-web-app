import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vyf-skeleton-list',
    standalone: true,
    imports: [],
    templateUrl: './skeleton-list.component.html',
    styleUrl: './skeleton-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonListComponent {
    public itemsCount = new Array<number>(6);
}
