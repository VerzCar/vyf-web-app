import { DatePipeConfig } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export const langCodeFactory = (translate: TranslateService) => translate.getBrowserLang() ?? 'en';

export const timezoneFactory = (): DatePipeConfig => ({
    timezone: new Date().getTimezoneOffset().toString()
});
