import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AccountService } from '../account.service';
import { LoaderService } from '../../core/services/loader.service';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';
import { environment } from '../../../environments/environment';
import { IButtonGroup } from '../../core/utils/models';
import {
   IToggleButtonGroup, IAlertMessage, IClientAccountDetail, IDocumentList,
   IDashboardAccount, IStatementPreferences, IStatementDetails, IApiResponse,
   IOutOfBandResponse
} from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { GAEvents } from '../../core/utils/ga-event';
import { BaseComponent } from '../../core/components/base/base.component';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-statements-documents',
   templateUrl: './statements-documents.component.html',
   styleUrls: ['./statements-documents.component.scss']
})
export class StatementsDocumentsComponent extends BaseComponent implements OnInit {
   labels = Constants.labels.statementAndDocument;
   values = Constants.VariableValues.statementAndDocument;
   messages = Constants.messages.statementAndDocument;
   showStatementsDocument = environment.features.plHlStatementsDocument;
   itemAccountId: string;
   accountName: string;
   accountNumber: number;
   accountType: string;
   buttonGroup: IButtonGroup[];
   type: string;
   toggleButtonGroup: IToggleButtonGroup;
   selectedAccount: IDashboardAccount;
   showAlert: boolean;
   displayMessageText: string;
   action: AlertActionType;
   alertType: AlertMessageType;
   buttonGroupWidth: number;
   documentList: IDocumentList[];
   isHlPlAccount: boolean;
   accountTypes = Constants.VariableValues.accountTypes;
   statementDetails: IStatementDetails;
   approveIt = false;
   statementPreferencesClicked = true;
   transactionID: string;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   alertMessage: IAlertMessage;
   isCasaAccount: boolean;
   isDSAccount: boolean;
   isInvAccount: boolean;
   isCreditCardAccount: boolean;
   showIT3b = environment.features.it3bDocuments;
   showStatementsCASA = environment.features.statementsCASA;

   constructor(private accountService: AccountService, private modalService: BsModalService,
      private route: ActivatedRoute, private loader: LoaderService, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.itemAccountId = params.accountId);
   }

   ngOnInit() {
      this.loader.show();
      this.accountService.currentAlertMessage.subscribe(message => this.setAlertMessage(message));
      this.getAccountDetails();
   }

   getAccountDetails() {
      this.selectedAccount = this.accountService.getAccountData();
      if (this.selectedAccount && this.selectedAccount.ItemAccountId === this.itemAccountId) {
         this.accountType = this.selectedAccount.AccountType;
         this.accountName = this.selectedAccount.AccountName;
         this.accountNumber = this.selectedAccount.AccountNumber;
         this.isHlPlAccount = this.values.hlPlAccount.indexOf(this.accountType) !== -1;
         this.isCasaAccount = CommonUtility.isCasaAccount(this.accountType);
         this.isDSAccount = CommonUtility.isDSAccount(this.accountType);
         this.isInvAccount = CommonUtility.isInvAccount(this.accountType);
         this.isCreditCardAccount = CommonUtility.isCreditCardAccount(this.accountType);
         this.getToggleTabButton();
      }
   }

   getToggleTabButton() {
      this.buttonGroup = [];
      if (this.values.showStatementDocument.indexOf(this.accountType) !== -1 && this.showStatementsDocument) {
         this.getDocumentList();
      }
      if (this.accountType === this.accountTypes.mfcvafLoanAccountType.code) {
         this.showTabForMfcCasa();
      }

      if (this.accountType === this.accountTypes.creditCardAccountType.code) {
         this.showTabForCC();
      }

      if (this.accountType === this.accountTypes.unitTrustInvestmentAccountType.code) {
         this.showTabForINV();
      }

      if (this.accountType === this.accountTypes.investmentAccountType.code && this.showIT3b) {
         this.showTabForInvestment();
      }

      if ((this.accountType === this.accountTypes.currentAccountType.code)
         || (this.accountType === this.accountTypes.savingAccountType.code)) {
         this.showTabForCasa();
      }

      this.toggleButtonGroup = {
         buttonGroup: this.buttonGroup,
         buttonGroupWidth: this.buttonGroupWidth,
         groupName: '',
         isGroupDisabled: false
      };
   }

   showTabForCasa() {
      if (this.showStatementsCASA) {
         this.buttonGroup.push(this.labels.statement);
      }
      if (this.showIT3b) {
         this.buttonGroup.push(this.labels.document);
      }
      this.buttonGroup.push(this.labels.preference);
      if ((this.showStatementsCASA && this.showIT3b) || (this.showStatementsCASA && !this.showIT3b)) {
         this.type = this.labels.statement.value;
      } else if (!this.showStatementsCASA && this.showIT3b) {
         this.type = this.labels.document.value;
      } else {
         this.setPreferences();
      }
      this.loader.hide();
   }

   showTabForMfcCasa() {
      this.buttonGroup.push(this.labels.statement);
      this.buttonGroup.push(this.labels.document);
      this.buttonGroup.push(this.labels.preference);
      this.type = this.labels.statement.value;
      this.loader.hide();
      this.getDocumentList();
   }

   showTabForCC() {
      if (this.showIT3b) {
         this.buttonGroup.push(this.labels.document);
         this.buttonGroup.push(this.labels.preference);
         this.type = this.labels.document.value;
      } else {
         this.buttonGroup.push(this.labels.preference);
         this.type = this.labels.preference.value;
         this.setPreferences();
      }
      this.loader.hide();
   }

   showTabForINV() {
      this.buttonGroup.push(this.labels.preference);
      this.setPreferences();
   }

   showTabForInvestment() {
      this.buttonGroup.push(this.labels.document);
      this.type = this.labels.document.value;
      this.loader.hide();
   }

   setPreferences() {
      this.type = this.labels.preference.value;
      this.loader.hide();
      this.onTypeChange(this.labels.preference);
      this.approveItCheck(true);
   }

   hideMessage() {
      return this.alertMessage = {
         showAlert: false,
         displayMessageText: '',
         action: AlertActionType.Close,
         alertType: AlertMessageType.Error,
      };
   }

   getDocumentList() {
      this.loader.show();
      this.accountService.getDocumentsList(this.itemAccountId)
         .finally(() => {
            this.loader.hide();
         })
         .subscribe((documentList) => {
            if (documentList && documentList.length) {
               if (this.accountType === this.accountTypes.personalLoanAccountType.code) {
                  if (documentList[0].documentDescription === this.values.statement) {
                     this.buttonGroup.push(this.labels.statement);
                     this.type = this.labels.statement.value;
                     this.sendStatementsGAEvent();
                  } else {
                     this.buttonGroup.push(this.labels.document);
                     this.type = this.labels.document.value;
                  }
                  this.documentList = documentList;
               }
               if (this.accountType === this.accountTypes.homeLoanAccountType.code) {
                  this.buttonGroup.push(this.labels.statement);
                  this.buttonGroup.push(this.labels.document);
                  this.type = this.labels.statement.value;
                  this.sendStatementsGAEvent();
                  this.documentList = documentList.slice(0, documentList.length - 1);
               }
               if (this.accountType === this.accountTypes.mfcvafLoanAccountType.code) {
                  this.sendStatementsGAEvent();
                  this.documentList = documentList.slice(0, documentList.length - 1);
               }
            }
         });
   }

   setAlertMessage(alertMessage: IAlertMessage) {
      this.showAlert = alertMessage.showAlert;
      this.displayMessageText = alertMessage.displayMessageText;
      this.action = alertMessage.action;
      this.alertType = alertMessage.alertType;
   }

   onTypeChange(type) {
      this.type = type.value;
      if (this.type === this.labels.statement.value) {
         this.sendStatementsGAEvent();
      }
      this.loader.hide();
      // hide already present global messages on tab change
      this.accountService.showAlertMessage(this.hideMessage());
      if (this.type === this.labels.preference.value) {
         this.onStatementPreferencesClick();
         const sdpView = Object.assign({}, GAEvents.statementDeliveryPreference.sdpView);
         sdpView.label += this.accountType;
         this.sendEvent(sdpView.eventAction, sdpView.label, null, sdpView.category);
      }
      if (this.type === this.labels.statement.value) {
         const statementAction = GAEvents.statementDownload.statementAction;
         this.sendEvent(statementAction.eventAction, statementAction.label, null, statementAction.category);
      }
   }

   /* approveIt functionality start */
   onStatementPreferencesClick() {
      this.loader.show();
      if (this.statementPreferencesClicked) {
         this.statementPreferencesClicked = false;
         this.accountService.getAccountStatementPreferences(this.itemAccountId.toString())
            .subscribe((statementPreferences: IApiResponse) => {
               if (statementPreferences && statementPreferences.metadata.resultData[0].transactionID) {
                  this.transactionID = statementPreferences.metadata.resultData[0].transactionID;
                  this.callApproveIt();
               } else {
                  this.statementPreferencesClicked = true;
                  this.approveItCheck(true);
               }
            }, (error) => {
               this.statementPreferencesClicked = true;
               this.approveItCheck(false);
            });
      }
   }
   /* this function calls when user retry for approve it if any timeout occurs */
   resendApproveDetails() {
      this.accountService.getAccountStatementPreferences(this.itemAccountId.toString())
         .subscribe((statementPreferences: IApiResponse) => {
            if (statementPreferences && statementPreferences.metadata.resultData[0].transactionID) {
               this.transactionID = statementPreferences.metadata.resultData[0].transactionID;
               this.bsModalRef.content.processResendApproveDetailsResponse(statementPreferences);
            } else {
               this.statementPreferencesClicked = true;
               this.approveItCheck(false);
            }
         }, (error) => {
            this.statementPreferencesClicked = true;
            this.approveItCheck(false);
         });
   }
   callApproveIt() {
      this.bsModalRef = this.modalService.show(
         OutofbandVerificationComponent,
         Object.assign(
            {},
            {
               animated: true,
               keyboard: false,
               backdrop: true,
               ignoreBackdropClick: true
            },
            { class: '' }
         )
      );

      this.bsModalRef.content.getApproveItStatus.subscribe(() => {
         this.accountService.
            statusStatementPreferences(this.transactionID).subscribe((statementPreferences: any) => {
               this.transactionID = statementPreferences.metadata.resultData[0].transactionID;
               this.bsModalRef.content.processApproveItResponse(statementPreferences);
            });
      });
      // Show success message if the above API returns success
      this.bsModalRef.content.updateSuccess.subscribe(value => {
         if (value) {
            this.approveItCheck(true);
         } else {
            this.statementPreferencesClicked = true;
            this.approveItCheck(false);
         }
      });
      // Recall approve it if  any timeout while approving the request
      this.bsModalRef.content.resendApproveDetails.subscribe(() => {
         this.resendApproveDetails();
      });
      // To show the OTP screen
      this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
         this.accountService.getApproveItOtpStatus(otpValue, this.transactionID)
            .subscribe((otpResponse: IOutOfBandResponse) => {
               this.bsModalRef.content.processApproveUserResponse(otpResponse);
            });
      });

      // To validate OTP and update the status
      this.bsModalRef.content.otpIsValid.subscribe(() => {
         this.accountService.statusStatementPreferences(this.transactionID).subscribe(approveItResponse => {
            this.bsModalRef.content.processApproveItResponse(approveItResponse);
         });
      });

      this.modalSubscription = this.modalService.onHidden.asObservable()
         .subscribe(() => {
            try {
               this.bsModalRef.content.otpIsValid.unSubscribe();
            } catch (e) { }
            try {
               this.bsModalRef.content.getApproveItStatus.unSubscribe();
            } catch (e) { }

            try {
               this.bsModalRef.content.resendApproveDetails.unSubscribe();
            } catch (e) { }

            try {
               this.bsModalRef.content.updateSuccess.unSubscribe();
            } catch (e) { }

            try {
               this.bsModalRef.content.getOTPStatus.unSubscribe();
            } catch (e) { }
         });
   }

   getApproveItErrorMessage() {
      return this.alertMessage = {
         showAlert: true,
         displayMessageText: 'error',
         action: AlertActionType.Close,
         alertType: AlertMessageType.Error,
      };
   }

   approveItCheck(check) {
      this.loader.hide();
      if (check === true) {
         this.approveIt = true;
      } else {
         this.approveIt = false;
         this.type = this.labels.document.value;
      }
   }
   /* approveIt functionality end */
   onAlertLinkSelected() {
      this.showAlert = false;
   }

   sendStatementsGAEvent() {
      const category = CommonUtility.format(GAEvents.statementsAndDocuments.request.category,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase());
      const eventAction = CommonUtility.format(GAEvents.statementsAndDocuments.request.eventAction,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase(),
               Constants.VariableValues.statementAndDocument.statement.toLowerCase());
      this.sendEvent(eventAction, GAEvents.statementsAndDocuments.request.label, null, category);
   }

   getAccountType(): string {
      return CommonUtility.isMfcvafLoan(this.accountType) ?
         Constants.VariableValues.statementAndDocument.mfc : this.accountType;
   }
}
