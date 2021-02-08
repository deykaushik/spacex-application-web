import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from './dashboard.service';



@NgModule({
  declarations: [FilterComponent, FlightListComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
