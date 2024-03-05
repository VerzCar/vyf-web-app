import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

@Component({
    selector: 'vyf-badge',
    standalone: true,
    imports: [
        NgClass,
        FeatherIconModule
    ],
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
    @Input() public text = '';
    @Input() public icon = '';
    @Input() public animated = false;

    public badgeColorClass: string = '';
    public badgeColor: string = '';

    @Input()
    public set color(rgb: string) {
        this.badgeColor = `text-${rgb}-500`;
        this.badgeColorClass = `bg-${rgb}-100 text-${rgb}-800`;
    }
}
