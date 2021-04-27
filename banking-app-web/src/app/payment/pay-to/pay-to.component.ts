import { Component, OnInit, AfterViewInit, EventEmitter, Output, ViewChild, Inject, Input, Injector, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ValidateInputDirective } from './../../shared/directives/validations/validateInput.directive';
import { PaymentService } from '../payment.service';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from './../../core/utils/common';
import {
   IBank, IBranch, IBeneficiaryData, IContactCardDetail, IContactCard,
   IBankDefinedBeneficiary, IAccountDetail, IGaEvent, CountryDetail, IRemittanceAvailabilityStatus
} from './../../core/services/models';
import { IWorkflowChildComponent, IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { IPayToVm, IPayAmountVm } from '../payment.models';
import { NgForm } from '@angular/forms';
import { PaymentType } from '../../core/utils/enums';
import { PreFillService } from '../../core/services/preFill.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { CountryList } from '../../register/utils/country-list';
import { LoaderService } from '../../core/services/loader.service';
import { Subject } from 'rxjs/Subject';


@Component({
   selector: 'app-pay-to',
   templateUrl: './pay-to.component.html',
   styleUrls: ['./pay-to.component.scss']
})
export class PayToComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('payToForm') payToForm: NgForm;

   vm: IPayToVm;
   payAmountVm: IPayAmountVm;
   creditCardLengths = Constants.VariableValues.creditCardLengths;
   isBranchVisible = false;
   mobilePattern = Constants.patterns.mobile;
   accountTypes = CommonUtility.covertToDropdownObject(Constants.VariableValues.accountTypes);
   creditCardAccountTypeCode = Constants.VariableValues.accountTypes.creditCardAccountType.code;
   mobileWarningNotification = Constants.labels.mobilePayWarningNotification;
   accountWarningNotification = Constants.labels.accountPaymentWarningNotification;
   noBankData = true;
   noBranchData = true;
   displaySelectedCountry;
   accountTypeDirty = false;
   crossCountryDirty = false;
   isSearchRecipients = false;
   isShowBankName = true;
   beneficiaryData: IContactCard[];
   processedBeneficiaryData;
   tempProcessedBeneficiaryData;
   selectedBeneficiary;
   benefeciarySearchResult = [];
   noBeneficiaryData = true;
   areBanksLoaded = false;
   banks: IBank[];
   popularBanks: IBank[];
   branches: IBranch[];
   bankApprovedRecipients: IBankDefinedBeneficiary[];
   myRecipients: IContactCard[];
   accounts: IAccountDetail[] = [];
   preFillData;
   constants = Constants;
   countryList: CountryDetail[];
   remittanceLoading: boolean;
   nextClickSubject = new Subject();
   isBeneficiaryInValid: boolean;
   invalidBeneficiaryMsg: string;
   noCountryData = false;
   crossborderTncLink = Constants.links.crossBorderPaymentTnC;
   enterCountryName = Constants.labels.enterCountryName;
   acceptTncCrossborderPayment = Constants.labels.acceptTncCrossborderPayment;
   termsAndConditions = Constants.labels.termsAndConditions;
   branchelement: HTMLElement;

   constructor(
      private paymentService: PaymentService,
      private preFillService: PreFillService,
      injector: Injector,
      @Inject(DOCUMENT) private document: Document, private loader: LoaderService) {
      super(injector);
   }

   ngOnInit() {
      this.preFillData = this.preFillService.preFillBeneficiaryData;
      this.vm = this.paymentService.getPayToVm();
      this.payAmountVm = this.paymentService.getPayAmountVm();
      this.setShowBank(this.paymentService.paymentWorkflowSteps.payTo.isNavigated);
      this.paymentService.accountsDataObserver.subscribe(accounts => {
         if (accounts) {
            this.accounts = accounts;
         }
      });
      this.paymentService.getBanks().subscribe((banks: IBank[]) => {
         this.banks = banks;
         this.sortAndAddPopularBanks();
         this.areBanksLoaded = true;
         if (this.vm.bank) {
            this.checkForBranchVisiblity(this.vm.bank);
         }
         if (this.preFillData) {
            this.handleBeneficiarySelection(this.preFillData);
            this.preFillData = null;
         }
      });
      this.displaySelectedCountry = this.vm.crossBorderPayment.country.countryName || '';
      this.noBankData = false;
      this.noBranchData = false;
      this.paymentService.countryListObserver.subscribe(countryList => {
         if (countryList) {
            this.countryList = countryList;
         }
      });
      if (!this.vm.isCrossBorderPaymentServiceAvailable) {
         this.vm.isCrossBorderPaymentServiceAvailable = false;
      }
      this.setAccoutTypes();
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

   setAccoutTypes() {
      if (this.isAccountPayment) {
         const accTypes = Object.keys(Constants.VariableValues.accountTypes)
            .filter((key) => Constants.VariableValues.accountTypes[key].isShownPaytoBank)
            .map((key) => Constants.VariableValues.accountTypes[key]);

         this.accountTypes = CommonUtility.covertToDropdownObject(accTypes);
      } else {
         this.accountTypes = CommonUtility.covertToDropdownObject(Constants.VariableValues.accountTypes);
      }
   }
   isBankOpen() {
      return !!this.document.getElementById('bank-name-list').getElementsByClassName('bankname-type-ahead').length;
   }
   isBankReadOnly() {
      return (this.vm.isReadOnly && this.vm.beneficiaryData.contactCardDetails.cardDetails.bankName
         && this.vm.beneficiaryData.contactCardDetails.cardDetails.bankName.trim().length > 0);
   }
   setShowBank(isNavigated) {
      if (!isNavigated) {
         this.vm.isShowBankName = true;
      }
   }
   getContactCards(recipientsData) {
      this.bankApprovedRecipients = recipientsData[0];
      this.myRecipients = recipientsData[1];
      this.processedBeneficiaryData = [];
      this.createMyRecipients(this.myRecipients);
      this.createBankApprovedRecipients(this.bankApprovedRecipients);
   }

   createMyRecipients(recipientsData) {
      recipientsData.forEach((data) => {
         data.contactCardDetails.forEach((cardData) => {
            this.processedBeneficiaryData.push(cardData);
         });
      });
   }

   createBankApprovedRecipients(bankApprovedBeneficiary) {
      bankApprovedBeneficiary.forEach((data) => {
         data.beneficiaryName = data.bDFName;
         this.processedBeneficiaryData.push(data);
      });
   }

   onRecipientNameChanged() {
      this.vm.isRecipientPicked = false;
      this.vm.isReadOnly = false;
      this.paymentService.clearPayToVm(this.vm);
      if (this.vm.beneficiaryData && this.vm.beneficiaryData.bankDefinedBeneficiary) {
         this.vm.isShowBankName = (this.vm.beneficiaryData.bankDefinedBeneficiary &&
            this.vm.recipientName !== this.vm.beneficiaryData.bankDefinedBeneficiary.bDFName);
      } else {
         this.vm.isShowBankName = true;
      }
   }

   selectBeneficiary(selectedBeneficiary) {
      this.beneficiaryChange(selectedBeneficiary);
   }

   private beneficiaryChange(beneficiary) {
      this.onRecipientNameChanged();
      if (beneficiary.item.bDFName) {
         this.assignBankApprovedBeneficiary(beneficiary);
      } else {
         this.assignBeneficiary(beneficiary);
      }
   }

   private assignBeneficiary(beneficiary) {
      this.selectedBeneficiary = beneficiary.item;
      this.vm.recipientName = beneficiary.value;
      const selectedBeneficiaryData = this.myRecipients.filter((data) => {
         let filterData = null;
         data.contactCardDetails.forEach(element => {
            if (element.beneficiaryID === this.selectedBeneficiary.beneficiaryID
               && element.beneficiaryName === this.selectedBeneficiary.beneficiaryName) {
               filterData = data;
            }
         });
         return filterData;
      }
      );
      if (selectedBeneficiaryData.length) {
         const contactCard = Object.assign({}, selectedBeneficiaryData[0]);
         contactCard.contactCardDetails = [];
         contactCard.contactCardDetails.push(this.selectedBeneficiary);
         const selectedProcessedBeneficiaryData = {
            contactCard: contactCard,
            contactCardDetails: {
               cardDetails: contactCard.contactCardDetails[0],
               isAccount: this.isAccountContact(contactCard),
               isPrepaid: this.isPrepaidContact(contactCard),
               isElectricity: this.isElectricityContact(contactCard)
            },
            bankDefinedBeneficiary: null
         };
         this.handleBeneficiarySelection(selectedProcessedBeneficiaryData);
      }
   }

   private assignBankApprovedBeneficiary(beneficiary) {
      this.selectedBeneficiary = beneficiary.item;
      this.vm.recipientName = beneficiary.value;
      this.handleBeneficiarySelection({
         bankDefinedBeneficiary: beneficiary.item
      });
   }

   isElectricityContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isElectricityContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isPrepaidContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isPrepaidContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isAccountContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isBankAccountContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isBankAccountContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType !== Constants.BeneficiaryType.Prepaid
         && contactCardDetail.beneficiaryType !== Constants.BeneficiaryType.Electricity;
   }

   isPrepaidContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === Constants.BeneficiaryType.Prepaid;
   }

   isElectricityContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === Constants.BeneficiaryType.Electricity;
   }

   handleBeneficiarySelection(beneficiaryData: IBeneficiaryData) {
      CommonUtility.markAllFormControlsUnTouchedAndPristine(this.payToForm);
      this.paymentService.resetDataOnRecipientSelection();
      this.vm = this.paymentService.getPayToVm();
      this.clearBank();
      this.vm.beneficiaryData = beneficiaryData;
      if (beneficiaryData.bankDefinedBeneficiary) {
         this.vm.recipientName = beneficiaryData.bankDefinedBeneficiary.bDFName;
         this.vm.paymentType = PaymentType.account;
         this.vm.isShowBankName = false;
      } else {
         if (this.isBankApprovedContact(beneficiaryData.contactCard)) {
            this.vm.isShowBankName = false;
            this.vm.accountType = beneficiaryData.contactCardDetails.cardDetails.accountType;
         } else {
            this.vm.isShowBankName = true;
         }
         const contactCardDetails = beneficiaryData.contactCardDetails;
         this.vm.recipientName = contactCardDetails.cardDetails.beneficiaryName;

         if (contactCardDetails.cardDetails.bankName) {
            let selectedBank: IBank[];
            selectedBank = this.banks.filter((bank) => {
               return bank.bankName.toLowerCase().trim() === contactCardDetails.cardDetails.bankName.toLowerCase().trim();
            });
            if (selectedBank && selectedBank.length > 0) {
               this.assignBank(selectedBank[0]);
               this.vm.bankName = selectedBank[0].bankName;
               this.checkForBranchVisiblity(this.vm.bank);
               if (this.isBranchVisible && contactCardDetails.cardDetails.branchCode) {
                  let selectedBranch: IBranch[];
                  selectedBranch = this.branches.filter((branch) => {
                     return branch.branchCode === contactCardDetails.cardDetails.branchCode;
                  });
                  if (selectedBranch && selectedBranch.length > 0) {
                     this.assignBranch(selectedBranch);
                     this.vm.branchName = selectedBranch[0].branchName;
                  }
               }
            }
         }

         if (this.isAccountPayment() && this.isNedBankSelected && this.vm.isShowBankName
            && contactCardDetails.cardDetails.accountType) {
            this.setAccountTypeByCode(contactCardDetails.cardDetails.accountType);
         } else {
            this.vm.accountType = '';
         }

         if (contactCardDetails.isAccount) {
            if (contactCardDetails.cardDetails.accountType === Constants.VariableValues.accountTypes.creditCardAccountType.code) {
               this.setPaymentType(PaymentType.creditCard);
               this.vm.creditCardNumber = contactCardDetails.cardDetails.accountNumber;
            } else {
               this.setPaymentType(PaymentType.account);
               this.vm.accountNumber = contactCardDetails.cardDetails.accountNumber;
            }
         } else if (beneficiaryData.contactCardDetails.isPrepaid) {
            this.setPaymentType(PaymentType.mobile);
            this.vm.mobileNumber = beneficiaryData.contactCardDetails.cardDetails.accountNumber;
         }
      }
      this.vm.isRecipientPicked = true;
      if (beneficiaryData.contactCard) {
         this.isEditableField(beneficiaryData.contactCard, this.vm.isRecipientPicked);
      } else {
         this.vm.isReadOnly = this.vm.isRecipientPicked;
      }
      this.validate();
   }

   isAccountPayment() {
      return this.vm.paymentType === PaymentType.account;
   }

   isMobilePayment() {
      return this.vm.paymentType === PaymentType.mobile;
   }

   isCreditCardPayment() {
      return this.vm.paymentType === PaymentType.creditCard;
   }

   isForeignBankPayment() {
      return this.vm.isCrossBorderPaymentActive && (this.vm.paymentType === PaymentType.foreignBank);
   }

   setPaymentType(mode: number) {
      this.vm.paymentType = mode;
   }

   isBankApprovedContact(contact: IContactCard) {
      const contactCardDetails = contact && contact.contactCardDetails;
      return contactCardDetails && contactCardDetails.length === 1 &&
         contactCardDetails[0].accountType.toLocaleLowerCase() ===
         Constants.Recipient.bankApprovedAccountType.toLocaleLowerCase();
   }

   isEditableField(contactCard, isRecipientPicked) {
      this.vm.isReadOnly = (!this.isElectricityContact(contactCard) && isRecipientPicked);
   }
   ngAfterViewInit() {
      this.payToForm.valueChanges
         .subscribe(values => this.validate());
   }

   validate() {
      const isFormValid = this.isAccountPayment() ? this.payToForm.valid
         : this.isMobilePayment() ? (this.payToForm.valid && this.validateMobileNumber()) :
            this.isCreditCardPayment() ? (this.payToForm.valid && this.validateCreditCardNumber()) :
               (this.isForeignBankPayment() ? (this.payToForm.valid && this.validateGender()) : this.payToForm.valid);
      if (this.payToForm.dirty) {
         this.paymentService.paymentWorkflowSteps.payTo.isDirty = true;
      }
      this.isComponentValid.emit(isFormValid);
   }
   validateCreditCardNumber() {
      const ccNumber = this.vm.creditCardNumber;
      return ccNumber && (ccNumber.length === this.creditCardLengths.min || ccNumber.length === this.creditCardLengths.max);
   }
   validateGender() {
      const gender = this.vm.crossBorderPayment.personalDetails.gender;
      return gender && (gender === Constants.labels.genderMale || gender === Constants.labels.genderFemale);
   }
   validateMobileNumber() {
      const regEx = new RegExp(this.mobilePattern);
      return regEx.test(this.vm.mobileNumber ? this.vm.mobileNumber.toString() : '');
   }

   onMobileNumberChange(number) {
      this.validate();
   }

   onPayToAccountClick() {
      this.setAccoutTypes();
      this.processedBeneficiaryData = this.tempProcessedBeneficiaryData ? this.tempProcessedBeneficiaryData : this.processedBeneficiaryData;
      if (!this.vm.isRecipientPicked) {
         this.setPaymentType(PaymentType.account);
         this.vm.isCrossBorderPaymentActive = false;
      }
   }

   onPayToMobileClick() {
      this.setAccoutTypes();
      this.processedBeneficiaryData = this.tempProcessedBeneficiaryData ? this.tempProcessedBeneficiaryData : this.processedBeneficiaryData;
      if (!this.vm.isRecipientPicked) {
         this.setPaymentType(PaymentType.mobile);
         // clear their reference for mobile payment
         this.paymentService.handleMobilePayment();
         this.vm.isCrossBorderPaymentActive = false;
      }
   }

   onPayToCreditCardClick() {
      this.setAccoutTypes();
      this.processedBeneficiaryData = this.tempProcessedBeneficiaryData ? this.tempProcessedBeneficiaryData : this.processedBeneficiaryData;
      if (!this.vm.isRecipientPicked) {
         this.vm.paymentType = PaymentType.creditCard;
         this.vm.isCrossBorderPaymentActive = false;
      }
   }

   onPayToForeignBankClick() {
      this.setAccoutTypes();
      this.tempProcessedBeneficiaryData = this.processedBeneficiaryData;
      this.processedBeneficiaryData = [];
      if (!this.vm.isRecipientPicked) {
         this.remittanceLoading = true;
         this.vm.paymentType = PaymentType.foreignBank;
         this.vm.isCrossBorderPaymentActive = true;
         this.payAmountVm.selectedCurrency = null;
         this.payAmountVm.beneficiaryCurrency = null;
         this.payAmountVm.transferAmount = null;
         this.paymentService.savePayAmountInfo(this.payAmountVm);
         this.paymentService.checkRemittanceAvailability()
            .finally(() => this.remittanceLoading = false)
            .subscribe((response: IRemittanceAvailabilityStatus) => {
               this.vm.isCrossBorderPaymentServiceAvailable =
                  (response.data && response.data.availability) ? response.data.availability : false;
            });
      }
   }

   isRemittanceAvailable() {
      return this.isForeignBankPayment() && this.vm.isCrossBorderPaymentServiceAvailable;
   }

   // Show Search Recipients
   showSearchRecipients() {
      this.isSearchRecipients = true;
   }

   // Hide Search Recipients
   hideSearchRecipients() {
      CommonUtility.markControlTouchedAndDirty(this.payToForm.form.controls.beneficiaryName);
      this.isSearchRecipients = false;
   }

   private assignBank(bank) {
      this.vm.bank = bank;
      if (this.isNedBank(bank)) {
         this.vm.branch = Constants.VariableValues.nedBankDefaults.branch;
         this.vm.bank.acceptsRealtimeAVS = Constants.VariableValues.nedBankDefaults.acceptsRealtimeAVS;
         this.vm.bank.acceptsBatchAVS = Constants.VariableValues.nedBankDefaults.acceptsRealtimeAVS;
         this.vm.accountType = Constants.VariableValues.nedBankDefaults.accountType;
      } else {
         this.branches = bank.branchCodes && bank.branchCodes.length ? bank.branchCodes.map(_branch => {
            _branch['displayName'] = _branch.branchName + ' - ' + _branch.branchCode;
            return _branch;
         }) : [];
         this.branches = CommonUtility.sortByKey(this.branches, 'displayName');
      }
   }

   private assignBranch(branch) {
      this.vm.branch = branch;
   }

   private clearBank() {
      this.vm.bankName = '';
      this.vm.bank = null;
      this.isBranchVisible = false;
      this.clearBranch();
   }

   private clearBranch() {
      this.vm.branch = null;
      this.vm.branchName = '';
   }

   private bankChange(bank) {
      this.checkForBranchVisiblity(bank);
      this.assignBank(bank);
      if (!this.isNedBank(bank)) {
         this.clearBranch();
      }
   }

   private checkForBranchVisiblity(bank) {
      this.isBranchVisible = !(bank.hasOwnProperty('universalCode') && bank.universalCode.length > 0)
         &&
         !this.isNedBank(bank);
   }

   isNedBank(bank: IBank) {
      return CommonUtility.isNedBank(bank.bankName);
   }

   get isNedBankSelected(): boolean {
      return this.vm.bank && CommonUtility.isNedBank(this.vm.bank.bankName);
   }

   get displaySelectedAccountType(): string {
      return this.vm.accountTypeName || Constants.dropdownDefault.displayText;
   }

   selectBank(selected) {
      this.bankChange(selected.item);
      this.branchelement = this.document.getElementById('branch') as HTMLElement;
      if (this.branchelement !== null) {
         this.branchelement.click();
      }
   }

   blurBank(selected) {
      if (selected && selected.item) {
         this.bankChange(selected.item);
         this.vm.bankName = this.vm.bank.bankName;
      } else {
         this.clearBank();
      }
   }

   blurBankInput() {
      if (this.noBankData) {
         this.clearBank();
      }
   }

   noBankResults(event) {
      this.noBankData = event;
   }

   selectBranch(selected) {
      this.assignBranch(selected.item);
   }

   blurBranch(selected) {
      if (selected && selected.item) {
         this.assignBranch(selected.item);
         this.vm.branchName = this.vm.branch.branchName + ' - ' + this.vm.branch.branchCode;
      } else {
         this.clearBranch();
      }
   }

   blurBranchInput() {
      if (this.noBranchData) {
         this.clearBranch();
      }
   }

   noBranchResults(event) {
      this.noBranchData = event;
   }

   onAccountTypeChanged(accountType) {
      this.vm.accountType = accountType.value.code;
      this.vm.accountTypeName = accountType.value.text;
   }

   onAccountTypeDropdownOpen() {
      this.accountTypeDirty = true;
   }

   onCountryDropdownOpen() {
      this.crossCountryDirty = true;
   }

   selectGender(gender) {
      this.vm.crossBorderPayment.personalDetails.gender = gender;
      this.payToForm.control.markAsDirty();
      this.validate();
   }

   setAccountTypeByCode(code: string): any {
      let key: string;
      for (key in this.accountTypes) {
         if (this.accountTypes[key].value.code === code) {
            this.onAccountTypeChanged(this.accountTypes[key]);
         }
      }
   }

   getAccountTypeByCode(code: string): any {
      let key: string, accountType = '';
      for (key in this.accountTypes) {
         if (this.accountTypes[key].value.code === code) {
            accountType = this.accountTypes[key].value.text;
         }
      }
      return accountType;
   }

   nextClick(currentStep: number) {
      this.vm.banks = this.banks;
      this.sendEvent('pay_recipient_details_click_on_next');
      if (this.isForeignBankPayment()) {
         this.nextClickSubject = new Subject();
         this.validateForeignBeneficiary();
         return this.nextClickSubject.asObservable();
      } else {
         this.paymentService.savePayToInfo(this.vm);
      }
   }

   stepClick(stepInfo: IStepInfo) {
   }

   onCountryChanged(country) {
      this.displaySelectedCountry = country.countryName;
      this.vm.crossBorderPayment.country.countryName = country.countryName;
      this.vm.crossBorderPayment.country.code = country.isoCountry;
      this.payToForm.control.markAsDirty();
   }
   validateForeignBeneficiary() {
      this.loader.show();
      const benficiaryDetails = {
         beneficiaryAccount: this.vm.crossBorderPayment.bank.accountNumber,
         beneficiaryCountry: this.vm.crossBorderPayment.country.code,
         beneficiaryInstitution: this.vm.crossBorderPayment.bank.bankName,
         customerNumber: this.vm.crossBorderPayment.personalDetails.idPassportNumber,
         checkReference: this.vm.crossBorderPayment.beneficiaryDetails.checkReference
      };
      this.paymentService.validateBeneficiary(benficiaryDetails).subscribe(response => {
         this.loader.hide();
         this.isBeneficiaryInValid = false;
         this.vm.banks = this.banks;
         const transactionStatus = CommonUtility.getTransactionStatus(response && response.metadata, Constants.metadataKeys.transaction);
         if (transactionStatus.isValid) {
            this.vm.crossBorderPayment.beneficiaryDetails = response.data;
            this.paymentService.savePayToInfo(this.vm);
            this.nextClickSubject.next();
         } else {
            this.invalidBeneficiaryMsg = transactionStatus.reason;
            this.isBeneficiaryInValid = true;
            this.isComponentValid.emit(false);
         }
      });
   }
   isCountryOpen() {
      return !!this.document.getElementById('country-name-list').getElementsByClassName('countryname-type-ahead').length;
   }
   selectCountry(result) {
      this.displaySelectedCountry = result.item.countryName;
      this.vm.crossBorderPayment.country.countryName = this.displaySelectedCountry;
      this.vm.crossBorderPayment.country.code = result.item.isoCountry;
      this.payToForm.control.markAsDirty();
      this.noCountryData = false;
   }
   private clearCountry() {
      this.vm.crossBorderPayment.country.countryName = null;
      this.vm.crossBorderPayment.country.code = null;
      this.displaySelectedCountry = null;
   }
   blurCountry(selected) {
      if (selected && selected.item) {
         this.selectCountry(selected);
      } else {
         this.clearCountry();
      }
   }
   blurCountryInput() {
      if (this.noCountryData) {
         this.clearCountry();
      }
   }
   noCountryResults() {
      this.noCountryData = true;
   }

}


