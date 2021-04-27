import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { AccountService } from '../dashboard/account.service';
import { FeedbackService } from './feedback.service';
import { FeedbackTryAgainComponent } from './feedback-try-again/feedback-try-again.component';
import { ReportSuspiciousComponent } from './report-suspicious/report-suspicious.component';
import { FeedbackAttemptsComponent } from './feedback-attempts/feedback-attempts.component';
import { FeedbackComponent } from './feedback.component';
import { CallMeBackComponent } from './call-me-back/call-me-back.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';

@NgModule({
   imports: [
      FeedbackRoutingModule,
      FormsModule,
      SharedModule,
      CommonModule
   ],
   entryComponents: [FeedbackComponent],
   declarations: [FeedbackComponent, CallMeBackComponent, SendFeedbackComponent,
      ReportSuspiciousComponent, FeedbackAttemptsComponent, FeedbackTryAgainComponent],
   providers: [FeedbackService, AccountService]
})
export class FeedbackModule { }
