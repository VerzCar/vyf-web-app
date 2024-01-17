import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { WarningDialogComponent, WarningDialogData } from '@vyf/component';
import { of, switchMap, tap } from 'rxjs';
import { CirclesAction } from '../../state/actions/circles.action';

@Component({
    selector: 'app-circle-detail-settings-actions',
    standalone: true,
    imports: [
        MatButtonModule
    ],
    templateUrl: './circle-detail-settings-actions.component.html',
    styleUrl: './circle-detail-settings-actions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsActionsComponent {
    @Output() public afterRouting = new EventEmitter<void>();
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);
    private readonly store = inject(Store);

    public onDeleteCircle(): void {
        const warningData: WarningDialogData = {
            title: 'Delete Circle',
            msg: 'You\'re about to delete this circle. This action is not reversible. Are you sure you want to delete this circle?',
            confirmText: 'Delete'
        };
        this.dialog.open(
            WarningDialogComponent, {
                disableClose: true,
                width: '500px',
                data: warningData
            }).afterClosed()
            .pipe(
                switchMap((confirmed: boolean) => {
                    if (confirmed) {
                        return this.store.dispatch(new CirclesAction.DeleteCircle()).pipe(
                            switchMap(() => this.router.navigate(['/circles'])),
                            tap(() => this.afterRouting.emit())
                        );
                    }
                    return of(void 0);
                })
            ).subscribe();
    }
}
