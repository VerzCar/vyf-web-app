import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

export interface SnackbarErrorComponentData {
    message: string;
    linkToLabel?: string;
    linkToHref?: string;
}

@Component({
    selector: 'vyf-snackbar-error',
    standalone: true,
    imports: [
        MatSnackBarLabel,
        FeatherIconModule
    ],
    template: `
        <span matSnackBarLabel>
          <i-feather name="alert-circle" class="align-top text-red-500 mr-1"></i-feather>
            {{ data.message }}
       </span>
    `,
    styles: `
        :host {@apply flex;}
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarErrorComponent {
    public readonly data: SnackbarErrorComponentData;

    private readonly snackBarRef: MatSnackBarRef<SnackbarErrorComponent> = inject(MatSnackBarRef<SnackbarErrorComponent>);

    constructor() {
        this.data = this.snackBarRef.containerInstance.snackBarConfig.data;
    }
}
