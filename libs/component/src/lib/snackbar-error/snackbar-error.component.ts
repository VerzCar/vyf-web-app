import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

export interface SnackbarErrorComponentData {
    message: string;
    httpError?: HttpErrorResponse;
}

@Component({
    selector: 'vyf-snackbar-error',
    standalone: true,
    imports: [
        MatSnackBarLabel,
        FeatherIconModule,
        JsonPipe
    ],
    template: `
        <span matSnackBarLabel>
          <i-feather name="alert-circle" class="align-top text-red-500 mr-1"></i-feather>
            {{ data.message }}
            @if (data.httpError) {
                <br>
                <span class="text-sm">
                    url: {{ data.httpError.url }}<br>
                    status: {{ data.httpError.status }}<br>
                    error: {{ data.httpError.error | json }}<br>
                    message: {{ data.httpError.message }}<br>
                </span>
            }
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
