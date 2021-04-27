import { Component, OnInit, Input, Injector } from '@angular/core';
import {
   IToggleButtonGroup, IButtonGroup, IStatementDownloadDetails,
   IStatementDownload
} from '../../../../core/services/models';
import * as moment from 'moment';
import { Moment } from 'moment/moment';
import { Constants } from '../../../../core/utils/constants';
import { StatementPreferencesConstants } from '../../../statement-preferences/statement-preferences-constants';
import { CommonUtility } from '../../../../core/utils/common';
import { IDatePickerConfig } from 'ng2-date-picker';
import { AccountService } from '../../../account.service';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { GAEvents } from '../../../../core/utils/ga-event';
import { Angular2Csv } from 'angular2-csv';
import { saveAs } from 'file-saver/FileSaver';

@Component({
   selector: 'app-statement-casa',
   templateUrl: './statement-casa.component.html',
   styleUrls: ['./statement-casa.component.scss']
})
export class StatementCasaComponent extends BaseComponent implements OnInit {
   @Input() itemAccountId: string;
   labels = Constants.labels.statementDownload;
   labelValues = Constants.VariableValues.statementDownload;
   variableValues = StatementPreferencesConstants.variableValues;
   toggleButtonGroup: IToggleButtonGroup;
   constants = Constants.VariableValues;
   values = StatementPreferencesConstants.values;
   buttonGroup: IButtonGroup[] = this.constants.statementDownloadTypes;
   buttonGroupWidth = this.variableValues.maximumButtonWidthForTwoButtons;
   groupName = this.labels.groupName;
   statementMode: string;
   isListingView: boolean;
   fromDate: Moment;
   toDate: Moment;
   fromDateChange: Date;
   toDateChange: Date;
   minPaymentDate: Moment;
   maxPaymentDate: Moment;
   toconfig: IDatePickerConfig;
   fromconfig: IDatePickerConfig;
   showLoader: boolean;
   isStatement: boolean;
   invalidFromDate: boolean;
   invalidToDate: boolean;

   dateFormat = Constants.formats.momentYYYYMMDD;
   readonlyFields = true;
   currentrDate: Moment;

   documentSearchResultRowList = [];
   startDates = [] as Date[];
   statementMonths: IStatementDownloadDetails[] = [];
   monthsToBeShown = [];
   alertMessage: { showAlert: boolean; displayMessageText: string; action: number; alertType: number; };

   constructor(private accountService: AccountService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.showLoader = true;
      const monthsArr = [0, 1, 2];
      const currentMonth = new Date().getMonth();
      monthsArr.forEach((month, index) => {
         this.statementMonths[index] = {
            date: '',
            month: '',
            year: '',
            download: false
         };
      });
      // for statement download we have to show only latest 3 months data, whatever may be the response
      this.monthsToBeShown = [currentMonth, currentMonth - 1, currentMonth - 2];
      this.statementDownload();
      this.isStatement = true;
      this.statementMode = 'PDF';
      this.isListingView = false;
      this.readonlyFields = false;
      this.toggleButtonGroup = {
         buttonGroup: this.buttonGroup,
         buttonGroupWidth: this.buttonGroupWidth,
         groupName: this.groupName,
         isGroupDisabled: false
      };
      this.fromDate = moment(CommonUtility.getNextDate(new Date(), -1, 'months'));
      this.toDate = moment(CommonUtility.getNextDate(new Date(), 0, 'days'));
      this.maxPaymentDate = moment(CommonUtility.getNextDate(new Date(), -5, 'years'));
      this.minPaymentDate = moment(CommonUtility.getNextDate(new Date(), 0, 'days'));
      this.toconfig = {
         format: Constants.formats.DDMMYYYY,
         min: this.maxPaymentDate,
         max: this.minPaymentDate
      };

      this.fromconfig = {
         format: Constants.formats.DDMMYYYY,
         min: this.maxPaymentDate,
         max: this.minPaymentDate
      };
   }

   setFromDate(value: Date) {
      this.fromDateChange = value;
      if (this.fromDateChange > this.toDateChange) {
         this.invalidFromDate = true;
      } else {
         this.invalidFromDate = false;
      }

   }
   setToDate(value: Date) {
      this.toDateChange = value;
      if (this.fromDateChange > this.toDateChange) {
         this.invalidFromDate = true;
      } else {
         this.invalidFromDate = false;
      }
   }
   onStatementChange(type) {
      if (type.value === 'CSV') {
         this.isListingView = true;
         this.statementMode = 'CSV';
      } else {
         this.isListingView = false;
         this.statementMode = 'PDF';
         const statementScreenPdf = GAEvents.statementDownload.statementScreenPdf;
         this.sendEvent(statementScreenPdf.eventAction, statementScreenPdf.label, null, statementScreenPdf.category);

      }
   }

   statementDownload() {
      const dateStart = moment(new Date()).add('days', -(90)).format(Constants.formats.momentYYYYMMDD);
      const endDate = moment(new Date()).format(Constants.formats.momentYYYYMMDD);
      const accountNumber = this.accountService.getAccountData().AccountNumber;
      this.accountService.getStatementDownload(dateStart, endDate, accountNumber)
         .subscribe((response: IStatementDownload) => {
            if (response) {
               if (response.documentSearchResultRowList.length) {
                  this.documentSearchResultRowList = response.documentSearchResultRowList;
                  response.documentSearchResultRowList.forEach(data => this.startDates.push(new Date(data.effectiveDate)));
                  this.showMonths(this.startDates);
                  this.isStatement = true;
               } else {
                  this.isStatement = false;
               }
               this.showLoader = false;
            }
         });
   }
   startDateStatement(month: IStatementDownloadDetails) {
      let documentUrl = '';
      this.documentSearchResultRowList.forEach(row => {
         const date = Constants.allMonths[new Date(row.effectiveDate).getMonth()] + ' ' + new Date(row.effectiveDate).getFullYear();
         if (date === month.date) {
            documentUrl = row.documentUrl;
         }
      });
      this.accountService.getStartDateStatement(documentUrl).subscribe((response) => saveAs
         (response, month.date + this.labelValues.fileExt));
   }

   showMonths(dates) {
      const monthsArray = [];
      this.getDates();
      this.startDates.forEach((date) => {
         monthsArray.push(new Date(date).getMonth());
      });
      this.monthsToBeShown.forEach((month, index) => {
         if (monthsArray.find(mon => month === mon)) {
            this.statementMonths[index].download = true;
         }
      });
   }
   getDates() {
      const months = Constants.allMonths;
      const currentYear = new Date().getFullYear();
      let year: number;
      this.monthsToBeShown.forEach((month, index) => {
         // if current month is Jan, previous month will be december. so accordingly -1 means 11 and -2 means 10
         // set current year, if month is -1 or -2, means its previous Year, so currentYear-1
         if (month === -1) {
            this.monthsToBeShown[index] = 11;
            year = currentYear - 1;
         } else if (month === -2) {
            this.monthsToBeShown[index] = 10;
            year = currentYear - 1;
         } else {
            year = currentYear;
         }
         this.statementMonths[index].year = year.toString();
         this.statementMonths[index].month = months[this.monthsToBeShown[index]];
         this.statementMonths[index].date = this.statementMonths[index].month + ' ' + this.statementMonths[index].year;
      });
   }
   getErrorMessage() {
      return this.alertMessage = {
         showAlert: true,
         displayMessageText: this.labelValues.noDownloadErroMessageForCSV,
         action: 2,
         alertType: 1,
      };
   }
   downloadStatementCASA() {
      this.showLoader = true;
      const startdate = moment(this.fromDateChange).format(Constants.formats.momentYYYYMMDD);
      const endDate = moment(this.toDateChange).format(Constants.formats.momentYYYYMMDD);
      this.accountService.getAdvancedSearchData(this.itemAccountId, startdate, endDate)
         .subscribe((response) => {
            const data = [];
            if (response && response.length) {
               response.forEach(transaction => {
                  data.push({
                     Date: moment(transaction.PostedDate).format(Constants.formats.ddmmyyyy),
                     Transaction: transaction.Description,
                     Amount: transaction.Amount
                  });
               });
               this.showLoader = false;
               const sheetName = this.labelValues.sheetName + moment(new Date()).format(Constants.formats.ddmmyyyy);
               const options = {
                  showLabels: true, headers: [this.labelValues.optionDate, this.labelValues.optionTransactions,
                  this.labelValues.optionAmount]
               };
               const download = new Angular2Csv(data, sheetName, options);
            } else {
               this.showLoader = false;
               this.accountService.showAlertMessage(this.getErrorMessage());
            }
         }, (error) => {
            this.showLoader = false;
         });
   }
}
