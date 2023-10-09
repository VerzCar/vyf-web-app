import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { VyfRoutingModule } from './vyf-routing.module';
import { VyfLandingComponent } from './vyf-landing/vyf-landing.component';
import { Vyf404Component } from './vyf-404/vyf-404.component';

@NgModule({
  declarations: [VyfLandingComponent, Vyf404Component],
  imports: [CommonModule, VyfRoutingModule, MatButtonModule],
})
export class VyfModule {}
