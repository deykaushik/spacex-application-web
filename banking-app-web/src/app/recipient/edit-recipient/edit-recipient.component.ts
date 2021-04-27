import {
   Component, OnInit, Input, OnChanges, Output, Inject,
   EventEmitter, ViewChild, OnDestroy, Injector, SimpleChanges
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';
import { ISubscription } from 'rxjs/Subscription';
import { Constants } from '../../core/utils/constants';
import { RecipientService } from '../recipient.service';
import {
   IBeneficiaryData, IContactCardNotification, IContactCardDetail,
   IContactCard, IBank, IBranch, IParentOperation, IScheduledTransaction, IScheduledTransactionType,
   IDashboardAccount, IDashboardAccounts
} from '../../core/services/models';
import { CommonUtility } from '../../core/utils/common';
import { BuyElectricityService } from '../../buy/buy-electricity/buy-electricity.service';
import { RecipientOperation, ScheduleTypes } from '../models';
import { AccountService } from '../../dashboard/account.service';
import { Observable } from 'rxjs/Observable';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { PreFillService } from '../../core/services/preFill.service';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../core/components/base/base.component';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import { SystemErrorService } from '../../core/services/system-services.service';


@Component({
   selector: 'app-edit-recipient',
   templateUrl: './edit-recipient.component.html',
   styleUrls: ['./edit-recipient.component.scss']
})
export class EditRecipientComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
   schedulePayementData: IScheduledTransactionType[];
   @Input() beneficiaryDetails: IBeneficiaryData;
   @Input() isAddMode: boolean;
   @Input() isEmptyState: boolean;
   @Output() childNotifying = new EventEmitter<IParentOperation>();
   @Output() onOperationSuccess = new EventEmitter<number>();
   @Output() enableSaveRecipient = new EventEmitter<boolean>();
   @Output() focusMessage = new EventEmitter<boolean>();
   @Output() selectBankApprovedTab = new EventEmitter();
   @Output() editSchedule = new EventEmitter<IScheduledTransactionType>();
   @Input() parentNotification: Subject<IParentOperation>;
   @Input() refreshSchedulePayments: number;
   @ViewChild('beneficiaryForm') beneficiaryForm;
   patterns = Constants.patterns;
   isReadOnly = true;
   emailNotifications: IContactCardNotification[] = [];
   smsNotifications: IContactCardNotification[] = [];
   faxNotifications: IContactCardNotification[] = [];
   isValid = false;
   accountContactCards: IContactCardDetail[] = [];
   electricityContactCards: IContactCardDetail[] = [];
   prepaidContactCards: IContactCardDetail[] = [];
   creditCardContactCards: IContactCardDetail[] = [];
   isVisible = false;
   isShowMessageBlock = false;
   statusMessage = '';
   isSuccess = false;
   messages = Constants.messages;
   labels = Constants.labels;
   showLoader: Boolean;
   saveLoading = false;

   banks: IBank[];
   popularBanks: IBank[];
   accountTypes = CommonUtility.covertToDropdownObject(Constants.VariableValues.accountTypes);
   contactName = '';
   acronymName = '';
   isMaxRecipientLimitExceeded = false;
   currentContactCardId: number;
   isBankApprovedBeneficiary;
   saveButtonText = '';
   isShowDeleteButton;
   sectionNames = Constants.BeneficiaryType;
   referenceText = Constants.labels.yourReference;
   beneficiaryData: IBeneficiaryData;
   beneficiaryDataToSave: IBeneficiaryData;
   apiFailureMessage = '';
   selectedRecipient: IBeneficiaryData;
   isFirstTime = false;
   subscription: ISubscription;
   skeletonModeSchedule = true;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   creditCardAccountTypeCode = Constants.VariableValues.accountTypes.creditCardAccountType.code;
   creditCardLengths = Constants.VariableValues.creditCardLengths;
   accounts: IDashboardAccount[] = [];
   @Output() showRepeatTransaction = new EventEmitter<boolean>();
   isCollapsed = true;
   branchelement: HTMLElement;
   ariaMessages  =  Constants.AriaMessages.recipient;
   constants = Constants;

   constructor(private recipientService: RecipientService,
      private buyElectricityService: BuyElectricityService,
      private preFillService: PreFillService,
      private router: Router,
      private modalService: BsModalService,
      private accountService: AccountService,
      private beneficiaryService: BeneficiaryService,
      @Inject(DOCUMENT) private document: Document,
      injector: Injector, private systemErrorService: SystemErrorService) {
      super(injector);
      this.recipientService.initiateRecepientFlow();
   }

   ngOnInit() {
      this.showLoader = true;
      this.updateScheduledPayments();
      this.recipientService.banks.subscribe(banks => {
         this.banks = banks;
         this.sortAndAddPopularBanks();
         this.setFormStateForContact();
      });

      this.subscription = this.recipientService.recipientOperation.subscribe(operation => {
         switch (operation) {
            case RecipientOperation.deleteRecipeint:
               this.deleteRecipient();
         }
      });
      this.beneficiaryService.selectedBeneficiary.subscribe(recipient => {
         this.selectedRecipient = recipient;
      });
      this.isFirstTime = true;
      this.parentNotification.subscribe((details: IParentOperation) => {
         if (details.isSaveRecipient) {
            this.saveRecipient();
         }
      });
      this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
         this.accounts = [];
         accountContainers.forEach((ac) => {
            Array.prototype.push.apply(this.accounts, ac.Accounts);
         });
      });
   }

   private sortAndAddPopularBanks() {
      if (this.banks && this.banks.length > 0) {
         this.banks.sort(function (current, next) {
            const currentName = (current && current.bankName !== null) ? current.bankName.toUpperCase() : '',
               nextName = (next && next.bankName !== null) ? next.bankName.toUpperCase() : '';
            return currentName < nextName ? -1 : 1;
         });
         this.popularBanks = this.banks.filter(i => this.constants.popularBanks.some(j => j.bankCode === i.bankCode &&
            i.bankName && j.bankName.toUpperCase() === i.bankName.toUpperCase()));
         this.popularBanks = this.popularBanks.map(x => Object.assign({}, x));
         this.popularBanks.sort(function (current, next) {
            const currentorder = Constants.popularBanks.filter(i => i.bankCode === current.bankCode)[0].order;
            const nextorder = Constants.popularBanks.filter(i => i.bankCode === next.bankCode)[0].order;
            return currentorder - nextorder;
         });
         this.popularBanks.map(i => i.category = Constants.PopularCategory);
         this.banks.map(b => {
            b.category = (b && b.bankName !== '' && b.bankName !== null ? b.bankName.charAt(0).toUpperCase() : '');
         });
         this.banks = this.popularBanks.concat(this.banks);
      }
   }

   ngOnChanges(changes?: SimpleChanges) {
      this.isReadOnly = !this.isAddMode;
      this.isBankApprovedBeneficiary = false;
      this.saveButtonText = Constants.Recipient.saveButtonText;
      this.isCollapsed = true;
      this.isShowDeleteButton = true;
      if (this.isAddMode) {
         this.resetFormState();
         this.isShowMessageBlock = false;
         if (!this.beneficiaryData) {
            this.beneficiaryData = {};
         }
      } else {
         this.handleBeneficiaryDetails();
      }
      this.showLoader = false;

      if (changes && changes['refreshSchedulePayments'] &&
         changes['refreshSchedulePayments'].currentValue !== changes['refreshSchedulePayments'].previousValue) {
         this.updateScheduledPayments();
      }
   }

   ngOnDestroy() {
      if (this.subscription) {
         this.subscription.unsubscribe();
      }
      if (this.parentNotification) {
         this.parentNotification.unsubscribe();
      }
   }

   prePaidToPay(contactCardDetail) {
      const data = {
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isPrepaid: true
         },
         bankDefinedBeneficiary: null
      };
      this.goToPay(data);
   }

   prePaidToBuy(contactCardDetail) {
      const data = {
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isPrepaid: true
         },
         bankDefinedBeneficiary: null
      };
      this.goToBuy(data);
   }

   isBankOpen(id) {
      return !!(this.document.getElementById(id) ?
         this.document.getElementById(id).getElementsByClassName('benf-bankname-type-ahead').length : 0);
   }

   isBankAccountContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType !== 'PPD' && contactCardDetail.beneficiaryType !== 'PEL';
   }

   isPrepaidContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === 'PPD';
   }

   isElectricityContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === 'PEL';
   }
   contactCardToPay(contactCardDetail: IContactCardDetail) {
      const data = {
         contactCard: this.beneficiaryDetails.contactCard,
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isAccount: this.isBankAccountContactCard(contactCardDetail),
            isPrepaid: this.isPrepaidContactCard(contactCardDetail),
            isElectricity: this.isElectricityContactCard(contactCardDetail)
         },
         bankDefinedBeneficiary: this.beneficiaryDetails.bankDefinedBeneficiary
      };
      this.goToPay(data);
   }

   electricityToBuy(contactCardDetail: IContactCardDetail) {
      const data = {
         contactCard: this.beneficiaryDetails.contactCard,
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isElectricity: true
         }
      };
      this.goToBuyElectricity(data);
   }
   goToPay(beneficiaryDetails: IBeneficiaryData) {
      this.preFillService.preFillBeneficiaryData = beneficiaryDetails;
      const itemAccountId = this.getItemAccountId(beneficiaryDetails.contactCardDetails.cardDetails.accountNumber);
      this.router.navigate(['/payment' + (itemAccountId ? ('/' + itemAccountId) : '')]);
   }
   goToBuy(beneficiaryDetails: IBeneficiaryData) {
      this.preFillService.preFillBeneficiaryData = beneficiaryDetails;
      const itemAccountId = this.getItemAccountId(beneficiaryDetails.contactCardDetails.cardDetails.accountNumber);
      this.router.navigate(['/buy' + (itemAccountId ? ('/' + itemAccountId) : '')]);
   }
   goToBuyElectricity(beneficiaryDetails: IBeneficiaryData) {
      this.preFillService.preFillBeneficiaryData = beneficiaryDetails;
      const itemAccountId = this.getItemAccountId(beneficiaryDetails.contactCardDetails.cardDetails.accountNumber);
      this.router.navigate(['/buyElectricity' + (itemAccountId ? ('/' + itemAccountId) : '')]);
   }

   getItemAccountId(accountNumber: string): string {
      const account = this.accounts.filter((ac) => {
         return ac.AccountNumber.toString() === accountNumber;
      })[0];

      return account ? account.ItemAccountId : null;
   }

   setFormStateForBankApproved() {
      this.resetFormState();
      // always show all details for bank approved beneficiary
      this.isCollapsed = false;
      this.saveButtonText = Constants.Recipient.saveAsRecipientText;
      this.isBankApprovedBeneficiary = true;
      this.contactName = this.beneficiaryData.bankDefinedBeneficiary.bDFName;
      this.acronymName = CommonUtility.getAcronymName(this.contactName);
      this.accountContactCards.push({
         accountType: Constants.Recipient.bankApprovedAccountType,
         beneficiaryName: this.contactName,
         accountNumber: this.beneficiaryData.bankDefinedBeneficiary.bDFID,
         beneficiaryType: Constants.Recipient.bankApprovedAccountType,
         beneficiaryReference: '',
         myReference: '',
         branchCode: this.beneficiaryData.bankDefinedBeneficiary.sortCode.toString()
      });
   }

   setFormStateForContact() {
      if (this.beneficiaryData && this.beneficiaryData.hasOwnProperty('contactCard')) {
         this.contactName = this.beneficiaryData.contactCard.contactCardName;
         this.acronymName = CommonUtility.getAcronymName(this.contactName);
         this.emailNotifications = this.getNotifications('email', this.beneficiaryData.contactCard);
         this.smsNotifications = this.getNotifications('sms', this.beneficiaryData.contactCard);
         this.faxNotifications = this.getNotifications('fax', this.beneficiaryData.contactCard);

         this.prepaidContactCards = this.getContactCardDetails('ppd', this.beneficiaryData.contactCard);
         this.electricityContactCards = this.getContactCardDetails('pel', this.beneficiaryData.contactCard);
         this.filterAccountContactCardDetails(this.beneficiaryData.contactCard);

         // when recipient does not have contact details saved, show account details without collapse toggle
         if (!(this.emailNotifications.length + this.smsNotifications.length + this.faxNotifications.length)) {
            this.isCollapsed = false;
         }
      }
   }

   handleBeneficiaryDetails() {
      if (this.beneficiaryDetails) {
         if (this.isFirstTime && this.selectedRecipient) {
            this.beneficiaryData = CommonUtility.clone(this.selectedRecipient);
            if (this.selectedRecipient.bankDefinedBeneficiary) {
               this.selectBankApprovedTab.emit();
            }
         } else {
            this.beneficiaryData = CommonUtility.clone(this.beneficiaryDetails);
         }
         this.isFirstTime = false;
         this.beneficiaryService.selectedBeneficiary.next(this.beneficiaryData);
         if (this.schedulePayementData) {
            this.appendSchedulePayemnt();
         }
         if (this.beneficiaryData.contactCard) {
            if (this.currentContactCardId !== this.beneficiaryData.contactCard.contactCardID) {
               this.isShowMessageBlock = false;
            }
            if (this.isBankApprovedContact(this.beneficiaryData.contactCard)) {
               this.isBankApprovedBeneficiary = true;
            }
            this.setFormStateForContact();
         } else if (this.beneficiaryData.bankDefinedBeneficiary) {
            this.isShowDeleteButton = false;
            this.setFormStateForBankApproved();
         }
      }
   }

   isBankApprovedContact(contact: IContactCard) {
      const contactCardDetails = contact.contactCardDetails;
      return contactCardDetails.length === 1 &&
         contactCardDetails[0].accountType === Constants.Recipient.bankApprovedAccountType;
   }

   filterAccountContactCardDetails(contactCard) {
      this.creditCardContactCards = [];
      this.accountContactCards = [];
      const result = contactCard.contactCardDetails &&
         contactCard.contactCardDetails.forEach((contactCardDetail) => {

            if (contactCardDetail.accountType === Constants.VariableValues.accountTypes.creditCardAccountType.code) {
               this.creditCardContactCards.push(contactCardDetail);
            } else if (contactCardDetail.beneficiaryType.toLocaleLowerCase() ===
               Constants.BeneficiaryType.Internal.toLocaleLowerCase() ||
               contactCardDetail.beneficiaryType.toLocaleLowerCase() ===
               Constants.BeneficiaryType.External.toLocaleLowerCase() ||
               contactCardDetail.beneficiaryType === Constants.Recipient.bankApprovedAccountType) {
               this.accountContactCards.push(contactCardDetail);
            }
         });
      this.updateAccountVm();
   }

   updateAccountVm() {
      this.accountContactCards.forEach(account => {
         const accType = account.accountType;
         const accTypeName = this.getAccountTypeName(account.accountType);
         if (account.bankCode) {
            const selectedBank: IBank = this.banks.find(bank => {
               return bank.bankCode === account.bankCode;
            });

            if (selectedBank) {
               const selectedBranch: IBranch = selectedBank.branchCodes && selectedBank.branchCodes.find(branch => {
                  return branch.branchCode === account.branchCode;
               });

               this.bankChange(account, selectedBank);
               account.bankName = selectedBank.bankName;
               account.accountType = accType;
               (<any>account).accountTypeName = accTypeName;

               if (selectedBranch) {
                  this.assignBranch(account, selectedBranch);
                  (<any>account).branchDisplayName = selectedBranch.displayName;
               }
            }
         }
      });
   }

   resetFormState() {
      this.contactName = '';
      this.acronymName = '';
      this.electricityContactCards = [];
      this.prepaidContactCards = [];
      this.accountContactCards = [];
      this.emailNotifications = [];
      this.smsNotifications = [];
      this.faxNotifications = [];
      this.creditCardContactCards = [];
      this.isShowMessageBlock = false;
   }

   isBeneficiaryValid() {
      this.isValid = !!(!!(this.beneficiaryForm && this.beneficiaryForm.valid)
         && (this.getSectionItemCount(this.sectionNames.Prepaid) || this.getSectionItemCount(this.sectionNames.Account)
            || this.getSectionItemCount(this.sectionNames.Electricity) ||
            (this.getSectionItemCount(this.sectionNames.CreditCard))));
      this.notifyParent();
      this.enableSaveRecipient.emit(this.isValid);
      return this.isValid;
   }
   private notifyParent() {
      this.childNotifying.emit({ isValid: this.isValid, isSaveLoading: this.saveLoading });
   }
   getSectionItemCount(name: string) {
      if (name === this.sectionNames.Prepaid) {
         return this.prepaidContactCards.filter(pre => !pre.isDeleted).length;
      } else if (name === this.sectionNames.Electricity) {
         return this.electricityContactCards.filter(ele => !ele.isDeleted).length;
      } else if (name === this.sectionNames.Account) {
         return this.accountContactCards.filter(acc => !acc.isDeleted).length;
      } else if (name === this.sectionNames.Sms) {
         return this.smsNotifications.filter(sms => !sms.isDeleted).length;
      } else if (name === this.sectionNames.Email) {
         return this.emailNotifications.filter(email => !email.isDeleted).length;
      } else if (name === this.sectionNames.Fax) {
         return this.faxNotifications.filter(fax => !fax.isDeleted).length;
      } else if (name === this.sectionNames.CreditCard) {
         return this.creditCardContactCards.filter(card => !card.isDeleted).length;
      }
   }

   onMeterNumberBlur(meter, number: number) {
      // this.buyElectricityService.saveBuyElectricityToInfo(this.vm);
      if (number && number.toString().trim().length > 0) {
         // TODO: refer for logic in here from buy-electricity-to component
         meter.isMeterNumberValid = true;
      }
   }

   onMeterNumberChange(meter) {
      meter.isMeterNumberValid = false;
   }

   isNedBankSelected(account: IContactCardDetail): boolean {
      return account.bankName && CommonUtility.isNedBank(account.bankName);
   }

   isNedBank(bank: IBank) {
      return CommonUtility.isNedBank(bank.bankName);
   }

   onAccountTypeChanged(account, accountType) {
      account.accountType = accountType.value.code;
      account.accountTypeName = accountType.value.text;
      (<any>account).accountTypeDirty = true;
   }

   onAccountTypeDropdownOpen(account) {
      account.accountTypeDirty = true;
   }

   selectBank(account, selected) {
      this.clearBankInfo(account);
      // clear account number to ensure user always
      // adds correct account number when bank is changed
      account.accountNumber = null;
      this.bankChange(account, selected.item);
      this.branchelement = this.document.getElementById('bank-0') as HTMLElement;
      if (this.branchelement !== null) {
         this.branchelement.click();
      }
   }

   bankChange(account, bank) {
      this.checkForBranchVisiblity(account, bank);
      this.assignBank(account, bank);
      if (!this.isNedBank(bank)) {
         this.clearBranch(account);
      }
   }

   private checkForBranchVisiblity(account, bank) {
      account.isBranchVisible = !(bank.hasOwnProperty('universalCode') && bank.universalCode.length > 0)
         &&
         !this.isNedBank(bank);
   }

   private assignBank(account, bank) {
      if (this.isNedBank(bank)) {
         account.branch = Constants.VariableValues.nedBankDefaults.branch;
         account.acceptsRealtimeAVS = Constants.VariableValues.nedBankDefaults.acceptsRealtimeAVS;
         account.acceptsBatchAVS = Constants.VariableValues.nedBankDefaults.acceptsRealtimeAVS;
         account.accountType = Constants.VariableValues.nedBankDefaults.accountType;
         account.beneficiaryType = Constants.BeneficiaryType.Internal;
      } else {
         (<any>(account)).branches = bank.branchCodes && bank.branchCodes.length ? bank.branchCodes.map(_branch => {
            _branch['displayName'] = _branch.branchName + ' - ' + _branch.branchCode;
            return _branch;
         }) : [];
         account.branches = CommonUtility.sortByKey(account.branches, 'displayName');
         account.beneficiaryType = Constants.BeneficiaryType.External;
      }
      account.bankName = bank.bankName;
      account.bankCode = bank.bankCode;
      account.branchCode = bank.universalCode;
   }

   blurBank(account: IContactCardDetail, selection: any) {
      if (selection && selection.item) {
         this.bankChange(account, selection.item);
         account.bankName = selection.item.bankName;
      } else {
         this.clearBankInfo(account);
      }
   }

   blurBankInput(account) {
      if (account.accountSuggestion) {
         this.clearBankInfo(account);
      }
   }

   clearBankSuggestion(account, event) {
      account.accountSuggestion = event;
   }

   clearBankInfo(account: IContactCardDetail, ) {
      // delete attributes to clear unwanted params in API request
      delete account.bankName;
      delete account.branchCode;
      delete account.accountType;
      delete account.beneficiaryType;
      delete account.bankCode;
   }

   selectBranch(account, selected) {
      this.assignBranch(account, selected.item);
   }

   blurBranch(account, selected) {
      if (selected && selected.item) {
         this.assignBranch(account, selected.item);
         account.branchName = account.branch.branchName + ' - ' + account.branch.branchCode;
         account.branchDisplayName = account.branch.displayName;
      } else {
         this.clearBranch(account);
      }
   }

   clearBranch(account) {
      account.branch = null;
      account.branchName = '';
      account.branchDisplayName = '';
   }

   assignBranch(account, branch) {
      account.branch = branch;
      account.branchCode = branch.branchCode || account.branchCode;
   }

   noBranchResults(account, event) {
      account.noBranchData = event;
   }

   blurBranchInput(account) {
      if (account.noBranchData) {
         this.clearBranch(account);
      }
   }

   getNotifications(notificationType: string, contactCard: IContactCard) {
      return contactCard.contactCardNotifications &&
         contactCard.contactCardNotifications.filter((notification) => {
            return notification.notificationType.toLocaleLowerCase() === notificationType.toLocaleLowerCase();
         });
   }

   getContactCardDetails(beneficiaryType: string, contactCard: IContactCard) {
      return contactCard.contactCardDetails &&
         contactCard.contactCardDetails.filter((contactCardDetail) => {
            return contactCardDetail.beneficiaryType.toLocaleLowerCase() === beneficiaryType.toLocaleLowerCase();
         });
   }

   addEmail() {
      this.emailNotifications.push({
         notificationType: 'Email',
         notificationAddress: ''
      });
   }

   addCellphone() {
      this.smsNotifications.push({
         notificationType: 'SMS',
         notificationAddress: ''
      });
   }

   addFax() {
      this.faxNotifications.push({
         notificationType: 'Fax',
         notificationAddress: ''
      });
   }

   removeNotification(notificationDetail: IContactCardNotification) {
      notificationDetail.isDeleted = true;
      notificationDetail.notificationAddress = '';
   }

   addAccount() {
      this.accountContactCards.push({
         accountType: 'U0',
         beneficiaryName: '',
         accountNumber: null,
         beneficiaryType: Constants.BeneficiaryType.External,
         beneficiaryReference: '',
         myReference: ''
      });
   }

   addMeter() {
      this.electricityContactCards.push({
         accountType: 'U0',
         beneficiaryName: '',
         accountNumber: null,
         beneficiaryType: 'PEL',
         beneficiaryReference: '',
         myReference: ''
      });
   }

   addPrepaid() {
      this.prepaidContactCards.push({
         accountType: 'U0',
         beneficiaryName: '',
         accountNumber: null,
         beneficiaryType: 'PPD',
         beneficiaryReference: '',
         myReference: ''
      });
   }

   addCreditCard() {
      this.creditCardContactCards.push({
         accountType: Constants.VariableValues.accountTypes.creditCardAccountType.code,
         beneficiaryName: '',
         accountNumber: null,
         beneficiaryType: Constants.BeneficiaryType.External,
         beneficiaryReference: '',
         myReference: ''
      });
   }

   removeContactCardDetail(contactCardDetail: IContactCardDetail) {
      contactCardDetail.isDeleted = true;
      contactCardDetail.accountNumber = '';
   }

   showDeleteRecipientNotification() {
      this.recipientService.recipientOperation.next(RecipientOperation.showDeleteRecipient);
   }

   hideDeleteRecipientNotification() {
      this.recipientService.recipientOperation.next(RecipientOperation.hideDeleteRecipient);
   }

   deleteRecipient() {
      this.currentContactCardId = this.beneficiaryData.contactCard.contactCardID;
      // to reset component input state
      this.onOperationSuccess.emit(Math.random());
      this.recipientService.deleteRecipient(this.beneficiaryData.contactCard.contactCardID).subscribe((data => {
         const status = this.recipientService.getTransactionStatus(data);
         if (status.isValid) {
            this.onOperationSuccess.emit(Constants.Recipient.status.deleteSuccess);
            this.isReadOnly = false;
            this.apiFailureMessage = '';
         } else {
            this.apiFailureMessage = status.reason;
            this.handleValidationError(Constants.Recipient.deleteErrorMessage);
         }
         this.hideDeleteRecipientNotification();
      }), (error) => {
         this.apiFailureMessage = '';
         this.handleErrorMessage(Constants.Recipient.deleteErrorMessage);
         this.hideDeleteRecipientNotification();
      });
   }

   autoCloseMessageBlock() {
      setTimeout(() => {
         this.closeMessageBlock();
      }, Constants.VariableValues.settings.messageHideTimeout);
   }

   closeMessageBlock() {
      this.isShowMessageBlock = false;
   }

   cancelAddRecipient() {
      this.resetFormState();
      this.handleBeneficiaryDetails();
      this.onOperationSuccess.emit(Constants.Recipient.status.cancel);
      this.router.navigate(['/recipient']);
   }

   isUpdateBankApprovedContact() {
      return this.beneficiaryData.contactCard &&
         this.beneficiaryData.contactCard.contactCardID &&
         this.isBankApprovedContact(this.beneficiaryData.contactCard);
   }


   validateSaveClick() {
      if (this.beneficiaryForm instanceof NgForm) {
         CommonUtility.markFormControlsTouched(this.beneficiaryForm);
      }

      if (this.isBeneficiaryValid()) {
         this.saveRecipient();
      }
   }

   saveRecipient() {
      // to reset component input state
      this.onOperationSuccess.emit(Math.random());
      this.setRecipientData();
      if (!this.beneficiaryDataToSave.contactCard.contactCardID) {
         this.addRecipient();
      } else {
         this.currentContactCardId = this.beneficiaryDataToSave.contactCard.contactCardID;
         this.updateRecipient();
      }
   }

   setRecipientData() {
      let contactCardID: number;
      if ((this.isAddMode || this.isBankApprovedBeneficiary) && !this.isUpdateBankApprovedContact()) {
         contactCardID = null;
      } else {
         contactCardID = this.beneficiaryData.contactCard.contactCardID;
      }
      // set notifications
      let notifications = this.emailNotifications.concat(this.smsNotifications, this.faxNotifications);
      notifications = notifications.filter((notification) => {
         return notification.notificationAddress || notification.notificationParents;
      });

      // set contact card details
      const contactCardDetails = this.accountContactCards.concat(this.prepaidContactCards, this.electricityContactCards,
         this.creditCardContactCards);
      const contactCardDetailsToSave = [];
      contactCardDetails.forEach(contactCard => {
         if (contactCard.accountNumber || contactCard.beneficiaryID) {
            contactCardDetailsToSave.push({
               accountType: contactCard.accountType,
               beneficiaryID: contactCard.beneficiaryID,
               beneficiaryName: this.contactName,
               accountNumber: contactCard.accountNumber,
               bankCode: contactCard.bankCode,
               branchCode: contactCard.branchCode || (contactCard.branch && contactCard.branch.branchCode),
               bankName: contactCard.bankName,
               beneficiaryType: contactCard.beneficiaryType,
               myReference: contactCard.myReference,
               beneficiaryReference: contactCard.beneficiaryReference,
            });
         }
      });

      this.beneficiaryDataToSave = {
         contactCard: {
            contactCardDetails: contactCardDetailsToSave,
            contactCardNotifications: notifications,
            contactCardName: this.contactName,
            contactCardID: this.isAddMode ? null : contactCardID
         }
      };
   }

   updateRecipient() {
      this.saveLoading = true;
      this.recipientService.updateRecipient(this.beneficiaryDataToSave.contactCard).subscribe((data) => {
         const status = this.recipientService.getTransactionStatus(data);
         if (status.isValid) {
            this.apiFailureMessage = '';
            this.recipientService.updateRecipient(this.beneficiaryDataToSave.contactCard, false).subscribe((response) => {
               const savedStatus = this.recipientService.getTransactionStatus(response);
               if (savedStatus.isValid) {
                  this.recipientService.addUpdateSuccess = false;

                  if (savedStatus.status.toLocaleLowerCase() === Constants.metadataKeys.pending.toLocaleLowerCase()) {
                     this.recipientService.tempContactCard = this.beneficiaryDataToSave.contactCard;
                     this.recipientService.tempContactCard.secureTransaction = {
                        verificationReferenceId: response.resultData[0].transactionID
                     };

                     this.bsModalRef = this.modalService.show(
                        OutofbandVerificationComponent,
                        Object.assign(
                           {},
                           {
                              animated: true,
                              keyboard: false,
                              backdrop: true,
                              ignoreBackdropClick: true
                           },
                           { class: '' }
                        )
                     );

                     this.bsModalRef.content.getApproveItStatus.subscribe(() => {
                        try {
                           this.recipientService.getApproveItStatus().subscribe(approveItResponse => {
                              this.recipientService.tempContactCard.
                                 secureTransaction.verificationReferenceId =
                                 approveItResponse.metadata.resultData[0].transactionID;
                              this.bsModalRef.content.processApproveItResponse(approveItResponse);
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                        } catch (e) { }
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.updateSuccess.subscribe(value => {
                        this.recipientService.addUpdateSuccess = value;
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                        this.recipientService.updateRecipient(this.recipientService.tempContactCard, false)
                           .subscribe((paymentResponse) => {
                              this.recipientService.tempContactCard.
                                 secureTransaction.verificationReferenceId =
                                 paymentResponse.resultData[0].transactionID;
                              this.bsModalRef.content.processResendApproveDetailsResponse(paymentResponse);
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
                        this.recipientService.getApproveItOtpStatus(otpValue,
                           this.recipientService.tempContactCard.secureTransaction.verificationReferenceId)
                           .subscribe(otpResponse => {
                              this.bsModalRef.content.processApproveUserResponse(otpResponse);
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.otpIsValid.subscribe(() => {
                        this.recipientService.getApproveItStatus().subscribe(approveItResponse => {
                           this.recipientService.tempContactCard.secureTransaction.verificationReferenceId =
                              approveItResponse.metadata.resultData[0].transactionID;
                           this.bsModalRef.content.processApproveItResponse(approveItResponse);
                        }, (error: any) => {
                           this.raiseSystemError();
                        });
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.modalSubscription = this.modalService.onHidden.asObservable()
                        .subscribe(() => {
                           try {
                              this.bsModalRef.content.unsubscribeAll();
                           } catch (e) { }

                           if (this.recipientService.addUpdateSuccess) {
                              this.onOperationSuccess.emit(
                                 this.beneficiaryDataToSave.contactCard.contactCardID);
                              this.handleSuccessMessage(Constants.Recipient.successMessage);
                           } else {
                              this.handleErrorMessage(Constants.Recipient.errorMessage);
                              this.onOperationSuccess.emit(Constants.Recipient.status.error);
                           }
                        });
                  } else if (savedStatus.status.toLocaleLowerCase() ===
                     Constants.metadataKeys.success.toLocaleLowerCase()) {
                     this.onOperationSuccess.emit(this.beneficiaryDataToSave.contactCard.contactCardID);
                     this.handleSuccessMessage(Constants.Recipient.successMessage);
                  } else {
                     this.handleValidationError(Constants.Recipient.errorMessage);
                     this.apiFailureMessage = savedStatus.reason;
                  }
               } else {
                  this.handleValidationError(Constants.Recipient.errorMessage);
                  this.apiFailureMessage = status.reason;
               }
            }, (error) => {
               this.apiFailureMessage = '';
               this.handleErrorMessage(Constants.Recipient.errorMessage);
               this.focusMessage.emit(true);
               this.raiseSystemError();
            });
         } else {
            this.handleValidationError(Constants.Recipient.errorMessage);
            this.apiFailureMessage = status.reason;
         }
      }, (error) => {
         this.apiFailureMessage = '';
         this.handleErrorMessage(Constants.Recipient.errorMessage);
         this.focusMessage.emit(true);
         this.saveLoading = false;
      });
   }
   // raise error to system message control
   private raiseSystemError() {
      this.saveLoading = false;
      this.buyElectricityService.raiseSystemError(true);
   }
   addRecipient() {
      this.saveLoading = true;
      this.notifyParent();
      this.recipientService.addUpdateSuccess = false;
      this.recipientService.addRecipient(this.beneficiaryDataToSave.contactCard).subscribe((data) => {
         const status = this.recipientService.getTransactionStatus(data.metadata);
         if (status.isValid) {
            this.apiFailureMessage = '';
            this.recipientService.addRecipient(this.beneficiaryDataToSave.contactCard, false)
               .subscribe((response) => {
                  const savedStatus = this.recipientService.getTransactionStatus(response.metadata);
                  if (savedStatus.isValid) {
                     if (savedStatus.status.toLocaleLowerCase() ===
                        Constants.metadataKeys.pending.toLocaleLowerCase()) {
                        this.recipientService.tempContactCard = this.beneficiaryDataToSave.contactCard;
                        this.recipientService.tempContactCard.secureTransaction = {
                           verificationReferenceId: response.metadata.resultData[0].transactionID
                        };

                        this.bsModalRef = this.modalService.show(
                           OutofbandVerificationComponent,
                           Object.assign(
                              {},
                              {
                                 animated: true,
                                 keyboard: false,
                                 backdrop: true,
                                 ignoreBackdropClick: true
                              },
                              { class: '' }
                           )
                        );
                     }

                     this.bsModalRef.content.getApproveItStatus.subscribe(() => {
                        try {
                           this.recipientService.getApproveItStatus().subscribe(approveItResponse => {
                              this.recipientService.tempContactCard.
                                 secureTransaction.verificationReferenceId =
                                 approveItResponse.metadata.resultData[0].transactionID;
                              this.recipientService.tempContactCard.contactCardID = approveItResponse.data &&
                                 approveItResponse.data && approveItResponse.data['contactCardID'];
                              this.bsModalRef.content.processApproveItResponse(approveItResponse);
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                        } catch (e) { }

                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.updateSuccess.subscribe(value => {
                        this.recipientService.addUpdateSuccess = value;
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                        this.recipientService.addRecipient(this.recipientService.tempContactCard, false)
                           .subscribe((paymentResponse) => {
                              this.recipientService.tempContactCard.
                                 secureTransaction.verificationReferenceId =
                                 paymentResponse.metadata.resultData[0].transactionID;
                              this.bsModalRef.content.processResendApproveDetailsResponse(paymentResponse);
                              this.recipientService.tempContactCard.contactCardID = paymentResponse.data &&
                                 paymentResponse.data.length && paymentResponse.data['contactCardID'];
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
                        this.recipientService.getApproveItOtpStatus(otpValue,
                           this.recipientService.tempContactCard.secureTransaction.verificationReferenceId)
                           .subscribe(otpResponse => {
                              this.bsModalRef.content.processApproveUserResponse(otpResponse);
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.otpIsValid.subscribe(() => {
                        this.recipientService.getApproveItStatus().subscribe(approveItResponse => {
                           this.recipientService.tempContactCard.secureTransaction.verificationReferenceId =
                              approveItResponse.metadata.resultData[0].transactionID;
                           this.recipientService.tempContactCard.contactCardID = approveItResponse.data &&
                              approveItResponse.data && approveItResponse.data['contactCardID'];
                           this.bsModalRef.content.processApproveItResponse(approveItResponse);
                        }, (error: any) => {
                           this.raiseSystemError();
                        });
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.modalSubscription = this.modalService.onHidden.asObservable()
                        .subscribe(() => {
                           this.bsModalRef.content.unsubscribeAll();

                           if (this.recipientService.addUpdateSuccess) {
                              this.onOperationSuccess.emit(
                                 this.recipientService.tempContactCard.contactCardID);
                           } else {
                              this.handleErrorMessage(Constants.Recipient.errorMessage);
                              this.onOperationSuccess.emit(Constants.Recipient.status.error);
                           }

                           this.currentContactCardId = this.recipientService.tempContactCard.contactCardID;
                           this.focusMessage.emit(true);
                           this.saveLoading = false;
                           this.notifyParent();
                        });
                  } else {
                     this.handleValidationError(Constants.Recipient.errorMessage);
                     this.apiFailureMessage = status.reason;
                  }
               }, (error) => {
                  this.handleErrorMessage(Constants.Recipient.errorMessage);
                  this.focusMessage.emit(true);
                  this.saveLoading = false;
                  this.notifyParent();
                  this.onOperationSuccess.emit(Constants.Recipient.status.error);
                  this.raiseSystemError();
               });
         } else {
            if (data.metadata && data.metadata.resultData &&
               data.metadata.resultData.length && data.metadata.resultData[0].result ===
               Constants.Recipient.limitExceededErrorCode) {
               this.recipientService.recipientOperation.next(RecipientOperation.showLimitExceeded);
            }
            this.handleValidationError(Constants.Recipient.errorMessage);
            this.apiFailureMessage = status.reason;
         }
      }, (error) => {
         this.handleErrorMessage(Constants.Recipient.errorMessage);
         this.focusMessage.emit(true);
         this.saveLoading = false;
         this.notifyParent();
         this.onOperationSuccess.emit(Constants.Recipient.status.error);
      });
   }

   handleValidationError(message) {
      this.isShowMessageBlock = true;
      this.isSuccess = false;
      this.focusMessage.emit(true);
      this.statusMessage = message;
      this.saveLoading = false;
      this.notifyParent();
      this.autoCloseMessageBlock();
   }

   handleErrorMessage(message) {
      this.handleValidationError(message);
      this.saveLoading = false;
      this.statusMessage = message;
      this.isShowMessageBlock = true;
      this.isSuccess = false;
      this.notifyParent();
   }

   handleSuccessMessage(message) {
      this.saveLoading = false;
      this.statusMessage = message;
      this.isShowMessageBlock = true;
      this.isSuccess = true;
      this.isReadOnly = true;
      this.focusMessage.emit(true);
      this.notifyParent();
      this.autoCloseMessageBlock();
   }

   getAccountTypeName(accountType) {
      const accountTypeDetail = this.accountTypes.find((accountTypeObj) => {
         return accountTypeObj.value.code === accountType;
      });
      let accountTypeName;

      if (accountTypeDetail) {
         accountTypeName = accountTypeDetail.value.text;
      }
      return accountTypeName;
   }

   editAddRecipient() {
      this.isReadOnly = false;
   }
   appendSchedulePayemnt() {
      let scheduledPayment;
      if (this.beneficiaryData.bankDefinedBeneficiary) {
         scheduledPayment = this.schedulePayementData.filter(schedule => {
            if (schedule.type === Constants.SchedulePaymentType.prepaid.name) {
               return false;
            }
            return schedule.transaction.toAccount.accountNumber === this.beneficiaryData.bankDefinedBeneficiary.bDFID;
         });
      } else if (this.beneficiaryData.contactCard) {
         scheduledPayment = this.schedulePayementData.filter(schedule =>
            !!this.beneficiaryData.contactCard.contactCardDetails.find(bene => bene.beneficiaryID === schedule.transaction.beneficiaryID));
      }
      this.beneficiaryData.schedulePayments = scheduledPayment;
   }
   formatScheduleTransactions(alltransaction: [IScheduledTransaction[], IScheduledTransaction[]]): IScheduledTransactionType[] {
      const transactionType: IScheduledTransactionType[] = [];
      alltransaction.forEach((transactions, index) => {
         transactions.forEach(transaction => {
            if (index === ScheduleTypes.payment) {
               transactionType.push({
                  transaction: transaction,
                  type: Constants.SchedulePaymentType.payment.name,
                  iconClass: Constants.SchedulePaymentType.payment.icon
               });
            } else {
               transactionType.push({
                  type: Constants.SchedulePaymentType.prepaid.name,
                  iconClass: Constants.SchedulePaymentType.prepaid.icon,
                  transaction: transaction
               });
            }
         });
      });
      return transactionType;
   }

   repeatPayment() {

   }
   goToRepeatPayment(value) {
      this.beneficiaryData.selectedTransaction = value;
      // this.preFillService.preFillBeneficiaryData = this.beneficiaryData;
      this.router.navigateByUrl('recipient/payment');
   }
   toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
   }

   updateScheduledPayments() {
      this.skeletonModeSchedule = true;
      const urlParam = { transactiontype: 'scheduled' };
      const scheduledPayment = this.accountService.getScheduledPayment(urlParam);
      const scheduledMobileTrasactions = this.accountService.getScheduledMobileTrasactions(urlParam);
      Observable.forkJoin(scheduledPayment, scheduledMobileTrasactions).subscribe(results => {
         this.skeletonModeSchedule = false;
         this.schedulePayementData = this.formatScheduleTransactions(results);
         if (this.beneficiaryData) {
            this.appendSchedulePayemnt();
         }
      });
   }
}
