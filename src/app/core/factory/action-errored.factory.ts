import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@vyf/base';
import { SnackbarErrorComponent, SnackbarErrorComponentData } from '@vyf/component';

export const actionErroredFactory = (snackbar: SnackbarService) =>
    (error?: HttpErrorResponse) => {
        const data: SnackbarErrorComponentData = {
            message: 'That did not worked out, we are sorry. Please try again.',
            httpError: error
        };
        snackbar.openError(SnackbarErrorComponent, data);
    };
