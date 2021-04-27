import { Component, OnInit, Input, EventEmitter, Output, Renderer2, Injector } from '@angular/core';
import * as moment from 'moment';
import { IAutoPayDetail } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { ApoService } from '../apo.service';
import { PreFillService } from '../../../core/services/preFill.service';
import { IApiResponse, IPlasticCard } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { GAEvents } from '../../../core/utils/ga-event';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-initiate-autopay',
   templateUrl: './initiate-autopay.component.html',
   styleUrls: ['./initiate-autopay.component.scss']
})
export class InitiateAutopayComponent extends BaseComponent implements OnInit {

   isAutoPay: boolean;
   isDeleteAutoPay: boolean;
   isEditAutoPay: boolean;
   isEnableEditAndDelete: boolean;
   autopayDetails: IAutoPayDetail;
   autoPayStatus: boolean;
   autoPayConstants = ApoConstants.apo;
   paymentAmountOptions = ApoConstants.apo.paymentAmountOptions;
   paymentAmountText: string;
   payFromBankType: string;
   monthlyPaymentDay: number;
   values = ApoConstants.apo.values;
   minDate: string;
   maxDate: string;
   isAutoPayTerm: boolean;
   autoPaySummary: IAutoPayDetail;
   showLoader: boolean;
   @Input() plasticId: string;
   @Output() closeApo = new EventEmitter<boolean>();
   @Output() successApo = new EventEmitter<boolean>();
   @Output() deleteApo = new EventEmitter<boolean>();
   card: IPlasticCard;
   isApoStepper: boolean;
   isSuccess = false;
   accountId: number;
   apoAddDeleteViewEditGAEvent = GAEvents.AutomaticPaymentOrder;

   constructor(private prefillService: PreFillService, injector: Injector,
      private autopayService: ApoService, private render: Renderer2) {
      super(injector);
   }

   ngOnInit() {
      this.autopayDetails = {} as IAutoPayDetail;
      this.autoPayStatus = false;
      this.isAutoPay = false;
      this.isEditAutoPay = false;
      this.isDeleteAutoPay = false;
      this.isEnableEditAndDelete = false;
      this.isApoStepper = false;
      this.showLoader = false;
      this.selectSendEvent();
      this.card = this.autopayService.getCardDetails();
      if (this.prefillService.preFillAutoPayDetail) {
         this.autopayDetails = this.prefillService.preFillAutoPayDetail;
      }
      this.showAutopay();
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
   }

   // to specify how user came to apo - through cards menu or card management
   selectSendEvent() {
      this.accountId = this.autopayService.getAccountId();
      this.accountId ? this.sendEvent(this.apoAddDeleteViewEditGAEvent.fromAccountView.eventAction,
         this.apoAddDeleteViewEditGAEvent.fromAccountView.label, null, this.apoAddDeleteViewEditGAEvent.fromAccountView.category) :
         this.sendEvent(this.apoAddDeleteViewEditGAEvent.fromCardsTap.eventAction, this.apoAddDeleteViewEditGAEvent.fromCardsTap.label,
            null, this.apoAddDeleteViewEditGAEvent.fromCardsTap.category);
   }

   showAutopay() {
      if (this.autopayDetails.autoPayInd) {
         this.populateFields();
         this.sendEvent(this.apoAddDeleteViewEditGAEvent.functionalityWise.eventAction,
            this.apoAddDeleteViewEditGAEvent.functionalityWise.label, null, this.apoAddDeleteViewEditGAEvent.functionalityWise.category);
         this.isEditAutoPay = true;
      } else {
         this.isAutoPay = true;
      }
   }
   populateFields() {
      if (this.autopayDetails.autoPayMethod === this.autoPayConstants.values.preferred) {
         this.paymentAmountText = this.autoPayConstants.messages.ownAmount;
      } else if (this.autopayDetails.autoPayMethod === this.autoPayConstants.values.minimum) {
         this.paymentAmountText = this.paymentAmountOptions.minimum.label;
      } else {
         this.paymentAmountText = this.paymentAmountOptions.total.label;
      }
      this.payFromBankType = (this.autoPayConstants.values.currentAccountTypes.indexOf(this.autopayDetails.payFromAccountType) !== -1) ?
         this.autoPayConstants.values.currentAccountName : this.payFromBankType = this.autoPayConstants.values.savingAccountName;
      if ((this.autopayDetails.monthlyPaymentDay && this.autopayDetails.monthlyPaymentDay !== this.autoPayConstants.values.zero)) {
         this.monthlyPaymentDay = parseInt(this.autopayDetails.monthlyPaymentDay, 10);
      } else {
         if (this.autopayDetails.autoPayTerm) {
            const day = parseInt(moment(this.autopayDetails.dueDate).format(this.autoPayConstants.values.monthFormat), 10);
            switch (this.autopayDetails.autoPayTerm) {
               case this.autoPayConstants.values.twentyThree:
                  if (day === 1) {
                     this.monthlyPaymentDay = this.autoPayConstants.values.selectedDayForOne[0];
                  } else if (day === 2) {
                     this.monthlyPaymentDay = this.autoPayConstants.values.selectedDayForOne[1];
                  } else {
                     this.monthlyPaymentDay = ((parseInt(moment(this.autopayDetails.dueDate)
                        .format(this.autoPayConstants.values.monthFormat), 10)) - 2);
                  }
                  break;
               case this.autoPayConstants.values.twentyFour:
                  if (day === 1) {
                     this.monthlyPaymentDay = this.autoPayConstants.values.selectedDayForOne[1];
                  } else if (day === 2) {
                     this.monthlyPaymentDay = 1;
                  } else {
                     this.monthlyPaymentDay = ((parseInt(moment(this.autopayDetails.dueDate)
                        .format(this.autoPayConstants.values.monthFormat), 10)) - 1);
                  }
                  break;
               default:
                  this.monthlyPaymentDay = parseInt(moment(this.autopayDetails.dueDate)
                     .format(this.autoPayConstants.values.monthFormat), 10);
            }
         }
      }
      this.isAutoPayTerm = (this.autopayDetails.monthlyPaymentDay === this.autoPayConstants.values.zero) ? true : false;
      this.minDate = moment(this.autopayDetails.statementDate).format(this.values.dateFormat);
      this.maxDate = moment(this.autopayDetails.dueDate).format(this.values.dateFormat);

   }

   /* Navigating the auto pay next button to stepper view */
   showAutoPaySettings() {
      this.isAutoPay = false;
      this.sendEvent(this.apoAddDeleteViewEditGAEvent.nextInAddApo.eventAction,
         this.apoAddDeleteViewEditGAEvent.nextInAddApo.label, null, this.apoAddDeleteViewEditGAEvent.nextInAddApo.category);
      this.sendEvent(this.apoAddDeleteViewEditGAEvent.functionalityWise.eventAction,
         this.apoAddDeleteViewEditGAEvent.functionalityWise.label, null, this.apoAddDeleteViewEditGAEvent.functionalityWise.category);
      this.prefillService.preFillAutoPayDetail = this.autopayDetails;
      this.isApoStepper = true;
   }

   /* Navigating the edit auutopay pay next button to stepper view */
   editAutoPay() {
      if (this.autopayDetails.mandateAction) {
         this.prefillService.preFillAutoPayDetail = this.autopayDetails;
         this.isEditAutoPay = (this.autopayDetails.autoPayInd && this.autopayDetails.mandateAction) ? true : false;
         this.sendEvent(this.apoAddDeleteViewEditGAEvent.functionalityWise.eventAction,
            this.apoAddDeleteViewEditGAEvent.functionalityWise.label, null, this.apoAddDeleteViewEditGAEvent.functionalityWise.category);
         this.isApoStepper = true;
      } else {
         this.isEditAutoPay = false;
         this.isEnableEditAndDelete = true;
      }
   }

   /* Navigating the delete autopay pay okay button to stepper view */
   deleteAutoPay() {
      if (this.autopayDetails.mandateAction) {
         this.autopayService.setAutoPaySummary(this.autopayDetails);
         this.autoPaySummary = {} as IAutoPayDetail;
         this.autoPaySummary = this.autopayService.getAutoPaySummary();
         this.autopayService.deleteAutoPayDetails(this.plasticId, this.autoPaySummary)
            .finally(() => {
               this.showLoader = false;
            }).subscribe((response: IApiResponse) => {
               if (response) {
                  if ((response.metadata.resultData[0].resultDetail[0].status) === Constants.metadataKeys.success) {
                     this.isDeleteAutoPay = false;
                     this.sendEvent(this.apoAddDeleteViewEditGAEvent.functionalityWise.eventAction,
                        this.apoAddDeleteViewEditGAEvent.functionalityWise.label, null,
                        this.apoAddDeleteViewEditGAEvent.functionalityWise.category);
                     this.sendEvent(this.apoAddDeleteViewEditGAEvent.deleteApo.eventAction,
                        this.apoAddDeleteViewEditGAEvent.deleteApo.label, null,
                        this.apoAddDeleteViewEditGAEvent.deleteApo.category);
                     this.deleteSuccess();
                  }
               }
            });
      } else {
         this.isDeleteAutoPay = false;
         this.isEnableEditAndDelete = true;
      }

   }
   deleteSuccess() {
      this.closeOverlay(false);
      this.deleteApo.emit(true);
   }
   closeEditAndDeleteAlert() {
      this.isEnableEditAndDelete = false;
      this.exit();
   }
   goToCards() {
      this.onSuccessApo(false);
   }

   showDeleteOverlay() {
      this.isEditAutoPay = false;
      this.isDeleteAutoPay = true;

   }
   onClose(event) {
      this.isAutoPay = false;
      this.isDeleteAutoPay = false;
      if (event) {
         this.sendEvent(this.apoAddDeleteViewEditGAEvent.cancelInAddApo.eventAction,
            this.apoAddDeleteViewEditGAEvent.cancelInAddApo.label, null, this.apoAddDeleteViewEditGAEvent.cancelInAddApo.category);
      } else {
         this.sendEvent(this.apoAddDeleteViewEditGAEvent.cancelInDeleteApo.eventAction,
            this.apoAddDeleteViewEditGAEvent.cancelInDeleteApo.label, null, this.apoAddDeleteViewEditGAEvent.cancelInDeleteApo.category);
      }
      this.exit();
   }
   onEditAutoPayClose(event) {
      this.isEditAutoPay = event;
      this.exit();
   }
   exit() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
      this.closeApo.emit(false);
   }
   onSuccess(event) {
      this.isSuccess = true;
      this.closeOverlay(event);
   }
   onSuccessApo(event) {
      this.isSuccess = event;
      this.closeOverlay(event);
      this.successApo.emit(event);
   }
   hideStepper(event) {
      this.isSuccess = event;
      this.closeOverlay(event);
      this.exit();
   }
   closeOverlay(event) {
      this.isEditAutoPay = event;
      this.isApoStepper = event;
      this.render.setStyle(document.body, 'overflow-y', 'auto');
   }
}
