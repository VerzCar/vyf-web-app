import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Commitment } from '@vyf/vote-circle-service';
import { FeatherModule } from 'angular-feather';

@Component({
    selector: 'vyf-circle-commitment-action',
    standalone: true,
    imports: [CommonModule, MatButtonModule, FeatherModule],
    template: `
        <p>
            You have not yet committed to be in the circle, commit now!
        </p>
        <div class="flex flex-row gap-2 items-center">
            <button mat-stroked-button
                    (click)="onCommitted()">
                <i-feather class="text-green-500 align-top" name="check"></i-feather>
            </button>
            <button mat-stroked-button
                    (click)="onRejected()">
                <i-feather class="text-red-500 align-top" name="slash"></i-feather>
            </button>
        </div>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleCommitmentActionComponent {
    @Output() public commitment = new EventEmitter<Commitment>();

    public onCommitted() {
        this.commitment.emit(Commitment.Committed);
    }

    public onRejected() {
        this.commitment.emit(Commitment.Rejected);
    }
}
