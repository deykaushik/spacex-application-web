import { Component, OnInit, Input, Output, EventEmitter, OnChanges, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment/moment';
import { IDatePickerConfig } from 'ng2-date-picker';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { AccountService } from '../../account.service';
import { LoaderService } from '../../../core/services/loader.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import {
   ILoanDebitOrderDetails, IAssetDetails, ISimilarAccounts, IBank,
   IActionSuccess, IManagePaymentDetailsPost, ITermsAndConditions, IApiResponse, IBranch
} from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { TermsAndConditionsConstants } from '../../../shared/terms-and-conditions/constants';
import { environment } from '../../../../environments/environment';
import { GAEvents } from '../../../core/utils/ga-event';
import { BaseComponent } from '../../../core/components/base/base.component';
import { Observable } from 'rxjs/Observable';

@Component({
   selector: 'app-update-loan-details',
   templateUrl: './update-loan-details.component.html',
   styleUrls: ['./update-loan-details.component.scss']
})
export class UpdateLoanDetailsComponent extends BaseComponent implements OnInit, OnChanges {
   @Input() loanDebitOrder: ILoanDebitOrderDetails;
   @Input() loanAccountType: string;
   labels = Constants.labels.loanDebitOrder;
   variableValues = Constants.VariableValues.loanDebitOrder;
   emailTo = this.variableValues.sendDocsMailId;
   messages = Constants.messages.loanDebitOrder;
   symbols = Constants.symbols;
   invalidInstalmentAmount = Constants.messages.loanDebitOrder.invalidInstalmentAmount;
   readOnlyFields = true;
   loanAssetDetails: IAssetDetails;
   showBankDetails: boolean;
   isYourBankAccount = false;
   hasThirdPartyEmail = false;
   authNedbank = false;
   applyDetailsToAll = false;
   acceptTerms = false;
   similarAccounts: ISimilarAccounts[];
   disableApplyChangesBtn = true;
   // this holds dropdown object, which will return any[]
   accountTypes: any[];
   accountTypeName: string;
   formatDate: Moment;
   newDebitOrderDateLabel: string;
   bankAccountTypeText: string;
   isAmountEmpty = false;
   minDate: Moment;
   maxDate: Moment;
   config: IDatePickerConfig;
   accountId: string;
   banks: IBank[];
   postAction: IActionSuccess;
   isHomeLoanPersonalLoan: boolean;
   loanName: string;
   minimumInstalmentAmt: number;
   isAmountValid = true;
   showEditPaymentLoan = environment.features.mfcUpdatePaymentDetails;
   originalLoanDetails: ILoanDebitOrderDetails;
   formValueChange = false;
   dateChanged = 0;
   isBankDetailsChanged: boolean;
   isBankName: boolean;
   showTerms = false;
   showTermsView: ITermsAndConditions;
   print = CommonUtility.print.bind(CommonUtility);
   areBanksLoaded = false;
   branches: IBranch[];
   isBranchVisible = false;
   branchName: string;
   branchCode = [];
   showTermsFlag: boolean;
   showLoader: boolean;
   filter: string;
   looseFocus = true;
   branchCodeList: IBranch[];

   constructor(private accountService: AccountService, private route: ActivatedRoute,
      private loader: LoaderService, injector: Injector, private errorService: SystemErrorService) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.isHomeLoanPersonalLoan = CommonUtility.isHomeLoan(this.loanAccountType) || CommonUtility.isPersonalLoan(this.loanAccountType);
      this.newDebitOrderDateLabel = Constants.labels.loanDebitOrder.nextInstalmentDate;
      this.minimumInstalmentAmt = this.isHomeLoanPersonalLoan ?
         this.loanDebitOrder.minimumInstallment : this.loanDebitOrder.totalInstallment;
      if (this.isHomeLoanPersonalLoan) {
         this.checkLoanName();
      }
      if (this.loanDebitOrder) {
         this.loanAssetDetails = this.loanDebitOrder.assetDetails;
         this.showBankDetails = this.loanDebitOrder.paymentMethod === this.labels.paymentMethodCash ? false : true;
         if (this.showBankDetails) {
            this.getBanks();
            this.similarAccounts = this.loanDebitOrder.similarAccounts
               .filter(account => account.accountNumber !== this.loanDebitOrder.accountNumber);
            this.similarAccounts.forEach(account => account.selected = true);
            const dropdownAccTypes = !this.isHomeLoanPersonalLoan ?
               this.variableValues.accountTypes : this.variableValues.accountTypesHlPl;
            this.isBankName = this.loanDebitOrder.bankName ? true : false;
            this.accountTypes = CommonUtility.covertToDropdownObject(dropdownAccTypes);
            this.bankAccountTypeText = this.getAccountTypeByCode(this.loanDebitOrder.bankAccountType);
         }
         this.setDatePicker();
      }
   }

   ngOnChanges(changes: SimpleChanges) {
      // to indicate that user already has edited the details and he is not on this page for the first time
      if (changes.loanDebitOrder && this.loanDebitOrder) {
         this.originalLoanDetails = Object.assign({}, this.loanDebitOrder);
      }
   }
   applyDetailsToAllAccountsToggle(toggleOn: boolean) {
      if (toggleOn) {
         this.similarAccounts.forEach(account => account.selected = true);
      }
   }
   updateDetails() {
      CommonUtility.topScroll();
      this.readOnlyFields = false;
      this.newDebitOrderDateLabel = this.labels.newDebitOrderDate;
      this.isYourBankAccount = false;
      this.applyDetailsToAll = false;
      this.authNedbank = false;
      this.acceptTerms = false;
      this.formValueChange = false;
      this.showTermsView = {};
      this.checkDisableApplyChanges();
   }
   showTermAndConditions() {
      CommonUtility.topScroll();
      this.loader.show();
      this.callServiceForTermsAndConditions();
      this.showTermsFlag = true;
   }
   callServiceForTermsAndConditions() {
      const versioncontent = TermsAndConditionsConstants.contentLatest;
      this.accountService.getTermsAndConditionsForMFC(versioncontent).subscribe((res: ITermsAndConditions) => {
         if (res && res.noticeDetails) {
            this.showTerms = this.showTermsFlag;
            this.showTermsView = res;
            this.loader.hide();
            this.showLoader = false;
         } else {
            this.getAcceptedTermsAndConditions();
         }
      });
   }
   getAcceptedTermsAndConditions() {
      const versioncontent = TermsAndConditionsConstants.contentAccepted;
      this.accountService.getTermsAndConditionsForMFC(versioncontent).subscribe((response: ITermsAndConditions) => {
         this.showTerms = this.showTermsFlag;
         this.showTermsView = response;
         this.loader.hide();
         this.showLoader = false;
      });
   }
   applyChangesClicked() {
      const acceptTermPost = this.createAcceptTerm(this.showTermsView);
      this.accountService.acceptTermsAndConditions(acceptTermPost).subscribe((response: IApiResponse) => {
         if (response && response.metadata) {
            const status = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.transaction);
            if (status.isValid) {
               this.onSuccessfulAcceptanceTerms();
               this.onSuccessfulGAEvent();
            } else {
               this.errorService.raiseError({ error: status.reason });
            }
         }
      });
   }
   onSuccessfulAcceptanceTerms() {
      if (this.isYourBankAccount) {
         this.updatePaymentDetails();
      } else {
         this.hasThirdPartyEmail = true;
      }
   }
   onSuccessfulGAEvent() {
      const mfcPaymentDetailsSuccess = Object.assign({}, GAEvents.managePaymentDetails.mfcPaymentDetailsSuccess);
      this.sendEvent(mfcPaymentDetailsSuccess.eventAction, mfcPaymentDetailsSuccess.label, null, mfcPaymentDetailsSuccess.category);
   }
   checkDisableApplyChanges() {
      if (!this.showTermsFlag && this.acceptTerms) {
         this.showLoader = true;
         this.callServiceForTermsAndConditions();
      }
      const mandatoryCheck = this.acceptTerms && this.authNedbank;
      this.disableApplyChangesBtn = !mandatoryCheck;
   }
   similarAccountCheck(checked: boolean) {
      this.checkDisableApplyChanges();
      const checkedLength = this.similarAccounts.filter(account => account.selected === true).length;
      if (!checkedLength) {
         this.applyDetailsToAll = false;
      }
   }
   onContinue() {
      this.hasThirdPartyEmail = false;
      this.updatePaymentDetails();
   }
   onUpload() {
      location.href = this.labels.mailTo + this.emailTo;
   }
   closeOverlay() {
      this.hasThirdPartyEmail = false;
   }
   updatePaymentDetails() {
      this.loader.show();
      const loanDataPost = this.setData();
      const data: IManagePaymentDetailsPost = {
         installmentAmount: loanDataPost.totalInstallment,
         paymentDate: loanDataPost.nextInstallmentDate,
         bankName: loanDataPost.bankName,
         bankBranchCode: loanDataPost.bankBranchCode,
         bankAccNumber: loanDataPost.bankAccNumber,
         accountType: loanDataPost.bankAccountType,
         additionalAccounts: loanDataPost.similarAccounts
      };
      this.accountService.updateMfcDebitOrders(this.accountId, data).subscribe((isSuccess: boolean) => {
         this.isBankDetailsChanged = false;
         this.postAction = { isSuccess: isSuccess };
         if (!isSuccess) {
            this.loanDebitOrder = this.originalLoanDetails;
         } else {
            this.originalLoanDetails = Object.assign({}, this.loanDebitOrder);
         }
         this.readOnlyFields = true;
         this.loader.hide();
      }, (error) => {
         this.readOnlyFields = false;
         this.loader.hide();
      });
      CommonUtility.topScroll();
   }
   getAccountTypeByCode(code: string): string {
      const selectedAccount = this.accountTypes.find(account => account.value.code === code);
      return selectedAccount.value.text;
   }
   onAccountTypeChanged(accountType) {
      this.formValueChange = true;
      this.loanDebitOrder.bankAccountType = accountType.value.code;
      this.accountTypeName = accountType.value.text;
      this.bankAccountTypeText = this.accountTypeName;
   }
   setDate(value: Date) {
      this.dateChanged = this.dateChanged + 1;
      this.formValueChange = this.dateChanged > 1 ? true : false;
      this.loanDebitOrder.nextInstallmentDate = moment(value).format(Constants.formats.YYYYMMDDTHHmmssZ);
   }
   onAmountChange(value: number) {
      this.applyDetailsToAll = false;
      this.isAmountValid = value > 0 && value >= this.minimumInstalmentAmt ? true : false;
      this.loanDebitOrder.totalInstallment = value;
      this.checkDisableApplyChanges();
   }
   selectBank(selected) {
      this.formValueChange = true;
      this.loanDebitOrder.bankName = selected.item.bankName;
      this.bankChange(selected.item);
      this.filter = Constants.symbols.spaceString;
   }

   bankChange(bank: IBank) {
      this.checkForBranchVisiblity(bank);
      this.branchName = Constants.symbols.spaceString;
      if (this.isBranchVisible) {
         this.branches = bank.branchCodes && bank.branchCodes.length ? bank.branchCodes.map(_branch => {
            _branch[this.labels.displayName] = _branch.branchName + Constants.symbols.hyphen + _branch.branchCode;
            return _branch;
         }) : [];
         this.branches = CommonUtility.sortByKey(this.branches, this.labels.displayName);
         this.branchCodeList = this.branches;
      } else {
         this.loanDebitOrder.bankBranchCode = parseInt(this.banks.find(item => item.bankName === bank.bankName).universalCode, 10);
      }
   }
   setDatePicker() {
      this.loanDebitOrder.nextInstallmentDate = moment(this.loanDebitOrder.nextInstallmentDate)
         .format(Constants.formats.momentDDMMMMYYYY);
      this.formatDate = CommonUtility.getNextDate(this.loanDebitOrder.nextInstallmentDate, 0, 'days');
      this.minDate = moment(CommonUtility.getNextDate(new Date(), this.variableValues.daysAfter, this.variableValues.days));
      this.maxDate = moment(CommonUtility.getNextDate(new Date(), this.variableValues.uptoMonths, this.variableValues.months));
      this.config = {
         format: Constants.formats.momentDDMMMMYYYY,
         min: this.minDate,
         max: this.maxDate
      };
   }
   getBanks() {
      this.loader.show();
      this.accountService.getBanks().subscribe((banks: IBank[]) => {
         this.banks = banks;
         if (this.banks.length) {
            this.areBanksLoaded = true;
            this.checkBankBranchCode();
            this.loader.hide();
         }
      });
   }
   checkBankBranchCode() {
      const banksCopy = Object.assign([], this.banks);
      banksCopy.forEach(item => {
         if (item.hasOwnProperty(this.labels.universalCode)) {
            if (item.universalCode === this.loanDebitOrder.bankBranchCode.toString()) {
               return;
            }
         } else {
            const value = item.branchCodes.find(branch => branch.branchCode === this.loanDebitOrder.bankBranchCode.toString());
            if (value) {
               this.branchCode = item.branchCodes;
               this.isBranchVisible = true;
               this.branchName = this.branchCode.find(branch => branch.branchCode === this.loanDebitOrder.bankBranchCode.toString())
                  .branchName + Constants.symbols.hyphen + this.loanDebitOrder.bankBranchCode.toString();
               this.filter = this.branchName;
               this.branches = this.branchCode.map(_branch => {
                  _branch[this.labels.displayName] = _branch.branchName + Constants.symbols.hyphen + _branch.branchCode;
                  return _branch;
               });
               return;
            }
         }
      });
   }

   checkLoanName() {
      this.loanName = CommonUtility.isHomeLoan(this.loanAccountType) ? this.labels.homeLoan : this.labels.personalLoan;
   }
   // totalInstallment is mapped as number, but when changed in input field, it gets converted to String, hence parsing
   checkIfAmountChanged() {
      return parseFloat(this.originalLoanDetails.totalInstallment.toString())
         !== parseFloat(this.loanDebitOrder.totalInstallment.toString());
   }
   onAcccountNumFocus() {
      this.formValueChange = true;
   }

   setData(): IManagePaymentDetailsPost {
      // default data to be sent
      const initialData: IManagePaymentDetailsPost = {
         totalInstallment: 0,
         nextInstallmentDate: '',
         bankName: '',
         bankBranchCode: 0,
         bankAccNumber: '',
         bankAccountType: '',
         similarAccounts: this.sendSimilarAccounts()
      };
      for (const key in this.loanDebitOrder) {
         // have to check separately for installment date since due to date picker time gets changed
         if (key === this.variableValues.nextInstallmentDate) {
            if (this.checkIfDateIsChanged(key)) {
               initialData[key] = this.loanDebitOrder[key];
            }
         }
         if (this.loanDebitOrder[key] !== this.originalLoanDetails[key] && key !== this.variableValues.nextInstallmentDate) {
            // if any of banking details is changed, we have to send entire banking details back
            if (!this.isBankDetailsChanged) {
               this.checkIfBankingDetailsChanged(key);
            }
            initialData[key] = this.loanDebitOrder[key];
         }
      }
      // if any banking details is changed, set all the banking details value in initialData
      if (this.isBankDetailsChanged) {
         this.setAllBankingData(initialData);
      }
      return initialData;
   }
   // check if any of the bankingDetailsFields changed
   checkIfBankingDetailsChanged(key: string) {
      const bankingFeilds = this.variableValues.bankingDetailsFields;
      if (bankingFeilds.indexOf(key) > -1) {
         this.isBankDetailsChanged = true;
      }
   }
   // if any banking details field changes, we need to send all banking details
   setAllBankingData(initialData: IManagePaymentDetailsPost): IManagePaymentDetailsPost {
      const bankingFeilds = this.variableValues.bankingDetailsFields;
      for (const key of bankingFeilds) {
         initialData[key] = this.loanDebitOrder[key];
      }
      return initialData;
   }
   // check if date is changed by formatting only date and not the time
   checkIfDateIsChanged(key: string): boolean {
      const dateFormat = Constants.formats.momentDDMMMMYYYY;
      return moment(this.loanDebitOrder[key]).format(dateFormat) !== moment(this.originalLoanDetails[key]).format(dateFormat);
   }
   // if apply details to all accounts toggle is on, we need to send all selected accounts, else send current one
   sendSimilarAccounts(): ISimilarAccounts[] {
      if (this.applyDetailsToAll) {
         return this.similarAccounts.filter(account => account.selected === true);
      }
      return [this.loanDebitOrder.similarAccounts.find(account => account.accountNumber ===
         this.loanDebitOrder.accountNumber)];
   }

   termsAndConditionsClose() {
      this.showTerms = false;
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
   checkForBranchVisiblity(bank) {
      this.isBranchVisible = !(bank.hasOwnProperty(this.labels.universalCode) && bank.universalCode.length > 0);
   }
   checkApplyChangesButton() {
      if (this.postAction && this.postAction.isSuccess && !this.checkIfAmountChanged() && !this.formValueChange) {
         return;
      }
      return true;
   }
   branchContextualSearch(value: IBranch) {
      this.loanDebitOrder.bankBranchCode = parseInt(value.branchCode, 10);
      this.filter = value.displayName;
      this.looseFocus = true;
   }
   toggleFocus() {
      this.looseFocus = false;
      this.filterContentContextual(this.filter);
   }
   filterContentContextual(value: string) {
      this.looseFocus = false;
      this.branchCodeList = this.branches;
      this.branchCodeList = this.getContextualFilteredData(this.branchCodeList, value);
      if (this.branchCodeList.length === 0) {
         this.looseFocus = true;
      }
   }
   getContextualFilteredData(branches: IBranch[], searchValue: string) {
      let returnData = branches;
      if (searchValue) {
         returnData = branches.filter(branch =>
            (branch.branchName + Constants.symbols.hyphen + branch.branchCode).toLowerCase().indexOf(this.filter.toLowerCase()) > -1);
      }
      return returnData;
   }
}
