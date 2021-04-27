import { Observable } from 'rxjs/Observable';
import { Component, OnInit, HostListener } from '@angular/core';
import { PreFillService } from '../../core/services/preFill.service';
import { TransferService } from './../transfer.service';
import { TransferAmountComponent } from './../transfer-amount/transfer-amount.component';
import { TransferReviewComponent } from './../transfer-review/transfer-review.component';
import { Constants } from './../../core/utils/constants';
import { TransferStep } from '../transfer.models';
import { IWorkflowContainerComponent, IStepInfo, IWorkflow } from '../../shared/components/work-flow/work-flow.models';
import { ActivatedRoute } from '@angular/router';

@Component({
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, IWorkflowContainerComponent {

   workflowInfo: IWorkflow;
   steps: any[];
   accountNumberFromDashboard?: string;

   constructor(public transferService: TransferService, private route: ActivatedRoute, private preFillService: PreFillService) {
      this.route.params.subscribe(params => this.accountNumberFromDashboard = params.accountnumber);
    }

   canDeactivate(): Observable<boolean> | boolean {
      return !this.transferService.checkDirtySteps();
   }
   get isDirty() {
      return this.transferService.checkDirtySteps();
   }
   ngOnInit() {
      this.transferService.initializeTransferWorkflow();
      this.initializeWorkFlowSteps();
      this.transferService.transferWorkflowSteps.amountStep.model.accountFromDashboard = this.accountNumberFromDashboard;
      this.fillTransferData();
      this.workflowInfo = <IWorkflow> {
        title : 'transfer',
        cancelButtonText : Constants.VariableValues.cancelButtonText,
        cancelRouteLink : '/dashboard'
      };
   }

   nextClick(currentStep: number) {
   }

   stepClick(stepInfo: IStepInfo) {
   }

   private initializeWorkFlowSteps() {
      this.steps = [
         {
            summary: this.transferService.getStepSummary(TransferStep.amount, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: TransferAmountComponent
         },
         {
            summary: this.transferService.getStepSummary(TransferStep.review, true),
            buttons: {
               next: {
                  text: Constants.labels.transferDoneText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: TransferReviewComponent
         }];
   }

   /* Fill the pre-transfer data which are amount and to-transfer-account into models and then erase the data in prefill service */
   fillTransferData() {
      const transferData = this.preFillService.settlementDetail;
      if (transferData && transferData.accountToTransfer && transferData.settlementAmt) {
         this.transferService.transferWorkflowSteps.amountStep.model.accountToTransfer = transferData.accountToTransfer.ItemAccountId;
         this.transferService.transferWorkflowSteps.amountStep.model.amount = transferData.settlementAmt;
         this.preFillService.settlementDetail = null;
      } else {
         this.transferService.transferWorkflowSteps.amountStep.model.accountToTransfer = undefined;
         this.transferService.transferWorkflowSteps.amountStep.model.amount = undefined;
      }
   }
}
