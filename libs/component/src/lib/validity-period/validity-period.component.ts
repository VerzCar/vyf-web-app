import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Circle } from '@vyf/vote-circle-service';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

@Component({
    selector: 'vyf-validity-period',
    standalone: true,
    imports: [DatePipe, FeatherIconModule, NgClass],
    templateUrl: './validity-period.component.html',
    styleUrl: './validity-period.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidityPeriodComponent {
    @Input({ required: true }) public circle!: Circle;
    @Input() public alignment: 'horizontal' | 'vertical' = 'horizontal';
}
