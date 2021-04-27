import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AmountTransformPipe } from './../../../../shared/pipes/amount-transform.pipe';
import { Constants } from '../../../../core/utils/constants';
import { CommonUtility } from '../../../../core/utils/common';
import { ISettlementDetail } from '../../../../core/services/models';

@Component({
   selector: 'app-settlement-terms',
   templateUrl: './settlement-terms.component.html',
   styleUrls: ['./settlement-terms.component.scss']
})
export class SettlementTermsComponent implements OnInit {

   @Input() settlementDetails: ISettlementDetail;
   @Output() onClose = new EventEmitter<boolean>();

   isMfCSettlement: boolean;
   isPlSettlement: boolean;
   isHlSettlement: boolean;
   isOverlayVisible: boolean;
   labels: any;
   closeBtnText: string = Constants.labels.settlement.buttons.close;
   dateFormat = Constants.formats.momentDDMMMMYYYY;
   nedBankHomeLink = Constants.links.nedBankHomeLink;
   amountTransform = new AmountTransformPipe();
   lastPaymentAmount: string;
   lastPaymentDate: string;
   settlementDate: string;
   accountTypes = Constants.VariableValues.accountTypes;

   ngOnInit() {
      this.isOverlayVisible = true;
      this.isMfCSettlement = false;
      this.isPlSettlement = false;
      this.isHlSettlement = false;
      this.findSettlementQuoteTermsType();
   }

   findSettlementQuoteTermsType() {
      switch (this.settlementDetails.typeOfProduct) {
         case this.accountTypes.mfcvafLoanAccountType.code:
            this.showMfcSettlementTerms();
            break;
         case this.accountTypes.personalLoanAccountType.code:
            this.showPlSettlementTerms();
            break;
         case this.accountTypes.homeLoanAccountType.code:
            this.isHlSettlement = true;
            this.labels = Constants.labels.settlement.terms.HL;
            break;
      }
   }

   showMfcSettlementTerms() {
      this.isMfCSettlement = true;
      this.labels = Constants.labels.settlement.terms.MFC;
      this.settlementDate = moment(this.settlementDetails.settlementDate).format(this.dateFormat);
      this.labels.term1[1] = CommonUtility.format(this.labels.term1[1], this.settlementDate);
      this.lastPaymentDate = moment(this.settlementDetails.lastPaymentDate).format(this.dateFormat);
      this.labels.term2[1] = CommonUtility.format(this.labels.term2[1], this.lastPaymentDate);
      this.lastPaymentAmount = this.amountTransform.transform(this.settlementDetails.lastPaymentAmount);
      this.labels.term2[3] = CommonUtility.format(this.labels.term2[3], this.lastPaymentAmount);
   }

   showPlSettlementTerms() {
      this.isPlSettlement = true;
      this.labels = Constants.labels.settlement.terms;
      this.settlementDate = moment(this.settlementDetails.settlementDate).format(this.dateFormat);
      this.labels.term1[1] = CommonUtility.format(this.labels.term1[1], this.settlementDate);
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      this.onClose.emit(true);
   }
}
