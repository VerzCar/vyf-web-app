import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, InjectionToken, isDevMode } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActionContext, Actions, ActionStatus, ActionType } from '@ngxs/store';
import { filter, tap } from 'rxjs';

export const ERROR_ACTIONS = new InjectionToken<Set<string>>('Actions of errors that will be tracked against failures', {
    providedIn: 'any',
    factory: () => new Set<string>()
});

export const ERROR_ACTION_EXECUTOR = new InjectionToken<(error?: HttpErrorResponse) => void>('Takes a function that will be executed if any of the provided ERROR_ACTIONS will fail.', {
    providedIn: 'any',
    factory: () => () => {}
});

export const actionsSetFactory = (actionTypes?: ActionType[]) => actionTypes ? new Set(actionTypes.map(at => at.type)) : new Set();

@Injectable()
export class ActionNotificationService {

    private readonly actions = inject(Actions);
    private readonly errorActions = inject(ERROR_ACTIONS);
    private readonly errorActionExecutor = inject(ERROR_ACTION_EXECUTOR);

    constructor() {
        this.actions.pipe(
            filter((actionContext) =>
                actionContext.status === ActionStatus.Errored
                && this.hasType(actionContext, this.errorActions)),
            tap({
                next: action => this.executeErrored(action)
            }),
            takeUntilDestroyed()
        ).subscribe();
    }

    private hasType(actionContext: ActionContext, types: Set<string>): boolean {
        const type = actionContext.action.constructor?.type;
        return type ? types.has(type) : false;
    };

    private executeErrored(actionContext: ActionContext): void {
        if (actionContext.error instanceof HttpErrorResponse) {
            const error = isDevMode() ? actionContext.error as HttpErrorResponse : undefined;
            this.errorActionExecutor(error);
        }
    }
}
