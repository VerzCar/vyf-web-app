import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CirclesRoutingModule } from './circles-routing.module';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';

@NgModule({
  declarations: [CirclesOverviewComponent],
  imports: [CommonModule, CirclesRoutingModule],
})
export class CirclesModule {}
