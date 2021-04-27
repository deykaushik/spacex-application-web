import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChargesAndFeesRoutingModule } from './charges-and-fees-routing.module';
import { ChargesAndFeesStatusComponent } from './charges-and-fees-status/charges-and-fees-status.component';
import { ChargesAndFeesReviewComponent } from './charges-and-fees-review/charges-and-fees-review.component';
import { LandingComponent } from './landing/landing.component';
import { ChargesAndFeesPayComponent } from './charges-and-fees-pay/charges-and-fees-pay.component';
import { ChargesAndFeesService } from './charges-and-fees.service';


@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      ChargesAndFeesRoutingModule
   ],
   declarations: [
      ChargesAndFeesStatusComponent,
      ChargesAndFeesReviewComponent,
      LandingComponent,
      ChargesAndFeesPayComponent
   ],
   entryComponents: [
      ChargesAndFeesStatusComponent,
      ChargesAndFeesReviewComponent,
      ChargesAndFeesPayComponent
   ],
   providers: [
      ChargesAndFeesService
   ]
})
export class ChargesAndFeesModule {}
