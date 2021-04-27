import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../../dashboard/account.service';
import { Constants } from '../../../../core/utils/constants';
import { CommonUtility } from './../../../../core/utils/common';
import { IUniversalBranchCode, IDashboardAccount } from '../../../../core/services/models';

@Component({
   selector: 'app-other-payment-modes',
   templateUrl: './other-payment-modes.component.html',
   styleUrls: ['./other-payment-modes.component.scss']
})
export class OtherPaymentModesComponent implements OnInit {

   @Output() onClose = new EventEmitter<boolean>();
   isOverlayVisible: boolean;
   closeBtnText: string = Constants.labels.settlement.buttons.close;
   labels = Constants.labels.settlement.otherPaymentModes;
   values = Constants.VariableValues.settlement.quoteRequest;
   nedBankaccountNo: number;
   sbAccountNo: number;
   accountType: string;
   accountNoLength: number;
   branchCode: string;
   isSkeletonMode: boolean;
   emailLink: string;
   emailValues = Constants.VariableValues.email;
   contactEmail: string;
   isMfCSettlement: boolean;
   isPlSettlement: boolean;
   isHlSettlement: boolean;
   accountTypes = Constants.VariableValues.accountTypes;
   selectedAccount: IDashboardAccount;

   constructor(private accountService: AccountService) {
   }

   ngOnInit() {
      this.isMfCSettlement = false;
      this.isPlSettlement = false;
      this.isHlSettlement = false;
      this.isOverlayVisible = true;
      this.isSkeletonMode = true;
      this.selectedAccount = this.accountService.getSettlementData().accountToTransfer;
      this.accountType = this.selectedAccount.AccountType;
      this.nedBankaccountNo = this.selectedAccount.AccountNumber;
      this.findSettlementQuoteType();
   }

   findSettlementQuoteType() {
      switch (this.accountType) {
         case this.accountTypes.mfcvafLoanAccountType.code:
            this.setMfcOtherPaymentModes();
            break;
         case this.accountTypes.personalLoanAccountType.code:
            this.setPlOtherPaymentModes();
            break;
         case this.accountTypes.homeLoanAccountType.code:
            this.setHlOtherPaymentModes();
            break;
      }
   }

   setMfcOtherPaymentModes() {
      this.isMfCSettlement = true;
      this.labels.MFC.cashDepositRefNumber
         = CommonUtility.format(this.labels.MFC.cashDepositRefNumber, this.selectedAccount.AccountNumber);
      this.labels.title = this.labels.MFC.title;
      this.labels.MFC.contactInfo = CommonUtility.format(this.labels.MFC.contactInfo, this.values.faxNumberForContactMFC);
      this.labels.eftPaymentsDesc = CommonUtility.format(this.labels.MFC.eftPaymentsDesc, this.selectedAccount.AccountNumber);
      this.contactEmail = this.values.emailForContactMFC;
      this.emailLink = this.emailValues.mailTo + this.values.emailForContactMFC +
         this.emailValues.subject + this.values.emailSubject;
   }

   setPlOtherPaymentModes() {
      this.isPlSettlement = true;
      this.labels.cashDepositDesc = CommonUtility.format(this.labels.cashDepositDesc, this.selectedAccount.AccountNumber);
      this.contactEmail = this.values.emailForContactPL;
      this.accountNoLength = this.nedBankaccountNo.toString().length - 2;
      this.sbAccountNo = Number(this.nedBankaccountNo.toString().substring(0, this.accountNoLength));
      this.emailLink = this.emailValues.mailTo + this.values.emailForContactPL
         + this.emailValues.subject + this.values.emailSubject;
      this.getUniversalBranchCode();
   }

   setHlOtherPaymentModes() {
      this.isHlSettlement = true;
      this.labels.HL.cashDepositRefNumber = CommonUtility.format(this.labels.MFC.cashDepositRefNumber, this.selectedAccount.AccountNumber);
      this.labels.eftPaymentsDesc = this.labels.HL.eftPaymentsDesc;
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      this.onClose.emit(true);
   }

   /* Get all universal branch codes, find and update share account details branch code based on account type */
   getUniversalBranchCode() {
      this.accountService.getUniversalBranchCodes().subscribe((universalBranchCodes: IUniversalBranchCode[]) => {
         const universalBranchCode = universalBranchCodes.find(ubc => ubc.accountType === this.accountType);
         if (universalBranchCode) {
            this.branchCode = universalBranchCode.branchCode;
         } else {
            this.branchCode = undefined;
         }
         this.isSkeletonMode = false;
      });
   }
}
