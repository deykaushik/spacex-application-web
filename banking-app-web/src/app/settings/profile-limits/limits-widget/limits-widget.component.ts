import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject, Injector } from '@angular/core';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/platform-browser';
import { Subject } from 'rxjs/Rx';

import { CommonUtility } from '../../../core/utils/common';
import { NotificationTypes } from '../../../core/utils/enums';
import { Constants } from './../../../core/utils/constants';
import { ProfileLimitsService } from './../profile-limits.service';

import { ILimitDetail, IRadioButtonItem, INotificationModel, IChangedLimitDetail } from './../../../core/services/models';
import { IRangeSliderConfig, IRangeSliderMessages, IRangeSliderEmitModel } from '../../../shared/models';
import { ILimitWidgetModel, LimitDetail } from '../profile-limits.models';
import { RangeAmountSliderComponent } from '../../../shared/controls/range-amount-slider/range-amount-slider.component';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-limits-widget',
   templateUrl: './limits-widget.component.html',
   styleUrls: ['./limits-widget.component.scss']
})
export class LimitsWidgetComponent extends BaseComponent implements OnInit {

   @Input() limitDetail: ILimitDetail;
   @Input() skeletonMode: Boolean = false;
   @Input() notifystatusToChild: Subject<INotificationModel>;
   @Input() allLimits: ILimitDetail[];
   @Output() updateTempLimit = new EventEmitter<ILimitDetail>();
   @Output() updatePermanentLimit = new EventEmitter<ILimitDetail>();

   private tempLimitSubject = new Subject<IRangeSliderEmitModel>();
   private initialDate = '';
   private initiallimitType = '';
   private tempLimitPropertySubject = new Subject<boolean>();
   private settingsConstants = Constants.VariableValues.settings;
   private limitTypesConstant = this.settingsConstants.limitTypes;
   public widgetTypesConstant = this.settingsConstants.widgetTypes;
   private formats = Constants.formats;
   private isAmountValid: boolean;
   isButtonLoader = false;
   isMessageOpened = false;
   notification: INotificationModel;
   notificationTypes = NotificationTypes;
   limitTypes: IRadioButtonItem[];
   vm: ILimitWidgetModel;
   limitSliderConfig: IRangeSliderConfig;
   temporaryDates = [];
   isValid = true;
   minAmount = 100;
   errorMessages: IRangeSliderMessages;
   constructor(private service: ProfileLimitsService, @Inject(DOCUMENT) private document: Document, injector: Injector) {
      super(injector);
   }
   addUpdatedLimits(amountObj: IRangeSliderEmitModel) {
      const limitdetail: IChangedLimitDetail = { limitDetail: this.limitDetail, status: !amountObj.isValid ? 'Invalid' : '' };
      this.updateLimitList(amountObj, limitdetail);
   }
   private updateLimitList(amountObj, limitdetail: IChangedLimitDetail) {
      const limitvalue = this.limitDetail.isTempLimit ? this.limitDetail.tempDailyLimit : this.limitDetail.dailyLimit;
      if (limitvalue === amountObj.value) {
         this.service.NotifyupdatedLimitChange(limitdetail);
      } else {
         this.limitDetail.newLimit = amountObj.value;
         this.service.NotifyupdatedLimitChange(limitdetail, true);
      }
   }

   ngOnInit() {
      this.setErrorMessages();
      this.initializeSliderConfig();
      this.intializeLimitTypes();
      this.vm = this.service.getLimitsWidgetVm(this.limitDetail.limitType);
      this.vm = this.skeletonMode ? { displayLimit: 0, type: '', headerText: '', limitTypeSelected: '' } : this.vm;
      this.setLimitTypeSelected();
      this.selectCurrentLimit();

      this.setCalendarConfig();
      this.setTemporaryDates();

      this.notifystatusToChild.subscribe((notifyObj: INotificationModel) => {
         if (this.limitDetail.limitType && this.limitDetail.limitType === notifyObj.sectionName) {
            this.notification = notifyObj;
            this.isButtonLoader = false;
            this.isMessageOpened = !!this.notification.message;
            this.errorMessages.serviceErrorMessage = this.notification.serviceErrorMessage || '';
         }
      });
      this.tempLimitSubject.subscribe(this.addUpdatedLimits.bind(this));
      this.tempLimitPropertySubject.subscribe(
         this.limitValueChanged.bind(this)
      );
   }

   setErrorMessages() {
      this.errorMessages = {
         divisibleMsg: 'Please enter a value in multiples of',
         maximumMsg: 'Please enter a value less than or equal to the maximum limit',
         requiredMsg: 'Amount is required.'
      };
   }
   onLimitTypeChange(limitType: IRadioButtonItem) {
      this.vm.limitTypeSelected = limitType.value;
      this.setTempLimit();
      this.selectCurrentLimit();
      if (this.vm.limitTypeSelected === Constants.VariableValues.settings.limitTypes.Temporary) {
         this.setStartDate(this.vm.limitEndDate);
      }
      this.tempLimitPropertySubject.next(true);
   }

   onLimitChange(amountObj: IRangeSliderEmitModel) {
      if (amountObj.value) {
         this.isAmountValid = amountObj.isValid;
         this.isValid = this.validateLimitValue(amountObj.value) && amountObj.isValid;
      } else {
         this.isAmountValid = false;
         this.isValid = false;
      }
      this.tempLimitSubject.next({ value: amountObj.value, isValid: this.isValid });
      this.onCloseMessage(false);
   }

   onCloseMessage(isOpened: boolean) {
      this.isMessageOpened = isOpened;
      this.errorMessages.serviceErrorMessage = isOpened ? this.errorMessages.serviceErrorMessage : '';
   }
   onSliderEnd(amountObj: IRangeSliderEmitModel) {
      if (amountObj.value) {
         this.isAmountValid = amountObj.isValid;
         this.isValid = this.validateLimitValue(amountObj.value) && amountObj.isValid;
      } else {
         this.isAmountValid = false;
         this.isValid = false;
      }
      this.tempLimitSubject.next({ value: amountObj.value, isValid: this.isValid });
   }
   validateLimitValue(value): boolean {
      let valid = false;
      this.errorMessages.customMsg = '';
      switch (this.limitDetail.limitType) {
         case this.widgetTypesConstant.instantpayment:
         case this.widgetTypesConstant.lotto:
         case this.widgetTypesConstant.prepaid:
         case this.widgetTypesConstant.sendimali:
            {
               valid = this.checkDependentLimits(value);
               if (!valid) {
                  this.errorMessages.customMsg = this.settingsConstants.extraErrorMsgs
                     .forOthers[this.limitDetail.limitType];
               }
               break;
            }
         case this.widgetTypesConstant.payment: {
            valid = this.checkPaymentLimit(value);
            if (!valid) {
               this.errorMessages.customMsg = this.settingsConstants.extraErrorMsgs.forPayment;
            }
            break;
         }
         default: {
            valid = true;
         }
      }
      return valid;
   }
   setDate($event) {
      const limitEndDate = moment($event);
      this.limitDetail.tempLimitEnd = limitEndDate.format(this.formats.momentYYYYMMDD);
      this.vm.expiresOn = limitEndDate.format(this.formats.momentDDMMMYYYY);
      this.updateLimitTypesList();
      this.initialDate = this.service.getLimitEndDateDetail(this.limitDetail.limitType);
      let isValueChanged = this.initialDate !== '' && (moment(this.initialDate)).
         format(this.formats.momentYYYYMMDD) !== this.limitDetail.tempLimitEnd;
      if (!isValueChanged && this.service.updatedlimits && this.service.updatedlimits.limits &&
         this.service.updatedlimits.limits.some(i => i.limitDetail.limitType === this.limitDetail.limitType)) {
         isValueChanged = true;
      }
      this.tempLimitPropertySubject.next(isValueChanged);
   }
   // set startDate
   setStartDate(limitDate: any) {
      const limitStartDate = limitDate;
      this.vm.expiresOn = limitStartDate.format(this.formats.momentDDMMMYYYY);
      const tempLimit = this.limitTypes.find(m => m.value === Constants.VariableValues.settings.limitTypes.Temporary);
      tempLimit.subTitle = CommonUtility.format(Constants.labels.expiresOn, this.vm.expiresOn.toString());
   }

   saveTemporaryLimit() {
      if (this.validateLimitValue(this.limitDetail.newLimit) && this.isAmountValid) {
         this.isValid = true;
         this.isButtonLoader = true;
         this.updateTempLimit.emit(this.limitDetail);
         this.setTemporaryDates();
      } else {
         this.isValid = false;
      }
   }

   private initializeSliderConfig() {
      this.limitSliderConfig = {
         min: this.minAmount,
         max: this.limitDetail.maxDailyLimit,
         step: 100
      };
   }

   private checkDependentLimits(value: number): boolean {
      let valid = false;
      let paymentLimit = this.allLimits.find(m => m.limitType === this.widgetTypesConstant.payment);
      let paymentValue = paymentLimit.isTempLimit ?
         paymentLimit.tempDailyLimit || this.minAmount : paymentLimit.dailyLimit || this.minAmount;
      if (this.service.updatedlimits && this.service.updatedlimits.limits.length > 0 &&
         this.service.updatedlimits.limits.some(i => i.limitDetail.limitType === this.widgetTypesConstant.payment)) {
         paymentLimit = this.service.updatedlimits.limits.filter(i => i.limitDetail.limitType ===
            this.widgetTypesConstant.payment)[0].limitDetail;
         paymentValue = paymentLimit.newLimit;
      }

      valid = value <= paymentValue;
      return valid;
   }
   private checkPaymentLimit(paymentLimit: number): boolean {
      let valid = false;
      const dependentLimits = this.allLimits.filter(m =>
         m.limitType === this.widgetTypesConstant.instantpayment
         || m.limitType === this.widgetTypesConstant.lotto
         || m.limitType === this.widgetTypesConstant.prepaid
         || m.limitType === this.widgetTypesConstant.sendimali
      );
      dependentLimits.map(i => {
         if (this.service.changedLimits && this.service.changedLimits.length > 0 &&
            this.service.changedLimits.some(j => j.limitDetail.limitType === i.limitType)) {
            const changedLimit = this.service.changedLimits.filter(j => j.limitDetail.limitType === i.limitType)[0];
            i.tempDailyLimit = changedLimit.limitDetail.tempDailyLimit;
            i.dailyLimit = changedLimit.limitDetail.dailyLimit;
         }
      }
      );

      for (let i = 0; i < dependentLimits.length; i++) {
         let limitValue = dependentLimits[i].isTempLimit ?
            dependentLimits[i].tempDailyLimit || this.minAmount : dependentLimits[i].dailyLimit || this.minAmount;
         const limitType = dependentLimits[i].limitType;
         if (this.service.changedLimits && this.service.changedLimits.length > 0 &&
            this.service.changedLimits.some(j => j.limitDetail.limitType === limitType)) {
            limitValue = dependentLimits[i].newLimit;
         }

         valid = paymentLimit >= limitValue;
         if (!valid) {
            break;
         }
      }
      return valid;
   }
   private intializeLimitTypes() {
      this.limitTypes = CommonUtility.getLimitTypeDropdownList();
   }

   private selectCurrentLimit() {
      this.vm.displayLimit = this.limitDetail.newLimit = this.limitDetail.isTempLimit ?
         this.limitDetail.tempDailyLimit || this.minAmount : this.limitDetail.dailyLimit || this.minAmount;
      this.isValid = this.validateLimitValue(this.limitDetail.newLimit);
      this.isAmountValid = !!this.isValid;
   }

   private setTempLimit() {
      this.limitDetail.isTempLimit = this.vm.limitTypeSelected === this.limitTypesConstant.Temporary;
   }

   private setLimitTypeSelected() {
      this.vm.limitTypeSelected = this.limitDetail.isTempLimit
         ? this.limitTypesConstant.Temporary
         : this.limitTypesConstant.Permanent;
   }

   private setTemporaryDates() {
      const limitStartDate = moment();
      const limitEndDate = this.limitDetail.tempLimitEnd ? moment(this.limitDetail.tempLimitEnd) : moment().add(1, 'days');
      this.vm.limitStartDate = limitStartDate.format(this.formats.fullDate);
      this.vm.limitEndDate = limitEndDate;
      this.vm.expiresOn = limitEndDate.format(this.formats.momentDDMMMYYYY);
      this.updateLimitTypesList();
   }

   private setCalendarConfig() {
      this.vm.minEndDate = moment().add(1, 'days');
      this.vm.maxEndDate = moment().add(30, 'days');

      this.vm.calendarConfig = {
         format: Constants.formats.fullDate,
         disableKeypress: true,
         showGoToCurrent: false,
         min: this.vm.minEndDate,
         max: this.vm.maxEndDate,
         monthFormat: Constants.formats.monthFormat,
         openOnFocus: false
      };
   }
   private updateLimitTypesList() {
      const tempLimit = this.limitTypes.find(m => m.value === Constants.VariableValues.settings.limitTypes.Temporary);
      tempLimit.subTitle = CommonUtility.format(Constants.labels.expiresOn, this.vm.expiresOn.toString());
   }

   limitValueChanged(isValueChanged: boolean) {
      const limitdetail: IChangedLimitDetail = {
         limitDetail: this.limitDetail,
         status: !this.isValid ? Constants.VariableValues.settings.labels.Invalid : ''
      };
      if (this.service.updatedlimits && this.service.updatedlimits.limits && this.service.updatedlimits.limits.length > 0) {
         for (let i = 0; i < this.service.updatedlimits.limits.length; i++) {
            if (this.service.updatedlimits.limits[i].limitDetail.limitType === this.limitDetail.limitType) {
               this.service.updatedlimits.limits[i] = JSON.parse(JSON.stringify({ limitDetail: this.limitDetail, status: '' }));
               break;
            }
         }
      }
      this.service.NotifyupdatedLimitChange(limitdetail, isValueChanged);
   }
}
