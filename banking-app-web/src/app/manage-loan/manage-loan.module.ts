import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { ManageLoanRoutingModule } from './manage-loan-routing.module';
import { ManageLoanService } from './manage-loan.service';
import { AccountService } from '../dashboard/account.service';
import { LandingComponent } from './landing/landing.component';
import { PlaceNoticeComponent } from './place-notice/place-notice.component';
import { CancelLoanComponent } from './cancel-loan/cancel-loan.component';
import { NoticeDetailsComponent } from './notice-details/notice-details.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
   imports: [
      CommonModule,
      SharedModule,
      ManageLoanRoutingModule
   ],
   declarations: [LandingComponent, PlaceNoticeComponent, CancelLoanComponent, NoticeDetailsComponent, ConfirmModalComponent],
   providers: [ManageLoanService, AccountService]
})
export class ManageLoanModule { }
