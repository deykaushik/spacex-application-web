import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../account.service';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { CommonUtility } from '../../../core/utils/common';
import { NotificationTypes } from '../../../core/utils/enums';
import { Constants } from '../../../core/utils/constants';
import {
   ISharedContact, ISharedAccount, IShareAccountReq, ISharedRecipient,
   ISharedCustomer, IApiResponse, IClientDetails
} from '../../../core/services/models';
import { GAEvents } from './../../../core/utils/ga-event';

@Component({
   selector: 'app-add-recipients',
   templateUrl: './add-recipients.component.html',
   styleUrls: ['./add-recipients.component.scss']
})
export class AddRecipientsComponent extends BaseComponent implements OnInit {

   @ViewChild('shareAccountForm') shareAccountForm;
   @Input() sharedAccountDetails: ISharedAccount;
   @Input() clientDetails: IClientDetails;
   @Output() onStatus = new EventEmitter<boolean>();

   sharedContacts: ISharedContact[];
   showAddEmailBtn: boolean;
   showRemoveEmailBtn: boolean;
   shareAccountReq: IShareAccountReq;
   shareStatus: NotificationTypes = NotificationTypes.None;
   notificationTypes = NotificationTypes;
   retryLimitExceeded: boolean;
   retryCount = 0;
   requestInprogress: boolean;
   emailPattern = Constants.patterns.email;
   labels = Constants.labels.accountShare;
   messages = Constants.messages.accountShare;
   maxNumberOfRecipients = Constants.VariableValues.accountShare.maxNumberOfRecipients;
   values = Constants.VariableValues.accountShare;
   shareContactId: number; // This helps to maintain unique name for enter-recipeint-name field
   isAllEmailValid: boolean; // This helps to determine if all recipient emails are valid or not

   constructor(private accountService: AccountService, private systemErrorService: SystemErrorService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.showAddEmailBtn = true;
      this.showRemoveEmailBtn = false;
      this.retryLimitExceeded = false;
      this.requestInprogress = false;
      this.shareContactId = 1;
      this.addDefaultEmail();
   }

   /* This function is helpful to prepopulate the CIS profile email as first default emailId */
   addDefaultEmail() {
      this.sharedContacts = [];
      const sharedContact = {} as ISharedContact;
      sharedContact.emailId = this.clientDetails.EmailAddress;
      sharedContact.id = this.shareContactId;
      this.sharedContacts.push(sharedContact);
      this.onEmailChange(0, sharedContact);
   }

   /* Add another email and hide the button if it's reaches max recipeints/email limit */
   addAnotherEmail() {
      if (this.showAddEmailBtn) {
         const sharedContact = {} as ISharedContact;
         sharedContact.id = ++this.shareContactId;
         sharedContact.isValidEmail = false;
         this.sharedContacts.push(sharedContact);
         this.isAllEmailValid = this.checkForInvalidEmail();
         if (this.sharedContacts.length > 1) {
            this.showRemoveEmailBtn = true;
         }

         if (this.sharedContacts.length === this.maxNumberOfRecipients) {
            this.showAddEmailBtn = false;
         }
      }
   }

   /* Remove email and show add email button if it's not reach max recipeints/email limit */
   removeEmail(index: number) {
      this.sharedContacts.splice(index, 1);
      if (this.sharedContacts.length < this.maxNumberOfRecipients) {
         this.showAddEmailBtn = true;
      }
      this.isAllEmailValid = this.checkForInvalidEmail();
   }

   /* This function is used to send the account share info to API */
   send() {
      if (this.shareAccountForm instanceof NgForm) {
         CommonUtility.markFormControlsTouched(this.shareAccountForm);
      }
      if (this.isAccountShareFormValid()) {
         const recipientsCount = this.sharedContacts.length ? this.sharedContacts.length.toString() : null;
         const amountEmailsEnteredGAEvent = GAEvents.shareAccount.amountEmailsEntered;
         this.sendEvent(amountEmailsEnteredGAEvent.eventAction, amountEmailsEnteredGAEvent.label,
            recipientsCount, amountEmailsEnteredGAEvent.category);
         this.shareAccount();
      }
   }

   isAccountShareFormValid() {
      return this.shareAccountForm && this.shareAccountForm.valid;
   }

   /* This function is used to create a account share request object and trigger the API to send info */
   shareAccount() {
      this.setShareAccountData();
      this.shareAccountData();
   }

   /* This function is used to send account share request object to API
      and validate the response and not allow to trigger the function
      once its reaches try again to limit */
   shareAccountData() {
      if (this.retryCount <= this.values.tryAgainLimit) {
         const selectShareProofOfAccEmailGAEvent = GAEvents.shareAccount.selectSend;
         this.sendEvent(selectShareProofOfAccEmailGAEvent.eventAction, selectShareProofOfAccEmailGAEvent.label,
            null, selectShareProofOfAccEmailGAEvent.category);
         this.requestInprogress = true;
         this.accountService.shareAccount(this.shareAccountReq)
            .finally(() => {
               this.requestInprogress = false;
               this.onStatus.emit(true);
            })
            .subscribe((response: IApiResponse) => {
               const resp = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.emailSent);
               if (resp.isValid) {
                  this.shareStatus = NotificationTypes.Success;
               } else {
                  this.shareStatus = NotificationTypes.Error;
               }
            }, (error) => {
               this.systemErrorService.closeError();
               this.shareStatus = NotificationTypes.Error;
            });
         this.retryLimitExceeded = this.retryCount === this.values.tryAgainLimit;
      } else {
         this.retryLimitExceeded = true;
      }
   }

   /* Create a account share request object */
   setShareAccountData() {
      this.shareAccountReq = {
         channel: this.values.channel,
         sharedAccountDetails: this.sharedAccountsDetails(),
         sharedRecipientDetails: this.sharedRecipientsDetails(),
         sharedCustomerDetails: this.sharedCustomersDetails()
      };
   }

   /* Retry when sharing account information fails */
   onRetryAccountShare(isRetried: boolean) {
      if (isRetried) {
         this.retryCount++;
         this.shareAccountData();
      }
   }

   private sharedAccountsDetails(): ISharedAccount[] {
      const sharedAccouunts: ISharedAccount[] = [];
      sharedAccouunts.push(this.sharedAccountDetails);
      return sharedAccouunts;
   }

   private sharedRecipientsDetails(): ISharedRecipient[] {
      const sharedRecipientsDetails: ISharedRecipient[] = [];
      const sharedRecipientDetails: ISharedRecipient = {
         partyName: '',
         contactDetail: this.sharedContacts
      };
      sharedRecipientsDetails.push(sharedRecipientDetails);
      return sharedRecipientsDetails;
   }

   private sharedCustomersDetails(): ISharedCustomer[] {
      const sharedCustomerDetails: ISharedCustomer[] = [];
      const sharedCustomer: ISharedCustomer = {
         identifierType: this.values.identifierType,
         identifier: this.clientDetails.CisNumber.toString()
      };
      sharedCustomerDetails.push(sharedCustomer);
      return sharedCustomerDetails;
   }

   onEmailChange(sharedIndex: number, sharedContact: ISharedContact) {
      this.sharedContacts[sharedIndex].isValidEmail = CommonUtility.isValidEmail(sharedContact.emailId);
      this.isAllEmailValid = this.checkForInvalidEmail();
   }

   checkForInvalidEmail(): boolean {
      return this.sharedContacts.findIndex(contact => contact.isValidEmail === false) !== -1 ? false : true;
   }
}
