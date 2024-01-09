import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { isDefined } from '@vyf/base';
import { ImageUploadComponent, UserListItemComponent, WarningDialogComponent, WarningDialogData } from '@vyf/component';
import { Circle } from '@vyf/vote-circle-service';
import { FeatherModule } from 'angular-feather';
import { filter, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Member } from '../../../shared/models';
import { CircleDetailEditFormComponent } from '../circle-detail-edit-form/circle-detail-edit-form.component';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

export interface CircleDetailSettingsDialogComponentView {
    circle: Circle;
    owner: Member;
    members: Member[];
    membersCount: number;
    disabled: boolean;
    selectedTabIndex?: number;
}

@Component({
    selector: 'app-circle-detail-settings-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatTabsModule,
        ImageUploadComponent,
        RxFor,
        UserListItemComponent,
        CircleDetailEditFormComponent,
        FormsModule,
        FeatherModule,
        MatButtonModule,
        WarningDialogComponent
    ],
    templateUrl: './circle-detail-settings-dialog.component.html',
    styleUrl: './circle-detail-settings-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsDialogComponent {
    public readonly view: CircleDetailSettingsDialogComponentView;
    public readonly circleImageSrc$: Observable<string>;
    public readonly selectedTab = new FormControl(0);

    private readonly dialogRef: MatDialogRef<CircleDetailSettingsDialogComponent, null> = inject(MatDialogRef<CircleDetailSettingsDialogComponent, null>);
    private readonly circleData: CircleDetailSettingsDialogComponentView = inject(MAT_DIALOG_DATA);
    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);

    constructor() {
        this.view = this.circleData;

        this.circleImageSrc$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            filter(circle => isDefined(circle)),
            map(circle => circle as Circle),
            map(circle => circle.imageSrc),
            shareReplay()
        );

        if (this.view?.selectedTabIndex) {
            this.selectedTab.setValue(this.view.selectedTabIndex);
        }
    }

    public close() {
        this.dialogRef.close(null);
    }

    public onCircleImageSelected(image: File): void {
        this.store.dispatch(new CirclesAction.UpdateCircleImage(image));
    }

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
                            tap(() => this.close())
                        );
                    }
                    return of(void 0);
                })
            ).subscribe();
    }
}
