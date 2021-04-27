import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../account.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import {
   IDashboardAccounts, IDashboardAccount, ITransactionDetailsData, IApiResponse, IOutOfBandResponse, IHomeLoanStatus
} from '../../core/services/models';
import {
   ITransactionDetail, IAccountDetail, IAccountBalanceDetail, ISettlementDetail,
   ISettlementFeatureVisibleProps, INoticePayload, IAccountInfo, ITravelCardPriorityDetails, IViewNoticeDetails
} from '../../core/services/models';
import { IAccountConfig } from './../dashboard.model';
import { transactionsData, accountData } from './../../core/data/skeleton-data';
import { BaseComponent } from '../../core/components/base/base.component';
import { environment } from '../../../environments/environment';
import { Constants } from './../../core/utils/constants';

import { CommonUtility } from '../../core/utils/common';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { PreFillService } from '../../core/services/preFill.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { GAEvents } from './../../core/utils/ga-event';

@Component({
   selector: 'app-account-detail',
   templateUrl: './account-detail.component.html',
   styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent extends BaseComponent implements OnInit {
   accountId: number;
   transactions: ITransactionDetail[];
   temporaryTransactions: ITransactionDetail[];
   filteredTransactions: ITransactionDetail[];
   graphTransactions: ITransactionDetail[];
   accountDetails: IAccountDetail;
   accountType: string;
   lastBalance = 0;
   lastAmountDeducted = 0;
   balance: number;
   accountNumber: number;
   pockets: ITravelCardPriorityDetails[];
   removeDebitOrderFlag: boolean;
   availableBalance: number;
   accountContainers: IDashboardAccounts[];
   skeletonMode: boolean;
   currency: string;
   transactionDetailsData: ITransactionDetailsData;
   itemAccountId: number;
   featureVisible: boolean;
   containerName: string;
   removeTypes = Constants.VariableValues.filterNonTransferAccounts;
   accountTypes = Constants.VariableValues.accountTypes;
   statementPreferencesTitle = Constants.labels.statementPreferencesTitle;
   isStatementPreferencesVisible: boolean;
   statementPreferencesToggle = environment.features.statementPreferences;
   showShareAccount = environment.features.accountShare;
   showTravelCardAccount = environment.features.travelCardAccount;
   showTravelCardTrips = environment.features.travelCardTrips;
   redemptionToggle = environment.features.redemption;
   chargesAndFeeToggle = environment.features.chargesAndFeeToggle;
   showPlHlStatementsDocument = environment.features.plHlStatementsDocument;
   labels = Constants.labels;
   investment = this.accountTypes.investmentAccountType.code;
   routeUrls = Constants.routeUrls;
   settlementDetails: ISettlementDetail;
   settlementFeatureProps: ISettlementFeatureVisibleProps;
   settlementToggle = environment.features.settlement;
   settlementQuoteBtnLbl = Constants.labels.settlement.quoteRequest.getQuoteBtn;
   isErrorShown: boolean;
   isSuccess: boolean;
   isDormantAccount: boolean;
   alertType: string;
   alertAction: string;
   isTransactionAccount: boolean;
   visibilityError: string;
   emptyStateUrl = Constants.links.nedBankEmptyStatePage;
   transactionHistory = Constants.messages.transactionHistory;
   isProvisional: boolean;
   showMoreTransactionsButton: boolean;
   transactionHistoryFailed: boolean;
   showLoader: boolean;
   isCasaAccount: boolean;
   message: string;
   noMoreTransactions: boolean;
   accountInformation: IAccountInfo;
   investmentType: string;
   isNoticeWithdrawal: boolean;
   settlementMfcToggle = environment.features.settlementMfc;
   isGreenbacksAccount: boolean;
   hasUnitTrustsInvAccount: boolean;
   transactionID: string;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   statementPreferencesClicked: boolean;
   isViewNotices: boolean;
   allNotices: IViewNoticeDetails[];
   showNoticeFlow: boolean;
   noticeDetails: INoticePayload;
   isNow: boolean;
   requestPayOut: boolean;
   buildingLoanBalance: IAccountBalanceDetail;
   homeLoanSkeletonMode: boolean;
   analyticsConstants = Constants.GAEventList.click;
   showRequestBuildingLoan: boolean;
   showMfcDebitOrder: boolean;
   showStatementsDocument = environment.features.statementsDocuments;
   productType: string;
   showMFCDebitOrder: boolean;
   showLoanDebitOrder: boolean;
   showMFCPaymentDetails = environment.features.mfcPaymentDetails;
   showLoanPaymentDetails = environment.features.loanPaymentDetails;
   firstWithdrawalDate: Date;
   isViewSubmittedNotice: boolean;
   debitOrderLabel = Constants.labels.debitOrders;
   isNoticeFlag = environment.features.noticeOfWithdrawal;
   managePaymentLabel = Constants.labels.loanDebitOrder.managePaymentDetails;
   cardsTabAccessedProdTypeGAEvent = GAEvents.cardFeatures.cardsTabAccessProdtype;
   statementPreferencesMFCToggle = environment.features.statementPreferencesMFC;
   deleteNotice: boolean;
   searchMode: boolean;
   requestPayOutToggle = environment.features.requestBuildingLoanPayment;
   settlementHlToggle = environment.features.settlementHl;
   isStatementAndDocument = true;
   isCreditCard: boolean;
   requestCreditLimitToggle = environment.features.requestCreditLimitIncrease;
   showOpenNewAccount = environment.features.openNewAccount;
   manageLoanToggle = environment.features.manageLoan; // Env toggle for Manage Loan feature
   manageLoan: boolean; // Flag to show/hide Manage Loan feature
   manageLoanSkeletonMode: boolean;  // skeleton loader of Manage Loan feature
   isOpenNewAccount: boolean;
   showIT3B = environment.features.it3bDocuments;

   constructor(private accountService: AccountService, private route: ActivatedRoute, injector: Injector,
      private systemErrorService: SystemErrorService, private router: Router,
      private modalService: BsModalService, private prefillService: PreFillService) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.showRequestBuildingLoan = false;
      this.statementPreferencesClicked = true;
      this.isStatementPreferencesVisible = false;
      this.getAccountData();
      this.accountService.transactionSearchModeEmitter.subscribe(response =>
         this.setSearchMode(response)
      );
      this.getInvestmentType();
   }

   getInvestmentType() {
      if (this.isNoticeFlag) {
         this.showNotices();
         this.accountService.getBalanceDetails(this.accountId).subscribe((response) => {
            if (response && response.data && response.data.investmentDetailsList) {
               this.productType = response.data.investmentDetailsList[0].investmentProductType;
               this.investmentType = response.data.investmentDetailsList[0].investmentProductName;
            }
         });
      }
   }

   onAccountChange(account: IDashboardAccount, containerName?: string) {
      this.containerName = containerName;
      this.accountNumber = account.AccountNumber;
      this.skeletonMode = true;
      this.accountType = account.AccountType;
      this.requestPayOut = false;
      this.firstWithdrawalDate = account.FirstAvailableWithdrawalDate;
      this.isViewSubmittedNotice = (account.AccountType === this.investment);
      if (this.accountType === this.labels.travelCardAccountTypeShortName) {
         this.getPockets(this.accountNumber);
      }
      if (account.MaintainOptions) {
         this.submitNotice(account.MaintainOptions.PlaceNotice, account.MaintainOptions.DeleteNotice);
      }

      this.accountId = parseInt(account.ItemAccountId, 10);
      this.balance = account.Balance;
      this.availableBalance = account.AvailableBalance;
      this.isGreenbacksAccount = account.RewardsProgram === this.labels.gbtype;
      this.accountType = account.AccountType;
      this.productType = account.ProductType;
      this.setPreferencesOption(this.accountType);
      this.isCasaAccount = CommonUtility.isCasaAccount(this.accountType);
      this.removeDebitOrderFlag = (this.accountType !== Constants.VariableValues.accountTypes.creditCardAccountType.code ? false : true);
      this.isCreditCard = CommonUtility.isCreditCardAccount(this.accountType);
      this.getFilteredTypeAccounts(this.accountType, this.productType);
      // this.pockets = account.Pockets ? account.Pockets : [];
      this.showMFCDebitOrder = CommonUtility.isMfcvafLoan(this.accountType);
      this.showLoanDebitOrder = CommonUtility.isHomeLoan(this.accountType) || CommonUtility.isPersonalLoan(this.accountType);
      this.loanDebitOrderLabel();

      // Settlement features
      if (this.settlementToggle && account && CommonUtility.isPersonalLoan(account.AccountType)) {
         this.getSettlemetDetails(account);
      } else if (this.settlementMfcToggle && account && CommonUtility.isMfcvafLoan(account.AccountType) && account.Balance > 0) {
         this.settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
         this.settlementFeatureProps.showSettlementQuoteBtn = true;
      } else if (CommonUtility.isHomeLoan(account.AccountType) && (this.requestPayOutToggle || this.settlementHlToggle)) {
         this.getHomeLoanBalanceDetails();
      } else {
         this.settlementFeatureProps = undefined;
      }

      this.getTransactionsData();
      this.isTransactionAccount = this.accountType === Constants.VariableValues.accountTypes.investmentAccountType.code;
      // on account change, clear the transactions stored in service
      this.accountService.setTransactionsForCASA([]);
      this.transactionHistoryFailed = false;
      this.noMoreTransactions = false;
      this.showLoader = false;
      this.searchMode = false;

      if (this.manageLoanToggle && CommonUtility.isHomeLoan(this.accountType)) {
         this.isManageLoan();
      } else {
         this.manageLoan = false;
      }
      this.isOpenNewAccount = this.accountType === this.accountTypes.investmentAccountType.code;
      this.showNotices();
   }
   loanDebitOrderLabel() {
      const values = Constants.labels.loanDebitOrder;
      this.managePaymentLabel = this.showMFCDebitOrder ? values.managePaymentDetails : values.viewPaymentDetails;
   }
   setMFCDetails() {
      const managePaymentDetails = Object.assign({}, GAEvents.managePaymentDetails.mfcPaymentDetailsClicked);
      this.sendEvent(managePaymentDetails.eventAction, managePaymentDetails.label,
         null, managePaymentDetails.category);
   }
   setHomeLoanDetails() {
      const homeLoanDetails = Object.assign({}, GAEvents.managePaymentDetails.homeLoanDetails);
      this.sendEvent(homeLoanDetails.eventAction, homeLoanDetails.label,
         null, homeLoanDetails.category);
   }
   setPersonalLoanDetails() {
      const personalLoanDetails = Object.assign({}, GAEvents.managePaymentDetails.personalLoanDetails);
      this.sendEvent(personalLoanDetails.eventAction, personalLoanDetails.label,
         null, personalLoanDetails.category);
   }
   setPreferencesOption(accountType: string) {
      this.isStatementPreferencesVisible = (CommonUtility.isCasaAccount(accountType)
         && this.productType !== Constants.VariableValues.clubAccount.productType)
         || accountType === this.accountTypes.creditCardAccountType.code
         || CommonUtility.isMfcvafLoan(accountType)
         || accountType === this.accountTypes.unitTrustInvestmentAccountType.code
         || (accountType === this.accountTypes.investmentAccountType.code && this.showIT3B)
         || (accountType === this.accountTypes.homeLoanAccountType.code && this.showPlHlStatementsDocument)
         || (accountType === this.accountTypes.personalLoanAccountType.code && this.showPlHlStatementsDocument);
   }
   getFilteredTypeAccounts(type: string, productType: string) {
      if (this.removeTypes.indexOf(type) >= 0 || productType === Constants.VariableValues.clubAccount.productType) {
         this.featureVisible = false;
      } else {
         this.featureVisible = true;
      }
   }

   getPocketBalance(currency: string) {
      if (this.pockets && this.pockets.length && currency) {
         const pocket = this.pockets.find((key) => key.currency.currency === currency);
         return pocket && pocket.currency.amount ? pocket.currency.amount : 0;
      } else {
         return 0;
      }
   }

   getPockets(accountNumber: number) {
      this.accountService.getPockets(this.accountNumber).subscribe((response) => {
         this.pockets = response;
      });
   }

   getTransactionsData() {
      // TODO - confirm how to handle scenarios when user manually enters an account in URL which is invalid
      this.transactions = transactionsData;
      this.graphTransactions = [];
      // for casa accounts, for the first time api call, isProvisional flag should be set to true
      this.isProvisional = this.isCasaAccount ? true : false;

      this.accountService.getAccountTransactions(this.accountId, this.isProvisional).subscribe((data) => {
         // if status code received from api is other than R00 sucesss, metadata will be send from the service.
         // if received metadata, set data as empty array to show no transaction yet screen, since other error handling is not available
         if (data.resultData) {
            data = [];
         }
         this.transactions = this.updateRunningBalance(data);
         this.updateLastRunningBalanceAndAmount(data);
         this.skeletonMode = false;
         // for casa accounts, if data is received as empty array, view more transactions button should not be displayed
         this.showMoreTransactionsButton = this.isCasaAccount && data.length ? true : false;
      });

      this.accountService.getGraphTransactions(this.accountId, this.accountType).subscribe((data) => {
         const transactions = this.updateRunningBalance(data);
         // for graph, transactions should be sent in the ascending order to graph component,
         // and from api we receive data in descending order, hence reversing the sequence
         this.graphTransactions = [...transactions].reverse();
         this.transactionDetailsData = {
            itemAccountId: this.accountId,
            balance: this.balance,
            accountContainers: this.accountContainers,
         };
         this.skeletonMode = false;
      });
   }
   updateLastRunningBalanceAndAmount(transactions: ITransactionDetail[]) {
      if (transactions && transactions.length) {
         this.lastBalance = transactions[this.transactions.length - 1].RunningBalance;
         this.lastAmountDeducted = transactions[this.transactions.length - 1].Amount;
      }
   }

   updateRunningBalance(transactions: ITransactionDetail[], loadMoreTransactions: boolean = false) {
      const currency = transactions.length ? (this.accountType === this.accountTypes.rewardsAccountType.code ?
         transactions[0].Currency + Constants.symbols.spaceString : transactions[0].Currency) : null;

      if (transactions && transactions.length) {
         if (this.accountType === this.labels.travelCardAccountTypeShortName) {
            const uniqueCurrencies = [];
            this.temporaryTransactions = [];
            transactions.forEach((transaction) => {
               if (uniqueCurrencies.indexOf(transaction.Currency) < 0) {
                  uniqueCurrencies.push(transaction.Currency);
               }
            });
            uniqueCurrencies.forEach((singleCurrency) => {
               this.filteredTransactions = transactions.filter(function (transaction, index) {
                  if (transaction && transaction.Currency && transaction.Currency === singleCurrency) {
                     return transaction;
                  }
               });
               let newBalance = this.getPocketBalance(singleCurrency);
               [...this.filteredTransactions].forEach(transaction => {
                  transaction.RunningBalance = newBalance;
                  newBalance = newBalance - transaction.Amount;
                  this.temporaryTransactions.push(transaction);
               });

            });

            transactions = this.temporaryTransactions.sort((t1, t2) => {
               return CommonUtility.sortTransactionToAscendingOrder(t1, t2);
            });
            transactions.reverse();
         } else {
            let newBalance = loadMoreTransactions ? this.lastBalance - this.lastAmountDeducted : this.getStartingBalance();
            // since response from api is already in descending order, removing the logic to reverse the data
            [...transactions].forEach(transaction => {
               transaction.RunningBalance = newBalance;
               newBalance = newBalance - transaction.Amount;
            });
            // eg. convert currency='&#x24;' into graph readable format '$'
            this.currency = this.accountType !== Constants.VariableValues.accountTypes.foreignCurrencyAccountType.code ?
               currency : String.fromCharCode(+(0 + currency.substring(2, currency.length - 1)));
         }
      }
      return transactions;
   }

   getStartingBalance(): number {
      let startingBalance = 0;
      switch (this.accountType) {
         case 'CA':
         case 'SA':
         case 'DS':
         case 'INV':
         case 'Rewards':
         case 'TC':
            startingBalance = this.availableBalance;
            break;
         case 'TD':
         default:
            startingBalance = this.balance;
      }
      return startingBalance;
   }

   isTravelCardActive(): boolean {
      // Only if account type is TC and feature is enabled in environent
      return this.showTravelCardAccount && this.accountType === Constants.labels.travelCardAccountTypeShortName;
   }

   submitNotice(placeNotice: string, deleteNotice: string) {
      this.isNow = (placeNotice === this.labels.placeNotice);
      this.deleteNotice = (deleteNotice === this.labels.placeNotice);
   }

   getAccountData() {
      const cachedAccountsData = this.accountService.getDashboardAccountsData();
      if (cachedAccountsData) {
         this.manageAccountContainers(cachedAccountsData);
      } else {
         this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
            this.manageAccountContainers(accountContainers);
         });
      }
   }

   manageAccountContainers(accountContainers: IDashboardAccounts[]) {
      this.accountContainers = accountContainers;
      this.updateAccountType(accountContainers);
   }

   updateAccountType(accountGroups: IDashboardAccounts[]) {
      accountGroups.forEach(accountGroup => {
         accountGroup.Accounts.forEach(account => {
            if (account && account.ItemAccountId && this.accountId.toString() === account.ItemAccountId.toString()) {
               this.onAccountChange(account, accountGroup.ContainerName);
               if (account.AccountType === this.labels.travelCardAccountTypeShortName) {
                  this.getPockets(this.accountNumber);
               }
            }
            if (account && account.AccountType === Constants.VariableValues.accountTypes.unitTrustInvestmentAccountType.code) {
               this.hasUnitTrustsInvAccount = true;
            }
         });
      });
   }

   getSettlemetDetails(account: IDashboardAccount) {
      Observable.forkJoin(this.getSettlementAmount(account.ItemAccountId), this.getBalanceDetails(account.ItemAccountId))
         .subscribe(results => {
            this.settlementDetails = results[0].data;
            const balanceDetails = results[1];
            if (this.settlementDetails && this.settlementDetails.settlementAmt > 0) {
               account.settlementAmt = this.settlementDetails.settlementAmt;
               this.settlementDetails.accountToTransfer = account;
               this.accountService.setSettlementData(this.settlementDetails);
            }
            this.settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
            this.settlementFeatureProps.showSettleLoanBtn = balanceDetails.isShowSettlement;
            this.settlementFeatureProps.showSettlementQuoteBtn = balanceDetails.isShowSettlement;
            this.settlementFeatureProps.showAmount = balanceDetails.isShowSettlementAmount;
         }, (error) => {
            this.systemErrorService.closeError();
            this.isErrorShown = true;
            this.setErrorMessage({
               message: Constants.messages.settlement.balLoadError,
               alertAction: AlertActionType.None, alertType: AlertMessageType.Error
            });
            this.settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
            this.settlementFeatureProps.showError = true;
         });
   }

   getSettlementAmount(itemAccountId: string) {
      return this.accountService.getSettlementDetails(itemAccountId);
   }

   getBalanceDetails(itemAccountId) {
      return this.accountService.getAccountBalanceDetail(itemAccountId);
   }

   onSettlementQuoteClick() {
      if (CommonUtility.isMfcvafLoan(this.accountType)) {
         const settlementQuoteGAEvents = Constants.GAEventList.settlement.MFC.settlementQuote;
         this.sendEvent(settlementQuoteGAEvents.action, settlementQuoteGAEvents.label, null, settlementQuoteGAEvents.category);
      } else if (CommonUtility.isHomeLoan(this.accountType)) {
         const settlementQuoteGAEvents = GAEvents.hlSettlement.clickQuote;
         this.sendEvent(settlementQuoteGAEvents.eventAction, settlementQuoteGAEvents.label, null, settlementQuoteGAEvents.category);
      } else if (CommonUtility.isPersonalLoan(this.accountType)) {
         const plSettlementQuoteGAEvents = GAEvents.personalLoanSettlement.settlementQuoteFromFeatures;
         this.sendEvent(plSettlementQuoteGAEvents.eventAction, plSettlementQuoteGAEvents.label, null, plSettlementQuoteGAEvents.category);
      }
      const routerLink = CommonUtility.format(Constants.routeUrls.settlement.requestQuote, this.accountId);
      this.router.navigateByUrl(encodeURI(routerLink));
   }

   // hide dormant label after getting success of approve it and refresh account-detail component
   notifications($event) {
      this.isErrorShown = $event.showMessage;
      this.isSuccess = $event.isSuccess;
      this.setErrorMessage({
         message: $event.message,
         alertAction: AlertActionType.None,
         alertType: AlertMessageType.Success
      });

      this.refreshAccounts();
      if (this.isSuccess) {
         this.isDormantAccount = false;
      }
   }

   setErrorMessage(errorMessage) {
      this.visibilityError = errorMessage.message;
      this.alertAction = errorMessage.alertAction;
      this.alertType = errorMessage.alertType;
   }

   // close success or error message
   onAlertLinkSelected(action: AlertActionType) {
      this.isErrorShown = false;
   }

   // refresh account-detail component.
   refreshAccounts() {
      this.skeletonMode = true;
      this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
         this.manageAccountContainers(accountContainers);
      }, error => {
         this.manageAccountContainers(this.accountService.getDashboardAccountsData());
      });
   }

   /* When user clicks on View more transactions for CASA accounts, the next set of transactions are lazily loaded, untill there are no
   more transactions in the backend */
   viewMoreTransactions() {
      // get last statment number to call next set of transactions from api
      const lastStatementNumber = this.transactions[this.transactions.length - 1].StatementNumber;
      this.showLoader = true;
      // if last statment number is not 1, there are more transactions in the backend, else backend returns no transactions
      if (lastStatementNumber !== 1) {
         this.accountService.getAccountTransactions(this.accountId, false, lastStatementNumber).subscribe((data) => {
            // response from api return statuscode other than R00 success, so the response received will be metadata and not data object
            // if received metadata, check for status code R10/R11, which means there are no more transactions in the backend
            if (data.resultData) {
               const statusCode = data.resultData[0].resultDetail[0].result;
               if (statusCode === Constants.statusCode.errorCodeR10 || statusCode === Constants.statusCode.errorCodeR11) {
                  this.setNoMoreTransactions();
               } else {
                  // if error code is other than R10/R11, handle it by saying something is not right
                  this.handleTransactionsError();
               }
            } else if (data.length) {
               // if status code is R00 from the api, we will received data object here. So set the data accordingly.
               this.setLazyLoadingData(data);
               this.updateLastRunningBalanceAndAmount(data);
            } else { // if data is [] and R00 and other conditions
               this.setNoMoreTransactions();
            }
         }, (error) => {
            this.handleTransactionsError();
         });
      } else {
         // if last statement number is 1, there are no more transactions in the backend
         this.setNoMoreTransactions();
      }
   }
   // set text message as no more transactions and unset the loader
   setNoMoreTransactions() {
      this.showLoader = false;
      this.message = this.transactionHistory.noMoreTransactions;
      this.noMoreTransactions = true;
   }
   // set transactions data and unset the loader
   setLazyLoadingData(data: ITransactionDetail[]) {
      this.transactions = this.updateRunningBalance(data, true);
      this.showLoader = false;
      this.noMoreTransactions = false;
   }

   handleTransactionsError() {
      this.transactionHistoryFailed = true;
      this.message = this.transactionHistory.transactionListingFailed;
      this.showLoader = false;
      this.noMoreTransactions = true;
   }

   setFlags(openAccount: boolean, noticeWithdrawal: boolean) {
      this.isNoticeWithdrawal = noticeWithdrawal;
   }

   onWithdrawalFlag(isWithdraw: boolean) {
      this.setFlags(false, isWithdraw);
      this.skeletonMode = false;
   }

   isTransactionClick(transaction: boolean) {
      this.showNotices();
      this.showNoticeFlow = false;
      this.setFlags(false, false);
   }

   openNewAccount() {
      this.router.navigateByUrl(Constants.routeUrls.openNewAccount);
   }

   accountInfo(accInfo: IAccountInfo) {
      this.accountInformation = accInfo;
      (accInfo.AccountType === this.investment) ? this.isViewSubmittedNotice = true : this.isViewSubmittedNotice = false;
   }

   showSettlementQuote(): boolean {
      return this.settlementFeatureProps && this.settlementFeatureProps.showSettlementQuoteBtn;
   }

   getHomeLoanBalanceDetails() {
      this.homeLoanSkeletonMode = true;
      this.accountService.getAccountBalanceDetail(this.accountId)
         .finally(() => {
            this.homeLoanSkeletonMode = false;
         })
         .subscribe((response: IAccountBalanceDetail) => {
            if (response) {
               this.buildingLoanBalance = response;
               this.prefillService.buildingBalanceData = this.buildingLoanBalance;
               this.isBuildingLoanFeature();
               this.isHlSettlement();
            }
         });
   }

   isBuildingLoanFeature() {
      this.showRequestBuildingLoan = this.requestPayOutToggle &&
         (this.buildingLoanBalance.isSingleBond || this.buildingLoanBalance.isJointBond);
   }

   isHlSettlement() {
      if (this.settlementHlToggle && this.buildingLoanBalance
         && this.buildingLoanBalance.outstandingBalance > 0 && this.buildingLoanBalance.isShowHLSettlement) {
         const accountInfo = this.accountService.getAccountData();
         accountInfo.accountHolderName = this.buildingLoanBalance.accountHolderName;
         accountInfo.loanDescription = this.buildingLoanBalance.loanDescription;
         this.accountService.setAccountData(accountInfo);
         this.settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
         this.settlementFeatureProps.showSettlementQuoteBtn = true;
      } else {
         this.settlementFeatureProps = undefined;
      }
   }

   onStatementPreferencesClick() {
      if (this.statementPreferencesClicked) {
         this.statementPreferencesClicked = false;
         this.accountService.getAccountStatementPreferences(this.accountId.toString())
            .subscribe((statementPreferences: IApiResponse) => {
               if (statementPreferences && statementPreferences.metadata.resultData[0].transactionID) {
                  this.transactionID = statementPreferences.metadata.resultData[0].transactionID;
                  this.callApproveIt();
               } else {
                  this.statementPreferencesClicked = true;
                  this.router.navigateByUrl(encodeURI(Constants.routeUrls.statementDocument + this.accountId));
               }
            }, (error) => {
               this.statementPreferencesClicked = true;
            });
      }
   }
   /* this function calls when user retry for approve it if any timeout occurs */
   resendApproveDetails() {
      this.accountService.getAccountStatementPreferences(this.accountId.toString())
         .subscribe((statementPreferences: IApiResponse) => {
            if (statementPreferences && statementPreferences.metadata.resultData[0].transactionID) {
               this.transactionID = statementPreferences.metadata.resultData[0].transactionID;
               this.bsModalRef.content.processResendApproveDetailsResponse(statementPreferences);
            } else {
               this.statementPreferencesClicked = true;
            }
         }, (error) => {
            this.statementPreferencesClicked = true;
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
            this.router.navigateByUrl(encodeURI(Constants.routeUrls.statementDocument + this.accountId));
         } else {
            this.statementPreferencesClicked = true;
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

   showNotices() {
      this.skeletonMode = true;
      if (this.isOpenNewAccount) {
         this.accountService.getNotice(this.accountId).subscribe((response) => {
            this.skeletonMode = false;
            if (response && response.length) {
               this.allNotices = response;
               this.isViewSubmittedNotice = true;
            } else {
               this.allNotices = [];
               this.isViewSubmittedNotice = false;
            }
         });
      }
   }

   viewNotices() {
      this.isViewNotices = true;
   }

   isNotices(value: boolean) {
      this.isViewNotices = value;
   }

   showNotice(value: INoticePayload) {
      this.isViewNotices = false;
      this.showNoticeFlow = true;
      this.onWithdrawalFlag(true);
      this.noticeDetails = value;
   }

   sendEventAccountType() {
      switch (this.accountType) {
         case this.accountTypes.creditCardAccountType.code: {
            this.cardsTabAccessedProdTypeGAEvent.value = Constants.accountTypesForEvents.creditCard;
            break;
         }
         case this.accountTypes.savingAccountType.code: {
            this.cardsTabAccessedProdTypeGAEvent.value = Constants.accountTypesForEvents.savings;
            break;
         }
         case this.accountTypes.currentAccountType.code: {
            this.cardsTabAccessedProdTypeGAEvent.value = Constants.accountTypesForEvents.current;
            break;
         }
         default: {
            this.cardsTabAccessedProdTypeGAEvent.value = '';
            break;
         }
      }
      this.sendEvent(this.cardsTabAccessedProdTypeGAEvent.action, this.cardsTabAccessedProdTypeGAEvent.label,
         this.cardsTabAccessedProdTypeGAEvent.value, this.cardsTabAccessedProdTypeGAEvent.category);
   }

   onStatementDocumentClick() {
      if (this.accountType === this.accountTypes.unitTrustInvestmentAccountType.code) {
         this.onStatementPreferencesClick();
         const sdpView = Object.assign({}, GAEvents.statementDeliveryPreference.sdpView);
         sdpView.label += this.accountType;
         this.sendEvent(sdpView.eventAction, sdpView.label, null, sdpView.category);
      } else {
         this.router.navigateByUrl(encodeURI(Constants.routeUrls.statementDocument + this.accountId));
      }
   }

   onAccountDetailsClick() {
      if (this.accountId) {
         const selectAcctDetailsGAEvent = GAEvents.shareAccount.selectAccountDetails;
         this.sendEvent(selectAcctDetailsGAEvent.eventAction, selectAcctDetailsGAEvent.label, null, selectAcctDetailsGAEvent.category);
         const routerLink = CommonUtility.format(Constants.routeUrls.accountViewMoreDetail, this.accountId);
         this.router.navigateByUrl(encodeURI(routerLink));
      }
   }
   checkLoanPaymentOption(): boolean {
      return (this.showMFCDebitOrder && this.showMFCPaymentDetails) ||
         (this.showLoanDebitOrder && this.showLoanPaymentDetails);
   }
   setSearchMode(value) {
      this.searchMode = value;
   }
   loanClicked() {
      if (this.showMFCDebitOrder) {
         this.setMFCDetails();
      } else if (CommonUtility.isHomeLoan(this.accountType)) {
         this.setHomeLoanDetails();
      } else {
         this.setPersonalLoanDetails();
      }
   }
   debitOrderClicked() {
      const debitOrder = Object.assign({}, GAEvents.debitOrder.debitOrderClicked);
      debitOrder.label += this.accountType;
      this.sendEvent(debitOrder.eventAction, debitOrder.label,
         null, debitOrder.category);
   }

   onRequestCreditLimitIncreaseClick() {
      const viewRCLIEvent = GAEvents.RequestCreditLimitIncrease;
      this.sendEvent(viewRCLIEvent.viewCreditLimitIncrease.eventAction,
         viewRCLIEvent.viewCreditLimitIncrease.label, null,
         viewRCLIEvent.viewCreditLimitIncrease.category);
      this.router.navigateByUrl(this.routeUrls.requestCreditLimitIncrease + this.accountId);
   }

   /**
    * Check the all required criteria to show or not show the Manage Loan feature.
    *
    * @memberof AccountDetailComponent
    */
   isManageLoan(): void {
      this.manageLoanSkeletonMode = true;
      this.manageLoan = false;
      this.accountService.getHomeLoanStatus(this.accountId)
         .finally(() => {
            this.manageLoanSkeletonMode = false;
         })
         .subscribe((response: IApiResponse) => {
            if (response && response.data && response.metadata) {
               const status = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.loanProductsManagement);
               if (status.isValid) {
                  this.loanStatusDetails(response.data);
               }
            }
         });
   }

   /**
    * Store the home loan status details.
    *
    * @param {IHomeLoanStatus} loanStatusDetails
    * @memberof AccountDetailComponent
    */
   loanStatusDetails(loanStatusDetails: IHomeLoanStatus): void {
      this.prefillService.homeLoanStatusData = loanStatusDetails;
      this.manageLoan = loanStatusDetails.isManageLoanEnabled;
   }
}
