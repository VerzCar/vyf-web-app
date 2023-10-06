import { Pipe, PipeTransform } from '@angular/core';
import { Commitment } from '@vyf/vote-circle-service';

@Pipe({
    name: 'circleMemberCommitment',
    standalone: true
})
export class CircleMemberCommitmentPipe implements PipeTransform {
    public transform(commitment: Commitment, ...args: unknown[]): string {
        switch (commitment) {
            case Commitment.Open:
                return 'Open Request';
            case Commitment.Committed:
                return 'Committed';
            case Commitment.Rejected:
                return 'Rejected';
            default:
                return '';
        }
    }
}
