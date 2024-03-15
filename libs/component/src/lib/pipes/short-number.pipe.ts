import { Pipe, PipeTransform } from '@angular/core';

const fractionSize = 1;
const rounder = Math.pow(10, fractionSize);
const powers = [
    { key: 'Q', value: Math.pow(10, 15) },
    { key: 'T', value: Math.pow(10, 12) },
    { key: 'B', value: Math.pow(10, 9) },
    { key: 'M', value: Math.pow(10, 6) },
    { key: 'k', value: 1000 }
];

@Pipe({
    name: 'shortNumber',
    standalone: true
})
export class ShortNumberPipe implements PipeTransform {
    public transform(value: number | null): string {
        if (value === null) {
            return '';
        }

        if (value === 0) {
            return '0';
        }

        const isNegative = value < 0;

        let absValue = Math.abs(value);
        let key = '';

        for (let i = 0; i < powers.length; i++) {
            let reduced = absValue / powers[i].value;

            reduced = Math.round(reduced * rounder) / rounder;

            if (reduced >= 1) {
                absValue = reduced;
                key = powers[i].key;
                break;
            }
        }

        const shortNumber = (isNegative ? '-' : '') + absValue;
        return shortNumber.split('.')[0] + key;
    }
}
