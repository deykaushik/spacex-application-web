import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { IBeneficiaryRecentTransactDetail, IContactCardDetail } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { constants } from 'fs';

@Component({
  selector: 'app-recent-recipient-transactions',
  templateUrl: './recent-recipient-transactions.component.html',
  styleUrls: ['./recent-recipient-transactions.component.scss']
})
export class RecentRecipientTransactionsComponent implements OnInit, OnChanges {

  @Input() recentTransactions: IBeneficiaryRecentTransactDetail[];
  @Output() repeatTransaction = new EventEmitter<IBeneficiaryRecentTransactDetail>();
  @Input() contactCardDetails: IContactCardDetail[];
  recentPayments: IBeneficiaryRecentTransactDetail[];
  recentPurchases: IBeneficiaryRecentTransactDetail[];
  dateFormat = Constants.formats.ddMMYYYY ;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.filterTransactions();
  }

  filterTransactions() {
    this.sortRecentTransactions();
    this.recentPayments = this.recentTransactions.filter((transaction) => {
      return transaction.beneficiarytype === Constants.BeneficiaryType.External ||
      transaction.beneficiarytype === Constants.BeneficiaryType.Internal ||
      transaction.beneficiarytype === Constants.Recipient.bankApprovedAccountType;
    }).splice(0, 3);

    this.recentPurchases = this.recentTransactions.filter((transaction) => {
      return transaction.beneficiarytype === Constants.BeneficiaryType.Prepaid ||
      transaction.beneficiarytype === Constants.BeneficiaryType.Electricity;
    }).splice(0, 3);
  }

  sortRecentTransactions() {
    this.recentTransactions = this.recentTransactions.sort((a, b) => {
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    });
  }

  getIconClass(transaction: IBeneficiaryRecentTransactDetail) {
    return (transaction.beneficiarytype === Constants.BeneficiaryType.Prepaid ||
    transaction.beneficiarytype === Constants.BeneficiaryType.Electricity) ? Constants.SchedulePaymentType.prepaid.icon
    : Constants.SchedulePaymentType.payment.icon;
  }

  getBeneficiaryAccountNumber(transaction: IBeneficiaryRecentTransactDetail) {
    return this.contactCardDetails.find((contactCardDetail) => {
      return contactCardDetail.beneficiaryID === transaction.beneficiaryID;
    }).accountNumber;
  }
  checkRepeatOption(recentPayment: IBeneficiaryRecentTransactDetail) {
    const isAccountCC = this.contactCardDetails.find((contactCardDetail) => {
      return contactCardDetail.beneficiaryID === recentPayment.beneficiaryID;
    }).accountType === 'CC';
   return (recentPayment.beneficiarytype === 'BNFEXT' || recentPayment.beneficiarytype === 'BNFINT' ||
   recentPayment.beneficiarytype === 'BDF') &&  !isAccountCC;
  }
}
