import { Observable } from 'rxjs/Rx';
import { FormGroup } from '@angular/forms';
import {
   IMarker, IBranchDetail, IATMDetail, IAccountDetail, IMetaData,
   IResultStatus, IClientDetails, IPlasticCard
} from './../services/models';
import { element } from 'protractor';
import { Constants } from './constants';
import { INotificationItem, IMapData, IBranchLocatorOptions } from './models';
import * as models from '../services/models';
import { HaversineService, GeoCoord } from 'ng2-haversine';
import { DatePipe, Location } from '@angular/common';

import * as atmData from './../../../assets/atms.json';
import * as branchData from './../../../assets/branches.json';
import { LocaleDatePipe } from '../../shared/pipes/locale-date.pipe';
import { IPaymentMetaData, ITransactionMetaData, ITransactionStatus, ITransactionDetail } from '../services/models';
import * as moment from 'moment';
import { Moment } from 'moment';
import { IDatePickerConfig } from 'ng2-date-picker';
import { AbstractControl, NgForm, FormControl } from '@angular/forms';
import { WindowRefService } from '../services/window-ref.service';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';

export class CommonUtility {
   private static windowService = new WindowRefService();
   public static haversineService: HaversineService;
   /* Validates email valid or not */
   public static isValidEmail(email): boolean {
      const regEx = new RegExp(Constants.patterns.email);
      return regEx.test(email);
   }

   /* Validates mobile valid or not */
   public static isValidMobile(number): boolean {
      const regEx = new RegExp(Constants.patterns.mobile);
      return regEx.test(number);
   }

   /* validates text using given pattern */
   public static isValidText(text: string, pattern): boolean {
      const regEx = new RegExp(pattern);
      return regEx.test(text);
   }

   public static isValidInput(formGroup: FormGroup, control: string): boolean {
      return (formGroup.controls[control] && formGroup.controls[control].errors &&
         formGroup.controls[control].errors.pattern && formGroup.controls[control].errors.minlength) ? false : true;
   }

   public static tenDigitMobile(number): string {
      const length = number.length;
      const temp = '0';
      return temp.concat(number.slice(length - 9, length));
   }

   /* Convert any javascript object to dropdown bindable object */
   public static covertToDropdownObject(object: any): Array<any> {
      let key: string, item: any, dropdownBindableObject: Array<any>;
      dropdownBindableObject = [];

      for (key in object) {
         item = {
            name: key,
            value: object[key]
         };
         dropdownBindableObject.push(item);
      }
      return dropdownBindableObject;
   }

   /* Check whether bank is NedBank */
   public static isNedBank(bankName: string) {
      return bankName && bankName.toLowerCase().trim() === Constants.VariableValues.nedBankDefaults.bankName.toLowerCase().trim();
   }

   /* Get style of different account types */
   public static getAccountTypeStyle(accountType: string, containerName?: string) {
      let cssClass;
      switch (accountType) {
         case 'CA':
            cssClass = Constants.accountTypeCssClasses.current;
            break;
         case 'SA':
            cssClass = Constants.accountTypeCssClasses.savings;
            if (containerName === Constants.labels.clubAccountText) {
               cssClass = Constants.accountTypeCssClasses.clubAccount;
            }
            break;
         case 'CC':
            cssClass = Constants.accountTypeCssClasses.creditCard;
            break;
         case 'NC':
         case 'IS':
         case 'HL':
         case 'PL':
            cssClass = Constants.accountTypeCssClasses.loan;
            break;
         case 'TD':
         case 'DS':
         case 'INV':
            cssClass = Constants.accountTypeCssClasses.investment;
            break;
         case 'CFC':
         case 'TC':
            cssClass = Constants.accountTypeCssClasses.foreign;
            break;
         // added for rewards account type
         case 'Rewards':
            cssClass = Constants.accountTypeCssClasses.rewards;
            break;
         default:
            cssClass = Constants.accountTypeCssClasses.other;
      }
      return cssClass;
   }

   /* Get name of account types */
   public static getAccountTypeName(accountType: string): string {
      let name;
      switch (accountType.toLowerCase()) {
         case 'ca':
            name = 'current';
            break;
         case 'sa':
            name = 'savings';
            break;
         case 'cc':
            name = 'credit';
            break;
         case 'nc':
            name = 'nedCredit';
            break;
         case 'is':
            name = 'installment';
            break;
         case 'hl':
            name = 'home loan';
            break;
         case 'pl':
            name = 'personal loan';
            break;
         case 'td':
            name = 'call';
            break;
         case 'ds':
            name = 'investment';
            break;
         case 'inv':
            name = 'NGI investment';
            break;
         case 'np':
            name = 'nedmatic profile';
            break;
         case 'onl':
            name = 'over night loan / nedmatic profile';
            break;
         case 'cfc':
            name = 'customer foreign currency';
            break;
         default:
            name = accountType;
      }
      return name;
   }

   public static getNotificationTypes(): INotificationItem[] {
      return [
         { name: Constants.notificationTypes.email, value: Constants.notificationTypes.email },
         { name: Constants.notificationTypes.Fax, value: Constants.notificationTypes.Fax },
         { name: Constants.notificationTypes.SMS, value: Constants.notificationTypes.SMS },
         { name: Constants.notificationTypes.none, value: Constants.notificationTypes.none },
      ];
   }
   public static getPaymentReasonTypes(residentialStatus: string): INotificationItem[] {
      if (residentialStatus.toLocaleLowerCase() === Constants.residentialStatus.resident) {
         return [
            { name: Constants.paymentReasonTypes.gift.name, value: Constants.paymentReasonTypes.gift.code },
            { name: Constants.paymentReasonTypes.other.name, value: Constants.paymentReasonTypes.other.code },
         ];
      } else {
         return [
            { name: Constants.paymentReasonTypes.migrantWorker.name, value: Constants.paymentReasonTypes.migrantWorker.code },
            { name: Constants.paymentReasonTypes.foreignNational.name, value: Constants.paymentReasonTypes.foreignNational.code },
         ];
      }
   }
   public static getDateString(date: Date): string {
      const datePipe = new DatePipe(Constants.labels.localeString);
      const todaysDate = new Date();
      const dateLabel = 'today.';
      const transformedTodaysDate = datePipe.transform(todaysDate, 'fullDate');
      const transformedDate = datePipe.transform(date, 'fullDate');
      if (transformedTodaysDate === transformedDate) {
         return dateLabel;
      } else {
         return `on ${transformedDate}`;
      }
   }
   public static getLimitTypeDropdownList(): models.IRadioButtonItem[] {
      return Object.keys(Constants.VariableValues.settings.limitTypes).map(key => {
         return { label: key, value: key };
      });
   }
   public static getRepeatType(): models.IRadioButtonItem[] {
      const repeatValues = Constants.VariableValues.repeatType;
      const result = [];
      for (const key in repeatValues) {
         // use key and val
         result.push({ label: repeatValues[key], value: key });
      }
      return result;
   }

   // scheduling journey
   private static getWeeksFromEndDate(selectedDate, endDate): string {
      const eventdate = moment(endDate);
      const todaysdate = moment(selectedDate);
      const weekCount = eventdate.diff(todaysdate, 'weeks') + 1;
      return ('[In ]' + (weekCount === 53 ? 52 : weekCount) + '[ week(s)] ' + '(' + Constants.formats.DDMMYYYY + ')');
   }
   private static getMonthsFromEndDate(selectedDate, endDate): string {
      const eventdate = moment(endDate);
      const todaysdate = moment(selectedDate);
      return ('[In ]' + (eventdate.diff(todaysdate, 'months') + 1) + '[ month(s)] ' + '(' + Constants.formats.DDMMYYYY + ')');
   }

   public static getRepeatDurationText(selectedDate, endDate, frequency): string {
      return (frequency === Constants.recurrenceFrequency.weekly ?
         moment(endDate).format(this.getWeeksFromEndDate(selectedDate, endDate))
         : moment(endDate).format(this.getMonthsFromEndDate(selectedDate, endDate)));
   }
   public static getNextEndDate(selectedDate) {
      return new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), selectedDate.getDate());
   }
   public static getNextDate(selectedDate, count, type) {
      return moment(selectedDate).add(count, type);
   }
   public static getConfig(minDate, maxDate): IDatePickerConfig {
      return {
         format: Constants.formats.fullDate,
         disableKeypress: true,
         showGoToCurrent: false,
         min: minDate,
         max: maxDate,
         monthFormat: Constants.formats.monthFormat,
         openOnFocus: false
      };
   }
   public static getJourneyOccuranceMessage(repeatBy, repeatDefineBy, endDate?, occurance?) {
      let message;
      occurance = isNaN(occurance) ? '' : occurance;
      if (repeatDefineBy === Constants.VariableValues.endDateRepeatType) {
         if (repeatBy === Constants.recurrenceFrequency.weekly) {
            message = `Weekly until ${moment(endDate).format(Constants.formats.DDMMYYYY)}`;
         } else if (repeatBy === Constants.recurrenceFrequency.monthly) {
            message = `Monthly until ${moment(endDate).format(Constants.formats.DDMMYYYY)}`;
         } else {
            message = moment(endDate).format(Constants.formats.DDMMYYYY);
         }
      } else if (repeatDefineBy === Constants.VariableValues.occurencesRepeatType) {
         if (repeatBy === Constants.recurrenceFrequency.weekly) {
            message = `Weekly for ${occurance} occurrence(s)`;
         } else if (repeatBy === Constants.recurrenceFrequency.monthly) {
            message = `Monthly for ${occurance} occurrence(s)`;
         } else {
            message = moment(endDate).format(Constants.formats.DDMMYYYY);
         }
      } else {
         message = '';
      }
      return message;
   }

   public static removeObjectKeyValue(payload) {
      const repeatType = payload.repeatType;
      if (repeatType !== Constants.VariableValues.endDateRepeatType) {
         delete payload.reoccurrenceItem['reoccurrenceToDate'];
      } else {
         delete payload.reoccurrenceItem['reoccurrenceOccur'];
      }
      return payload;
   }

   // scheduling journey

   public static isTransactionStatusValid(metadata: ITransactionMetaData, statusType = Constants.metadataKeys.transaction): boolean {
      let isValid = false;

      // check for transaction success
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference === statusType
                  && x.status === Constants.metadataKeys.success);

            if (transactionDetails) {
               isValid = true;
               break;
            }
         }
      }
      return isValid;
   }

   public static findPaymentRecurrenceDuration(code: string): string {
      let temp = '';
      const frequency = Constants.VariableValues.paymentRecurrenceFrequency;
      for (const property in frequency) {
         if (frequency[property].code === code) {
            temp = frequency[property].duration;
         }
      }
      return temp;
   }
   public static getNumberArray(getNumberArray) {
      return getNumberArray.split(' ');
   }
   public static getLotteryNumberGroup(lotteryNumber) {
      let group;
      switch (true) {
         case (lotteryNumber >= 1 && lotteryNumber <= 13):
            group = 1;
            break;
         case (lotteryNumber >= 14 && lotteryNumber <= 26):
            group = 2;
            break;
         case (lotteryNumber >= 27 && lotteryNumber <= 39):
            group = 3;
            break;
         case (lotteryNumber >= 40 && lotteryNumber <= 52):
            group = 4;
            break;
         default:
            group = 0;
            break;
      }
      return group;
   }

   public static getAcronymName(name: string) {
      const fragments = name.split(' ');
      let acronym = fragments[0].charAt(0).toLocaleUpperCase();
      if (fragments.length > 1) {
         acronym += fragments[fragments.length - 1].charAt(0).toLocaleUpperCase();
      }
      return acronym;
   }

   public static getCapitalizeText(input: string) {
      return input.trim();
   }
   public static format(input: string, ...args: any[]) {
      return input.replace(/{(\d+)}/g, function (match, number) {
         return typeof args[number] !== 'undefined'
            ? args[number]
            : match
            ;
      });
   }

   /*Map utility */
   public static getMarkerClusterStyle() {
      return [{
         textColor: 'white',
         textSize: 20,
         url: 'assets/png/gd-round1.png',
         height: 53,
         width: 53
      },
      {
         textColor: 'white',
         textSize: 20,
         url: 'assets/png/gd-round2.png',
         height: 56,
         width: 56
      },
      {
         textColor: 'white',
         textSize: 20,
         url: 'assets/png/gd-round3.png',
         height: 66,
         width: 66
      },
      {
         textColor: 'white',
         textSize: 20,
         url: 'assets/png/gd-round4.png',
         height: 78,
         width: 78
      }];
   }

   public static removeDuplicate(cloneSource): any {
      const ar = [];
      cloneSource.forEach(item => {
         const isPresent = ar.filter(elem => {
            return elem.longitude === item.longitude && elem.latitude === item.latitude;
         });
         if (isPresent.length === 0) {
            ar.push(item);
         }
      });
      return ar;
   }

   private static showMarkers(element, showAll, currentLocationLatLng, service: HaversineService) {
      const currentLocation = {
         latitude: Number(currentLocationLatLng.latitude),
         longitude: Number(currentLocationLatLng.longitude),
         name: currentLocationLatLng.bankName,
         address: currentLocationLatLng.address
      };
      const elementLocation = {
         latitude: Number(element.latitude.replace(/,/g, '.')),
         longitude: Number(element.longitude.replace(/,/g, '.')),
         name: element.name,
         address: element.address + ', ' + element.suburb + ', ' + element.province
      };
      if (!showAll) {
         return this.checkIfWithinRadius(elementLocation, currentLocation, service);
      } else {
         return elementLocation;
      }
   }

   private static getMarker(element) {
      return {
         latitude: Number(element.latitude.replace(/,/g, '.')),
         longitude: Number(element.longitude.replace(/,/g, '.')),
         name: element.name,
         address: element.address + ', ' + element.suburb + ', ' + element.province,
      };
   }

   public static onBranchLocatorOptionChanged(branchLocatorOption: IBranchLocatorOptions) {
      let source = [];
      if (branchLocatorOption.text.toLowerCase() === Constants.VariableValues.branchLocator.atm.text.toLowerCase()) {
         source = atmData['atms'];
      } else if (branchLocatorOption.text.toLowerCase() === Constants.VariableValues.branchLocator.forexBranch.text.toLowerCase()) {
         source = branchData['branches'].filter(branch => branch.forexService.toLowerCase() === 'yes');
      } else {
         source = branchData['branches'];
      }
      source.forEach((bankSource: any) => {
         bankSource.fullAddress = bankSource.address + ','
            + bankSource.suburb + ',' + bankSource.town + ',' + bankSource.province;
      });
      return source;
   }

   public static transferFromAccounts(accounts) {
      // Case 1 - When no TransferTo Account rules - remove account from FROM List
      return accounts.filter(acc => {
         return (acc.TransferAccountRules && acc.TransferAccountRules.TransferTo &&
            acc.TransferAccountRules.TransferTo.length > 0);
      });
   }

   public static transferToAccounts(fromAccount: IAccountDetail, accountsData: IAccountDetail[]) {
      const fromAccRules = fromAccount.TransferAccountRules && fromAccount.TransferAccountRules.TransferTo;
      let toList = [];
      if (fromAccRules) {
         toList = accountsData.filter((accData) => {
            const rule = fromAccRules.find(m => m.AccountType === accData.accountType);
            if (rule) {
               const existsInCodes: boolean = !!rule.ProductCodes.find(m => m === accData.productCode);
               return rule.ProductAccessType === 'Blocked' ? !existsInCodes : existsInCodes;
            } else {
               return false;
            }
         });
      }
      return toList;
   }

   public static selectSourceType(source): IMapData {
      const markers: IMarker[] = [];
      const currentPosition: IMarker = {
         latitude: Number(source.item.latitude.replace(',', '.')),
         longitude: Number(source.item.longitude.replace(',', '.')),
         name: source.item.name,
         address: source.item.address + ', ' + source.item.suburb + ', ' + source.item.province
      };
      markers.push({
         latitude: currentPosition.latitude,
         longitude: currentPosition.longitude,
         name: currentPosition.name,
         address: currentPosition.address
      });
      return {
         currentLocationLatLng: currentPosition,
         zoom: Constants.mapVariables.defaultZoomLevel,
         markers: markers
      };
   }

   public static populateNearByATMS(selectedBranchOption, showAll: boolean, currentLocationLatLng: IMarker, service: HaversineService) {
      const markers: IMarker[] = [];
      const atms = atmData['atms'];
      const branches = branchData['branches'];
      if (selectedBranchOption.text.toLowerCase() === Constants.VariableValues.branchLocator.atm.text.toLowerCase()) {
         atms.forEach((element) => {
            const location = this.showMarkers(element, showAll, currentLocationLatLng, service);
            if (location) {
               markers.push(this.showMarkers(element, showAll, currentLocationLatLng, service));
            }
         });
      } else {
         branches.forEach((element) => {
            const location = this.showMarkers(element, showAll, currentLocationLatLng, service);
            if (location) {
               markers.push(this.showMarkers(element, showAll, currentLocationLatLng, service));
            }
         });
      }
      return markers;
   }

   public static getAtmMarkers() {
      let markers = [];
      const atms = atmData['atms'];
      if (atms) {
         markers = atms.map((element) => {
            return this.getMarker(element);
         });
      }
      return markers;
   }

   public static getBranchMarkers() {
      let markers = [];
      const branches = branchData['branches'];
      if (branches) {
         markers = branches.map((element) => {
            return this.getMarker(element);
         });
      }
      return markers;
   }

   public static checkIfWithinRadius(elementLocation: GeoCoord, latlng: IMarker, service: HaversineService) {
      const currentLocation = {
         latitude: Number(latlng.latitude),
         longitude: Number(latlng.longitude)
      };
      const distanceInKilometers = service.getDistanceInKilometers(currentLocation, elementLocation);
      if (distanceInKilometers <= Constants.mapVariables.defaultRadiusInkm) {
         return elementLocation;
      }
   }
   public static clone(obj) {
      return JSON.parse(JSON.stringify(obj));
   }

   public static isSameDateAs(date1: Date, date2: Date): boolean {
      return (
         date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
      );
   }

   public static markControlUnTouchedAndPristine(control: AbstractControl) {
      control.markAsUntouched();
      control.markAsPristine();
   }

   public static markControlTouchedAndDirty(control: AbstractControl) {
      if (control) {
         control.markAsTouched();
         control.markAsDirty();
      }
   }

   public static markAllFormControlsUnTouchedAndPristine(form: NgForm) {
      for (const control in form.controls) {
         this.markControlUnTouchedAndPristine(form.controls[control]);
      }
   }

   public static getTransactionStatus(metadata: ITransactionMetaData, statusType: string): ITransactionStatus {
      let isValid = false,
         errorMessage = '',
         status = '',
         result = '';

      // check for transaction success
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference === statusType ||
                  x.operationReference === Constants.metadataKeys.secureTransaction);
            if (transactionDetails) {
               if (transactionDetails.status.toLocaleLowerCase() !== Constants.metadataKeys.failure.toLocaleLowerCase()) {
                  isValid = true;
                  status = transactionDetails.status;
                  break;
               } else {
                  errorMessage = transactionDetails.reason;
                  result = transactionDetails.result;
                  break;
               }
            }
         }
      }
      return {
         isValid: isValid,
         reason: errorMessage,
         status: status,
         result: result
      };
   }

   public static getResultStatus(metadata: IMetaData, statusType: string = ''): IResultStatus {
      let isValid = false,
         errorMessage = '',
         status = '';

      // check for result success
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const resultDetail = metadata.resultData[i].resultDetail
               .find(x => x.operationReference ? x.operationReference === statusType : true);
            if (resultDetail) {
               if (resultDetail.status.toLocaleLowerCase() !== Constants.metadataKeys.failure.toLocaleLowerCase()) {
                  isValid = true;
                  status = resultDetail.status;
                  break;
               } else {
                  errorMessage = resultDetail.reason;
                  break;
               }
            }
         }
      }
      return {
         isValid: isValid,
         reason: errorMessage,
         status: status
      };
   }

   public static markFormControlsTouched(form: NgForm) {
      const controls = form.controls;
      for (const control in controls) {
         if (controls[control] instanceof FormControl) {
            controls[control].markAsTouched();
         }
      }
   }

   public static getID(text: string) {
      return text ? text.replace(/ /g, '_').toLowerCase() : '';
   }

   public static sortByKey(array, key) {
      return array.sort(function (a, b) {
         const x = a[key].toLocaleLowerCase(),
            y = b[key].toLocaleLowerCase();
         return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
   }
   public static removePrintHeaderFooter() {
      const footer = this.windowService.nativeWindow.document.getElementsByClassName('main-footer')[0];
      const header = this.windowService.nativeWindow.document.getElementsByClassName('main-header')[0];
      const mobHeader = this.windowService.nativeWindow.document.getElementsByClassName('sub-menu-mob')[0];
      if (footer && header && mobHeader) {
         footer.classList.add('no-print');
         header.classList.add('no-print');
         mobHeader.classList.add('no-print');
      }

   }
   public static addPrintHeaderFooter() {
      const footer = this.windowService.nativeWindow.document.getElementsByClassName('main-footer')[0];
      const header = this.windowService.nativeWindow.document.getElementsByClassName('main-header')[0];
      const mobHeader = this.windowService.nativeWindow.document.getElementsByClassName('sub-menu-mob')[0];
      if (footer && header && mobHeader) {
         footer.classList.remove('no-print');
         header.classList.remove('no-print');
         mobHeader.classList.remove('no-print');
      }
   }

   public static print(): void {
      this.windowService.nativeWindow.print();
   }
   public static convertNumbertoWords(num): string {

      if (!num) { return ''; }
      const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ',
         'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ',
         'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
      const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

      if ((num = num.toString()).length > 9) { return 'overflow'; }
      const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

      let str = '';
      str += (parseInt(n[1], 10) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
      str += (parseInt(n[2], 10) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
      str += (parseInt(n[3], 10) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
      str += (parseInt(n[4], 10) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
      str += (parseInt(n[5], 10) !== 0) ? ((str !== '') ? 'and ' : '') +
         (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]].trim()) + '' : '';
      return str;
   }

   public static ballBorder(ballNumber: number) {
      if (ballNumber < 14) {
         return Constants.ballBorderColor.ballRedBorder;
      } else if (ballNumber > 13 && ballNumber < 27) {
         return Constants.ballBorderColor.ballYellowBorder;
      } else if (ballNumber > 26 && ballNumber < 40) {
         return Constants.ballBorderColor.ballGreenBorder;
      } else if (ballNumber > 39 && ballNumber < 53) {
         return Constants.ballBorderColor.ballBlueBorder;
      }
   }

   public static isCasaAccount(accountType: string): boolean {
      return accountType === Constants.VariableValues.accountTypes.currentAccountType.code
         || accountType === Constants.VariableValues.accountTypes.savingAccountType.code;
   }

   public static isDSAccount(accountType: string): boolean {
      return accountType === Constants.VariableValues.accountTypes.investmentAccountType.code;
   }

   public static isInvAccount(accountType: string): boolean {
      return accountType === Constants.VariableValues.accountTypes.unitTrustInvestmentAccountType.code;
   }

   public static getBalanceDetailsTemplate(accountType: string, subAccountType: string, isOverdraft = false, containerName?: string) {
      let balanceDetailTemplate = {};
      const investmentType = Constants.labels.account.balanceDetailLabels.investmentType;
      const fields = Constants.balanceDetailTemplate;
      const accountTypes = Constants.VariableValues.accountTypes;
      // implemented switch case based on account type and the corresponding subAccountTypes/conditions
      switch (accountType) {
         case accountTypes.currentAccountType.code:
            if (isOverdraft) {
               balanceDetailTemplate = fields.currentAcOverdraft;
            } else {
               balanceDetailTemplate = fields.currentAcNonOverdraft;
            }
            break;
         case accountTypes.savingAccountType.code:
            balanceDetailTemplate = fields.savingsAc;
            if (containerName === Constants.labels.clubAccountText) {
               balanceDetailTemplate = fields.clubAccount;
            }
            break;
         case accountTypes.investmentAccountType.code:
            switch (subAccountType) {
               case investmentType.fixedInv: balanceDetailTemplate = fields.investmentFixedDs;
                  break;
               case investmentType.linkedInv: balanceDetailTemplate = fields.investmentLinkedDs;
                  break;
               case investmentType.noticeInv: balanceDetailTemplate = fields.investmentNoticeDs;
                  break;
            }
            break;
         case accountTypes.treasuryInvestmentAccountType.code:
            switch (subAccountType) {
               case investmentType.callDfInv: balanceDetailTemplate = fields.investmentCallDf;
                  break;
               case investmentType.noticeDfInv: balanceDetailTemplate = fields.investmentNoticeDf;
                  break;
               case investmentType.fixedDfInv: balanceDetailTemplate = fields.investmentFixedDf;
                  break;
               case investmentType.cfoDfInv: balanceDetailTemplate = fields.investmentCfoDf;
            }
            break;
         case accountTypes.unitTrustInvestmentAccountType.code:
            balanceDetailTemplate = fields.investmentUnitTrust;
            break;
         case accountTypes.foreignCurrencyAccountType.code:
            balanceDetailTemplate = fields.foreignCurrencyAccount;
            break;
         case accountTypes.homeLoanAccountType.code:
         case accountTypes.personalLoanAccountType.code:
            balanceDetailTemplate = fields.loan;
            break;
         case accountTypes.mfcvafLoanAccountType.code:
            balanceDetailTemplate = fields.mfcvafLoanAccount;
            break;
         case accountTypes.creditCardAccountType.code:
            balanceDetailTemplate = fields.creditCard;
      }
      return balanceDetailTemplate;
   }
   public static topScroll() {
      this.windowService.nativeWindow.scrollTo(0, 0);
   }
   public static getPasswordField(isPassword: boolean): string {
      return isPassword ? 'password' : 'text';
   }
   /* This is a utility function which will return the account type description based on the given account type */
   public static getAccountTypeDesc(accountTypeCode: string): string {
      const accountTypes = this.covertToDropdownObject(Constants.VariableValues.shareAccountTypes);
      const accountType = accountTypes.find(accountTypeKey => accountTypeKey.value.code === accountTypeCode);
      if (accountType) {
         return accountType.value.text;
      } else {
         return accountTypeCode;
      }
   }
   public static isMyPocketsAccount(accountType: string, productType: string): boolean {
      return accountType === Constants.VariableValues.accountTypes.savingAccountType.code
         && parseInt(productType, 10) === Constants.myPockets.productType;
   }
   public static replaceAccentCharacters(text) {
      if (!text) {
         return text;
      }
      const result = text.toString().replace(Constants.patterns.recipientsAllowedChars, '');
      return result.replace(/('|`|&)/g, '');
   }
   // To return investor number from investment number passed
   public static getInvestorNumber(investmentNumber: string): string {
      if (investmentNumber.indexOf('-') !== -1) {
         return investmentNumber.split('-')[0];
      }
      return investmentNumber;
   }

   public static isPersonalLoan(accountType: string) {
      return accountType === Constants.VariableValues.accountTypes.personalLoanAccountType.code;
   }

   public static filterTransferableAccounts(accounts) {
      const filterNonTransfer = Constants.VariableValues.filterNonTransferAccounts;
      return accounts.filter(acc => {
         return filterNonTransfer.indexOf(acc.accountType) < 0;
      });
   }

   public static convertStringToNumber(strInput: string): number {
      return parseFloat(strInput);
   }
   /**
    * Get the Id of client based on residentail status if client is resident of
    * SA then return RSA else it's passport number.
    *
    * @static
    * @param {IClientDetails} details
    * @returns {string}    RSA/Passport
    * @memberof CommonUtility
    */
   public static getResidencyBasedClientId(details: IClientDetails): string {
      let id = '';
      if (details.Resident &&
         details.Resident.toLocaleLowerCase() === Constants.countries.za.code) {
         id = details.IdOrTaxIdNo.toString();
      } else {
         id = details.PassportNo;
      }

      return id;
   }
   public static isHomeLoan(accountType: string): boolean {
      return accountType === Constants.VariableValues.accountTypes.homeLoanAccountType.code;
   }
   public static sortTransactionToAscendingOrder(t1: ITransactionDetail, t2: ITransactionDetail) {
      return new Date(new Date(t1.PostedDate.slice(0, t1.PostedDate.indexOf('T')).replace(/-/g, '/'))).getTime()
         - new Date(new Date(t2.PostedDate.slice(0, t2.PostedDate.indexOf('T')).replace(/-/g, '/'))).getTime();
   }

   /*
   returns branch code for nedbank account types
   */
   public static getNedbankSortCode(accountNumber: string, accType: string): string {
      let branchCode;
      const accTypes = Constants.VariableValues.accountTypes;
      if (accType === accTypes.savingAccountType.code) {
         branchCode = accTypes.savingAccountType.sortCode;
      } else if (accType === accTypes.currentAccountType.code) {
         branchCode = accTypes.currentAccountType.sortCode;
      } else if (accType === accTypes.investmentAccountType.code) {
         branchCode = accTypes.investmentAccountType.sortCode;
      } else if (accType === accTypes.homeLoanAccountType.code || accType === accTypes.personalLoanAccountType.code) {
         if (accountNumber.length === 11) {
            branchCode = accTypes.homeLoanAccountType.sortCode11Digits;
         } else if (accountNumber.length === 13) {
            branchCode = accTypes.homeLoanAccountType.sortCode13Digits;
         }
      }
      return branchCode;
   }

   public static checkIfTravelCard(cardNumber: string) {
      // Todo: check with bin number will be removed
      // once we get card type as part of ActionItem
      return (cardNumber.substr(0, 4) === '5299');
   }

   // check whether card is garage card
   public static isGarageCard(card: IPlasticCard): boolean {
      return Constants.labels.garageCardLabel.find(obj => obj === card.plasticType) != null;
   }

   // Check whether card is Active card
   public static isActiveCard(card: IPlasticCard): boolean {
      return Constants.labels.activeCardsReasonCodes.find(activeCardReasonCode => activeCardReasonCode === card.plasticStatusCode) != null;
   }

   public static getTimeInHoursAndSeconds(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      const strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
   }

   public static isMfcvafLoan(accountType: string): boolean {
      return accountType === Constants.VariableValues.accountTypes.mfcvafLoanAccountType.code;
   }

   public static isTransactionSearchApplicable(accountType: string): boolean {
      const accountTypes = Constants.VariableValues.accountTypes;
      return this.isCasaAccount(accountType) || accountType === accountTypes.creditCardAccountType.code ||
         accountType === accountTypes.rewardsAccountType.code || accountType === accountTypes.foreignCurrencyAccountType.code;
   }

   public static isCreditCardAccount(accountType: string): boolean {
      return accountType === Constants.VariableValues.accountTypes.creditCardAccountType.code;
   }

   public static gaAccountType(accountType: string, productType: string): string {
      let accAppend = accountType;
      if (this.isMyPocketsAccount(accountType, productType)) {
         accAppend = Constants.GAEventList.myPocket;
      } else if (productType === Constants.VariableValues.clubAccount.productType) {
         accAppend = Constants.GAEventList.clubAccount;
      }
      return accAppend;
   }

   public static omitSpecialCharacter(event) {
      let k;
      k = event.charCode;
      return((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
   }

   public static convertTncToHtml(textValue) {
      const txt = document.createElement('textarea');
      txt.innerHTML = textValue;
      txt.value = txt.value.replace(TermsAndConditionsConstants.removeSpecialChars, '');

      txt.value = txt.value.replace(new RegExp(TermsAndConditionsConstants.lessThanCode, 'g'),
         TermsAndConditionsConstants.lessThanSign);
      txt.value = txt.value.replace(new RegExp(TermsAndConditionsConstants.greaterThanCode, 'g'),

         TermsAndConditionsConstants.greaterThanSign);
      txt.value = txt.value.replace(TermsAndConditionsConstants.removeNbsp, ' ');
      return txt.value;
   }
}
