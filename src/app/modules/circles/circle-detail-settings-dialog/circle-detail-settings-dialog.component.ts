import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { ImageUploadComponent, UserListItemComponent, WarningDialogComponent } from '@vyf/component';
import { Circle } from '@vyf/vote-circle-service';
import { FeatherModule } from 'angular-feather';
import { CircleDetailEditFormComponent } from '../circle-detail-edit-form/circle-detail-edit-form.component';
import { CirclesSelectors } from '../state/circles.selectors';
import { CircleDetailSettingsActionsComponent } from './circle-detail-settings-actions/circle-detail-settings-actions.component';
import { CircleDetailSettingsImageComponent } from './circle-detail-settings-image/circle-detail-settings-image.component';
import { CircleDetailSettingsMembersComponent } from './circle-detail-settings-members/circle-detail-settings-members.component';

export interface CircleDetailSettingsDialogComponentView {
    circle: Circle;
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
        WarningDialogComponent,
        CircleDetailSettingsMembersComponent,
        CircleDetailSettingsImageComponent,
        CircleDetailSettingsActionsComponent
    ],
    templateUrl: './circle-detail-settings-dialog.component.html',
    styleUrl: './circle-detail-settings-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsDialogComponent {
    public readonly view: CircleDetailSettingsDialogComponentView;
    public readonly selectedTab = new FormControl(0);
    public canEditCircle = false;

    private readonly dialogRef: MatDialogRef<CircleDetailSettingsDialogComponent, null> = inject(MatDialogRef<CircleDetailSettingsDialogComponent, null>);
    private readonly circleData: CircleDetailSettingsDialogComponentView = inject(MAT_DIALOG_DATA);
    private readonly store = inject(Store);

    constructor() {
        this.view = this.circleData;

        if (this.view?.selectedTabIndex) {
            this.selectedTab.setValue(this.view.selectedTabIndex);
        }

        this.canEditCircle = this.store.selectSnapshot(CirclesSelectors.canEditCircle);
    }

    public close() {
        this.dialogRef.close(null);
    }
}
