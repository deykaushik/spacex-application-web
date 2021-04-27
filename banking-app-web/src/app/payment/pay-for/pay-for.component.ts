import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit, Injector, OnDestroy } from '@angular/core';

import { PaymentService } from '../payment.service';
import { PreFillService } from '../../core/services/preFill.service';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { ValidateInputDirective } from './../../shared/directives/validations/validateInput.directive';

import { IPayToVm, IPayForVm, IPayAmountVm } from '../payment.models';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { IWorkflowChildComponent, IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import {
   IContactCardNotification, IGaEvent, IAccountDetail, IClientDetails, IScheduledTransaction,
   ISettlementDetail
} from './../../core/services/models';
import { INotificationItem } from './../../core/utils/models';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-pay-for',
   templateUrl: './pay-for.component.html',
   styleUrls: ['./pay-for.component.scss']
})
export class PayForComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
   @ViewChild('payToForm') payToForm;
   @Output() isComponentValid = new EventEmitter<boolean>();
   vm: IPayForVm;
   payToVm: IPayToVm;
   isValid = false;
   payAmountVm: IPayAmountVm;
   accounts: IAccountDetail[];
   skeletonMode: Boolean = true;
   insufficientFunds = false;
   displayReasonText: string;
   isReasonDirty = false;
   dropdownDefault = Constants.dropdownDefault;
   smsMinLength = Constants.VariableValues.smsMinLength;
   smsMaxLength = Constants.VariableValues.smsMaxLength;
   referenceMaxLength = Constants.VariableValues.referenceMaxLength;
   patterns = Constants.patterns;
   messages = Constants.messages;
   labels = Constants.labels;
   isMobilePayment = false;
   showReasonError = false;
   isMobileNumberValid = false;
   constructor(private paymentService: PaymentService, injector: Injector,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private preFillService: PreFillService) {
      super(injector);
   }

   notifications = CommonUtility.getNotificationTypes();
   paymentReasons: INotificationItem[] = [];
   preFillData: ISettlementDetail;

   /* Event occured on notification dropwn down change */
   onNotificationChange(event: Event, selectd: any) {
      let contactCardNotification: IContactCardNotification[];
      if (this.payToVm.isRecipientPicked && this.vm.contactCardNotifications && this.vm.contactCardNotifications.length > 0) {
         contactCardNotification = this.vm.contactCardNotifications.filter((notification) => {
            return notification.notificationType.toLowerCase().trim() === selectd.value.toLowerCase().trim();
         });
      }
      if (contactCardNotification && contactCardNotification.length > 0) {
         let notification: INotificationItem[], contactCard: IContactCardNotification;
         contactCard = contactCardNotification[0];
         notification = this.notifications.filter((cardNotification) => {
            return cardNotification.value.toLowerCase().trim() === contactCard.notificationType.toLowerCase().trim();
         });
         this.vm.notification = notification[0];
         this.vm.notificationInput = contactCard.notificationAddress;
      } else {
         this.vm.notification = selectd;
         this.vm.notificationInput = '';
      }
   }

   onReasonDropdownOpen() {
      this.isReasonDirty = true;
   }

   isReasonDropdownValid(paymentReasonRef) {
      return ((this.displayReasonText === this.dropdownDefault.displayText) && this.isReasonDirty) ||
      (paymentReasonRef.invalid && (paymentReasonRef.dirty || paymentReasonRef.touched) && paymentReasonRef.isBlurred);
   }

   onPaymentReasonChange(event: Event, selected: any) {
      if (selected.value === Constants.paymentReasonTypes.other.code) {
         this.showReasonError = true;
      } else {
         this.vm.paymentReason = { name: selected.name, code: selected.value};
         this.displayReasonText = this.vm.paymentReason.name;
      }
   }

   closeResonError() {
      this.showReasonError = false;
   }

   onMobileNumberChange(number) {
      this.validate();
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.preFillData = this.preFillService.settlementDetail;
      this.isComponentValid.emit(true);
      this.payToVm = this.paymentService.getPayToVm();
      this.vm = this.paymentService.getPayForVm();
      if (!this.paymentService.paymentWorkflowSteps.payFor.isNavigated && this.payToVm.isRecipientPicked) {
         this.setDataFromBeneficiary();
         if (this.preFillData && this.preFillData.yourReference && this.preFillData.theirReference) {
            this.setDatatoReferences();
         }

      }
      if (!this.vm.notification) {
         this.vm.notification = this.notifications.find(m => m.value === Constants.notificationTypes.none);
      }
      if (this.payToVm.isCrossBorderPaymentActive) {
         this.paymentReasons = CommonUtility.getPaymentReasonTypes(this.payToVm.crossBorderPayment.beneficiaryDetails.residentialStatus);
         this.displayReasonText = (this.vm.paymentReason && this.vm.paymentReason.name) ?
         this.vm.paymentReason.name : Constants.dropdownDefault.displayText;
      }
      this.isMobilePayment = this.paymentService.isMobilePayment();
      if (this.payToVm.isCrossBorderPaymentActive) {
         this.payAmountVm = this.paymentService.getPayAmountVm();
         this.paymentService.getActiveCasaAccounts().subscribe(accounts => {
            this.accounts = accounts || [];
            this.setAccountFrom();
            this.payAmountVm.selectedAccount =
               this.payAmountVm.selectedAccount || this.clientProfileDetailsService.getDefaultAccount(this.accounts)
               || (this.accounts.length ? this.accounts[0] : null);
            this.skeletonMode = false;
            this.validate();
         });
         this.subscribeClientDetails();
      }
   }
   setAccountFrom() {
      if (!this.payAmountVm.selectedAccount && this.payAmountVm.accountFromDashboard) {
         this.payAmountVm.selectedAccount = this.accounts.filter((ac) => {
            return ac.itemAccountId === this.payAmountVm.accountFromDashboard;
         })[0];
      }
   }
   onAccountSelection(account: IAccountDetail) {
      this.payAmountVm.selectedAccount = account;
      this.validate();
   }

   setDataFromBeneficiary() {
      if (this.payToVm.beneficiaryData && this.payToVm.beneficiaryData.contactCard) {
         if (this.payToVm.beneficiaryData.contactCard.contactCardNotifications) {
            this.vm.contactCardNotifications = this.payToVm.beneficiaryData.contactCard.contactCardNotifications;
            this.setDefaultNotification(this.vm.contactCardNotifications);
         }
         if (this.payToVm.beneficiaryData.contactCardDetails.cardDetails) {
            this.vm.yourReference = this.payToVm.beneficiaryData.contactCardDetails.cardDetails.myReference;
            if (!this.isMobilePayment) {
               this.vm.theirReference = this.payToVm.beneficiaryData.contactCardDetails.cardDetails.beneficiaryReference;
            }
         }
      }
   }

   setDefaultNotification(contactCardNotifications: IContactCardNotification[]) {
      let defaultContactCardNotification: IContactCardNotification[];
      defaultContactCardNotification = contactCardNotifications.filter((contactCardNotification) => {
         return contactCardNotification.notificationDefault;
      });
      if (defaultContactCardNotification && defaultContactCardNotification.length > 0) {
         let notification: INotificationItem[], contactCard: IContactCardNotification;
         contactCard = defaultContactCardNotification[0];
         notification = this.notifications.filter((cardNotification) => {
            return cardNotification.value.toLowerCase().trim() === contactCard.notificationType.toLowerCase().trim();
         });
         if (notification.length > 0) {
            this.vm.notification = notification[0];
            this.vm.notificationInput = defaultContactCardNotification[0].notificationAddress;
         }
      }
   }

   nextClick(currentStep: number) {
      this.sendEvent('pay_notification_click_on_next');
      this.paymentService.savePayForInfo(this.vm);
      if (this.payToVm.isCrossBorderPaymentActive) {
         this.paymentService.savePayAmountInfo(this.payAmountVm);
      }
   }
   ngOnDestroy() {
      // Called once, before the instance is destroyed.
      // Add 'implements OnDestroy' to the class
      // To save info before going to next
      this.paymentService.savePayForInfo(this.vm);
   }

   ngAfterViewInit() {
      this.payToForm.valueChanges
         .subscribe(values => {
            this.validate();
         });
   }

   /* validate form is valid or not */
   validate() {

      let valid = true;
      if (this.payToVm.isCrossBorderPaymentActive) {
         if (!this.payAmountVm.selectedAccount) {
            valid = false;
         } else {
            this.insufficientFunds = (this.payAmountVm.transferAmount > 0)
               && (this.payAmountVm.transferAmount > this.payAmountVm.selectedAccount.availableBalance);
            valid = !this.insufficientFunds;
         }
         valid  = this.vm.crossBorderSmsNotificationInput ? CommonUtility.isValidMobile(this.vm.crossBorderSmsNotificationInput) : false;
         valid = valid && !this.skeletonMode;
      }

      if (this.vm.notification && ((this.vm.notification.value === Constants.notificationTypes.SMS) ||
         (this.vm.notification.value === Constants.notificationTypes.Fax))) {
         this.isValid = (this.payToForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidMobile(this.vm.notificationInput) : false));
      } else if (this.vm.notification && this.vm.notification.value === Constants.notificationTypes.email) {
         this.isValid = (this.payToForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidEmail(this.vm.notificationInput) : false));
      } else {
         this.isValid = this.payToForm.valid;
      }
      this.paymentService.paymentWorkflowSteps.payFor.isDirty = this.payToForm.dirty;
      this.isComponentValid.emit(this.isValid && valid);
   }

   subscribeClientDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe((data: IClientDetails) => {
         if (data && data.CellNumber) {
            this.vm.crossBorderSmsNotificationInput = this.vm.crossBorderSmsNotificationInput || data.CellNumber;
            this.mobileNumberChange();
         }
      });
   }

   mobileNumberChange() {
      this.isMobileNumberValid = CommonUtility.isValidMobile(this.vm.crossBorderSmsNotificationInput);
   }

   stepClick(stepInfo: IStepInfo) {
   }
   setDatatoReferences() {
      if (!this.vm.yourReference && !(this.vm.yourReference && this.vm.yourReference.length)) {
         this.vm.yourReference = this.preFillData.yourReference;
         this.preFillData.yourReference = null;
      }

      if (!this.vm.theirReference && !(this.vm.theirReference && this.vm.theirReference.length)) {
         this.vm.theirReference = this.preFillData.theirReference;
         this.preFillData.theirReference = null;
      }
   }
}
