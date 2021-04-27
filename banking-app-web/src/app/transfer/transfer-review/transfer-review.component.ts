import { Component, OnInit, EventEmitter, Output, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '../../core/utils/constants';
import { TransferService } from './../transfer.service';

import { TransferDetail, ITransferReviewVm, ITransferAmountVm } from '../transfer.models';
import { IWorkflowChildComponentWithLoader, IStepInfo } from '../../shared/components/work-flow/work-flow.models';
import { CommonUtility } from '../../core/utils/common';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   templateUrl: './transfer-review.component.html',
   styleUrls: ['./transfer-review.component.scss']
})
export class TransferReviewComponent extends BaseComponent implements OnInit, IWorkflowChildComponentWithLoader {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();

   labels = Constants.labels;
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   vm: ITransferAmountVm;
   transferDetails: TransferDetail;
   tansferAmmountVm: ITransferAmountVm;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;

   constructor(public router: Router, private transferService: TransferService,
      injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.vm = this.transferService.getTransferAmountVm();
      this.isComponentValid.emit(true);
      this.transferDetails = this.transferService.getTransferDetailInfo();
      this.tansferAmmountVm = this.transferService.getTransferAmountVm();
      this.vm.repeatStatusText = CommonUtility.getJourneyOccuranceMessage(this.vm.reoccurrenceItem.reoccurrenceFrequency,
         this.vm.repeatType, this.vm.endDate, this.vm.reoccurrenceItem.reoccurrenceOccur);
   }

   nextClick(currentStep: number) {
      this.transferService.createGUID();
      this.isButtonLoader.emit(true);
      this.vm = CommonUtility.removeObjectKeyValue(this.vm);
      this.transferService.saveTransferReviewInfo(this.vm);
      this.transferService.transferWorkflowSteps.reviewStep.isDirty = true;
      this.transferService.makeTransfer().subscribe((validationResponse) => {
         if (this.transferService.isTransferStatusValid(validationResponse)) {
            this.transferService.makeTransfer(false).subscribe((transferResponse) => {
               if (this.transferService.isTransferStatusValid(transferResponse)) {
                  this.transferService.updateTransactionID(transferResponse.resultData[0].transactionID);
                  this.transferService.updateexecEngineRef(
                     transferResponse.resultData[0].execEngineRef ||
                     transferResponse.resultData[0].transactionID);
                  this.router.navigateByUrl(Constants.routeUrls.transferStatus);
               } else {
                  this.router.navigateByUrl(Constants.routeUrls.transferStatus);
               }
               this.transferService.isAPIFailure = false;
            }, (error) => {
               this.isButtonLoader.emit(false);
               this.transferService.raiseSystemErrorforAPIFailure();
            });
         } else {
            this.router.navigateByUrl(Constants.routeUrls.transferStatus);
         }
      }, (error) => {
         this.isButtonLoader.emit(false);
      });
      this.sendEvent('transfer_review_click_on_transfer');
   }

   stepClick(stepInfo: IStepInfo) {
   }

}
