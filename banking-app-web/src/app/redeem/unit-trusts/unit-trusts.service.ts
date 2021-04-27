import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from '../../core/services/api.service';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ClientProfileDetailsService } from './../../core/services/client-profile-details.service';
import {
   IErrorEmitterResponse, IRate, IGetRateReq, IProductItem, IDashboardAccount,
   IDashboardAccounts, IRewardsRedemptionReq, IAccountDetail, IRewardsRedemption, IResultStatus
} from './../../core/services/models';
import { IWorkflowStep, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';

import * as models from './unit-trusts.models';
import { UnitTrustsBuyModel } from './unit-trusts-buy/unit-trusts-buy.model';
import { UnitTrustsReviewModel } from './unit-trusts-review/unit-trusts-review.model';

/**
 * Service for handling unit trusts transaction. Contain business logic for workflow steps,
 * server API call and model for interview data communication.
 *
 * @export
 * @class UnitTrustsService
 */
@Injectable()
export class UnitTrustsService {

   /** Holds the workflow steps defined for unit trusts.. */
   public unitTrustsWorkFlowSteps: models.IUnitTrustWorkflowSteps;
   /** Error messag to be shown to user. */
   public errorMessage: string;
   /** Callback to invokedd from the generic system error handler. */
   public callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
   /** Store transaction status reslult object. */
   public transactionStatus: IResultStatus = {
      isValid: false,
      reason: ''
   };
   /** Subject for payment from account list. */
   public accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   /** Subject for rewards conversion rates. */
   public rateDataObserver = new BehaviorSubject<IRate>(null);
   /** Subject for Unit trusts account list. */
   public unitTrustsListDataObserver = new BehaviorSubject<IProductItem[]>(null);
   /** Cached instance of payload to be used in retry. */
   private cachedPayload;

   /**
    * Creates an instance of UnitTrustsService.
    * @param {Router} router
    * @param {ApiService} apiService
    * @param {ClientProfileDetailsService} clientDetails
    * @param {SystemErrorService} systemErrorService
    * @memberof UnitTrustsService
    */
   constructor(
      public router: Router,
      private apiService: ApiService,
      private clientDetails: ClientProfileDetailsService,
      private systemErrorService: SystemErrorService
   ) { }

   /**
    * Initialize the work flow steps by setting up the models, API data
    * and view validation states.
    *
    * @memberof UnitTrustsService
    */
   initializeUnitTrustsBuyWorkflow() {
      this.unitTrustsWorkFlowSteps = {
         buy: {
            isNavigated: false,
            sequenceId: models.UnitTrustsStep.buy,
            model: new UnitTrustsBuyModel(),
            isDirty: false
         },
         review: {
            isNavigated: false,
            sequenceId: models.UnitTrustsStep.review,
            model: new UnitTrustsReviewModel(),
            isDirty: false
         }
      };
      const payload: IGetRateReq = {
         programmeId: Constants.labels.gbtype
      };
      Observable.forkJoin([
         this.apiService.GetRewardsRate.getAll(payload),
         this.apiService.DashboardAccounts.getAll()
      ]).subscribe((responses: any[]) => {
         const getRates = responses[0];
         this.updateRateData(getRates ? getRates.data : []);

         const dashboardAccounts = responses[1];
         this.updateAccountsData(dashboardAccounts ? dashboardAccounts : []);
      });
   }

   /**
    * Publish the new value of the conversion rate.
    *
    * @param {IRate} rate
    * @memberof UnitTrustsService
    */
   updateRateData(rate: IRate) {
      this.rateDataObserver.next(rate);
   }

   /**
    * Publish the new account list and unit trusts list.
    *
    * @param {IDashboardAccounts[]} accounts
    * @memberof UnitTrustsService
    */
   updateAccountsData(accounts: IDashboardAccounts[]) {
      this.accountsDataObserver.next(this.getAccountList(accounts));
      this.unitTrustsListDataObserver.next(this.getProductItems(accounts));
   }

   /**
    * Get the investement product item list from the dashbaord account list,
    * investement product information of account number and account name is
    * fetched form investement container having account type of 'INV'.
    * Some field in the list are hard code and other has to generate at the
    * time of sending API request to server.
    *
    * @param {IDashboardAccounts[]} accounts
    * @returns {IProductItem[]}
    * @memberof UnitTrustsService
    */
   getProductItems(accounts: IDashboardAccounts[]): IProductItem[] {
      const investments = accounts.find(item =>
         item.ContainerName === Constants.VariableValues.accountContainers.investment);
      let unitTrustsAccounts: IDashboardAccount[] = [];
      if (investments && investments.Accounts) {
         unitTrustsAccounts = investments.Accounts
            .filter(item => item.AccountType === Constants.VariableValues.accountTypes.unitTrustInvestmentAccountType.code);
      }
      const productsList: IProductItem[] = [];
      unitTrustsAccounts.forEach(account => {
         const productItem = {
            productReferenceNumber: 'Prod',
            supplierCode: 'NIP',
            supplierName: 'Nedbank Investment Products',
            productCount: 1,
            productCode: 'Investment',
            productCategory: 'InternalRedemptions',
            productName: 'Nedgroup Investments',
            productCostPoints: 0,
            productCostRands: 0,
            productPropertyList: [{
               propertyName: 'NedbankUnitTrustAccountNumber',
               propertyValue: account.AccountNumber
            }, {
               propertyName: 'NedbankUnitTrustAccountName',
               propertyValue: account.AccountName
            }]
         };
         productsList.push(productItem as any);
      });

      return productsList;
   }

   /**
    * Get the from account list form the Dasboard account list, we have to map dashboard
    * account to account details to re-use the existing component in from account.
    *
    * @param {IDashboardAccounts[]} accounts
    * @returns {IAccountDetail[]}
    * @memberof UnitTrustsService
    */
   getAccountList(accounts: IDashboardAccounts[]): IAccountDetail[] {
      const rewards = accounts.find(item =>
         item.ContainerName === Constants.VariableValues.accountTypes.rewardsAccountType.code);
      let rewardsAccounts: IDashboardAccount[] = [];
      if (rewards && rewards.Accounts) {
         rewardsAccounts = rewards.Accounts
            .filter(reward => reward.RewardsProgram === Constants.labels.gbtype);
      }
      const accountsList: IAccountDetail[] = [];
      rewardsAccounts.forEach(account => {
         const accountList = {
            itemAccountId: account.ItemAccountId,
            accountNumber: account.AccountNumber,
            productCode: '',
            productDescription: '',
            isPlastic: false,
            accountType: account.AccountType,
            nickname: account.AccountName,
            sourceSystem: '',
            currency: account.Currency,
            availableBalance: account.AvailableBalance,
            rewardsProgram: account.RewardsProgram,
            currentBalance: account.Balance,
            profileAccountState: '',
            accountLevel: '',
            viewAvailBal: '',
            viewStmnts: '',
            isRestricted: false,
            viewCurrBal: false,
            viewCredLim: false,
            viewMinAmtDue: false,
            isAlternateAccount: false,
            allowCredits: false,
            allowDebits: true,
         };

         accountsList.push(accountList as any);
      });

      return accountsList;
   }

   /**
    * Get the buy model reference.
    *
    * @returns {models.IUnitTrustsBuy}
    * @memberof UnitTrustsService
    */
   getBuyVm(): models.IUnitTrustsBuy {
      return this.unitTrustsWorkFlowSteps.buy.model.getViewModel();
   }

   /**
    * Update the buy model to the new value passed.
    *
    * @param {models.IUnitTrustsBuy} vm
    * @memberof UnitTrustsService
    */
   saveBuyInfo(vm: models.IUnitTrustsBuy) {
      this.unitTrustsWorkFlowSteps.buy.model.updateModel(vm);
      this.unitTrustsWorkFlowSteps.buy.isNavigated = true;
   }

   /**
    * Get the summary of the step like navigation state, header text, sequence id etc.
    *
    * @param {number} stepId
    * @param {boolean} isDefault
    * @returns {IWorkflowStepSummary}
    * @memberof UnitTrustsService
    */
   getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {
      const stepSummary: IWorkflowStepSummary = {
         isNavigated: false,
         sequenceId: 0,
         title: null
      };
      let isNavigated = true;
      switch (stepId) {
         case models.UnitTrustsStep.buy:
            isNavigated = this.unitTrustsWorkFlowSteps.buy.isNavigated;
            stepSummary.title = this.unitTrustsWorkFlowSteps.buy.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.unitTrustsWorkFlowSteps.buy.isNavigated;
            stepSummary.sequenceId = models.UnitTrustsStep.buy;
            break;
         case models.UnitTrustsStep.review:
            isNavigated = this.unitTrustsWorkFlowSteps.review.isNavigated;
            stepSummary.title = this.unitTrustsWorkFlowSteps.review.model.getStepTitle();
            stepSummary.isNavigated = this.unitTrustsWorkFlowSteps.review.isNavigated;
            stepSummary.sequenceId = models.UnitTrustsStep.review;
            break;
         default:
            throw new Error('no matching step found!');
      }
      return stepSummary;
   }

   /**
    * Redem the required against the unit trusts. Returns observable which will
    * succeed if got any response from the server and will fail when there is any
    * error while communicating to the server.
    * If isRetry is true then use the already generate payload object instead of
    * creating a unique one.
    *
    * @param {boolean} [isRetry=false]
    * @returns {Observable<any>}
    * @memberof UnitTrustsService
    */
   redemRewards(isRetry = false): Observable<any> {
      return Observable.create(observer => {
         this.apiService.RewardsRedemption.create(this.getRedemptionPayload(isRetry))
            .subscribe(res => {
               const status = CommonUtility.getResultStatus(res.metadata);
               this.transactionStatus = status;
               const vm = this.getBuyVm();
               vm.requestDate = new Date();
               vm.transactionReference = (res.data as IRewardsRedemption).redemptionReferenceNumber;
               this.saveBuyInfo(vm);
               observer.next(status);
               observer.complete();
            }, err => {
               this.raiseSystemError(true);
               observer.error(new Error('Error'));
               observer.complete();
            });
      });
   }

   /**
    * Get the payload which has to be sent to the server also cache the same
    * for retry feature.
    *
    * @param {boolean} [isRetry=false]
    * @returns {IRewardsRedemptionReq}
    * @memberof UnitTrustsService
    */
   getRedemptionPayload(isRetry = false): IRewardsRedemptionReq {
      let payload;
      if (isRetry && this.cachedPayload) {
         payload = this.cachedPayload;
      } else {
         const details = this.clientDetails.getClientPreferenceDetails();
         const productList = [];
         const accounts = this.getBuyVm().toAccounts;
         const fromAccount = this.getBuyVm().fromAccount;
         const referenceArr = [];
         const uuid = '' + fromAccount.accountNumber + new Date().getTime();
         let counter = 1;
         // split uuid in to batch of 9 and perform 36 operation.
         referenceArr.push((+uuid.substring(0, 9)).toString(36));
         referenceArr.push((+uuid.substring(9, 18)).toString(36));
         referenceArr.push((+uuid.substring(18)).toString(36));
         accounts.forEach(account => {
            const accountTmp = Object.assign({}, account);
            if (accountTmp.productCostRands > 0) {
               // API expect cost points to be max upto two decimal.
               accountTmp.productCostPoints = +account.productCostPoints.toFixed(2);
               accountTmp.productReferenceNumber = account.productReferenceNumber + counter;
               accountTmp.productPropertyList = [account.productPropertyList[0]];
               productList.push(accountTmp);
               counter++;
            }
         });
         payload = {
            rewardsAccountNumber: fromAccount.accountNumber,
            customerNo: details.CisNumber.toString(),
            redemptionReferenceNumber: referenceArr.join('').toUpperCase(),
            productList: productList
         };
         this.cachedPayload = payload;
      }
      return payload;
   }

   /**
    * Check the dirty state of the view to notify user about unsaved changes on navigation.
    *
    * @returns true when buy step is dirty.
    * @memberof UnitTrustsService
    */
   checkDirtySteps() {
      return this.unitTrustsWorkFlowSteps.buy.isDirty && !this.unitTrustsWorkFlowSteps.review.isDirty;
   }

   /**
    * Get the step summary of any step during edit operation, used by workflow.
    *
    * @param {IWorkflowStep} currentStep
    * @memberof UnitTrustsService
    */
   getStepInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
   }

   /**
    * Get the step summary of initial step, used by workflow.
    *
    * @param {IWorkflowStep} currentStep
    * @memberof UnitTrustsService
    */
   getStepInitialInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
   }

   /**
    * Check whether user is allowed to navigation to the status view direct or there is any
    * pending information has to be filled by user.
    *
    * @returns {boolean}
    * @memberof UnitTrustsService
    */
   isStatusNavigationAllowed(): boolean {
      return this.unitTrustsWorkFlowSteps && this.unitTrustsWorkFlowSteps.buy.isNavigated;
   }

   /**
    * Reset buy model to start new transaction.
    *
    * @memberof UnitTrustsService
    */
   resetBuyModel() {
      this.transactionStatus = {
         isValid: false,
         reason: ''
      };
      this.unitTrustsWorkFlowSteps.buy.isNavigated = false;
   }

   /**
    * Refresh the accounts list.
    *
    * @memberof UnitTrustsService
    */
   refreshAccounts() {
      this.apiService.refreshAccounts.getAll().subscribe();
   }

   /**
    * Raise the error to the Global error indicator and also specify the operation to be
    * performed on user action on handler using callback.
    *
    * @param {boolean} [isCallback=false]
    * @memberof UnitTrustsService
    */
   raiseSystemError(isCallback: boolean = false) {
      if (isCallback) {
         const callback = this.callbackFromSystemService.subscribe((response: IErrorEmitterResponse) => {
            callback.unsubscribe();
            this.resetBuyModel();
            this.router.navigateByUrl(Constants.routeUrls.dashboard);
         });
      }
      this.systemErrorService.raiseError({
         error: Constants.VariableValues.sytemErrorMessages.transactionMessage,
         callbackEmitter: isCallback && this.callbackFromSystemService
      });
   }
}
