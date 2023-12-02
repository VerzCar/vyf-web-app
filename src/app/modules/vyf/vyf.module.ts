import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Vyf404Component } from './vyf-404/vyf-404.component';
import { VyfLandingComponent } from './vyf-landing/vyf-landing.component';

import { VyfRoutingModule } from './vyf-routing.module';

@NgModule({
    declarations: [VyfLandingComponent, Vyf404Component],
    imports: [CommonModule, VyfRoutingModule, MatButtonModule]
})
export class VyfModule {}
