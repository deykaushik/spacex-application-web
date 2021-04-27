import { Component, OnInit, ViewChild, Inject, Injector } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { ApoService } from '../apo.service';
import { IAvsCheck, IAutoPayDetail, IAvsResponse } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { IBank, IBranch, IAccountDetail, IDashboardAccounts, IDashboardAccount } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { PaymentService } from '../../../payment/payment.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { PreFillService } from '../../../core/services/preFill.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-pay-from',
   templateUrl: './pay-from.component.html',
   styleUrls: ['./pay-from.component.scss']
})
export class PayFromComponent extends BaseComponent implements OnInit {

   noBranchData = true;
   noBankData = true;
   @ViewChild('payFromForm') payFromForm: NgForm;
   autoPayDetails: IAutoPayDetail;
   isNedBankAccountSelected: boolean;
   banks: IBank[];
   bank: IBank;
   nedBankFlexcube = ApoConstants.apo.nedBankFlexcube;
   accountTypes = CommonUtility.covertToDropdownObject(Constants.VariableValues.accountTypes);
   isBranchVisible: boolean;
   autoPay = ApoConstants.apo;
   pattern = Constants.patterns;
   otherBank: string;
   branchName: string;
   branches: IBranch[];
   branch: IBranch;
   accountNumber: string;
   otherBankForm: FormGroup;
   nedbankForm: FormGroup;
   otherBankName: FormControl;
   otherBankCode: FormControl;
   bankType: FormControl;
   nedbankAccount: FormControl;
   selectedFromAccounts: IAccountDetail[];
   dropdownAccounts: IAccountDetail[];
   selectedDropdownAccount: IAccountDetail;
   insufficientFunds: boolean;
   avsValid: boolean;
   isAvsOverlay: boolean;
   isNedbank: boolean;
   accountTypeDirty: boolean;
   accountType: string;
   accountTypeName: string;
   workflowSteps: IStepper[];
   selectedAccountType: string;
   showLoader: boolean;
   operationMode: string;
   isnedBankFlexcube: boolean;
   maxLimit = ApoConstants.apo.values.length;
   avsResponseData: IAvsResponse;
   payFromGAEvents = GAEvents.AutomaticPaymentOrder;
   accountContainers: IDashboardAccounts[];
   dashboardAccounts: IDashboardAccount[];
   filteredAccounts: IDashboardAccount[];
   selectedAccount: IDashboardAccount;
   value = Constants.VariableValues.reportFraud;

   constructor(private autopayService: ApoService, private paymentService: PaymentService, private prefillService: PreFillService,
      private workflowService: WorkflowService, injector: Injector, @Inject(DOCUMENT) private document: Document) {
      super(injector);
   }
   ngOnInit() {
      this.isBranchVisible = false;
      this.isNedBankAccountSelected = true;
      this.insufficientFunds = false;
      this.isAvsOverlay = false;
      this.isNedbank = false;
      this.accountTypeDirty = false;
      this.autoPayDetails = {} as IAutoPayDetail;
      this.avsResponseData = {} as IAvsResponse;
      this.dropdownAccounts = {} as IAccountDetail[];
      this.showLoader = false;
      this.isnedBankFlexcube = false;
      this.accountContainers = this.autopayService.getDashboardAccounts();
      this.workflowSteps = this.workflowService.workflow;
      this.autoPayDetails = this.autopayService.getAutoPayDetails();
      this.operationMode = this.autopayService.getMode();
      this.selectedAccountType = this.displaySelectedAccountType();
      const cachedNedBankAccounts = this.autopayService.getCachedNedBankAccounts();
      if (cachedNedBankAccounts) {
         this.selectedFromAccounts = cachedNedBankAccounts;
         this.processDropdownData(this.accountContainers);
         this.setApoDetails();
      } else {
         this.getNedbankAccounts();
      }
      const cachedOtherBankAccounts = this.autopayService.getOtherBankAccounts();
      if (cachedOtherBankAccounts) {
         this.banks = cachedOtherBankAccounts;
      } else {
         this.getOtherBankAccounts();
      }
      this.formInitialization();
      this.setAccoutTypes();
   }

   setAccoutTypes() {
      if (this.accountTypes) {
         const accTypes = Object.keys(Constants.VariableValues.accountTypes)
            .filter((key) => Constants.VariableValues.accountTypes[key].isShownPaytoBank &&
               (Constants.VariableValues.accountTypes[key].code === ApoConstants.apo.values.accounts[0]
                  || Constants.VariableValues.accountTypes[key].code === ApoConstants.apo.values.accounts[1]))
            .map((key) => Constants.VariableValues.accountTypes[key]);
         this.accountTypes = CommonUtility.covertToDropdownObject(accTypes);
      } else {
         this.accountTypes = CommonUtility.covertToDropdownObject(Constants.VariableValues.accountTypes);
      }
   }

   public setApoDetails() {
      if (this.operationMode === this.autoPay.values.add && !this.workflowSteps[0].valid) {
         this.selectNedBank(true);
      } else {
         if (this.autoPayDetails && this.autoPayDetails.nedbankIdentifier) {
            this.selectNedBank(this.autoPayDetails.nedbankIdentifier);
            this.dropdownAccounts.forEach(account => {
               if (account.accountNumber === this.autoPayDetails.payFromAccount) {
                  this.selectedDropdownAccount = account;
               }
            });
         } else {
            this.selectNedBank(this.autoPayDetails.nedbankIdentifier);
            this.accountNumber = this.autoPayDetails.payFromAccount;
            this.accountType = this.autoPayDetails.payFromAccountType;

         }
      }
   }
   public getNedbankAccounts() {
      this.showLoader = true;
      this.autopayService.getNedbankAccounts().finally(() => {
         this.showLoader = false;
      }).subscribe((response: IAccountDetail[]) => {
         this.selectedFromAccounts = response.filter((account => {
            return CommonUtility.isCasaAccount(account.accountType);
         }));
         this.autopayService.setCachedNedBankAccounts(this.selectedFromAccounts);
         this.processDropdownData(this.accountContainers);
         this.setApoDetails();
      });
   }
   processDropdownData(accountContainers: IDashboardAccounts[]) {
      this.dashboardAccounts = [];
      this.filteredAccounts = [];
      this.dropdownAccounts = [];
      accountContainers.forEach(ac => {
         if (ac.ContainerName === this.autoPay.values.bank) {
            Array.prototype.push.apply(this.dashboardAccounts, ac.Accounts);
         }
      });
      this.filteredAccounts = this.dashboardAccounts.filter(account =>
         account.AccountStatusCode === this.autoPay.values.accountStatusCode[0]
         || account.AccountStatusCode === this.autoPay.values.accountStatusCode[1]
      );
      this.filteredAccounts.forEach(dashboardAccount => {
         const addDropdownAccount = this.selectedFromAccounts.find(account => {
            return (account.itemAccountId === dashboardAccount.ItemAccountId);
         });
         if (addDropdownAccount) {
            this.dropdownAccounts.push(addDropdownAccount);
         }
      });
   }

   public getOtherBankAccounts() {
      this.showLoader = true;
      this.paymentService.getBanks().finally(() => {
         this.showLoader = false;
      }).subscribe((banks: IBank[]) => {
         this.banks = banks;
         this.autopayService.setOtherBankAccounts(banks);
      });
   }

   public formInitialization() {
      this.otherBankName = new FormControl(null, Validators.required);
      this.otherBankCode = new FormControl(null, Validators.required);
      this.bankType = new FormControl(null, Validators.required);
      this.nedbankAccount = new FormControl(null, Validators.required);

      this.nedbankForm = new FormGroup({
         nedbankAccount: this.nedbankAccount
      });
   }
   /**
    * Set up the payfrom data object and pay to data object
    * Set the Service autopay object and redirect to next step
    */
   public gotToNextStep() {
      if (this.isNedBankAccountSelected && this.nedbankForm.valid) {
         this.autoPayDetails.payFromAccount = this.selectedDropdownAccount.accountNumber;
         this.autoPayDetails.payFromAccountType = this.selectedDropdownAccount.accountType;
         this.autoPayDetails.branchOrUniversalCode = this.autoPay.values.branchCode;
         this.autoPayDetails.nedbankIdentifier = true;
         this.navigateToNextStep();
      } else if (!this.isNedBankAccountSelected && this.payFromForm.valid) {
         this.autoPayDetails.nedbankIdentifier = false;
         this.autoPayDetails.payFromAccount = this.payFromForm.value.accountNumber;
         this.nedBankFlexcube.forEach(bankName => {
            if (bankName === this.bank.bankName) {
               this.isnedBankFlexcube = true;
            }
            if (this.isnedBankFlexcube) {
               this.autoPayDetails.payFromAccountType = (this.payFromForm.value.accountType.code === this.autoPay.values.currentAccount) ?
                  this.autoPay.values.gc : this.autoPay.values.gs;
            }
         });
         if (!this.isnedBankFlexcube) {
            this.autoPayDetails.payFromAccountType = (this.payFromForm.value.accountType.code === this.autoPay.values.currentAccount) ?
               this.autoPay.values.one : this.autoPay.values.two;
         }
         if (this.bank) {
            if (this.bank.acceptsRealtimeAVS && this.bank.universalCode) {
               this.autoPayDetails.branchOrUniversalCode = this.bank.universalCode;
               this.initiateAvsCheck(this.autoPayDetails);
            } else if (this.bank.branchCodes) {
               this.bank.branchCodes.forEach(branch => {
                  if (branch.branchCode === this.branch.branchCode) {
                     if (this.branch.acceptsRealtimeAVS) {
                        this.autoPayDetails.branchOrUniversalCode = branch.branchCode;
                        this.initiateAvsCheck(this.autoPayDetails);
                     } else {
                        this.navigateToNextStep();
                     }
                  }
               });
            } else {
               this.navigateToNextStep();
            }
         }
      }
   }
   initiateAvsCheck(otherBankDetails) {
      const accountDetails: IAvsCheck = {
         account: {
            accountNumber: otherBankDetails.payFromAccount,
            branchCode: otherBankDetails.branchOrUniversalCode,
            accountType: (otherBankDetails.payFromAccountType === this.autoPay.values.one) ? this.autoPay.values.currentAccount :
               this.autoPay.values.savingAccount,
            bankName: this.bank.bankName
         }
      };
      this.showLoader = true;
      this.autopayService.verifyAvsStatus(accountDetails).subscribe(response => {
         if (response && response.data) {
            this.avsResponseData = response.data;
            if (this.avsResponseData.verificationResults &&
               this.avsResponseData.verificationResults.accountActive === this.autoPay.values.avsCheck
               && this.avsResponseData.verificationResults.accountExists === this.autoPay.values.avsCheck
               && this.avsResponseData.verificationResults.canDebitAccount === this.autoPay.values.avsCheck
               && this.avsResponseData.verificationResults.identificationNumberMatched === this.autoPay.values.avsCheck) {
               this.showLoader = false;
               this.isAvsOverlay = false;
               this.navigateToNextStep();
            } else {
               this.showLoader = false;
               this.isAvsOverlay = true;
            }
         } else {
            this.showLoader = false;
            this.isAvsOverlay = true;
         }

      }, (error) => {
         this.showLoader = false;
         this.isAvsOverlay = true;
      });
   }

   closeAvsOverlay() {
      this.isAvsOverlay = false;
   }
   /* Set the state of the step to success and navigating to next step in stepper */
   public navigateToNextStep() {
      this.sendEvent(this.payFromGAEvents.timeTakenOnPayFromScreen.eventAction,
         this.payFromGAEvents.timeTakenOnPayFromScreen.label, null, this.payFromGAEvents.timeTakenOnPayFromScreen.category);
      this.autopayService.setAutoPayDetails(this.autoPayDetails);
      this.workflowSteps[0] = { step: this.workflowSteps[0].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
   }

   /* setting the property isNedBankAccountSelected to true or false */
   public selectNedBank(value) {
      if (value) {
         this.isNedBankAccountSelected = true;
         this.selectedDropdownAccount = this.dropdownAccounts[0];
         this.sendEvent(this.payFromGAEvents.fromOwnNedbank.eventAction,
            this.payFromGAEvents.fromOwnNedbank.label, null, this.payFromGAEvents.fromOwnNedbank.category);
      } else {
         this.isNedBankAccountSelected = false;
         this.sendEvent(this.payFromGAEvents.fromOtherBank.eventAction,
            this.payFromGAEvents.fromOtherBank.label, null, this.payFromGAEvents.fromOtherBank.category);
      }
      this.otherBank = this.autoPay.values.emptyString;
      this.accountNumber = this.autoPay.values.emptyString;
      this.isBranchVisible = false;
      this.accountType = this.autoPay.values.emptyString;
   }

   isNedBankSelected(bank) {
      this.isNedbank = bank && CommonUtility.isNedBank(bank.bankName);
   }
   displaySelectedAccountType(): string {
      return this.accountTypeName ? this.accountTypeName : Constants.dropdownDefault.displayText;
   }

   onAccountTypeDropdownOpen() {
      this.accountTypeDirty = true;
   }

   onAccountTypeChanged(accountType) {
      this.accountType = accountType.value.code;
      this.accountTypeName = accountType.value.text;
      this.selectedAccountType = this.displaySelectedAccountType();
   }

   isBankOpen() {
      return this.document.getElementById('bank-name-list').getElementsByClassName('bankname-type-ahead').length;
   }
   public assignBank(bank) {
      this.otherBank = bank.bankName;
      this.bank = bank;
      this.isNedBankSelected(bank);
      if (this.isNedBank(bank)) {
         this.branch = Constants.VariableValues.nedBankDefaults.branch;
      } else {
         this.branches = bank.branchCodes && bank.branchCodes.length ? bank.branchCodes.map(_branch => {
            _branch['displayName'] = _branch.branchName + ' - ' + _branch.branchCode;
            return _branch;
         }) : [];
      }
   }
   public assignBranch(branch) {
      this.branch = branch;
      this.branchName = branch.branchName;
   }

   public onAccountSelection(account: IAccountDetail) {
      this.selectedDropdownAccount = account;
   }
   public checkForBranchVisiblity(bank) {
      this.isBranchVisible = !(bank.hasOwnProperty('universalCode') && bank.universalCode.length > 0) && !this.isNedBank(bank);
   }
   public bankChange(bank) {
      this.checkForBranchVisiblity(bank);
      this.assignBank(bank);
      if (!this.isNedBank(bank)) {
         if (this.operationMode !== this.autoPay.values.edit) {
            this.clearBranch();
         }
      }
   }
   public clearBranch() {
      this.branchName = this.autoPay.values.emptyString;
   }
   isNedBank(bank: IBank) {
      return CommonUtility.isNedBank(bank.bankName);
   }
   public selectBank(selected) {
      if (selected.item) {
         this.bankChange(selected.item);
      } else {
         this.bankChange(selected);
      }
   }
   public clearBank() {
      this.otherBank = this.autoPay.values.emptyString;
      this.bank = null;
      this.isBranchVisible = false;
      this.accountNumber = this.autoPay.values.emptyString;
      this.clearBranch();
   }

   public blurBank(selected) {
      if (selected && selected.item) {
         this.bankChange(selected.item);
         this.otherBank = selected.item.bankName;
      } else {
         this.clearBank();
      }
   }
   noBankResults(event) {
      this.noBankData = event;
   }
   public blurBankInput() {
      if (this.noBankData) {
         this.clearBank();
      }
   }
   selectBranch(selected) {
      if (selected.item) {
         this.assignBranch(selected.item);
      } else {
         this.assignBranch(selected);
      }

   }
   blurBranch(selected) {
      if (selected && selected.item) {
         this.assignBranch(selected.item);
      } else {
         this.clearBranch();
      }
   }
   noBranchResults(event) {
      this.noBranchData = event;
   }
   blurBranchInput() {
      if (this.noBranchData) {
         this.clearBranch();
      }
   }
}
