import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Router, PreloadAllModules } from '@angular/router';

import { Constants } from './../../core/utils/constants';
import { CommonUtility } from './../../core/utils/common';
import { TransferService } from './../../transfer/transfer.service';
import { ITransferDetail } from '../../core/services/models';
import { ITransferAmountVm } from '../transfer.models';
import { BaseComponent } from '../../core/components/base/base.component';
import { ReportsService } from '../../reports/reports.service';
import { TransferPopComponent } from '../../reports/templates/transfer-pop/transfer-pop.component';
import { SystemErrorService } from '../../core/services/system-services.service';

@Component({
   selector: 'app-transfer-status',
   templateUrl: './transfer-status.component.html',
   styleUrls: ['./transfer-status.component.scss']
})
export class TransferStatusComponent extends BaseComponent implements OnInit, OnDestroy {
   heading: string;
   transferDetail: ITransferDetail;
   successful: boolean;
   disableRetryButton = false;
   labels = Constants.labels;
   formats = Constants.formats;
   requestInprogress = false;
   transferAmountVm: ITransferAmountVm;
   fromAccountNickName: string;
   toAccountNickName: string;
   private transferRetryTimes = 1;
   isButtonLoader: boolean;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   responseErrorStatus: boolean;

   constructor(public router: Router, private transferService: TransferService,
      injector: Injector, private reportsService: ReportsService) {
      super(injector);
   }
   print() {
      this.reportsService.open(TransferPopComponent, {
         transferDetails: this.transferDetail, transferAmountVm: this.transferAmountVm
      }, { title: 'Printing Proof of Transfer' });
   }
   private disableRetry(value: boolean) {
      this.successful = value;
      this.disableRetryButton = value;
   }

   ngOnInit() {
      if (this.transferService.isTransferStatusNavigationAllowed()) {
         this.transferAmountVm = this.transferService.getTransferAmountVm();
         // set account type names
         this.fromAccountNickName = this.transferAmountVm.selectedFromAccount.nickname;
         this.toAccountNickName = this.transferAmountVm.selectedToAccount.nickname;
         this.setTransactionStatus();
      } else {
         this.router.navigateByUrl(Constants.routeUrls.transferLanding);
      }
   }
   ngOnDestroy() {
      this.transferService.clearTransferDetails();
   }
   newTransfer() {
      this.transferService.clearTransferDetails();
      this.router.navigateByUrl(Constants.routeUrls.transferLanding);
   }
   goToDashboard() {
      this.transferService.clearTransferDetails();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }
   private handleButtonState(isEnabled: boolean) {
      this.requestInprogress = isEnabled;
      this.isButtonLoader = isEnabled;
   }
   retryTransfer() {
      if (this.transferRetryTimes <= Constants.VariableValues.maximumTransferAttempts) {
         this.transferRetryTimes++;
         this.handleButtonState(true);
         if (!this.transferService.isAPIFailure) {
            this.transferService.createGUID();
         }
         this.transferService.makeTransfer().subscribe((validationResponse) => {
            this.handleButtonState(false);
            if (this.transferService.isTransferStatusValid(validationResponse)) {
               this.handleButtonState(true);
               this.transferService.makeTransfer(false).subscribe((paymentResponse) => {
                  this.handleButtonState(false);
                  if (this.transferService.isTransferStatusValid(paymentResponse)) {
                     this.transferService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.transferService.updateexecEngineRef(
                        paymentResponse.resultData[0].execEngineRef ||
                        paymentResponse.resultData[0].transactionID);
                     this.disableRetry(true);
                  } else {
                     this.disableRetry(false);
                  }
                  this.transferService.isAPIFailure = false;
               }, (error) => {
                  /* disallow tu submit again , because user may pay have duplicate transaction,
                      till now FE dont know whether Trxn happened or not  */
                  this.handleButtonState(false);
                  this.setTransactionStatus();
                  this.transferService.raiseSystemErrorforAPIFailure();
               });
            } else {
               this.disableRetry(false);
            }
         }, (error) => {
            this.disableRetry(false);
            this.handleButtonState(false);
         });
      } else {
         this.disableRetryButton = true;
         this.transferDetail.errorMessage = this.labels.transferRetryMessage;
      }
   }
   private setTransactionStatus() {
      /* condition for succesful and unsuccessful*/
      this.transferDetail = this.transferService.getTransferDetailInfo();
      if (this.transferDetail.transactionID) {
         this.successful = true;
         this.heading = Constants.labels.transferSuccess;
      } else {
         this.successful = false;
         this.heading = Constants.labels.transferFailed;
      }
   }

   public get isNoResponseReceived(): boolean {
      return this.transferService.isAPIFailure;
   }


}
