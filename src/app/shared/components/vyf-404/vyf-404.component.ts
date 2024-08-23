import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-vyf-404',
    templateUrl: './vyf-404.component.html',
    styleUrls: ['./vyf-404.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Vyf404Component {}
