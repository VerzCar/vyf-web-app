import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from '../../../routes';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
    public readonly currentDate = new Date();
    public readonly route = Route;

    public readonly routes = [];
}
