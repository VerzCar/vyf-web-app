import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Commitment } from '@vyf/vote-circle-service';
import { FeatherModule } from 'angular-feather';

@Component({
    selector: 'vyf-circle-commitment-action',
    standalone: true,
    imports: [CommonModule, MatButtonModule, FeatherModule],
    template: `
        <div class="flex flex-row gap-2 items-center">
            <button mat-stroked-button
                    (click)="onCommitted()"
                    [disabled]="selectedCommitment === Commitment.Committed"
                    [ngClass]="{'COMMITTED': selectedCommitment === Commitment.Committed}">
                <i-feather class="text-green-500 align-top" name="check"></i-feather>
            </button>
            <button mat-stroked-button
                    (click)="onRejected()"
                    [disabled]="selectedCommitment === Commitment.Rejected"
                    [ngClass]="{'REJECTED': selectedCommitment === Commitment.Rejected}">
                <i-feather class="text-red-500 align-top" name="slash"></i-feather>
            </button>
        </div>
    `,
    styles: ['button{ &.COMMITTED{@apply bg-green-200;} &.REJECTED{@apply bg-red-200;}}'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleCommitmentActionComponent {
    @Input() public selectedCommitment: Commitment | undefined = Commitment.Committed;
    @Output() public commitment = new EventEmitter<Commitment>();

    public readonly Commitment = Commitment;

    public onCommitted() {
        this.commitment.emit(Commitment.Committed);
    }

    public onRejected() {
        this.commitment.emit(Commitment.Rejected);
    }
}
