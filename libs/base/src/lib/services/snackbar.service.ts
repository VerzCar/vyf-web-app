import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    private readonly _snackBar = inject(MatSnackBar);

    private readonly defaultConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
    };

    public open(
        message: string,
        action?: string | undefined,
        config?: MatSnackBarConfig<any> | undefined
    ): MatSnackBarRef<TextOnlySnackBar> {
        return this._snackBar.open(message, action, { ...this.defaultConfig, ...config });
    }

    public openFrom<C>(
        component: ComponentType<C>,
        config?: MatSnackBarConfig<any> | undefined
    ): MatSnackBarRef<C> {
        return this._snackBar.openFromComponent(component, { ...this.defaultConfig, ...config });
    }

    public openSuccess<C, D>(
        component: ComponentType<C>,
        data: D
    ): MatSnackBarRef<C> {
        const config: MatSnackBarConfig = {
            data,
            panelClass: 'success'
        };
        return this.openFrom(component, config);
    }

    public openError<C, D>(
        component: ComponentType<C>,
        data: D
    ): MatSnackBarRef<C> {
        const config: MatSnackBarConfig = {
            data,
            panelClass: 'error'
        };
        return this.openFrom(component, config);
    }
}
