import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { StatementPreferencesConstants } from '../statement-preferences-constants';
import { IButtonGroup } from '../../../core/utils/models';
import { IStatementPreferences, IStatementDetails } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { GAEvents } from '../../../core/utils/ga-event';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-statement-preferences-postal',
   templateUrl: './statement-preferences-postal.component.html',
   styleUrls: ['./statement-preferences-postal.component.scss']
})
export class StatementPreferencesPostalComponent extends BaseComponent implements OnInit {

   constants = Constants.VariableValues;
   labels = StatementPreferencesConstants.labels;
   informations = StatementPreferencesConstants.informations;
   @Input() statementDetails: IStatementDetails;
   @Input() buttonName: string;
   @Input() buttonGroup: IButtonGroup[];
   @Input() statementPreferencesDetails: IStatementPreferences;
   @Output() changeStatementPreferencesDetails = new EventEmitter<IStatementPreferences>();
   @Output() changeNotification = new EventEmitter<boolean>();
   isFrequencyInfo: boolean;
   isMfc: boolean;
   isdebitOrderPayer: boolean;
   isEditAddress: boolean;

   constructor (injector:  Injector) {
      super(injector);
   }

   ngOnInit() {
      this.isFrequencyInfo = false;
      this.isMfc = false;
      this.isdebitOrderPayer = false;
      this.isEditAddress = false;
      if (this.statementPreferencesDetails && this.statementPreferencesDetails.postalAddress) {
         if (this.statementPreferencesDetails.postalAddress.addrLines &&
            !(this.statementPreferencesDetails.postalAddress.addrLines.length > 0)) {
            this.statementPreferencesDetails.postalAddress.addrLines = [];
         }
      }
      if (CommonUtility.isCasaAccount(this.statementDetails.accountType)) {
         this.isFrequencyInfo = true;
      } else if (this.statementDetails.accountType === this.constants.accountTypes.mfcvafLoanAccountType.code) {
         this.isMfc = true;
      }
      if (this.statementPreferencesDetails) {
         if (this.statementPreferencesDetails.paymentMethod === 'DEBO') {
            this.isdebitOrderPayer = true;
         }
      }
   }

   // to emit the statement prefernces details
   updateStatementPreferences() {
      this.changeStatementPreferencesDetails.emit(this.statementPreferencesDetails);
      this.changeNotification.emit(this.statementDetails.isGroupDisabled);
   }

   updateStatementPreferencesPostalAddress(statementPreferencesDetails) {
      this.statementPreferencesDetails = statementPreferencesDetails;
   }
   openEditAddress() {
      this.statementDetails.isGroupDisabled = true;
      this.isEditAddress = true;
      this.changeNotification.emit(this.statementDetails.isGroupDisabled);
      const  sdpPostalAddressView  =  Object.assign({},  GAEvents.statementDeliveryPreference.sdpPostalAddressView);
      this.sendEvent(sdpPostalAddressView.eventAction,  sdpPostalAddressView.label,  null,  sdpPostalAddressView.category);
   }
   closeEditAddress() {
      this.statementDetails.isGroupDisabled = false;
      this.isEditAddress = false;
      const  sdpPostalAddressAbort  =  Object.assign({},  GAEvents.statementDeliveryPreference.sdpPostalAddressAbort);
      this.sendEvent(sdpPostalAddressAbort.eventAction,  sdpPostalAddressAbort.label,  null,  sdpPostalAddressAbort.category);
   }

   isDisable() {
      return (this.statementDetails.isGroupDisabled || !this.statementPreferencesDetails.deliveryMode
         || this.statementDetails.inProgress) ? true : false;
   }
}
