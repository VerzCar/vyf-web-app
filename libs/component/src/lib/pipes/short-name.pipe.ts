import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortName',
    standalone: true
})
export class ShortNamePipe implements PipeTransform {
    public transform(name: string): string {
        if (name.length > 2) {
            return (name.charAt(0) + name.charAt(1)).toUpperCase();
        }
        return '';
    }
}
