import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { ActionType } from '@ngxs/store';
import { ActionNotificationService, actionsSetFactory, ERROR_ACTIONS } from './action-notification.service';

@NgModule()
export class ActionNotificationModule {
    private readonly scv = inject(ActionNotificationService);

    public static forRoot(options?: { errorTrackedActions?: ActionType[]; }): ModuleWithProviders<ActionNotificationModule> {
        return {
            ngModule: ActionNotificationModule,
            providers: [
                ActionNotificationService,
                {
                    provide: ERROR_ACTIONS,
                    useFactory: () => actionsSetFactory(options?.errorTrackedActions)
                }
            ]
        };
    }
}
