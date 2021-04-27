import { Component, OnInit, OnChanges, Input, SimpleChanges, Injector } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment/moment';
import { IDatePickerConfig } from 'ng2-date-picker';
import { AccountService } from '../account.service';
import { ITransactionDetail, IToggleButtonGroup, IButtonGroup, ITransactionAccountDetails } from '../../core/services/models';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { StatementPreferencesConstants } from '../statement-preferences/statement-preferences-constants';
import { GAEvents } from '../../core/utils/ga-event';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-transaction-search',
   templateUrl: './transaction-search.component.html',
   styleUrls: ['./transaction-search.component.scss']
})
export class TransactionSearchComponent extends BaseComponent implements OnInit, OnChanges {
   visibleTransactions: ITransactionDetail[];
   @Input() accountDetails: ITransactionAccountDetails;
   @Input() transactions: ITransactionDetail[];
   filter: string;
   isAdvancedSearch: boolean;
   amountFrom: string;
   amountTo: string;
   isToAmountInValid: boolean;
   isFromAmountInValid: boolean;
   showDatePicker: boolean;
   fromMinDate: Moment;
   fromMaxDate: Moment;
   toMinDate: Moment;
   toMaxDate: Moment;
   fromConfig: IDatePickerConfig;
   toConfig: IDatePickerConfig;

   disableSubmit = false;
   dateCount = 0;
   messages = Constants.messages.transactionSearch;
   labels = Constants.labels.transactionSearch;
   variableValues = Constants.VariableValues.transactionSearch;
   patternAmount = this.variableValues.patternForAmount;
   patternPoint = Constants.patterns.number;
   enableDateText = true;
   fromDate: Date;
   toDate: Date;
   count: number;
   focusAmount: string;
   amountLabel: string;
   getDataFromService = false;
   formatDateFrom: Moment;
   formatDateTo: Moment;
   showLoader = false;
   selectedButton: string;
   toggleButtonGroup: IToggleButtonGroup;
   buttonGroup = Constants.VariableValues.searchTransactionsDateRange;
   buttonGroupWidth = StatementPreferencesConstants.variableValues.maximumButtonWidthForThreeButtons;
   accountTypeRewards = Constants.labels.dashboardRewardsAccountTitle;
   period = this.buttonGroup[0].value;
   errorOccured: boolean;
   placeholderToDate: string;
   placeholderFromDate: string;
   isContextualGAEvent = true;
   filteredTransactions: ITransactionDetail[];
   errorMessageFrom: string;
   errorMessageTo: string;
   disableToCalendar = true;
   submitClicked: boolean;
   pointOrAmount: string;
   errorMessageReqTo: string;
   defaultAmount: number;

   constructor(private accountService: AccountService, injector: Injector) {
      super(injector);
   }

   ngOnChanges() {
      if (this.transactions) {
         this.visibleTransactions = this.transactions;
         this.filteredTransactions = this.visibleTransactions;
      }
   }
   ngOnInit() {
      this.formatDateTo = moment(new Date());
      this.formatDateFrom = moment(new Date());
      this.toggleButtonGroup = {
         buttonGroup: this.buttonGroup,
         buttonGroupWidth: this.buttonGroupWidth,
         groupName: this.labels.groupName,
         isGroupDisabled: false
      };
      this.selectedButton = this.buttonGroup[0].value;
      this.count = this.getNumberOfDays();
      this.pointOrAmount = this.accountDetails.accountType === Constants.VariableValues.accountTypes.rewardsAccountType.code ?
         this.labels.points : this.labels.amount;
      this.setErrorMessage(this.pointOrAmount);
      this.setDatePicker();
      this.placeholderToDate = this.labels.placeholderDate;
      this.placeholderFromDate = this.labels.placeholderDate;
   }
   setErrorMessage(pointOrAmount: string) {
      this.amountLabel = pointOrAmount === this.labels.amount ? this.labels.amount : this.labels.points;
      this.errorMessageFrom = CommonUtility.format(this.messages.fromError, this.amountLabel);
      this.errorMessageTo = CommonUtility.format(this.messages.toError, this.amountLabel);
      this.errorMessageReqTo = CommonUtility.format(this.messages.blankToAmtError, this.amountLabel);
   }

   getNumberOfDays() {
      return CommonUtility.isCasaAccount(this.accountDetails.accountType) ? this.variableValues.year : this.variableValues.threeMonths;
   }
   // initalize datepicker
   setDatePicker() {
      this.fromMinDate = moment(CommonUtility.getNextDate(new Date(), this.count, this.variableValues.days));
      this.fromMaxDate = moment(CommonUtility.getNextDate(new Date(), 0, this.variableValues.days));
      this.fromConfig = {
         format: Constants.formats.fullDate,
         min: this.fromMinDate,
         max: this.fromMaxDate,
         openOnClick: true
      };
      this.toConfig = {
         format: Constants.formats.fullDate,
         min: moment(CommonUtility.getNextDate(new Date(), this.count, this.variableValues.days)),
         max: moment(CommonUtility.getNextDate(new Date(), 0, this.variableValues.days)),
         showGoToCurrent: true,
         openOnFocus: false
      };
   }
   selectDate(selectedBtn: IButtonGroup) {
      this.dateCount = 0;
      this.period = selectedBtn.value;
      this.selectedButton = selectedBtn.value;
      selectedBtn.value === this.buttonGroup[3].value ? this.setDatePickerVariables(true) : this.setDatePickerVariables(false);
   }
   setDatePickerVariables(value: boolean) {
      this.showDatePicker = value;
      this.disableSubmit = value;
      this.disableToCalendar = true;
      this.enableDateText = value;
      if (value) {
         this.setDatePicker();
      }
      this.setSubmit();
   }
   setFromDate(value: Date) {
      this.dateCount++;
      if (this.fromDate) {
         this.disableToCalendar = false;
      }
      this.toMinDate = moment(CommonUtility.getNextDate(value, 0, this.variableValues.days));
      this.toMaxDate = moment(CommonUtility.getNextDate(new Date(), 0, this.variableValues.days));
      this.toConfig = {
         format: Constants.formats.fullDate,
         min: this.toMinDate,
         max: this.toMaxDate,
         showGoToCurrent: true,
         openOnFocus: false
      };
      this.fromDate = value;
      this.disableSubmit = (this.toDate === undefined) ? true : false;
   }
   setToDate(value: Date) {
      this.dateCount++;
      this.fromMinDate = moment(CommonUtility.getNextDate(new Date(), this.count, this.variableValues.days));
      this.fromMaxDate = moment(CommonUtility.getNextDate(value, 0, this.variableValues.days));
      this.fromConfig = {
         format: Constants.formats.fullDate,
         min: this.fromMinDate,
         max: this.fromMaxDate,
         openOnClick: true
      };
      this.setSubmit();
      this.toDate = value;
   }

   setSubmit() {
      if (this.fromDate && this.toDate) {
         this.disableSubmit = false;
      }
      if (this.submitClicked && this.dateCount === this.variableValues.twoValue) {
         this.disableSubmit = true;
      } else if (this.dateCount === 2) {
         this.disableSubmit = false;
      }

   }

   onFromAmountChange(value: string) {
      value = value.replace(Constants.patterns.replaceSpace, '');
      if (parseInt(value, 10) > 0) {
         if (this.amountTo !== this.variableValues.zeroDecValue) {
            this.isFromAmountInValid = parseFloat(value) > parseFloat(this.amountTo) ? true : false;
         }
      }
      this.amountFrom = value;
      this.focusAmount = this.labels.amountFrom;
      this.disableSubmit = false;
   }
   onToAmountChange(value: string) {
      value = value.replace(Constants.patterns.replaceSpace, '');
      this.amountTo = value;
      this.isToAmountInValid = parseFloat(this.amountTo) < parseFloat(this.amountFrom) ? true : false;
      this.isFromAmountInValid = parseFloat(this.amountFrom) > parseFloat(this.amountTo) ? true : false;
      this.focusAmount = this.labels.amountTo;
      if (this.amountFrom !== '') {
         this.disableSubmit = false;
      }
   }
   amountValidation() {
      return this.amountTo ? true : false;
   }

   formatAmount(field: string) {
      this.amountTo = this.amountFrom === this.variableValues.emptyValue ? this.variableValues.emptyValue : this.amountTo;
      if (this.accountDetails.accountType === Constants.VariableValues.accountTypes.rewardsAccountType.code) {
         return;
      }
      if (this.amountFrom && this.checkNotNaN(this.amountFrom)) {
         this.amountFrom = this.parseAmountWithPrecision(this.amountFrom);
      }
      if (this.amountTo && this.checkNotNaN(this.amountTo)) {
         this.amountTo = this.parseAmountWithPrecision(this.amountTo);
      }
   }
   checkNotNaN(amount: string): boolean {
      return !isNaN(parseFloat(amount));
   }
   parseAmountWithPrecision(amount: string): string {
      return parseFloat(amount).toFixed(2);
   }

   filterContentContextual(value: string) {
      const searchValue = value.trim();
      this.visibleTransactions = this.getDataFromService ? this.filteredTransactions : this.transactions;
      this.visibleTransactions = this.getContextualFilteredData(this.visibleTransactions, searchValue);
   }
   getDateFilterType() {
      let days: number;
      let customSearch = false;
      switch (this.period) {
         case this.buttonGroup[0].value: days = this.variableValues.thirty;
            break;
         case this.buttonGroup[1].value: days = this.variableValues.sixty;
            break;
         case this.buttonGroup[2].value: days = this.variableValues.ninety;
            break;
         default: customSearch = true;
      }
      return { days: days, customSearch: customSearch };
   }
   // return start date and end date depending on account type and filter type - either 30, 60, 90 or custom filter
   getStartDateEndDate() {
      const days = this.getDateFilterType().days;
      const customSearch = this.getDateFilterType().customSearch;
      let startDate: string;
      let endDate: string;
      let fromDate: number;
      let toDate: number;
      const startDateMoment = moment(new Date()).add('days', -(days));
      const startDateCustomMoment = moment(new Date(this.fromDate)).format(Constants.formats.momentYYYYMMDD);
      const endDateCustomMomemt = moment(new Date(this.toDate)).format(Constants.formats.momentYYYYMMDD);

      if (CommonUtility.isCasaAccount(this.accountDetails.accountType)) {
         if (!customSearch) {
            startDate = startDateMoment.format(Constants.formats.momentYYYYMMDD);
            endDate = moment(new Date()).format(Constants.formats.momentYYYYMMDD);
         } else {
            startDate = startDateCustomMoment;
            endDate = endDateCustomMomemt;
         }
      } else {
         this.getDataFromService = false;
         if (!customSearch) {
            fromDate = new Date(startDateMoment.toLocaleString()).getTime();
            toDate = new Date().getTime();
         } else {
            fromDate = new Date(this.fromDate).getTime();
            toDate = new Date(this.toDate).getTime();
         }
         return { startDate: fromDate, endDate: toDate };
      }
      this.getDataFromService = true;
      return { startDate: startDate, endDate: endDate };
   }
   /* fromDate and toDate can be either number in case if there is no api call and date needs to filtered in front end
   or it can be date in case if account type is casa(all filters) or credit card(custom filter) */
   getFilteredDateData(fromDate, toDate) {
      if (this.getDataFromService) {
         this.searchForCasaAndCreditCard(fromDate, toDate, this.amountFrom, this.amountTo);
         return;
      }
      return this.transactions.filter(transaction =>
         new Date(transaction.PostedDate).getTime() >= fromDate && new Date(transaction.PostedDate).getTime() <= toDate
      );
   }
   getContextualFilteredData(transactions: ITransactionDetail[], searchValue: string) {
      let returnData = transactions;
      if (searchValue && searchValue.length > this.variableValues.contextualSearchStart) {
         returnData = transactions.filter(transaction =>
            transaction.Description.toLowerCase().includes(this.filter.toLowerCase()));
         if (this.isContextualGAEvent) {
            const filterContext = GAEvents.transactionSearch.contextualSearch;
            this.sendEvent(filterContext.eventAction, filterContext.label, null, filterContext.category);
            this.isContextualGAEvent = false;
         }
      }
      return returnData;
   }
   getAmountRangeFilteredData(transactions: ITransactionDetail[], fromValue: number, toValue: number) {
      let returnData = transactions;
      if (!isNaN(fromValue) && !isNaN(toValue)) {
         returnData = transactions.filter((transaction) => {
            if (fromValue === 0 && toValue === 0) {
               return Math.trunc(transaction.Amount) === 0;
            }
            return Math.abs(transaction.Amount) >= fromValue && Math.abs(transaction.Amount) <= toValue;
         });
      }
      return returnData;
   }
   searchForCasaAndCreditCard(startDate: string, endDate: string, amountFrom: string, amountTo: string) {
      const fromAmount = this.amountFrom ? parseInt(amountFrom, 10) : this.defaultAmount;
      const toAmount = this.amountTo ? parseInt(amountTo, 10) : this.defaultAmount;
      this.showLoader = true;
      this.errorOccured = false;
      this.accountService.getAdvancedSearchData(this.accountDetails.itemAccountId, startDate, endDate, fromAmount, toAmount)
         .subscribe((response) => {
            let temp;
            if (response.length) {
               temp = response;
               this.filteredTransactions = response;
               if (this.filter) {
                  temp = this.getContextualFilteredData(response, this.filter);
               }
               // for credit card custom search, amount range should also work
               if (this.accountDetails.accountType === Constants.VariableValues.accountTypes.creditCardAccountType.code) {
                  temp = this.getAmountRangeFilteredData(temp, fromAmount, toAmount);
                  this.filteredTransactions = temp;
               }
               this.visibleTransactions = temp;
            } else {
               if (response.resultData) {
                  this.errorOccured = true;
               }
               this.visibleTransactions = [];
            }
            this.showLoader = false;
         });
   }
   submit() {
      let temp: ITransactionDetail[];
      const dateRange = this.getStartDateEndDate();
      const filteredDateData = this.getFilteredDateData(dateRange.startDate, dateRange.endDate);
      if (filteredDateData && this.filter) {
         temp = this.getContextualFilteredData(filteredDateData, this.filter);
      }
      if (this.amountFrom && this.amountTo && !this.getDataFromService) {
         const fromAmount = parseInt(this.amountFrom, 10);
         const toAmount = parseInt(this.amountTo, 10);
         temp = this.getAmountRangeFilteredData(filteredDateData, fromAmount, toAmount);
      }
      this.visibleTransactions = temp || filteredDateData;
      this.filteredTransactions = this.visibleTransactions;
      this.isAdvancedSearch = false;
      this.enableDateText = true;
      this.placeholderFromDate = moment(this.fromDate).format(Constants.formats.fullDate);
      this.placeholderToDate = moment(this.toDate).format(Constants.formats.fullDate);
      this.disableSubmit = true;
      this.formatDateFrom = moment(this.fromDate);
      this.formatDateTo = moment(this.toDate);
      this.disableToCalendar = true;
      this.dateCount = 0;
      this.submitClicked = true;
   }
   goBack() {
      this.accountService.transactionSearchMode(false);
   }
   GAEventAdvanceSearch() {
      const onFilterClick = GAEvents.transactionSearch.onFilterClick;
      this.sendEvent(onFilterClick.eventAction, onFilterClick.label, null, onFilterClick.category);
   }
}
