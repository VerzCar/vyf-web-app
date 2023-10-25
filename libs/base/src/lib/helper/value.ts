import { isDefined } from './guards';

export const isEmptyValue = (value: string | number | boolean | Date | []): boolean => {
    if (!isDefined(value)) {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'boolean') {
        return !value;
    }

    return value === '';
};
