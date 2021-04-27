import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../core/utils/constants';
import * as moment from 'moment';
import { ISchedulePaymentConatiner } from '../dashboard.model';
import { IScheduledTransaction, IScheduledTransactionType } from '../../core/services/models';
import { scheduledCardSkeletonData } from './../../core/data/skeleton-data';
import { BuyService } from '../../buy/buy-prepaid/buy.service';

@Component({
   selector: 'app-scheduled-card',
   templateUrl: './scheduled-card.component.html',
   styleUrls: ['./scheduled-card.component.scss']
})
export class ScheduledCardComponent implements OnInit {
   @Input() accountNumber: string;
   scheduledPaymentsData: ISchedulePaymentConatiner[];
   skeletonMode: Boolean;
   heading = 'Scheduled payments';
   @Input() accountType: string;
   @Input() ItemAccountId: number;

   constructor(private accountService: AccountService, private buyService: BuyService) { }

   ngOnInit() {
      this.skeletonMode = true;
      const urlParam = {
         transactiontype: 'scheduled',
         page: 1,
         pagesize: 100,
         fromItemAccountID: this.ItemAccountId
      };
      this.scheduledPaymentsData = scheduledCardSkeletonData;
      const scheduledTranfers = this.accountService.getScheduledTransfer(urlParam);
      const scheduledPayment = this.accountService.getScheduledPayment(urlParam);
      const scheduledMobileTrasactions = this.accountService.getScheduledMobileTrasactions(urlParam);
      Observable.forkJoin(scheduledTranfers, scheduledPayment, scheduledMobileTrasactions).subscribe(results => {
         const scheduledPayments = this.formatAndSort(results);
         this.scheduledPaymentsData = [];
         this.groupDataByMonth(scheduledPayments, 'nextTransDate');
      });

   }
   groupDataByMonth(arr: IScheduledTransactionType[], key: string) {
      this.buyService.getServiceProviders().subscribe((serviceProviders) => {
         arr.forEach(element => {
            if (element.type === Constants.SchedulePaymentType.prepaid.name) {
               const serviceProvider = serviceProviders
                  .find(provider => provider.serviceProviderCode === element.transaction.serviceProvider);
               element.transaction.serviceProviderName = serviceProvider ? serviceProvider.serviceProviderName : '';
            }
            const date = new Date(element.transaction[key]);
            const month = Constants.allMonths[date.getMonth()] + '-' + date.getFullYear();
            const factor = this.getAmountMultiplyFactor(element.transaction);
            const temp = this.FindKey(this.scheduledPaymentsData, month);
            if (temp != null) {
               temp.data.push(element);
               temp.totalAmount += element.transaction.amount * factor;
               temp.totalTransaction += factor;
            } else {
               const obj: ISchedulePaymentConatiner = {
                  month: month,
                  data: [element],
                  totalAmount: element.transaction.amount * factor,
                  totalTransaction: factor
               };
               this.scheduledPaymentsData.push(obj);
            }
         });
      });
      this.skeletonMode = false;
   }
   formatAndSort(arr: [IScheduledTransaction[], IScheduledTransaction[], IScheduledTransaction[]]): IScheduledTransactionType[] {
      const data: IScheduledTransactionType[] = [];
      arr.forEach((element, index) => {
         element.forEach(transaction => {
            let temp: IScheduledTransactionType;
            if (index === 0) {
               transaction.fromAccount.accountType = this.accountType;
               temp = {
                  type: Constants.SchedulePaymentType.transfer.name,
                  iconClass: Constants.SchedulePaymentType.transfer.icon,
                  transaction: transaction
               };
            } else if (index === 1) {
               temp = {
                  transaction: transaction,
                  type: Constants.SchedulePaymentType.payment.name,
                  iconClass: Constants.SchedulePaymentType.payment.icon
               };
            } else {
               temp = {
                  type: Constants.SchedulePaymentType.prepaid.name,
                  iconClass: Constants.SchedulePaymentType.prepaid.icon,
                  transaction: transaction
               };
            }
            data.push(temp);
         });

      });
      // const combinedData = arr[0].concat(arr[1], arr[2]);
      data.sort(function (trans1, trans2) {
         return +new Date(trans1.transaction.nextTransDate) - +new Date(trans2.transaction.nextTransDate);
      });
      // this.skeletonMode = false;
      return data;
   }
   FindKey(arr: ISchedulePaymentConatiner[], key: string): ISchedulePaymentConatiner {
      let temp: ISchedulePaymentConatiner;
      arr.some((element) => {
         if (element.month === key) {
            temp = element;
            return true;
         }
      });
      return temp;
   }

   private getAmountMultiplyFactor(transaction: IScheduledTransaction) {
      if (transaction.reoccurrenceItem &&
         transaction.reoccurrenceItem.reoccurrenceFrequency === Constants.recurrenceFrequency.weekly) {
         const totalFrequencyLeft = transaction.reoccurrenceItem.reoccOccurrencesLeft;
         const frequncyLeftInMonth = this.getRamaingFrequencyOfDay(transaction.nextTransDate);
         return totalFrequencyLeft < frequncyLeftInMonth ? totalFrequencyLeft : frequncyLeftInMonth;
      }
      return 1; // If transaction is not recurring or Monthly;
   }
   private getRamaingFrequencyOfDay(fromdate) {
      const date = new Date(fromdate).getDate();
      const totalDaysInMonth = moment(fromdate).endOf('month').date();
      const ramainingFreq = 1 + (totalDaysInMonth - date) / 7;
      return Math.floor(ramainingFreq);
   }
}
