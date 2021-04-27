import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { FundTripService } from './fund-trip.service';
import { TestBed, inject } from '@angular/core/testing';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { SystemErrorService } from '../../core/services/system-services.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IAccountDetail, IPrepaidLimitDetail, ITermsAndConditions } from './../../core/services/models';
import { IWorkflowStep } from '../../shared/components/work-flow/work-flow.models';
import { GetQuoteComponent } from './get-quote/get-quote.component';

const quoteData = {
      currency: {
            ccycde: 'EUR',
            ccyname: 'Ccyname',
            Ccyno: 1234,
            Multydivind: 'Multydivind',
            Decimalpoints: 2
      },
      fromCurrencyValue: 1000,
      toCurrencyValue: 'toCurrencyValue',
      clientDetails: {
            email: 'email',
            passportNumber: 1234,
            rsaId: 'rsaId',
            areaCode: 1,
            phoneNumber: 82749834,
            floor: 'floor',
            building: 'building',
            streetNumber: 1,
            streetName: 'streetName',
            suburb: 'suburb',
            city: 'city',
            postalCode: 1234,
            fromAccount: {
                  AccountNumber: 'AccountNumber',
                  accountType: 'accountType',
                  AccountName: 'AccountName'
            },
            transactionReference: 'transactionReference'
      },
      quotationReference: 'quotationReference'
};

const paymentDetailsVM = {
      amount: 1234,
      toAccount: {
            itemAccountId: 'newitemAccountId',
            accountNumber: 'newaccountNumber',
            productCode: 'newproductCode',
            productDescription: 'newproductDescription',
            isPlastic: true,
            accountType: 'accountType',
            nickname: 'nickname',
            sourceSystem: 'sourceSystem',
            currency: 'currency',
            availableBalance: 1,
            currentBalance: 1,
            profileAccountState: 'profileAccountState',
            accountLevel: 'accountLevel',
            rewardsProgram: 'rewardsProgram',
            viewAvailBal: true,
            viewStmnts: true,
            isRestricted: true,
            viewCurrBal: true,
            viewCredLim: true,
            viewMinAmtDue: true,
            isAlternateAccount: false,
            allowCredits: true,
            allowDebits: true,
            accountRules: {
                  instantPayFrom: true,
                  onceOffPayFrom: true,
                  futureOnceOffPayFrom: true,
                  recurringPayFrom: true,
                  recurringBDFPayFrom: true,
                  onceOffTransferFrom: true,
                  onceOffTransferTo: true,
                  futureTransferFrom: true,
                  futureTransferTo: true,
                  recurringTransferFrom: true,
                  recurringTransferTo: true,
                  onceOffPrepaidFrom: true,
                  futurePrepaidFrom: true,
                  recurringPrepaidFrom: true,
                  onceOffElectricityFrom: true,
                  onceOffLottoFrom: true,
                  onceOffiMaliFrom: true,
                  InternationalRemittance: true
            }
      },
      reference: 'reference'
};

const reviewPaymentModel = {
      isPaymentSuccessful: true,
      cardNumber: 1234,
      transactionReference: 'transactionResponse',
      transferDate: '1/1/2018',
      totalAmount: { currency: 'ZAR', amount: 100 },
      senderReference: 'ref'
};

const routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(true)
};
const mockApidata = {
      result: {
            resultCode: 1,
            resultMessage: 'resultMessage'
      }
};

const mockPaymentLimit: IPrepaidLimitDetail[] = [{
      limitType: 'limitType',
      dailyLimit: 100,
      userAvailableDailyLimit: 100,
      maxDailyLimit: 100,
      isTempLimit: true,
      maxTmpDateRangeLimit: 100
}];

const mockTnCData: ITermsAndConditions = {
      noticeTitle: 'noticeTitle',
      noticeType: 'noticeType',
      versionNumber: 1,
      newVersionNumber: 2,
      acceptedDateTime: 'acceptedDateTime',
      noticeDetails: {
            noticeContent: 'noticeContent',
            versionDate: 'versionDate'
      }
};


const apiServiceStub = {
      refreshAccounts: {
            getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(mockApidata))
      },
      getAllCurrencies: {
            getAll: jasmine.createSpy('getAll')
      },
      getCurrencyConversionRates: {
            create: jasmine.createSpy('create')
      },
      getAllPaymentLimits: {
            getAll: jasmine.createSpy('getAll')
      },
      fundTrip: {
            update: jasmine.createSpy('update')
      },
      getOperatingHours: {
            getAll: jasmine.createSpy('getAll')
      },
      dailyPaymentLimit: {
            getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: mockPaymentLimit }))
      },
      SarbTermsAndCondition: {
            getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: mockTnCData }))
      }
};

const mockCurrentstep: IWorkflowStep = {
      summary: {
            title: 'title',
            isNavigated: true,
            sequenceId: 1
      },
      buttons: {
            next: {
                  text: 'next'
            },
            edit: {
                  text: 'edit'
            }
      },
      component: GetQuoteComponent
};

describe('FundTripService', () => {

      let fundtripService: FundTripService;

      function initalizeWorkFlow() {
            fundtripService.initializeFundTripWorkflow();
            fundtripService.fundTripWorkflowSteps.getQuote.model.updateModel(quoteData);
            fundtripService.fundTripWorkflowSteps.paymentDetails.model.updateModel(paymentDetailsVM);
            fundtripService.fundTripWorkflowSteps.reviewPayment.model.updateModel(reviewPaymentModel);
      }

      beforeEach(() => {
            TestBed.configureTestingModule({
                  imports: [RouterTestingModule, HttpClientModule],
                  providers: [FundTripService, { provide: ApiService, useValue: apiServiceStub },
                        DatePipe, SystemErrorService, { provide: Router, useValue: routerStub }]
            });
      });

      beforeEach(inject([FundTripService], (service: FundTripService) => {
            fundtripService = service;
      }));

      it('should be created', () => {
            expect(fundtripService).toBeTruthy();
      });

      it('should initialize workflow', () => {
            fundtripService.initializeFundTripWorkflow();
            expect(fundtripService.fundTripWorkflowSteps.getQuote.isNavigated).toBeFalsy();
            expect(fundtripService.fundTripWorkflowSteps).toBeDefined();
      });

      it('should get step summary', () => {
            let res = fundtripService.getStepSummary(1, false);
            expect(res.title).toEqual(Constants.labels.fundTripLabels.getQuoteTitle);
            expect(res.sequenceId).toEqual(1);

            res = fundtripService.getStepSummary(2, false);
            expect(res.title).toEqual(Constants.labels.fundTripLabels.paymentDetails);
            expect(res.sequenceId).toEqual(2);

            res = fundtripService.getStepSummary(3, false);
            expect(res.title).toEqual(Constants.labels.fundTripLabels.reviewPaymentDetails);
            expect(res.sequenceId).toEqual(3);

            expect(function () { fundtripService.getStepSummary(5, false); }).toThrow(new Error('no matching step found!'));
      });

      it('should get quote vm', () => {
            initalizeWorkFlow();
            const res = fundtripService.getGetQuoteVm();
            expect(res.currency.ccycde).toEqual('EUR');
            expect(res.clientDetails.email).toEqual('email');
      });

      it('should update Get Quote Info', () => {
            fundtripService.initializeFundTripWorkflow();
            fundtripService.saveGetQuoteInfo(quoteData);
            const res = fundtripService.fundTripWorkflowSteps.getQuote.model.getViewModel();
            expect(res.currency.ccycde).toEqual('EUR');
            expect(res.clientDetails.email).toEqual('email');
            expect(fundtripService.fundTripWorkflowSteps.getQuote.isNavigated).toBeTruthy();
      });

      it('should get payment details VM', () => {
            initalizeWorkFlow();
            const res = fundtripService.getPaymentDetailsVm();
            expect(res.amount).toEqual(1234);
            expect(res.toAccount.accountNumber).toEqual('newaccountNumber');
      });

      it('should update payment details VM', () => {
            fundtripService.initializeFundTripWorkflow();
            fundtripService.savePaymentDetailsInfo(paymentDetailsVM);
            const res = fundtripService.getPaymentDetailsVm();
            expect(res.amount).toEqual(1234);
            expect(res.toAccount.accountNumber).toEqual('newaccountNumber');
      });

      it('should get payment review VM', () => {
            initalizeWorkFlow();
            const res = fundtripService.getPaymentReviewVm();
            expect(res.cardNumber).toEqual(1234);
            expect(res.transactionReference).toEqual('transactionResponse');
      });

      it('should update payment review VM', () => {
            fundtripService.initializeFundTripWorkflow();
            fundtripService.savePaymentReviewInfo(reviewPaymentModel);
            const res = fundtripService.getPaymentReviewVm();
            expect(res.cardNumber).toEqual(1234);
            expect(res.transactionReference).toEqual('transactionResponse');
      });

      it('should refresh accounts', () => {
            fundtripService.refreshAccounts();
            apiServiceStub.refreshAccounts.getAll().subscribe(resp => {
                  expect(resp).toEqual(mockApidata);
            });
      });

      it('should redirect to status page', () => {
            fundtripService.redirecttoStatusPage();
            expect(fundtripService.isNoResponseReceived).toBeTruthy();
            expect(routerStub.navigateByUrl).toHaveBeenCalled();
      });

      it('should get all currencies', () => {
            fundtripService.getCurrencies();
            expect(apiServiceStub.getAllCurrencies.getAll).toHaveBeenCalled();
      });

      it('should get operating hours', () => {
            fundtripService.getOperatingHours();
            expect(apiServiceStub.getOperatingHours.getAll).toHaveBeenCalled();
      });

      it('should get currency conversion rates', () => {
            fundtripService.getCurrencyConversionRates('EUR', 'cardNumber');
            expect(apiServiceStub.getCurrencyConversionRates.create).toHaveBeenCalled();
      });

      it('should get all payment limits', () => {
            fundtripService.getPaymentLimits('cardNumber');
            expect(apiServiceStub.getAllPaymentLimits.getAll).toHaveBeenCalled();
      });

      it('should create fund trip', () => {
            fundtripService.fundTrip(1, 1);
            expect(apiServiceStub.fundTrip.update).toHaveBeenCalled();
      });

      it('should update account data', () => {
            fundtripService.updateAccountData([paymentDetailsVM.toAccount]);
            fundtripService.accountsDataObserver.subscribe(resp => {
                  expect(resp[0].accountNumber).toEqual(paymentDetailsVM.toAccount.accountNumber);
            });
      });

      it('should refresh account data', () => {
            fundtripService.refreshAccountData();
            expect(fundtripService.accountsDataObserver).toEqual(new BehaviorSubject<IAccountDetail[]>(null));
      });

      it('should check dirty steps', () => {
            fundtripService.checkDirtySteps();
      });

      it('should get step info', () => {
            initalizeWorkFlow();
            fundtripService.getStepInfo(mockCurrentstep);
            expect(mockCurrentstep.summary.sequenceId).toEqual(1);
      });

      it('should get Step Initial Info', () => {
            initalizeWorkFlow();
            fundtripService.getStepInitialInfo(mockCurrentstep);
            expect(mockCurrentstep.summary.sequenceId).toEqual(1);
      });

      it('should get payment limits', () => {
            fundtripService.getPaymentLimit().subscribe(response => {
                  expect(response[0].limitType).toEqual(mockPaymentLimit[0].limitType);
            });
      });

      it('should get sarb tnc', () => {
            fundtripService.getSarbTnc('accepted').subscribe(response => {
                  expect(response).toEqual(mockTnCData);
            });
      });
});
