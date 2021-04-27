import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from './../../core/utils/constants';
import { AccountService } from '../account.service';
import { ITransactionData, ITransactionDetail, ITransactionDetailIS, ITypeDataTransactionData } from '../../core/services/models';
import { MomentInputObject } from 'moment';

@Component({
   selector: 'app-account-transaction-details',
   templateUrl: './account-transaction-details.component.html',
   styleUrls: ['./account-transaction-details.component.scss']
})
export class AccountTransactionDetailsComponent implements OnInit {
   @Input() transaction: ITransactionData;
   @Input() index: number;
   @Input() accountType: string;
   @Input() itemAccountId: number;
   @Output() onCloseClicked = new EventEmitter<number>();

   labels = Constants.labels;
   transactionTypes = Constants.transactionDetailsLabels.transactionTypeConstants;
   gameTypeTitles = Constants.transactionDetailsLabels.gameTypeTitles;
   accountTypes = Constants.VariableValues.accountTypes;
   transactionTemplates = Constants.transactionDetailsLabels.transactionDetailTemplates;
   amountPipeConfig = undefined;
   fieldLabels = Constants.transactionDetailsLabels.fieldLabels;
   dateFormat = Constants.formats.ddMMMMyyyy;
   setTransactionDetailsView: string;
   visibleTransactionDetails: ITransactionData;
   visibleRecipientsDetails: ITypeDataTransactionData;
   isSkeletonMode: boolean;
   unitTrustAccount = this.accountTypes.unitTrustInvestmentAccountType.code;
   creditCardAccount = this.accountTypes.creditCardAccountType.code;
   isErrorStatus = true;

   constructor(private accountService: AccountService) { }

   ngOnInit() {
      this.isSkeletonMode = true;
      this.amountPipeConfig = this.accountType === this.labels.dashboardRewardsAccountTitle ?
         Constants.amountPipeSettings.amountWithNoDecimal : Constants.amountPipeSettings.amountWithLabelAndSign;
      this.setSelectedTransactionDetail();
   }

   // set the detailed values of selected transaction
   setSelectedTransactionDetail() {
      // if transaction id is present, call api to get details for that transaction, else populate transaction listing data
      if (this.transaction.TransactionId) {
         this.accountService.getTransactionDetails(this.itemAccountId, this.transaction.TransactionId)
            .subscribe((response: ITransactionDetailIS) => {
               if (response.data) {
                  response.data.TransactionDate = new Date(response.data.TransactionDate).toDateString();
                  this.setTransactionDetails(response.data);
                  this.isErrorStatus = false;
               } else {
                  this.visibleTransactionDetails = this.transaction;
               }
               this.isSkeletonMode = false;
            });
      } else {
         this.visibleTransactionDetails = this.transaction;
         this.isSkeletonMode = false;
      }
   }

   // emit event to parent to close the details section
   closeTransactionDetails() {
      this.onCloseClicked.emit(this.index);
   }

   // set the transaction details and call method that sets the template depending on transaction type
   setTransactionDetails(transaction: ITransactionData) {
      this.setTransactionDetailsTemplate(transaction.TransactionType);
      if (transaction.TransactionType === this.transactionTypes.LOT) {
         transaction.TypeData.data.GameType = this.getGameType(transaction.TypeData.data.GameName);
      }
      this.visibleTransactionDetails = transaction;
      this.visibleRecipientsDetails = transaction.TypeData.data;
   }

   // set the template depending on transaction type
   setTransactionDetailsTemplate(transactionType: string) {
      switch (transactionType) {
         case this.transactionTypes.EFTPay:
         case this.transactionTypes.EFTTran:
         case this.transactionTypes.EFTDepo:
         case this.transactionTypes.STO:
         case this.transactionTypes.DOI: this.setTransactionDetailsView = this.transactionTemplates.stopOrderEftDebitOrderInternal;
            break;
         case this.transactionTypes.IMA: this.setTransactionDetailsView = this.transactionTemplates.iMali;
            break;
         case this.transactionTypes.LOT: this.setTransactionDetailsView = this.transactionTemplates.lotto;
            break;
         case this.transactionTypes.PPE: this.setTransactionDetailsView = this.transactionTemplates.electricity;
            break;
         case this.transactionTypes.PPP: this.setTransactionDetailsView = this.transactionTemplates.airtime;
      }
   }

   // get the game type
   getGameType(gameName: string): string {
      return gameName === this.gameTypeTitles.lot ? this.gameTypeTitles.lotto : this.gameTypeTitles.powerball;
   }
}
