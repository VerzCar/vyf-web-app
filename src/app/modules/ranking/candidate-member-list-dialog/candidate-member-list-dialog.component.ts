import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-candidate-member-list-dialog',
    templateUrl: './candidate-member-list-dialog.component.html',
    styleUrls: ['./candidate-member-list-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateMemberListDialogComponent {}
