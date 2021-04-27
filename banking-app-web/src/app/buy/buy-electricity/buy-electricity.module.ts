import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuyElectricityRoutingModule } from './buy-electricity-routing.module';
import { SharedModule } from './../../shared/shared.module';

import { LandingComponent } from './landing/landing.component';
import { BuyElectricityToComponent } from './buy-electricity-to/buy-electricity-to.component';
import { BuyElectricityReviewComponent } from './buy-electricity-review/buy-electricity-review.component';
import { BuyElectricityAmountComponent } from './buy-electricity-amount/buy-electricity-amount.component';
import { BuyElectricityStatusComponent } from './buy-electricity-status/buy-electricity-status.component';
import { BuyElectricityForComponent } from './buy-electricity-for/buy-electricity-for.component';

import { BuyElectricityService } from './buy-electricity.service';

@NgModule({
   imports: [
      CommonModule,
      BuyElectricityRoutingModule,
      FormsModule,
      SharedModule
   ],
   declarations: [LandingComponent, BuyElectricityToComponent, BuyElectricityAmountComponent, BuyElectricityForComponent,
      BuyElectricityReviewComponent, BuyElectricityStatusComponent],
   entryComponents: [BuyElectricityToComponent, BuyElectricityForComponent, BuyElectricityAmountComponent,
      BuyElectricityReviewComponent, BuyElectricityStatusComponent],
   providers: [BuyElectricityService, DatePipe]
})
export class BuyElectricityModule { }
