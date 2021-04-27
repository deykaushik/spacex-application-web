import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonUtility } from './../../core/utils/common';

@Pipe({
   name: 'formatSchedulePayment'
})
export class FormatSchedulePaymentPipe implements PipeTransform {

   constructor(private datePipe: DatePipe) {

   }

   transform(value: any, recurrenceMsgFlag?: boolean): any {
      return value ? this.formatPayment(value, recurrenceMsgFlag) : value;
   }

   private formatPayment(accountInfo, recurrenceMsgFlag) {
      let nextdate: string;
      let amount;
      let formatType: string;
      if (recurrenceMsgFlag) {
         formatType = 'RecurrenceMsg';
      } else {
         formatType = accountInfo.type;
         nextdate = this.datePipe.transform(accountInfo.transaction['nextTransDate'], 'dd/MM/yyyy');
         amount = accountInfo.transaction['amount'].toFixed(2);
      }
      switch (formatType) {
         case 'Transfer':
            let accountType: string;
            if (accountInfo.transaction.toAccount.accountType) {
               accountType = CommonUtility.getAccountTypeName(accountInfo.transaction.toAccount.accountType) + ' account';
            } else {
               accountType = accountInfo.transaction.toAccount.accountNumber;
            }
            const fromaccountType = accountInfo.transaction.fromAccount.accountType;
            return `Transfer from <b>${fromaccountType} account</b> to <b>${accountType}</b>, <b>R${amount}</b> on <b>${nextdate}</b>`;
         case 'Payment':
            return `Pay <b>${accountInfo.transaction['bFName']}</b>, <b>R${amount}</b> on <b>${nextdate}</b>`;
         case 'Mobile':
            return `Recharge ${accountInfo.transaction['serviceProviderName']} ${accountInfo.transaction['destinationNumber']} ,` +
               ` <b>R${amount}<b> on <b>${nextdate}</b>`;
         default:
            const recurringItem = accountInfo.transaction.reoccurrenceItem;
            const remainingItem = parseInt(recurringItem['reoccOccurrencesLeft'], 10);
            const remaingMsg = remainingItem > 1 ? 'payments remaining' : 'payment remaining';
            return `Repeats ${recurringItem['reoccurrenceFrequency']} (${remainingItem + ' ' + remaingMsg})`;
      }

   }
}
