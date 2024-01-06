import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { isDefined } from '@vyf/base';
import { ImageUploadComponent, UserListItemComponent } from '@vyf/component';
import { Circle } from '@vyf/vote-circle-service';
import { filter, map, Observable, shareReplay } from 'rxjs';
import { Member } from '../../../shared/models';
import { createCircleCreateForm } from '../services/factory/forms.factory';
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
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule
    ],
    templateUrl: './circle-detail-settings-dialog.component.html',
    styleUrl: './circle-detail-settings-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsDialogComponent {
    public readonly view: CircleDetailSettingsDialogComponentView;
    public readonly circleImageSrc$: Observable<string>;
    public readonly form = createCircleCreateForm();
    public readonly selectedTab = new FormControl(0);

    private readonly dialogRef: MatDialogRef<CircleDetailSettingsDialogComponent, null> = inject(MatDialogRef<CircleDetailSettingsDialogComponent, null>);
    private readonly circleData: CircleDetailSettingsDialogComponentView = inject(MAT_DIALOG_DATA);
    private readonly store = inject(Store);

    constructor() {
        this.view = this.circleData;

        this.circleImageSrc$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            filter(circle => isDefined(circle)),
            map(circle => circle as Circle),
            map(circle => circle.imageSrc),
            shareReplay()
        );

        // TODO check if user is eligible to edit circle
        // this.store.selectSnapshot(CirclesSelectors.canEditCircle)

        if (this.view?.selectedTabIndex) {
            this.selectedTab.setValue(this.view.selectedTabIndex);
        }

        this.form.patchValue(this.view.circle);
    }

    public close() {
        this.dialogRef.close(null);
    }

    public onCircleImageSelected(image: File): void {
        this.store.dispatch(new CirclesAction.UpdateCircleImage(image));
    }
}
