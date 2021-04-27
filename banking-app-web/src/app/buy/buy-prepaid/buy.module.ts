import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuyRoutingModule } from './buy-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { LandingComponent } from './landing/landing.component';
import { BuyToComponent } from './buy-to/buy-to.component';
import { BuyReviewComponent } from './buy-review/buy-review.component';
import { BuyAmountComponent } from './buy-amount/buy-amount.component';
import { BuyStatusComponent } from './buy-status/buy-status.component';
import { BuyService } from './buy.service';
import { BuyForComponent } from './buy-for/buy-for.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@NgModule({
   imports: [
      CommonModule,
      BuyRoutingModule,
      FormsModule,
      SharedModule
   ],
   declarations: [LandingComponent, BuyToComponent, BuyAmountComponent,
      BuyForComponent, BuyReviewComponent, BuyStatusComponent],
   entryComponents: [BuyToComponent, BuyForComponent, BuyAmountComponent, BuyReviewComponent, BuyStatusComponent],
   providers: [BuyService, DatePipe, DecimalPipe, BsModalService, BsModalRef]
})
export class BuyModule { }
