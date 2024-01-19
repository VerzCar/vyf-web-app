import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

export interface SnackbarSuccessComponentData {
    message: string;
    linkToLabel?: string;
    linkToHref?: string;
}

@Component({
    selector: 'vyf-snackbar-success',
    standalone: true,
    imports: [
        MatSnackBarLabel,
        FeatherIconModule,
        RouterLink
    ],
    template: `
        <span matSnackBarLabel>
          <i-feather name="check" class="align-top text-green-500"></i-feather>
            {{ data.message }}
            @if (data.linkToHref) {
                <a [routerLink]="data.linkToHref"
                   class="text-blue-500 ml-1">
                    {{ data.linkToLabel }}
                </a>
            }
       </span>
    `,
    styles: `
        :host {@apply flex;}
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarSuccessComponent {
    public readonly data: SnackbarSuccessComponentData;

    private readonly snackBarRef: MatSnackBarRef<SnackbarSuccessComponent> = inject(MatSnackBarRef<SnackbarSuccessComponent>);

    constructor() {
        this.data = this.snackBarRef.containerInstance.snackBarConfig.data;
    }
}
