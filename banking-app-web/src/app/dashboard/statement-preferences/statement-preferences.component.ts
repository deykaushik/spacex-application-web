import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../core/utils/constants';
import { LoaderService } from '../../core/services/loader.service';
import { StatementPreferencesConstants } from './statement-preferences-constants';
import { IButtonGroup } from '../../core/utils/models';
import {
   IStatementPreferences, IMetaData, IResultData, IApiResponse, IStatementDetails, IToggleButtonGroup, IAlertMessage
} from '../../core/services/models';
import { CommonUtility } from '../../core/utils/common';
import { WindowRefService } from '../../core/services/window-ref.service';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { GAEvents } from '../../core/utils/ga-event';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-statement-preferences',
   templateUrl: './statement-preferences.component.html',
   styleUrls: ['./statement-preferences.component.scss']
})
export class StatementPreferencesComponent extends BaseComponent implements OnInit {
   constants = Constants.VariableValues;
   values = StatementPreferencesConstants.values;
   labels = StatementPreferencesConstants.labels;
   messages = StatementPreferencesConstants.messages;
   informations = StatementPreferencesConstants.informations;
   variableValues = StatementPreferencesConstants.variableValues;
   accountTypes = this.constants.accountTypes;
   accountName: string;
   accountId: string;
   isMobileView: boolean;
   accountNumber: number;
   skeletonMode: Boolean;
   statementDetails: IStatementDetails;
   buttonName: string;
   statementPreferencesDetails: IStatementPreferences;
   buttonGroup: IButtonGroup[] = this.constants.statementPreferenceTypes;
   groupName = this.values.groupName;
   buttonGroupWidth = this.variableValues.maximumButtonWidthForThreeButtons;
   deliveryMode: string;
   alertType: string;
   alertAction: string;
   isShowAlert: boolean;
   message: string;
   toggleButtonGroup: IToggleButtonGroup;
   isUnitTrust = false;
   pattern = Constants.patterns;
   unitTrustEmail: string;
   showConfirmationPopup = false;
   alertMessage: IAlertMessage;
   isUnitTrustButtonDisable = true;
   constructor(private accountService: AccountService,
      private route: ActivatedRoute, private winRef: WindowRefService, private loader: LoaderService, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.statementDetails = {} as IStatementDetails;
      this.loader.show();
      this.statementDetails.isGroupDisabled = true;
      this.statementDetails.inProgress = false;
      this.buttonName = this.labels.save;
      this.isShowAlert = false;
      const selectedAccount = this.accountService.getAccountData();
      if (selectedAccount && selectedAccount.ItemAccountId === this.accountId) {
         this.setAccountData(selectedAccount);
      } else {
         this.accountService.getDashboardAccounts().subscribe((result) => {
            const accountContainer = result.
               find(container => container.Accounts.some(a => a.ItemAccountId === this.accountId.toString()));
            const accountInfo = accountContainer.Accounts
               .find(account => account.ItemAccountId === this.accountId.toString());
            this.setAccountData(accountInfo);
         });
      }
      this.getAccountStatementPreferencesDetails();
      this.isMobileView = (this.winRef.nativeWindow.innerWidth <= Constants.uiBreakPoints.sm) ? true : false;
      this.toggleButtonGroup = {
         buttonGroup: this.buttonGroup,
         buttonGroupWidth: this.buttonGroupWidth,
         groupName: this.groupName,
         isGroupDisabled: false
      };
   }
   // to change the statement preferences delivery mode
   // type of delivery modes - emial, post, Do not send.
   onTypeChange(type) {
      this.isShowAlert = false;
      this.statementPreferencesDetails.deliveryMode = type.value;
      this.validateDeliveryMode(this.statementPreferencesDetails);
   }
   validateDeliveryMode(statementPreferencesDetails: IStatementPreferences) {
      if (statementPreferencesDetails && statementPreferencesDetails.deliveryMode) {
         this.statementDetails.isGroupDisabled = (statementPreferencesDetails.deliveryMode === this.deliveryMode) ? true : false;
      }
   }
   // to set the Account details based on account type.
   setAccountData(accountInfo) {
      this.accountNumber = accountInfo.AccountNumber;
      this.statementDetails.accountType = accountInfo.AccountType;
      this.accountName = accountInfo.AccountName;
      if (this.statementDetails.accountType === this.accountTypes.mfcvafLoanAccountType.code ||
         this.statementDetails.accountType === this.accountTypes.creditCardAccountType.code) {
         this.buttonGroup = [this.buttonGroup[0], this.buttonGroup[1]];
         this.buttonGroupWidth = this.variableValues.maximumButtonWidthForTwoButtons;
      } else if (this.statementDetails.accountType === this.accountTypes.unitTrustInvestmentAccountType.code) {
         this.isUnitTrust = true;
      }
   }
   // to update the statement prefernces details.
   updateStatementPreferences(statementPreferencesDetails: IStatementPreferences) {
      if (!this.statementDetails.isGroupDisabled || this.isUnitTrust) {
         this.statementDetails.inProgress = true;
         this.loader.show();
         if (this.isUnitTrust) {
            statementPreferencesDetails.deliveryMode = 'EMAIL';
         }
         // GAEvent
         const sdpUpdate = Object.assign({}, GAEvents.statementDeliveryPreference.sdpUpdate);
         sdpUpdate.label += this.statementDetails.accountType + '_ProductMode_' + this.statementPreferencesDetails.deliveryMode;
         this.sendEvent(sdpUpdate.eventAction, sdpUpdate.label, null, sdpUpdate.category);

         this.accountService.updateAccountStatementPreferences(statementPreferencesDetails).subscribe((result: IMetaData) => {
            const transactionStatus = CommonUtility.getTransactionStatus(result, Constants.metadataKeys.statementPrefrencesDelivery);
            if (transactionStatus.isValid) {
               this.isShowAlert = true;
               this.accountService.showAlertMessage(this.getSuccessMessage());
               this.statementDetails.isGroupDisabled = true;
               this.isUnitTrustButtonDisable = true;
               this.getAccountStatementPreferencesDetails();
            } else {
               this.isShowAlert = true;
               this.accountService.showAlertMessage(this.getErrorMessage());
               this.statementDetails.isGroupDisabled = false;
            }
            this.statementDetails.inProgress = false;
            this.loader.hide();
         }, (error) => {
            this.statementDetails.inProgress = false;
            this.loader.hide();
            this.statementDetails.isGroupDisabled = false;
            this.buttonName = this.labels.save;
         });
      } else {
         return false;
      }
   }

   // to get the statement perefernces details for different type of accounts.
   // to get the frequency
   getAccountStatementPreferencesDetails() {
      this.accountService.getAccountStatementPreferences(this.accountId).subscribe((reponse: IApiResponse) => {
         if (reponse) {
            this.statementPreferencesDetails = reponse.data;
            if (!this.statementPreferencesDetails.deliveryMode) {
               this.statementPreferencesDetails.deliveryMode = this.values.doNotSend;
            }
            this.deliveryMode = this.statementPreferencesDetails.deliveryMode;
            this.statementPreferencesDetails.itemAccountId = this.accountId;

            if (this.statementPreferencesDetails) {
               if (!this.statementPreferencesDetails.email) {
                  this.statementPreferencesDetails.email = [];
               } else {
                  this.unitTrustEmail = this.statementPreferencesDetails.email[this.variableValues.zero];
               }
            }
            if (this.statementPreferencesDetails.frequency) {
               switch (this.statementPreferencesDetails.frequency.toLowerCase()) {
                  case this.values.monthly.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.monthly;
                     break;
                  case this.values.month.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.monthly;
                     break;
                  case this.values.quarterly.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.quarterly;
                     break;
                  case this.values.quarter.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.quarterly;
                     break;
                  case this.values.halfyearly.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.halfyearly;
                     break;
                  case this.values.biMonthly.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.biMonthly;
                     break;
                  case this.values.biMonth.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.biMonthly;
                     break;
                  case this.values.never.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.never;
                     break;
                  case this.values.unknown.toLowerCase():
                     this.statementPreferencesDetails.frequency = this.values.unknown;
                     break;
                  default:
                     this.statementPreferencesDetails.frequency = this.values.monthly;
               }
            }
            this.loader.hide();
         }
      }, (error) => {
         this.loader.hide();
      });
   }

   isDisable() {
      return (this.statementDetails.isGroupDisabled || !this.statementPreferencesDetails.deliveryMode
         || this.statementDetails.inProgress) ? true : false;
   }

   // to close the success, error information
   onAlertLinkSelected(event) {
      this.isShowAlert = event;
   }

   onEdit() {
      this.statementDetails.isGroupDisabled = false;
      this.isShowAlert = false;
   }

   changeIsGroupDisabled(event) {
      this.statementDetails.isGroupDisabled = event;
      this.onAlertLinkSelected(false);
   }

   getSuccessMessage() {
      return this.alertMessage = {
         showAlert: true,
         displayMessageText: this.messages.updateSuccess,
         action: AlertActionType.Close,
         alertType: AlertMessageType.Success,
      };
   }

   getErrorMessage() {
      return this.alertMessage = {
         showAlert: true,
         displayMessageText: this.messages.updateFail,
         action: AlertActionType.Close,
         alertType: AlertMessageType.Error,
      };
   }
   displayConfirmationPopup() {
      this.showConfirmationPopup = true;
   }

   hideConfirmationPopup() {
      this.showConfirmationPopup = false;
   }

   emailChange() {
      this.isUnitTrustButtonDisable = false;
   }
   confirmUpdateStatementPreferences(prefrencesDetails) {
      this.hideConfirmationPopup();
      if (this.unitTrustEmail) {
         this.updateStatementPreferences(prefrencesDetails);
      } else {
         this.addStatementPreferences(prefrencesDetails);
      }
   }
   // Add preference details
   addStatementPreferences(statementPreferencesDetails: IStatementPreferences) {
      this.statementDetails.inProgress = true;
      this.loader.show();
      if (this.isUnitTrust) {
         statementPreferencesDetails.deliveryMode = 'EMAIL';
      }
      this.accountService.updateAccountStatementPreferences(statementPreferencesDetails).subscribe((result: IMetaData) => {
         const transactionStatus = CommonUtility.getTransactionStatus(result, Constants.metadataKeys.statementPrefrencesDelivery);
         if (transactionStatus.isValid) {
            this.isShowAlert = true;
            this.accountService.showAlertMessage(this.getSuccessMessage());
            this.isUnitTrustButtonDisable = true;
            this.getAccountStatementPreferencesDetails();
         } else {
            this.isShowAlert = true;
            this.accountService.showAlertMessage(this.getErrorMessage());
         }
         this.statementDetails.inProgress = false;
         this.loader.hide();
      }, (error) => {
         this.statementDetails.inProgress = false;
         this.loader.hide();
         this.buttonName = this.labels.save;
      });
   }
}
