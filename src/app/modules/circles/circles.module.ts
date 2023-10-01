import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { CirclesRoutingModule } from './circles-routing.module';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';

@NgModule({
  declarations: [CirclesOverviewComponent],
  imports: [CommonModule, CirclesRoutingModule, MatButtonModule],
})
export class CirclesModule {}
