import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IServiceProvider, IPaymentNotification, IErrorEmitterResponse, ITermsAndConditions } from './../../core/services/models';
import { IWorkflowStep, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';

import { ApiService } from '../../core/services/api.service';
import { IApiResponse, IOutOfBandResponse, IOutOfBandRequest } from './../../core/services/models';
import { IWorkflowService } from './../../shared/components/work-flow/work-flow.models';
import { Constants } from '../../core/utils/constants';

import { CommonUtility } from '../../core/utils/common';
import { Router } from '@angular/router';
import { SystemErrorService } from '../../core/services/system-services.service';
import { IAccountDetail, IPrepaidLimitDetail } from './../../core/services/models';
import { GetQuoteModel } from './get-quote/get-quote.model';
import { PaymentDetailsModel } from './payment-details/payment-details.model';
import { ReviewPaymentModel } from './review-payment/review-payment.model';
import * as models from './fund-trip.model';


@Injectable()
export class FundTripService implements IWorkflowService {
    public fundTripWorkflowSteps: models.IFundTripWorkflowSteps;
    public isPaymentSuccessful = false;
    public errorMessage?: string;
    public requestid: string;
    public isNoResponseReceived = false;
    accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
    callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
    execEngineRef: string;
    labels = Constants.labels;
    public buyToNextButton = {
        text: Constants.labels.nextText
    };
    public buyToDoneButton = {
      text: Constants.labels.doneText
  };


    constructor(private apiService: ApiService, private datepipe: DatePipe,
        public router: Router, private systemErrorService: SystemErrorService) {

    }
    checkDirtySteps() {
    }

    // work flow methods
    initializeFundTripWorkflow() {
        this.fundTripWorkflowSteps = {
            getQuote: {
                isNavigated: false,
                sequenceId: models.FundTripStep.getQuote,
                model: new GetQuoteModel(),
                isDirty: false
            },
            paymentDetails: {
                isNavigated: false,
                sequenceId: models.FundTripStep.paymentDetails,
                model: new PaymentDetailsModel(),
                isDirty: false
            },
            reviewPayment: {
                isNavigated: false,
                sequenceId: models.FundTripStep.reviewPayment,
                model: new ReviewPaymentModel(),
                isDirty: false
            }
        };
    }

    updateAccountData(accounts: IAccountDetail[]) {
        this.accountsDataObserver.next(accounts);
    }
    refreshAccountData() {
        this.accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
    }

    getStepInfo(currentStep: IWorkflowStep) {
        currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
    }

    getStepInitialInfo(currentStep: IWorkflowStep) {
        currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
    }

    getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {
        const stepSummary: IWorkflowStepSummary = {
            isNavigated: false,
            sequenceId: 0,
            title: null
        };
        let isNavigated = true;
        switch (stepId) {
            case models.FundTripStep.getQuote:
                // todo: define models and map step summaries properly
                isNavigated = true;
                stepSummary.title = this.labels.fundTripLabels.getQuoteTitle;
                stepSummary.isNavigated = true;
                stepSummary.sequenceId = 1;
                break;
            case models.FundTripStep.paymentDetails:
                isNavigated = true;
                stepSummary.title = this.labels.fundTripLabels.paymentDetails;
                stepSummary.isNavigated = true;
                stepSummary.sequenceId = 2;
                break;
            case models.FundTripStep.reviewPayment:
                isNavigated = true;
                stepSummary.title = this.labels.fundTripLabels.reviewPaymentDetails;
                stepSummary.isNavigated = true;
                stepSummary.sequenceId = 3;
                break;
            default:
                throw new Error('no matching step found!');
        }
        return stepSummary;
    }

    getGetQuoteVm(): models.IGetQuoteVm {
        return this.fundTripWorkflowSteps.getQuote.model.getViewModel();
    }
    saveGetQuoteInfo(vm: models.IGetQuoteVm) {
        this.fundTripWorkflowSteps.getQuote.model.updateModel(vm);
        this.fundTripWorkflowSteps.getQuote.isNavigated = true;
    }
    getPaymentDetailsVm(): models.IPaymentDetailsVm {
        return this.fundTripWorkflowSteps.paymentDetails.model.getViewModel();
    }
    savePaymentDetailsInfo(vm: models.IPaymentDetailsVm) {
        this.fundTripWorkflowSteps.paymentDetails.model.updateModel(vm);
        this.fundTripWorkflowSteps.getQuote.isNavigated = true;
    }
    getPaymentReviewVm(): models.IPaymentReviewVm {
        return this.fundTripWorkflowSteps.reviewPayment.model.getViewModel();
    }
    savePaymentReviewInfo(vm: any) {
        this.fundTripWorkflowSteps.reviewPayment.model.updateModel(vm);
        this.fundTripWorkflowSteps.reviewPayment.isNavigated = true;
    }
    refreshAccounts() {
        this.apiService.refreshAccounts.getAll().subscribe();
    }
    redirecttoStatusPage() {
        this.isNoResponseReceived = true;
        this.isPaymentSuccessful = false;
        this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);

    }
    getCurrencies() {
        return this.apiService.getAllCurrencies.getAll();
    }
    getCurrencyConversionRates(currenyData: any, cardNumber: string) {
        return this.apiService.getCurrencyConversionRates.create(currenyData, {}, { cardNumber: cardNumber });
    }
    getPaymentLimits(cardNumber: string) {
        return this.apiService.getAllPaymentLimits.getAll({}, { cardNumber: cardNumber });
    }
    fundTrip(data, cardNumber) {
        return this.apiService.fundTrip.update(data, {}, { cardNumber: cardNumber });
    }
    getOperatingHours() {
      return this.apiService.getOperatingHours.getAll();
    }
    getPaymentLimit(): Observable<IPrepaidLimitDetail[]> {
      return this.apiService.dailyPaymentLimit.getAll().map(response => response ? response.data : []);
   }
   getSarbTnc(contentType): Observable<ITermsAndConditions> {
      return this.apiService.SarbTermsAndCondition.getAll({versioncontent: contentType}).map(response => response ? response.data : []);
   }
}
