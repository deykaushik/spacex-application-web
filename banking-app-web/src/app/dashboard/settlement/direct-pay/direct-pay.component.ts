import { Component, OnInit, TemplateRef, ViewChild, Input, EventEmitter, Output, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../dashboard/account.service';
import { PreFillService } from '../../../core/services/preFill.service';
import { TransferNowComponent } from './transfer-now/transfer-now.component';
import { OtherPaymentModesComponent } from './other-payment-modes/other-payment-modes.component';
import { SettlementTermsComponent } from './settlement-terms/settlement-terms.component';
import { RequestQuoteEmailComponent } from './../request-quote/request-quote-email/request-quote-email.component';
import { BaseComponent } from '../../../core/components/base/base.component';
import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { ISettlementDetail, IBeneficiaryData, IBankDefinedBeneficiary, IAccountDetail } from '../../../core/services/models';
import { GAEvents } from './../../../core/utils/ga-event';

@Component({
   selector: 'app-direct-pay',
   templateUrl: './direct-pay.component.html',
   styleUrls: ['./direct-pay.component.scss']
})
export class DirectPayComponent extends BaseComponent implements OnInit {

   @Input() accountId: number;
   @Input() accountType: string;
   @Input() settlementDetails: ISettlementDetail;
   @Output() onClose = new EventEmitter<boolean>();

   isOverlayVisible: boolean;
   closeBtnText: string = Constants.labels.settlement.buttons.close;
   labels = Constants.labels.settlement.directPay;
   allowTransfer: boolean;
   selectedTemplate: TemplateRef<any>;
   showLoader: boolean;
   accountTypes = Constants.VariableValues.accountTypes;
   values = Constants.VariableValues.settlement;
   isMFCSettlement = false;
   isPlSettlement = false;
   isHlSettlement = false;

   @ViewChild('directPayTemplate') directPayTemplate: TemplateRef<DirectPayComponent>;
   @ViewChild('termsTemplate') termsTemplate: TemplateRef<SettlementTermsComponent>;
   @ViewChild('otherPaymentModesTemplate') otherPaymentModesTemplate: TemplateRef<OtherPaymentModesComponent>;
   @ViewChild('transferNowTemplate') transferNowTemplate: TemplateRef<TransferNowComponent>;
   @ViewChild('settlementQuoteTemplate') settlementQuoteTemplate: TemplateRef<RequestQuoteEmailComponent>;

   constructor(private route: ActivatedRoute, private router: Router,
      private accountService: AccountService, private preFillService: PreFillService, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.showLoader = true;
      this.isOverlayVisible = true;
      this.selectedTemplate = this.directPayTemplate;
      const selectedAccount = this.accountService.getAccountData();
      if (selectedAccount && selectedAccount.ItemAccountId === this.accountId) {
         this.accountType = selectedAccount.AccountType;
      }
      switch (this.accountType) {
         case this.accountTypes.mfcvafLoanAccountType.code:
            this.isMFCSettlement = true;
            this.labels.subTitle = this.labels.mfc.subTitle;
            this.labels.transferNow = this.labels.mfc.payNow;
            this.findPayAccounts();
            break;
         case this.accountTypes.personalLoanAccountType.code:
            this.isPlSettlement = true;
            this.getSettlementDetails();
            this.findFromCASAAccounts();
            break;
         case this.accountTypes.homeLoanAccountType.code:
            this.isHlSettlement = true;
            this.labels.title = this.labels.hl.title;
            this.labels.subTitle = this.labels.hl.subTitle;
            this.findFromCASAAccounts();
            break;
      }
   }

   findPayAccounts() {
      this.accountService.getPaymentAccounts().subscribe(response => {
         const accounts = response;
         if (accounts && accounts.length) {
            this.allowTransfer = accounts.find(account => CommonUtility.isCasaAccount(account.accountType)) != null;
            this.showLoader = false;
         } else {
            this.disableTransfer(false);
         }
      }, (error) => {
         this.disableTransfer(false);
      });
   }

   findFromCASAAccounts() {
      this.accountService.getTransferAccounts().subscribe(response => {
         const accounts = response;
         if (accounts && accounts.length > 0) {
            const transferableAccounts = CommonUtility.filterTransferableAccounts(accounts);
            if (transferableAccounts && transferableAccounts.length > 0) {
               this.allowTransfer = transferableAccounts.find(account => this.isAllowTransfer(account)) != null;
               this.showLoader = false;
            } else {
               this.disableTransfer(false);
            }
         } else {
            this.disableTransfer(false);
         }
      }, (error) => {
         this.disableTransfer(false);
      });
   }

   isAllowTransfer(account: IAccountDetail): boolean {
      return CommonUtility.isCasaAccount(account.accountType) && account.allowDebits;
   }

   disableTransfer(value: boolean) {
      this.showLoader = value;
      this.allowTransfer = value;
   }

   getSettlementDetails() {
      this.settlementDetails = this.accountService.getSettlementData();
   }

   showTransferNow() {
      if (this.isMFCSettlement) {
         const payNowGAEvents = Constants.GAEventList.settlement.MFC.payNow;
         this.sendEvent(payNowGAEvents.action, payNowGAEvents.label, null, payNowGAEvents.category);
         this.goToPay();
      } else if (this.isHlSettlement) {
         const transferNowGAEvent = GAEvents.hlSettlement.transferNow;
         this.sendEvent(transferNowGAEvent.eventAction, transferNowGAEvent.label, null, transferNowGAEvent.category);
         this.preFillService.settlementDetail = this.settlementDetails;
         this.router.navigateByUrl(Constants.routeUrls.transferLanding);
      } else {
         const transferNowGAEvent = GAEvents.personalLoanSettlement.transferNow;
         this.sendEvent(transferNowGAEvent.eventAction, transferNowGAEvent.label, null, transferNowGAEvent.category);
         this.selectedTemplate = this.transferNowTemplate;
      }
   }

   goToPay() {
      const beneficiaryDetails = {} as IBeneficiaryData;
      const bankDefinedBeneficiary = {} as IBankDefinedBeneficiary;
      bankDefinedBeneficiary.bDFID = this.values.bankDefinedBeneficiary.id;
      bankDefinedBeneficiary.bDFName = this.values.bankDefinedBeneficiary.name;
      bankDefinedBeneficiary.sortCode = this.values.bankDefinedBeneficiary.sortCode;
      beneficiaryDetails.bankDefinedBeneficiary = bankDefinedBeneficiary;
      this.preFillService.settlementDetail = {} as ISettlementDetail;
      this.preFillService.settlementDetail.beneficiaryData = beneficiaryDetails;
      this.preFillService.settlementDetail.settlementAmt = this.settlementDetails.settlementAmt;
      this.preFillService.settlementDetail.theirReference = this.settlementDetails.loanAccountNumber.toString();
      this.preFillService.settlementDetail.yourReference = this.values.bankDefinedBeneficiary.yourReference;
      this.preFillService.preFillBeneficiaryData = beneficiaryDetails;
      this.router.navigateByUrl(Constants.routeUrls.payLanding);
   }

   showOtherPaymentModes() {
      this.selectedTemplate = this.otherPaymentModesTemplate;
   }

   showTerms() {
      this.selectedTemplate = this.termsTemplate;
   }

   showQuote() {
      const plSettlementQuotefromSLGAEvents = GAEvents.personalLoanSettlement.settlementQuoteFromSettleLoan;
      this.sendEvent(plSettlementQuotefromSLGAEvents.eventAction, plSettlementQuotefromSLGAEvents.label,
         null, plSettlementQuotefromSLGAEvents.category);
      this.selectedTemplate = this.settlementQuoteTemplate;
   }

   onTermsClose(isTermsClose: boolean) {
      if (isTermsClose) {
         this.selectedTemplate = this.directPayTemplate;
      }
   }

   onOtherPaymentModesClose(isOtherPaymentModesClose: boolean) {
      if (isOtherPaymentModesClose) {
         this.selectedTemplate = this.directPayTemplate;
      }
   }

   onTransferNowClose(isPaymentClose: boolean) {
      if (isPaymentClose) {
         this.selectedTemplate = this.directPayTemplate;
      }
   }

   onQuoteClose(isSettlementQuoteClose: boolean) {
      if (isSettlementQuoteClose) {
         this.selectedTemplate = this.directPayTemplate;
      }
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      if (this.isMFCSettlement || this.isHlSettlement) {
         this.onClose.emit(true);
      } else {
         this.accountService.setSettlementData(null);
         this.router.navigateByUrl(encodeURI(Constants.routeUrls.accountDetail + this.accountId));
      }
   }

}
