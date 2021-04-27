import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { IGetQuoteVm, IConversionRate, IConversionFilterCOnversionRate, ISingleCurrency } from '../fund-trip.model';
import { FundTripService } from '../fund-trip.service';
import { Constants } from '../../../core/utils/constants';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { IStepInfo, IWorkflowChildComponent } from '../../../shared/components/work-flow/work-flow.models';
import { IOperatingHour } from '../fund-trip.model';
import { CommonUtility } from '../../../core/utils/common';
import * as moment from 'moment';

@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.scss']
})
export class GetQuoteComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
   @ViewChild('getQuoteForm') getQuoteForm;
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();
   vm: IGetQuoteVm;
   showCustomizableTwoButtons = new EventEmitter<boolean>();
   showNextButton = new EventEmitter<boolean>();
   labels = Constants.labels;
   quotationSection = false;
   currencies: any;
   selectedCurrency: any;
   conversionRates: IConversionRate[];
   quotationreference: number;
   quoteDetails: any;
   weekdayOperatingHour: IOperatingHour;
   weekendOperatingHour: IOperatingHour;
   showOperatingHourMessage = false;
   loading: boolean;
   showloader: boolean;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   formats = Constants.formats;
   tripStatus: string;

   constructor(private fundTripService: FundTripService, private dataService: DataService,
      private router: Router) { }

   ngOnInit() {
      this.loading = false;
      this.showloader = false;
      this.showNextButton.emit(false);
      this.showCustomizableTwoButtons.emit(true);
      this.conversionRates = [];
      this.vm = this.fundTripService.getGetQuoteVm();
      this.vm.clientDetails = this.dataService.getData();
      this.tripStatus = this.dataService.getTripStatus();
      this.isButtonLoader.emit(false);
      this.fundTripService.getCurrencies().subscribe(response => {
         this.currencies = response.data;
      });
      this.fundTripService.getOperatingHours().subscribe(response => {
         this.weekdayOperatingHour = response && response.data && response.data.operatingHours ?
            response.data.operatingHours[0] : null;
         this.weekdayOperatingHour.endTime = this.deductCutoff(this.weekdayOperatingHour.endTime,
            this.labels.fundTripLabels.minutesToServiceShutDown);
         this.weekendOperatingHour = response && response.data && response.data.operatingHours ?
            response.data.operatingHours[5] : null;
         this.weekendOperatingHour.endTime = this.deductCutoff(this.weekendOperatingHour.endTime,
            this.labels.fundTripLabels.minutesToServiceShutDown);
      });
      if ( this.vm && this.vm.clientDetails) {
         if (this.vm.currency && this.vm.currency.ccycde) {
            this.onCurrencyTypeChanged(this.vm.currency);
         }
      } else {
         this.router.navigate(['dashboard/']);
      }
   }

   // Deducting cutoff time from end time
   deductCutoff(time, cutoff) {
     return moment.utc(time, this.formats.hhmm)
      .subtract(cutoff, 'minutes').format(this.formats.HHmm).toString();
   }

   validate() {
      let isValid = false;
      isValid = this.vm.currency && (this.vm.fromCurrencyValue > 0) && this.getQuoteForm.valid;
      this.isComponentValid.emit(isValid);
   }

   ngAfterViewInit() {
      this.getQuoteForm.valueChanges
         .subscribe(values => {
            this.validate();
         });
   }

   omitSpecialChar(event) {
      return CommonUtility.omitSpecialCharacter(event);
   }

   checkValid() {
      return this.quotationSection || (!this.getQuoteForm.valid || !this.vm.currency || !(this.vm.fromCurrencyValue > 0));
   }

   onCurrencyTypeChanged(currency: any) {
      this.loading = true;
      this.fundTripService.getCurrencyConversionRates(this.getConversionRates(
         [currency.ccycde], 0),
         this.vm.clientDetails.fromAccount.AccountNumber).subscribe(response => {

         this.conversionRates = response ? this.parseExchangeRates(response) : [];
         this.vm.currency = currency;
         this.validate();
         this.quotationSection = false;
         this.showNextButton.emit(false);
         this.isConvertionRatePresent();
         this.loading = false;
      }, (error) => { this.loading = false; });
   }

   onAmountChange(value) {
      this.vm.fromCurrencyValue = value;
      this.validate();
      this.quotationSection = false;
      this.showNextButton.emit(false);
   }

   calculateQuote(currency) {
      // value has been calculated from current quote value
      this.showloader = true;
      this.fundTripService.getCurrencyConversionRates(this.getConversionRates([currency],
         this.vm.fromCurrencyValue), this.vm.clientDetails.fromAccount.AccountNumber).subscribe(response => {
         this.quoteDetails = response ? this.parseExchangeRates(response) : [];
         this.vm.toCurrencyValue = this.quoteDetails[this.vm.currency.ccycde].totalZar;
         this.quotationSection = true;
         this.showNextButton.emit(true);
         this.showloader = false;
      }, error => {
         this.showloader = false;
      });
   }

   declineClick() {
      this.vm.currency = null;
      this.vm.fromCurrencyValue = null;
      this.vm.toCurrencyValue = null;
      this.showNextButton.emit(false);
      this.quotationSection = false;
   }

   isConvertionRatePresent() {
      return (Object.keys(this.conversionRates).length > 0) && (this.conversionRates[this.vm.currency.ccycde].exchangeRate);
   }

   getConversionRates(currencies: string[], amount: any) {
      const currenciesForConversionRates: IConversionFilterCOnversionRate = {
         currencies: [
         ],
         activeTripReference: this.tripStatus === this.labels.fundTripLabels.activeTripStatus ?
            this.vm.clientDetails.transactionReference : null,
         futureTripReference: this.tripStatus !== this.labels.fundTripLabels.activeTripStatus ?
            this.vm.clientDetails.transactionReference : null
       };
       currencies.forEach(currency => {
          const singleCurrency: ISingleCurrency = {
               buyCurrency: {
               currency: currency,
               amount: parseFloat(amount)
               },
               sellCurrency: {
               currency: 'ZAR',
               amount: 0
               }
            };
          currenciesForConversionRates.currencies.push(singleCurrency);
       });

       return currenciesForConversionRates;
   }

   parseExchangeRates(retes: any) {
      const filteredRates =  [];
      this.vm.quotationReference = retes.quotationReference;
      if ( parseInt(retes.minutesToServiceShutdown, 10) >= this.labels.fundTripLabels.minutesToServiceShutDown) {
         this.showOperatingHourMessage = false;
      }else {
         this.showOperatingHourMessage = true;
         this.showNextButton.emit(true);
         this.showCustomizableTwoButtons.emit(false);
      }
      retes.foreignCurrenciesTransactions.forEach(rate => {
         filteredRates[rate.foreignCurrency.buyCurrency.currency] = {exchangeRate: rate.exchangeRate,
            commisionCharge: rate.commissionCharge && rate.commissionCharge.amount ? rate.commissionCharge.amount : 0,
            sellCurrencyAmount: rate.foreignCurrency && rate.foreignCurrency.sellCurrency && rate.foreignCurrency.sellCurrency.amount ?
               rate.foreignCurrency.sellCurrency.amount : 0,
            totalZar: retes.totalZar && retes.totalZar.amount ? retes.totalZar.amount : 0
            };
      });
      return filteredRates;
   }

   formatExchangeRate(rate: number, currency: string) {
      const excludeArray = ['USD', 'EUR', 'GBP'];
      return ((excludeArray.indexOf(currency.toUpperCase()) < 0) && rate) ? this.fixedPrecision(1 / rate) : rate;
   }

   fixedPrecision(number: number) {
      const numberToString = number.toString();
      return ((numberToString.length - numberToString.indexOf('.') - 1) > 6) ? number.toFixed(6) : number;
   }

   stepClick(stepInfo: IStepInfo) {
   }

   nextClick(currentStep: number) {
      this.fundTripService.saveGetQuoteInfo(this.vm);
      if (this.showOperatingHourMessage) {
         this.router.navigate(['dashboard/account/detail/trip/' + this.vm.clientDetails.fromAccount.ItemAccountId]);
      }
   }

}
