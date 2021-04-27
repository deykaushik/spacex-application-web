import { Component, OnInit, Renderer2, Injector } from '@angular/core';
import { IAutoPayDetail } from '../apo.model';
import { ApoService } from '../apo.service';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ApoConstants } from '../apo-constants';
import { ITermsAndConditions, IApiResponse, IPlasticCard } from '../../../core/services/models';
import { TermsAndConditionsConstants } from '../../../shared/terms-and-conditions/constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { Constants } from '../../../core/utils/constants';
import { BaseComponent } from '../../../core/components/base/base.component';
import { CommonUtility } from './../../../core/utils/common';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-summary',
   templateUrl: './summary.component.html',
   styleUrls: ['./summary.component.scss']
})
export class SummaryComponent extends BaseComponent implements OnInit {
   showTermsAndConditionsOverlay: boolean;
   autoPayModelDetails: IAutoPayDetail;
   autoPay = ApoConstants.apo;
   termAndConditionCheck: boolean;
   paymentAmountText: string;
   termsAndConditions: ITermsAndConditions;
   termsAndConditionsPath = TermsAndConditionsConstants.TermsGeneralHtml;
   paymentAmountOptions = ApoConstants.apo.paymentAmountOptions;
   workflowSteps: IStepper[];
   plasticId: string;
   showLoader: boolean;
   operationMode: string;
   pageLoader: boolean;
   autoPaySummary: IAutoPayDetail;
   todayDate: Moment;
   payFromBankType: string;
   minDate: string;
   maxDate: string;
   isAutoPayTerm: boolean;
   monthlyPaymentDay: number;
   values = ApoConstants.apo.values;
   workFlowStepLength: number;
   isSuccess = false;
   summaryGAEvents = GAEvents.AutomaticPaymentOrder;
   acceptTerms: boolean;
   card: IPlasticCard;
   startingMonth: string;

   constructor(private workflowService: WorkflowService, private renderer: Renderer2,
      private autopayService: ApoService, private router: Router, injector: Injector,
      private errorService: SystemErrorService) {
      super(injector);
   }
   ngOnInit() {
      this.showLoader = false;
      this.pageLoader = false;
      this.acceptTerms = false;
      this.termAndConditionCheck = false;
      this.showTermsAndConditionsOverlay = false;
      this.autoPayModelDetails = {} as IAutoPayDetail;
      this.termsAndConditions = {} as ITermsAndConditions;
      this.card = this.autopayService.getCardDetails();
      this.autoPayModelDetails = this.autopayService.getAutoPayDetails();
      this.autopayService.setAutoPaySummary(this.autoPayModelDetails);
      this.autoPaySummary = this.autopayService.getAutoPaySummary();
      this.plasticId = this.autopayService.getId();
      this.operationMode = this.autopayService.getMode();
      this.workflowSteps = this.workflowService.workflow;
      this.populateFields();
      const terms = this.autopayService.getCachedTermsAndConditions();
      if (terms) {
         this.termsAndConditions = terms;
      } else {
         this.getTermsAndConditions();
      }
      this.onStartingMonth();
   }
   populateFields() {
      if (this.autoPayModelDetails.autoPayMethod === this.autoPay.values.preferred) {
         this.paymentAmountText = this.autoPay.messages.ownAmount;
      } else if (this.autoPayModelDetails.autoPayMethod === this.autoPay.values.minimum) {
         this.paymentAmountText = this.paymentAmountOptions.minimum.label;
      } else {
         this.paymentAmountText = this.paymentAmountOptions.total.label;
      }
      this.payFromBankType = (this.autoPay.values.currentAccountTypes.indexOf(this.autoPayModelDetails.payFromAccountType) !== -1) ?
         this.autoPay.values.currentAccountName : this.payFromBankType = this.autoPay.values.savingAccountName;
      if ((this.autoPayModelDetails.monthlyPaymentDay && this.autoPayModelDetails.monthlyPaymentDay !== this.autoPay.values.zero)) {
         this.monthlyPaymentDay = parseInt(this.autoPayModelDetails.monthlyPaymentDay, 10);
      } else {
         if (this.autoPayModelDetails.autoPayTerm) {
            const day = parseInt(moment(this.autoPayModelDetails.dueDate).format(this.values.monthFormat), 10);
            switch (this.autoPayModelDetails.autoPayTerm) {
               case this.values.twentyThree:
                  if (day === 1) {
                     this.monthlyPaymentDay = this.values.selectedDayForOne[0];
                  } else if (day === 2) {
                     this.monthlyPaymentDay = this.values.selectedDayForOne[1];
                  } else {
                     this.monthlyPaymentDay = ((parseInt(moment(this.autoPayModelDetails.dueDate)
                        .format(this.values.monthFormat), 10)) - 2);
                  }
                  break;
               case this.values.twentyFour:
                  if (day === 1) {
                     this.monthlyPaymentDay = this.values.selectedDayForOne[1];
                  } else if (day === 2) {
                     this.monthlyPaymentDay = 1;
                  } else {
                     this.monthlyPaymentDay = ((parseInt(moment(this.autoPayModelDetails.dueDate)
                        .format(this.values.monthFormat), 10)) - 1);
                  }
                  break;
               default:
                  this.monthlyPaymentDay = parseInt(moment(this.autoPayModelDetails.dueDate)
                     .format(this.values.monthFormat), 10);
            }
         }
      }
      this.isAutoPayTerm = (this.autoPayModelDetails.monthlyPaymentDay === this.autoPay.values.zero) ? true : false;
      this.minDate = moment(this.autoPayModelDetails.statementDate).format(this.values.dateFormat);
      this.maxDate = moment(this.autoPayModelDetails.dueDate).format(this.values.dateFormat);

   }
   /* setting the terms and conditions checkbox to active and enable next button */
   toggleTermsCondition() {
      this.termAndConditionCheck = !this.termAndConditionCheck;
   }

   /* Navigating to success page and setting the autopay details object */
   goToSuccess() {
      if (this.termAndConditionCheck) {
         if (!this.acceptTerms) {
            this.showLoader = true;
            const acceptTerm = this.createAcceptTerm(this.termsAndConditions);
            this.autopayService.acceptTermsAndConditions(this.autoPay.values.aac, acceptTerm).finally(() => {
               this.showLoader = false;
            }).subscribe((response: IApiResponse) => {
               if (response && response.metadata) {
                  const status = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.transaction);
                  if (status.isValid) {
                     this.sendApoDetails();
                     this.sendEvent(this.summaryGAEvents.termsAndConditionConsent.eventAction,
                        this.summaryGAEvents.termsAndConditionConsent.label, null, this.summaryGAEvents.termsAndConditionConsent.category);
                  } else {
                     this.errorService.raiseError({ error: status.reason });
                  }
               }
            });
         } else {
            this.sendApoDetails();
         }
      }
   }

   sendApoDetails() {
      this.workFlowStepLength = (this.autoPayModelDetails.camsAccType !== this.values.att) ?
         (this.operationMode === this.autoPay.values.add) ? 3 : 5 : (this.operationMode === this.autoPay.values.add) ? 2 : 4;
      if (this.workflowService.getFirstInvalidStep() === this.workFlowStepLength) {
         this.showLoader = true;
         if (this.operationMode === this.autoPay.values.add) {
            this.autoPaySummary.autoPayInd = true;
            this.autopayService.addApoDetails(this.autoPaySummary, this.plasticId).finally(() => {
               this.showLoader = false;
            }).subscribe((response: IApiResponse) => {
               const status = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.transaction);
               if (status.isValid) {
                  this.sendEvent(this.summaryGAEvents.timeTakenOnAPOScreen.eventAction,
                     this.summaryGAEvents.timeTakenOnAPOScreen.label, null, this.summaryGAEvents.timeTakenOnAPOScreen.category);
                  this.sendEvent(this.summaryGAEvents.addNewApo.eventAction,
                     this.summaryGAEvents.addNewApo.label, null, this.summaryGAEvents.addNewApo.category);
                  this.autopayService.setAPOSuccess();
               } else {
                  this.errorService.raiseError({ error: status.reason });
               }
            });
         } else {
            this.autopayService.updateApoDetails(this.autoPaySummary, this.plasticId).finally(() => {
               this.showLoader = false;
            }).subscribe((response: IApiResponse) => {
               const status = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.transaction);
               if (status.isValid) {
                  this.sendEvent(this.summaryGAEvents.timeTakenOnAPOScreen.eventAction,
                     this.summaryGAEvents.timeTakenOnAPOScreen.label, null, this.summaryGAEvents.timeTakenOnAPOScreen.category);
                  this.sendEvent(this.summaryGAEvents.editApo.eventAction,
                     this.summaryGAEvents.editApo.label, null, this.summaryGAEvents.editApo.category);
                  this.autopayService.setAPOSuccess();
               } else {
                  this.errorService.raiseError({ error: status.reason });
               }
            });
         }

      }
   }

   getTermsAndConditions() {
      this.pageLoader = true;
      this.autopayService.getTermsAndConditions(this.autoPay.values.aac, this.autoPay.values.latest).subscribe(response => {
         if (!response) {
            this.acceptTerms = true;
            this.openTermsAndConditions();
         } else {
            this.acceptTerms = false;
            this.termsAndConditions = response;
            this.pageLoader = false;
            this.autopayService.setCachedTermsAndConditions(this.termsAndConditions);
         }
      }, (error) => {
         this.pageLoader = false;
      });
   }
   /* Open terms and conditions overlay */
   openTermsAndConditions() {
      this.autopayService.getTermsAndConditions(this.autoPay.values.aac, this.autoPay.values.accepted).finally(() => {
         this.pageLoader = false;
      }).subscribe(response => {
         this.termsAndConditions = response;
         this.autopayService.setCachedTermsAndConditions(this.termsAndConditions);
      });
   }

   showTermsAndConditions() {
      this.showTermsAndConditionsOverlay = true;
   }


   closeTermsAndConditions() {
      this.showTermsAndConditionsOverlay = false;
   }

   createAcceptTerm(termsAndConditions: ITermsAndConditions): ITermsAndConditions {
      const term: ITermsAndConditions = {
         noticeType: termsAndConditions.noticeType,
         versionNumber: termsAndConditions.versionNumber,
         acceptedDateTime: moment().format(Constants.formats.YYYYMMDDhhmmssA),
         noticeDetails: {
            versionDate: termsAndConditions.noticeDetails.versionDate,
         }
      };
      return term;
   }

   // to specify the apo starting month based on monthly payment day.
   onStartingMonth() {
      const currentMonth = moment(this.autoPayModelDetails.dueDate).format(this.values.monthString);
      const nextMonth = moment(this.autoPayModelDetails.dueDate).add(1, 'months').format(this.values.monthString);
      const todayDate = moment().format(this.values.dateFormat);
      if (this.monthlyPaymentDay) {
         const dueDay = parseInt(moment(this.maxDate).format(this.values.monthFormat), 10);
         this.startingMonth = dueDay < this.monthlyPaymentDay && todayDate < this.maxDate ?
            CommonUtility.format(this.autoPay.autopayLabels.startingFrom, currentMonth) :
            CommonUtility.format(this.autoPay.autopayLabels.startingFrom, nextMonth);
      }
   }
}
