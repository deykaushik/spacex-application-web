import { Component, OnInit, Output, EventEmitter, Input, Injector } from '@angular/core';
import { ApoService } from '../apo.service';
import { PayFromComponent } from '../pay-from/pay-from.component';
import { PaymentAmountComponent } from '../payment-amount/payment-amount.component';
import { PaymentDateComponent } from '../payment-date/payment-date.component';
import { SummaryComponent } from '../summary/summary.component';
import { IAutoPayDetail } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { AddStepItem } from '../../../shared/components/stepper-work-flow/add-step-item';
import { PreFillService } from '../../../core/services/preFill.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-apo-landing',
   templateUrl: './apo-landing.component.html'
})
export class ApoLandingComponent extends BaseComponent implements OnInit {
   @Input() plasticId: string;
   @Output() onHide = new EventEmitter();
   @Output() onSuccess = new EventEmitter();
   operationMode: string;
   accountId: string;
   isNetbankAccount: boolean;
   steppers: AddStepItem[];
   navigationSteps: string[];
   exitUrl: string;
   apoDetails: IAutoPayDetail;
   closeApoGAEvent = GAEvents.AutomaticPaymentOrder;

   constructor(private apoService: ApoService, private workflowService: WorkflowService,
      private prefillService: PreFillService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.apoService.emitApoSuccess.subscribe(response => {
         this.closeStepperOverlay(response);
      });
      this.operationMode = this.prefillService.preFillOperationMode;
      this.apoService.setId(this.plasticId);
      this.apoService.setMode(this.operationMode);
      this.navigationSteps = [];
      if (this.prefillService.preFillAutoPayDetail) {
         this.apoDetails = this.prefillService.preFillAutoPayDetail;
      } else {
         this.apoDetails = {} as IAutoPayDetail;
      }
      this.setApoOptions();
   }

   closeStepperOverlay(response) {
      this.showSuccess();
   }

   setApoOptions() {
      this.navigationSteps = ApoConstants.apo.steps;
      if (this.apoDetails.camsAccType === ApoConstants.apo.values.att) {
         this.steppers = [
            new AddStepItem(PayFromComponent),
            new AddStepItem(PaymentDateComponent),
            new AddStepItem(SummaryComponent)
         ];
         this.apoDetails.autoPayMethod = ApoConstants.apo.values.total;
         if (this.operationMode === ApoConstants.apo.values.edit) {
            this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: true, isValueChanged: false },
            { step: this.navigationSteps[2], valid: true, isValueChanged: false },
            { step: this.navigationSteps[3], valid: true, isValueChanged: false }];
         } else {
            this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: false, isValueChanged: false },
            { step: this.navigationSteps[2], valid: false, isValueChanged: false },
            { step: this.navigationSteps[3], valid: false, isValueChanged: false }];
         }
      } else {
         this.steppers = [
            new AddStepItem(PayFromComponent),
            new AddStepItem(PaymentAmountComponent),
            new AddStepItem(PaymentDateComponent),
            new AddStepItem(SummaryComponent)
         ];
         if (this.operationMode === ApoConstants.apo.values.edit) {
            this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: true, isValueChanged: false },
            { step: this.navigationSteps[1], valid: true, isValueChanged: false },
            { step: this.navigationSteps[2], valid: true, isValueChanged: false },
            { step: this.navigationSteps[3], valid: true, isValueChanged: false }];
         } else {
            this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: false, isValueChanged: false },
            { step: this.navigationSteps[1], valid: false, isValueChanged: false },
            { step: this.navigationSteps[2], valid: false, isValueChanged: false },
            { step: this.navigationSteps[3], valid: false, isValueChanged: false }];
         }
      }
      this.apoService.setAutoPayDetails(this.apoDetails);
   }

   showSuccess() {
      this.onSuccess.emit(false);
   }
   hideStepper(event) {
      this.sendEvent(this.closeApoGAEvent.dropOff.eventAction,
         this.closeApoGAEvent.dropOff.label, null, this.closeApoGAEvent.dropOff.category);
      this.onHide.emit(event);
   }
   onCurrentStepIndex(event: number) {
      if (this.apoDetails.camsAccType !== ApoConstants.apo.values.att) {
         switch (event) {
            case 1:
               this.sendEvent(this.closeApoGAEvent.dropOffFromPayFrom.eventAction,
                  this.closeApoGAEvent.dropOffFromPayFrom.label, null, this.closeApoGAEvent.dropOffFromPayFrom.category);
               break;
            case 2:
               this.sendEvent(this.closeApoGAEvent.dropOffFromPaymentAmount.eventAction,
                  this.closeApoGAEvent.dropOffFromPaymentAmount.label, null, this.closeApoGAEvent.dropOffFromPaymentAmount.category);
               break;
            case 3:
               this.sendEvent(this.closeApoGAEvent.dropOffFromPaymentDate.eventAction,
                  this.closeApoGAEvent.dropOffFromPaymentDate.label, null, this.closeApoGAEvent.dropOffFromPaymentDate.category);
               break;
         }
      } else {
         switch (event) {
            case 1:
               this.sendEvent(this.closeApoGAEvent.dropOffFromPayFrom.eventAction,
                  this.closeApoGAEvent.dropOffFromPayFrom.label, null, this.closeApoGAEvent.dropOffFromPayFrom.category);
               break;
            case 2:
               this.sendEvent(this.closeApoGAEvent.dropOffFromPaymentDate.eventAction,
                  this.closeApoGAEvent.dropOffFromPaymentDate.label, null, this.closeApoGAEvent.dropOffFromPaymentDate.category);
               break;
         }
      }
   }
}
