import { Component, OnInit, Injector } from '@angular/core';
import * as moment from 'moment';
import { ApoService } from '../apo.service';
import { IAutopayPaymentDate, IAutoPayDetail, IInrangeDateSeletor } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { CommonUtility } from '../../../core/utils/common';
import { BaseComponent } from '../../../core/components/base/base.component';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-payment-date',
   templateUrl: './payment-date.component.html',
   styleUrls: ['./payment-date.component.scss']
})
export class PaymentDateComponent extends BaseComponent implements OnInit {
   operationMode: string;
   inrangeDateSelector: IInrangeDateSeletor;
   values = ApoConstants.apo.values;
   autoPayModelDetails: IAutoPayDetail;
   accountId: number;
   dueDay: number;
   statementDay: number;
   isValidDaySelected: boolean;
   statementDateObj;
   selectedDate: IAutopayPaymentDate;
   selectedAutoPayDay: IAutopayPaymentDate;
   paymentDateLabels = ApoConstants.apo.autopayLabels;
   selectLabels = ApoConstants.apo.selectLabels;
   selectedDayObj: IAutopayPaymentDate;
   workflowSteps: IStepper[];
   autoPay = ApoConstants.apo;
   isAutoPayTerm: boolean;
   paymentOrder: string;
   isPaymentOrder: boolean;
   statementDate: string;
   paymentDateGAEvents = GAEvents.AutomaticPaymentOrder;

   constructor(private autopayService: ApoService, private workflowService: WorkflowService, injector: Injector) {
      super(injector);
   }
   ngOnInit() {
      this.selectedDate = {} as IAutopayPaymentDate;
      this.autoPayModelDetails = {} as IAutoPayDetail;
      this.inrangeDateSelector = {} as IInrangeDateSeletor;
      this.isPaymentOrder = false;
      this.inrangeDateSelector.title = this.paymentDateLabels.selectPreferredDate;
      this.inrangeDateSelector.warningMsg = ApoConstants.inRangeDateSelector.apo.warningMsg;
      this.autoPayModelDetails = this.autopayService.getAutoPayDetails();
      this.operationMode = this.autopayService.getMode();
      this.workflowSteps = this.workflowService.workflow;
      this.setStatementDate();
      this.statementDate = moment(this.autoPayModelDetails.statementDate).format(this.values.dateFormat);
      if (this.operationMode === this.values.edit || this.workflowSteps[2].valid) {
         this.populateFields();
      }
      this.isAutoPayTerm = (this.autoPayModelDetails.monthlyPaymentDay === this.autoPay.values.zero) ? true : false;
   }
   /* Getting the selected day object emitted from the in range selector component */
   public handleDayClickEvent(paymentDate: IAutopayPaymentDate) {
      this.isValidDaySelected = paymentDate.isValid;
      this.setPaymentDate(paymentDate);
   }
   public populateFields() {
      if ((this.autoPayModelDetails.monthlyPaymentDay && this.autoPayModelDetails.monthlyPaymentDay !== this.autoPay.values.zero)) {
         this.selectedDate.day = parseInt(this.autoPayModelDetails.monthlyPaymentDay, 10);
         this.isPaymentOrder = false;
         this.paymentOrder = '';
      } else {
         if (this.autoPayModelDetails.autoPayTerm) {
            const day = parseInt(moment(this.autoPayModelDetails.dueDate).format(this.values.monthFormat), 10);
            switch (this.autoPayModelDetails.autoPayTerm) {
               case this.values.twentyThree:
                  if (day === 1) {
                     this.selectedDate.day = this.values.selectedDayForOne[0];
                  } else if (day === 2) {
                     this.selectedDate.day = this.values.selectedDayForOne[1];
                  } else {
                     this.selectedDate.day = ((parseInt(moment(this.autoPayModelDetails.dueDate)
                        .format(this.values.monthFormat), 10)) - 2);
                  }
                  this.paymentOrder = this.values.paymentOrder23;
                  break;
               case this.values.twentyFour:
                  if (day === 1) {
                     this.selectedDate.day = this.values.selectedDayForOne[1];
                  } else if (day === 2) {
                     this.selectedDate.day = 1;
                  } else {
                     this.selectedDate.day = ((parseInt(moment(this.autoPayModelDetails.dueDate)
                        .format(this.values.monthFormat), 10)) - 1);
                  }
                  this.paymentOrder = this.values.paymentOrder24;
                  break;
               default:
                  this.selectedDate.day = parseInt(moment(this.autoPayModelDetails.dueDate)
                     .format(this.values.monthFormat), 10);
                  this.paymentOrder = this.values.paymentOrder25;
            }
            this.isPaymentOrder = true;
         }
      }
      this.selectedDate.isValid = true;
      this.handleDayClickEvent(this.selectedDate);
   }

   public setPaymentDate(paymentDate) {
      this.statementDay = parseInt(moment(this.inrangeDateSelector.minDate).format(this.values.monthFormat), 10);
      this.dueDay = parseInt(moment(this.inrangeDateSelector.maxDate).format(this.values.monthFormat), 10);
      if ((this.dueDay === 1) && (this.values.selectedDayForOne.indexOf(paymentDate.day) !== -1)) {
         this.isPaymentOrder = true;
         this.autoPayModelDetails.monthlyPaymentDay = this.values.zero;
         switch (paymentDate.day) {
            case this.values.selectedDayForOne[1]:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyFour;
               this.paymentOrder = this.values.paymentOrder24;
               break;
            case this.values.selectedDayForOne[0]:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyThree;
               this.paymentOrder = this.values.paymentOrder23;
               break;
            default:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyFive;
               this.paymentOrder = this.values.paymentOrder25;
         }
      } else if ((this.dueDay === 2) && (this.values.selectedDayForTwo.indexOf(paymentDate.day) !== -1)) {
         this.isPaymentOrder = true;
         this.autoPayModelDetails.monthlyPaymentDay = this.values.zero;
         switch (paymentDate.day) {
            case this.values.selectedDayForTwo[1]:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyFour;
               this.paymentOrder = this.values.paymentOrder24;
               break;
            case this.values.selectedDayForTwo[0]:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyThree;
               this.paymentOrder = this.values.paymentOrder23;
               break;
            default:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyFive;
               this.paymentOrder = this.values.paymentOrder25;
         }
      } else if ((this.dueDay - paymentDate.day) <= 2 && (this.dueDay - paymentDate.day) >= 0) {
         this.isPaymentOrder = true;
         this.autoPayModelDetails.monthlyPaymentDay = this.values.zero;
         switch (this.dueDay - paymentDate.day) {
            case this.values.cases[0]:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyFour;
               this.paymentOrder = this.values.paymentOrder24;
               break;
            case this.values.cases[1]:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyThree;
               this.paymentOrder = this.values.paymentOrder23;
               break;
            default:
               this.autoPayModelDetails.autoPayTerm = this.values.twentyFive;
               this.paymentOrder = this.values.paymentOrder25;
         }
      } else {
         this.autoPayModelDetails.monthlyPaymentDay = paymentDate.day.toString();
         this.isPaymentOrder = false;
         this.autoPayModelDetails.autoPayTerm = '';
      }
   }
   public gotToNextStep() {
      /* If valid day selected save the payment day and call navigate method  */
      if (this.isValidDaySelected) {
         this.autopayService.setAutoPayDetails(this.autoPayModelDetails);
         this.navigateToNextStep();
      }
   }

   /* On clicking Next , setting the step state as success and  navigate to next step*/
   public navigateToNextStep() {
      this.sendEvent(this.paymentDateGAEvents.timeTakenOnDateScreen.eventAction,
         this.paymentDateGAEvents.timeTakenOnDateScreen.label, null, this.paymentDateGAEvents.timeTakenOnDateScreen.category);
      this.workflowSteps[2] = { step: this.workflowSteps[2].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[3].step);
   }

   public setStatementDate() {
      if (this.autoPayModelDetails.statementDate) {
         const day = parseInt(moment(this.autoPayModelDetails.statementDate).format(this.values.monthFormat), 10);
         const month = parseInt(moment(this.autoPayModelDetails.statementDate).format(this.values.month), 10);
         const year = parseInt(moment(this.autoPayModelDetails.statementDate).format(this.values.year), 10);
         switch (day) {
            case this.values.selectedDayForOne[1]:
               this.inrangeDateSelector.minDate = (month + 1) + '/' + this.values.three + '/' + year;
               break;
            case this.values.selectedDayForOne[0]:
               this.inrangeDateSelector.minDate = (month + 1) + '/' + this.values.two + '/' + year;
               break;
            case this.values.day:
               this.inrangeDateSelector.minDate = (month + 1) + '/' + this.values.one + '/' + year;
               break;
            default:
               this.inrangeDateSelector.minDate = moment(CommonUtility.getNextDate(this.autoPayModelDetails.statementDate, 3, 'days'))
                  .format(this.values.dateFormat);
         }
         this.inrangeDateSelector.maxDate = moment(this.autoPayModelDetails.dueDate).format(this.values.dateFormat);
      }
   }
}


