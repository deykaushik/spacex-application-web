import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import { DatePipe } from '@angular/common';
import { AmountTransformPipe } from '../pipes/amount-transform.pipe';
import { CommonUtility } from './../../core/utils/common';
import {
   IBalanceDetailsChangeLabel, IPropertyLabelsDetailedBalances, IPropertyToApplyFilter,
   IKeyValueMapResultSequence, IAccountBalanceDetail
} from '../../core/services/models';

@Pipe({
   name: 'keyValueMap'
})
/* example usage
1. balanceDetailInput is the response object from API from balancedetail call
For Unit trust accounts:
   balanceDetailInput = {
         "investmentNumber":"8204657","investmentAccountType":"UT",
         "fundName":"Financials Fund A","marketValue":0.0000000000000000,"totalMarketValue":0.0,
         "fundFolioNumber":8204657,"quantity":0.0000000,"availableUnits":0.0000000,"unitPrice":32094.21000000,
         "cededAmount":0.0,"unclearedAmount":0.0,"percentage":0.0,"objectId":"800142712"
   }
2. propertySequence is the sequence of properties to be shown on UI, this is fetched for particular account type/sub account type and
 is ulitmately coming from commonUtility. On business conditions, some of the properties can be removed from the UI if value of
 that particular property is not received as desired from the API.
 Eg. if we received defualt date from API, that date field will be removed from the sequence.

For Unit trust accounts:
   propertySequence = ['fundFolioNumber', 'quantity', 'availableUnits', 'unitPrice', 'cededAmount', 'unclearedAmount', 'percentage']

3. propertyFilters will give the list of properties grouped together so that particular filter/pipe can be applied on them.
   Eg. Say for some dateOfOpening to be displayed on UI in dd/MM/yyyy format, [{'date': ['dateOfOpening']}

For Unit trust accounts:
   propertyFilters = { rate: ['percentage'] ,noFilter: ['fundFolioNumber', 'quantity', 'availableUnits', 'cededAmount', 'unclearedAmount']}
   ]

3. changePropertyLabel is the property from API that should be populated into different fieldName.
   Eg. Since we are populating label and value on UI using property names of API, in some case,
   payOutDate field should have 'Maturity date' as label.
   In such case, changePropertyLabel = {label: ['payOutDate', 'Maturity date']}
For Unit trust accounts:
   changePropertyLabel = { label: null}

4. Final object returned to the html:
For Unit trust accounts:
   resultSequence = [{key: "Fund number", value: 8204657, id: "fundFolioNumber"},
   {key: "Total units", value: 0, id: "quantity"},
   {key: "Available units", value: 0, id: "availableUnits"},
   {key: "Price per unit", value: "R32 094.21", id: "unitPrice"},
   {key: "Ceded units", value: 0, id: "cededAmount"},
   {key: "Uncleared units", value: 0, id: "unclearedAmount"},
   {key: "Percentage allocation", value: "0%", id: "percentage"}]

   Example For CA account:
      balanceDetailInput = ["accountName":"CURRENT AC","accountNumber":"1907023852","accountType":"CA","currentBalance":9058151.07,
      "availableBalance":9068151.07,"currency":"&#x52;","movementsDue":0.0,"unclearedEffects":0.0,"accruedFees":0.0,"pledgedAmount":0.0,
      "crInterestDue":0.0,"crInterestRate":0.0,"overdraftLimit":10000.0,"dbInterestDue":0.0,"dbInterestRate":20.25]
   */
export class KeyValueMapPipe implements PipeTransform {
   amountTransform = new AmountTransformPipe();
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   dateFilter = new DatePipe('en-US');
   fieldLabelsBalanceDetails = Constants.labels.account.balanceDetailLabels.fieldLabels;
   defaultDate = Constants.labels.account.balanceDetailLabels.defaultDate.toString();
   dateFilterOnProperties = [];
   rateFilterOnProperties = [];
   noFilterOnProperties = [];
   changePropertyLabel = [];
   propertyLabels = [];
   paramHasFilter = true;
   propertyLabelAppend: string;
   propertyLabelAppliedOnValue: string;
   currency: string;

   transform(balanceDetailInput: IAccountBalanceDetail, propertySequence: string[], propertyFilters?: IPropertyToApplyFilter,
      changePropertyLabel?: IBalanceDetailsChangeLabel, propertyLabels?: IPropertyLabelsDetailedBalances[]): IKeyValueMapResultSequence[] {

      let resultSequence: IKeyValueMapResultSequence[] = [];
      // creating deep copy of fieldLabels, as they will get modified in case of some accounts
      const fieldLabels = Object.assign({}, this.fieldLabelsBalanceDetails);
      const removeField = [];
      // get properties from arguments of pipe, where particular pipe(rate/date/no pipe/amount pipe) needs to be applied.
      if (propertyFilters) {
         this.dateFilterOnProperties = propertyFilters.date;
         this.rateFilterOnProperties = propertyFilters.rate;
         this.noFilterOnProperties = propertyFilters.noFilter;
      }
      if (propertyLabels && propertyLabels.length) {
         this.propertyLabels = propertyLabels;
      }
      // store currecy if received from the response
      if (balanceDetailInput && balanceDetailInput[fieldLabels.currency.toLowerCase()]) {
         this.currency = balanceDetailInput[fieldLabels.currency.toLowerCase()];
      }
      // iterate over each sequence to be displayed and modify the fieldLabel and value according to the api response and filters
      propertySequence.forEach((param, index) => {
         const dateFilter = this.hasFilter(param, fieldLabels.dateFilter);
         const noFilter = this.hasFilter(param, fieldLabels.noFilter);
         const rateFilter = this.hasFilter(param, fieldLabels.rateFilter);
         const formatPropertyLabel = this.formatPropertyLabel(param);
         // one param, at particular time will have one particular pipe/filter/formatting on it.
         // That particular const, will be true from above code. So, if this.paramHasFilter is true, one of the switch/case would match.
         switch (this.paramHasFilter) {
            case dateFilter: // if date is default push the index into array so that it can be removed from the final object
               if (new Date(balanceDetailInput[param]).toString() !== this.defaultDate) {
                  balanceDetailInput[param] = this.formatDate(balanceDetailInput[param]);
               } else {
                  removeField.push(param);
               }
               break;
            case noFilter:
               balanceDetailInput[param] = balanceDetailInput[param];
               break;
            case rateFilter:
               balanceDetailInput[param] = balanceDetailInput[param] + fieldLabels.percentageSymbol;
               break;
            case formatPropertyLabel:
               if (this.propertyLabelAppliedOnValue) {
                  balanceDetailInput[param] = this.formatCurrencyCode(balanceDetailInput[param],
                     balanceDetailInput[this.propertyLabelAppend]);
               } else {
                  fieldLabels[param] = this.formatPercentRate(fieldLabels[param], balanceDetailInput[this.propertyLabelAppend]);
                  balanceDetailInput[param] = this.formatAmountWithCurrency(balanceDetailInput[param], this.currency);
               }
               break;
            default:
               // if the param is present in the api response, only then format it, else return false
               balanceDetailInput[param] = balanceDetailInput.hasOwnProperty(param)
                  ? this.formatAmountWithCurrency(balanceDetailInput[param]) : false;
         }
         // if the param from propertySequence has value undefined from the API response, dont push it to resultSequence
         if (balanceDetailInput[param]) {
            resultSequence.push({ key: fieldLabels[param], value: balanceDetailInput[param], id: param });

            // for linked and fixed DS investment, UI should display maturity date with balanceDetailInput of payOutDate from API field
            // changePropertyLabel.label will have only 2 elements, 1st api key and 2nd the new label that needs to be applied
            if (changePropertyLabel.label && changePropertyLabel.label[0] === param && changePropertyLabel.label.length === 2) {
               resultSequence[index].key = fieldLabels[changePropertyLabel.label[1]];
            }
         }
      });
      // remove all the fields from the resultSequence, that are present in removeField array
      if (removeField.length) {
         removeField.forEach(fieldToBeRemoved => resultSequence = resultSequence.filter(val => val.id !== fieldToBeRemoved));
      }

      return resultSequence;
   }

   formatAmountWithCurrency(amount: string, currency = Constants.labels.currencySymbol): string {
      return this.amountTransform.transform(amount, this.amountPipeConfig, currency);
   }

   formatDate(dateValue: string): string {
      return this.dateFilter.transform(dateValue, Constants.formats.ddMMMyyyy);
   }

   formatPercentRate(label: string, percent: string): string {
      return label + '(' + percent + this.fieldLabelsBalanceDetails.percentageSymbol + ')';
   }

   formatCurrencyCode(currency: string, currencyCode: string): string {
      return currency + '(' + currencyCode + ')';
   }

   hasFilter(param: string, filterName: string): boolean {
      let result = false;
      let properties = [];
      switch (filterName) {
         case this.fieldLabelsBalanceDetails.dateFilter: properties = this.dateFilterOnProperties; break;
         case this.fieldLabelsBalanceDetails.rateFilter: properties = this.rateFilterOnProperties; break;
         default: properties = this.noFilterOnProperties;
      }
      // .includes() method is not supported on IE, hence using indexOf
      result = properties ? (properties.indexOf(param) !== -1) : false;

      return result;
   }

   formatPropertyLabel(param): boolean {
      let result = false;
      this.propertyLabels.forEach((propertyLabel) => {
         if (propertyLabel.prop === param) {
            this.propertyLabelAppend = propertyLabel.append;
            this.propertyLabelAppliedOnValue = propertyLabel.applyOnValue;
            result = true;
         }
      });
      return result;
   }
}
