import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LandingComponent } from './landing/landing.component';
import { SharedModule } from './../shared/shared.module';
import { TransferAmountComponent } from './transfer-amount/transfer-amount.component';
import { TransferReviewComponent } from './transfer-review/transfer-review.component';
import { TransferStatusComponent } from './transfer-status/transfer-status.component';
import { TransferRoutingModule } from './transfer-routing.module';
import { TransferService } from './transfer.service';
import { ReportsModule } from '../reports/reports.module';
import { TransferPopComponent } from '../reports/templates/transfer-pop/transfer-pop.component';
import { BsModalService, BsModalRef, ModalBackdropComponent } from 'ngx-bootstrap';

@NgModule({
   imports: [
      FormsModule,
      CommonModule,
      SharedModule,
      TransferRoutingModule,
      ReportsModule
   ],
   declarations: [LandingComponent, TransferAmountComponent, TransferReviewComponent,
      TransferStatusComponent],
   entryComponents: [TransferAmountComponent, TransferReviewComponent, TransferStatusComponent],
   providers: [TransferService, DatePipe, BsModalService, BsModalRef, ModalBackdropComponent, TransferService]
})
export class TransferModule { }
