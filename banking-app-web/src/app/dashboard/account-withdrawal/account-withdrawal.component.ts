import { Component, OnInit, Input, Output, EventEmitter, Inject, Renderer2, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { IDatePickerConfig } from 'ng2-date-picker';
import { CommonUtility } from '../../core/utils/common';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Constants } from '../../core/utils/constants';
import { IDashboardAccounts, INoticeDetail, INotificationModel, INoticePayload, IAccountInfo } from '../../core/services/models';
import { AccountService } from '../account.service';
import { BeneficiaryService } from './../../core/services/beneficiary.service';
import { Subject, Observable } from 'rxjs/Rx';
import { ISubscription } from 'rxjs/Subscription';
import { SystemErrorService } from './../../core/services/system-services.service';
import { OutofbandVerificationComponent } from './../../shared/components/outofband-verification/outofband-verification.component';
import { NotificationTypes } from '../../core/utils/enums';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { IBank, IBranches, IBeneficiaryData, IContactCardDetail, IContactCard, IAccount } from './../../core/services/models';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';

@Component({
   selector: 'app-account-withdrawal',
   templateUrl: './account-withdrawal.component.html',
   styleUrls: ['./account-withdrawal.component.scss']
})
export class AccountWithdrawalComponent implements OnInit, OnDestroy {

   @Output() transactionFlag = new EventEmitter<boolean>();
   @Input() accountInformation;
   @Input() investmentType;
   @Input() showNoticeFlow: boolean;
   @Input() noticeDetails;
   @Input() accountId: number;
   @Input() firstWitdrawDate: string;
   @Input() isDeleteBtnShow: boolean;
   @Input() productType: number;

   calendarConfig: IDatePickerConfig;
   isOverlayVisible = true;
   labels = Constants.labels;
   nowLabels = this.labels.nowLabels;
   noticeWithdrawal = Constants.messages.noticeWithdrawal;
   closeBtnText = this.labels.cancelText;
   investmentAccount: string;
   accNumber: Number;
   InvestmentNumber: string;
   investmentAmount: number;
   investmentDate: string;
   infoMessage = true;
   allAccounts: IAccountInfo[];
   bsModalRef: BsModalRef;
   account = this.nowLabels.selectAccountLabel;
   accountTypes = Constants.VariableValues.accountTypes;
   investorNumber: number;
   accSelectedType: string;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   formatDate: Moment;
   minDate: Moment;
   investmentAmountLabel: number;
   isDeleteNotice: boolean;
   minPaymentDate = moment();
   isBeneficiary: boolean;
   isSubmit: boolean;
   isAmountValid = true;
   isEnteredAmountValid: boolean;
   isValidDate = true;
   isAccDate: boolean;
   amountLimit: boolean;
   isSelected = true;
   accType: boolean;
   accSelected: boolean;
   branches = [];
   selectedAccounType: string;
   instructionMsg: string;
   selectedDate: string;
   isNoticeSuccess: boolean;
   isRecipient: boolean;
   deleteNoticeValue: number;
   parentNotifying: Subject<INotificationModel> = new Subject();
   selectedAccountType: string;
   isAccountSelected: boolean;
   isRecipientSelected: boolean;
   selectedbusinessday: string;
   isEditNotice: boolean;
   noticeId: string;
   isUpdate: boolean;
   benificiary: string;
   showLoader: boolean;
   partAmount: number;
   clientType: number;
   skeletonMode: boolean;
   beneficiaryReference = '0';
   sortCode = 0;
   isUpdatePage: boolean;
   submitBtnText: string;
   dateFormat = Constants.formats.ddMMYYYY;
   loadRecipient: boolean;
   recipientName: string;
   beneficiaryIndicator: string;
   entryValue: number;
   instructionMsgValues = Constants.VariableValues.noticeOfWithdrawalValues;

   constructor(private accountService: AccountService,
      private beneficiaryService: BeneficiaryService,
      private systemErrorService: SystemErrorService,
      private modalService: BsModalService, private router: Router,
      @Inject(DOCUMENT) private document: Document,
      private clientProfileDetailsService: ClientProfileDetailsService, private render: Renderer2) { }

   ngOnInit() {
      this.render.setStyle(this.document.body, 'overflow-y', 'hidden');
      this.showLoader = true;
      this.submitBtnText = this.nowLabels.submit;
      CommonUtility.topScroll();
      this.benificiary = this.nowLabels.benificiary;
      this.isOverlayVisible = true;
      this.closeBtnText = this.labels.cancelText;
      this.clientProfileDetailsService.clientDetailsObserver.subscribe(response => {
         if (response) {
            this.clientType = parseInt(response.ClientType, 10);
         }
      });
      const getAccounts = this.accountService.getAccountsForNotice().subscribe(result => {
         this.showLoader = false;
         if (result) {
            for (let i = 0; i < result.length; i++) {
               const itemId = parseInt(result[i].itemAccountId, 10);
               if (this.accountId === itemId) {
                  result.splice(i, 1);
                  break;
               }
            }
         }
         this.getAccountDetails(result);
      });
      this.getPartWithdrawalAmount();
      const firstWithdrawDate = this.firstWitdrawDate.split('T');
      this.formatDate = moment(firstWithdrawDate[0]);
      this.calendarConfig = {
         format: Constants.formats.fullDate,
         min: this.formatDate,
      };

      this.investmentAccount = this.investmentType;
      if (this.accountInformation) {
         this.investmentAmountLabel = this.accountInformation.AvailableBalance;
         this.InvestmentNumber = this.accountInformation.AccountNumber;
         this.accNumber = this.accountInformation.AccountNumber.replace(Constants.symbols.hyphenWithoutSpace, Constants.symbols.blankSpace);
      }

      if (this.showNoticeFlow) {
         this.isSubmit = true;
         if (this.noticeDetails) {
            this.investmentAmount = this.noticeDetails.noticeAmount;
            this.investmentDate = this.noticeDetails.noticeDate;
            this.accSelectedType = this.noticeDetails.capitalDisposalAccount.accountType;
            this.investorNumber = this.noticeDetails.capitalDisposalAccount.accountNumber;
            if (this.noticeDetails.beneficiaryIndicator === Constants.VariableValues.openNewAccount.yes) {
               this.isRecipientSelected = true;
               this.isAccountSelected = false;
               this.selectedAccounType = this.nowLabels.isRecipient;
               this.isRecipient = true;
               this.isBeneficiary = true;
               this.isSelected = false;
               this.accType = true;
               this.selectedAccountType = this.noticeWithdrawal.recipient;
               if (this.accSelectedType === Constants.VariableValues.openNewAccount.selectedAccount) {
                  this.recipientName = this.noticeDetails.capitalDisposalAccount.accountName;
               } else {
                  this.recipientName = this.noticeDetails.capitalDisposalAccount.accountType +
                     Constants.symbols.hyphenWithoutSpace + this.noticeDetails.capitalDisposalAccount.accountNumber;
               }
            } else {
               this.selectedAccounType = this.noticeDetails.capitalDisposalAccount.accountType
                  + Constants.symbols.hyphenWithoutSpace + this.noticeDetails.capitalDisposalAccount.accountNumber;
            }
         }

         const date = this.investmentDate.split('T');
         this.account = this.selectedAccounType;
         this.formatDate = moment(date[0]);
         if (this.noticeDetails.beneficiaryIndicator !== Constants.VariableValues.openNewAccount.yes) {
            this.displayMessage(this.noticeDetails.capitalDisposalAccount.accountType);
         }
      } else {
         this.isSubmit = false;
      }
   }

   private getPartWithdrawalAmount() {
      this.accountService.getPartWithdrawalAmount(this.productType).subscribe(response => {
         if (response && response[0]) {
            this.partAmount = response[0].minimumWithdrawalAmount;
            this.entryValue = response[0].entryValue;
         }
      });
   }

   public displayMessage(type) {
      this.isAccountSelected = false;
      this.isRecipientSelected = false;
      this.instructionMsg = this.instructionMsgValues.one;
      switch (type) {
         case this.accountTypes.currentAccountType.code:
            this.selectedAccountType = this.nowLabels.currentAccount;
            break;
         case this.accountTypes.savingAccountType.code:
            this.selectedAccountType = this.nowLabels.savingAccount;
            break;

         case this.accountTypes.investmentAccountType.code:
            this.selectedAccountType = this.nowLabels.investmentAccount;
            break;
         case this.accountTypes.creditCardAccountType.code:
            this.isAccountSelected = true;
            this.isRecipientSelected = false;
            this.selectedAccountType = this.nowLabels.creditCard;
            break;
         case this.accountTypes.homeLoanAccountType.code:
            this.isAccountSelected = true;
            this.isRecipientSelected = false;
            this.selectedAccountType = this.nowLabels.homeLoan;
            break;

         case this.nowLabels.isRecipient:
            this.isRecipientSelected = true;
            this.isAccountSelected = false;
            this.selectedAccountType = this.noticeWithdrawal.recipient;
            break;
      }
   }

   private getAccountDetails(accInfo: IAccountInfo[]) {
      this.allAccounts = accInfo;
      const receipient = { AccountNumber: null, AvailableBalance: null, AccountType: null, nickname: this.nowLabels.isRecipient };
      this.allAccounts.unshift(receipient);
      this.skeletonMode = false;
   }

   setAmountFlag(amountValid, amountLimit, enteredAmount) {
      this.isAmountValid = amountValid;
      this.amountLimit = amountLimit;
      this.isEnteredAmountValid = enteredAmount;
   }
   onAmountChange(value: number) {
      this.investmentAmount = value;
      const remainingAmount = this.investmentAmountLabel - this.investmentAmount;
      if (remainingAmount === 0) {
         this.setAmountFlag(true, false, true);
      } else if (remainingAmount < this.entryValue) {
         this.setAmountFlag(false, true, false);
      } else if (value < this.partAmount) {
         this.setAmountFlag(false, false, false);
      }else {
         this.setAmountFlag(true, false, true);
      }
   }

   onAccountSelect(value) {
      this.account = value;
      if (value === this.nowLabels.selectAccountLabel) {
         this.isSelected = true;
         this.accSelected = true;
         this.isBeneficiary = false;
      } else {
         this.isSelected = false;
         this.accSelected = false;
      }
      if (value === this.nowLabels.isRecipient) {
         this.isBeneficiary = true;
         this.accType = true;
      } else {
         this.isBeneficiary = false;
      }
   }

   onAccountChanged(accDetails: IAccount) {
      if (accDetails.accountType === this.accountTypes.currentAccountType.code ||
         accDetails.accountType === this.accountTypes.savingAccountType.code
         || accDetails.accountType === this.accountTypes.investmentAccountType.code) {
         this.isAccountSelected = false;
         this.isRecipientSelected = false;
      }
      switch (accDetails.accountType) {
         case this.accountTypes.currentAccountType.code:
            this.selectedAccountType = this.nowLabels.currentAccount;
            break;
         case this.accountTypes.savingAccountType.code:
            this.selectedAccountType = this.nowLabels.savingAccount;
            break;
         case this.accountTypes.investmentAccountType.code:
            this.selectedAccountType = this.nowLabels.investmentAccount;
            break;
      }
      if (accDetails.nickname && accDetails.accountNumber) {
         this.investorNumber = accDetails.accountNumber;
         this.accSelectedType = accDetails.accountType;
         if (this.accSelectedType === this.accountTypes.creditCardAccountType.code) {
            this.isAccountSelected = true;
            this.isRecipientSelected = false;
            this.selectedAccountType = this.nowLabels.creditCard;
         } else if (this.accSelectedType === this.accountTypes.homeLoanAccountType.code) {
            this.isAccountSelected = true;
            this.isRecipientSelected = false;
            this.selectedAccountType = this.nowLabels.homeLoan;
         }
         this.isSelected = false;
         this.account = accDetails.nickname + '-' + accDetails.accountNumber;
         if (accDetails.accountType === this.accountTypes.homeLoanAccountType.code ||
            accDetails.accountType === this.accountTypes.creditCardAccountType.code) {
            this.accType = true;
         } else {
            this.accType = false;
         }
      }
      if (accDetails.nickname === this.nowLabels.isRecipient) {
         this.isRecipientSelected = true;
         this.isAccountSelected = false;
         this.selectedAccountType = this.noticeWithdrawal.recipient;
         this.isRecipient = true;
         this.account = accDetails.nickname;
         this.isBeneficiary = true;
         this.isSelected = false;
         this.accType = true;
         this.beneficiaryIndicator = Constants.VariableValues.openNewAccount.yes;
         this.loadRecipients();
      } else {
         this.isRecipient = false;
         this.isBeneficiary = false;
         this.beneficiaryIndicator = Constants.symbols.blankSpace;
      }
   }

   benificiaryChange(name: string) {
      this.isRecipient = true;
      if (this.branches) {
         for (let i = 0; i < this.branches.length; i++) {
            if (name === this.branches[i].displayName) {
               if (this.branches[i].accountType === this.nowLabels.accountTypeU0) {
                  this.beneficiaryReference = '0';
                  this.sortCode = parseInt(this.branches[i].sortCode, 10);
               } else if (this.branches[i].accountType === this.nowLabels.accountTypeBdf) {
                  this.beneficiaryReference = this.branches[i].beneficiaryReference;
                  this.sortCode = this.branches[i].branchCode;
               } else {
                  this.beneficiaryReference = '0';
                  this.sortCode = 0;
               }
               this.isRecipient = false;
               this.accSelectedType = this.branches[i].accountType;
               this.investorNumber = this.branches[i].branchCode;
               break;
            }
         }
      }
   }

   onSubmit() {
      if (!(this.isValidDate || !this.isEnteredAmountValid || this.isSelected || this.isRecipient)) {
         this.isSubmit = true;
         if (this.accType) {
            this.instructionMsg = this.instructionMsgValues.two;
            this.selectedbusinessday = this.noticeWithdrawal.business;
         } else {
            this.instructionMsg = this.instructionMsgValues.one;
            this.selectedbusinessday = this.noticeWithdrawal.oneBusinessDay;
         }
         this.selectedAccounType = this.account;
      }
   }

   amendClick() {
      this.isSubmit = false;
      this.submitBtnText = this.nowLabels.updateNotice;
      this.isUpdatePage = true;
      if (!this.showNoticeFlow) {
         this.formatDate = moment(this.selectedDate);
      }
   }

   close() {
      this.infoMessage = false;
   }

   setDate(value) {
      this.selectedDate = value;
      this.isValidDate = false;
      this.isAccDate = false;
      let month = value.getUTCMonth() + 1;
      let day = value.getDate();
      const year = value.getUTCFullYear();
      if (month < 9) {
         month = '0' + month;
      }
      if (day < 9) {
         day = '0' + day;
      }
      const newdate = year + '-' + month + '-' + day;
      this.investmentDate = newdate;
   }

   confirm() {
      this.showLoader = true;
      const details = {
         investmentNumber: this.InvestmentNumber,
         noticeDate: this.investmentDate,
         noticeAmount: this.investmentAmount,
         accountNumber: this.investorNumber,
         accountType: this.accSelectedType,
         benificiaryRefrence: this.beneficiaryReference,
         sortCode: this.sortCode,
         beneficiaryIndicator: this.beneficiaryIndicator
      };
      this.secureTransaction(details);
   }

   deleteNotices() {
      this.isDeleteNotice = true;
      this.deleteNoticeValue = 1;
   }

   loadRecipients() {
      if (!this.loadRecipient) {
         this.loadRecipient = true;
         const contactCards = this.beneficiaryService.getContactCards();
         const requestArray = [];
         requestArray.push(contactCards);
         Observable.forkJoin(requestArray).subscribe(results => {
            this.createRecipientData(results[0]);
         });
      }
   }

   createRecipientData(beneficiaryData) {
      for (let i = 0; i < beneficiaryData.length; i++) {
         this.branches.push({
            branchName: beneficiaryData[i].contactCardDetails[0].bankName,
            branchCode: beneficiaryData[i].contactCardDetails[0].accountNumber,
            displayName: beneficiaryData[i].contactCardDetails[0].beneficiaryName,
            accountType: beneficiaryData[i].contactCardDetails[0].accountType,
            beneficiaryReference: beneficiaryData[i].contactCardDetails[0].beneficiaryReference,
            sortCode: beneficiaryData[i].contactCardDetails[0].branchCode
         });
      }
   }

   backToDashboard() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   guid() {
      function s4() {
         return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
   }

   secureTransaction(noticeDetail: INoticeDetail) {
      const payload: INoticePayload = {
         requestId: this.guid(),
         notices: [{
            investmentNumber: noticeDetail.investmentNumber,
            noticeDate: noticeDetail.noticeDate,
            noticeAmount: noticeDetail.noticeAmount,
            capitalDisposalAccount:
            {
               accountNumber: noticeDetail.accountNumber,
               accountType: noticeDetail.accountType
            },
            SortCode: noticeDetail.sortCode,
            BeneficiaryReferenceNumber: noticeDetail.benificiaryRefrence,
            beneficiaryIndicator: noticeDetail.beneficiaryIndicator
         }]
      };
      const routeParams = {
         type: 'transfer'
      };
      this.accountService.createNotice(payload, routeParams).subscribe((response) => {
         let responseStatus = '';
         this.showLoader = false;
         const resStatus = response.metadata.resultData[0].resultDetail.find(item =>
            item.operationReference === Constants.metadataKeys.secureTransaction ||
            item.operationReference === Constants.metadataKeys.transaction);
         responseStatus = resStatus ? resStatus.status : '';
         if (responseStatus === Constants.metadataKeys.pending) {
            this.accountService.updateTransactionID(response.metadata.resultData[0].transactionID);
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
               try {
                  this.accountService.getApproveItStatusNow().subscribe(approveItResponse => {
                     this.bsModalRef.content.processApproveItResponse(approveItResponse);
                     this.accountService.updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                  }, (error: any) => {
                  });
               } catch (e) {
               }
            }, (error: any) => {
            });
            this.bsModalRef.content.updateSuccess.subscribe(value => {
               this.accountService.isChangeSuccessful = value;
               if (value) {
                  this.isNoticeSuccess = true;
               }
               CommonUtility.topScroll();
            });
            this.bsModalRef.content.resendApproveDetails.subscribe(() => {
               this.resendApproveDetails(response);
            });
            this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
               this.accountService.getApproveItOtpStatus(otpValue, this.accountService.transactionID)
                  .subscribe(otpResponse => {
                     this.bsModalRef.content.processApproveUserResponse(otpResponse);
                  }, (error: any) => {
                  });
            });
            this.bsModalRef.content.otpIsValid.subscribe(() => {
               this.accountService.getApproveItStatusNow().subscribe(approveItResponse => {
                  this.bsModalRef.content.processApproveItResponse(approveItResponse);
               });
            });
         }
      });
   }

   resendApproveDetails(response) {
      this.accountService.updateTransactionID(response.metadata.resultData[0].transactionID);
      this.bsModalRef.content.processResendApproveDetailsResponse(response);
   }

   closeOverlay(value) {
      if (this.isNoticeSuccess && this.isSubmit) {
         this.accountService.getDashboardAccounts().subscribe(response => {
         });
         this.accountService.getAccountBalanceDetail(this.accountId).subscribe(response => {
         });
      }
      if (this.investmentAmount && this.investmentAmount !== 0 && !this.isSubmit) {
         if (this.isNoticeSuccess) {
            this.transactionFlag.emit(true);
         } else {
            this.isDeleteNotice = true;
            this.deleteNoticeValue = 4;
         }
      } else {
         this.transactionFlag.emit(true);
      }
      this.isEditNotice = false;
      this.showNoticeFlow = false;
   }

   onYesClicked() {
      this.showNoticeFlow = false;
      this.isDeleteNotice = false;
      this.isSubmit = false;
      this.transactionFlag.emit(true);
   }

   onNoClicked() {
      this.isDeleteNotice = false;
   }

   deleteNotice() {
      this.noticeId = this.accountId + '/' + this.noticeDetails.noticeID;
      this.accountService.deleteNotice(this.noticeId).subscribe(response => {
         this.deleteNoticeValue = (response ? 2 : 3);
      });
   }

   cancelNotice() {
      this.isDeleteNotice = false;
   }

   backToOverview() {
      this.isEditNotice = false;
      this.backToDashboard();
   }

   ngOnDestroy() {
      this.render.setStyle(this.document.body, 'overflow-y', 'auto');
   }
}
