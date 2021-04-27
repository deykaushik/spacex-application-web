import { UnitTrustsStatusComponent } from './unit-trusts-status/unit-trusts-status.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './../../shared/shared.module';
import { UnitTrustsRoutingModule } from './unit-trusts-routing.module';
import { UnitTrustsService } from './unit-trusts.service';
import { LandingComponent } from './landing/landing.component';
import { UnitTrustsBuyComponent } from './unit-trusts-buy/unit-trusts-buy.component';
import { UnitTrustsReviewComponent } from './unit-trusts-review/unit-trusts-review.component';
import { UnitTrustWidgetComponent } from './unit-trust-widget/unit-trust-widget.component';

@NgModule({
   imports: [
      CommonModule,
      UnitTrustsRoutingModule,
      FormsModule,
      SharedModule
   ],
   declarations: [
      LandingComponent,
      UnitTrustsBuyComponent,
      UnitTrustsReviewComponent,
      UnitTrustsStatusComponent,
      UnitTrustWidgetComponent
   ],
   entryComponents: [
      UnitTrustsBuyComponent,
      UnitTrustsReviewComponent,
      UnitTrustsStatusComponent
   ],
   providers: [
      UnitTrustsService
   ]
})
export class UnitTrustsModule { }
