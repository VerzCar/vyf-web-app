import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Commitment } from '@vyf/vote-circle-service';

@Component({
    selector: 'vyf-commitment-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './commitment-icon.component.html',
    styleUrls: ['./commitment-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommitmentIconComponent {
    @Input() public commitment: Commitment = Commitment.Open;
    @HostBinding('class.open') get open() { return this.commitment === Commitment.Open; }
    @HostBinding('class.committed') get committed() { return this.commitment === Commitment.Committed; }
    @HostBinding('class.rejected') get rejected() { return this.commitment === Commitment.Rejected; }
}
