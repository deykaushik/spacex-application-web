import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IDashboardAccount, IDashboardAccounts } from './../../core/services/models';
import { ApiService } from './../../core/services/api.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { ClientProfileDetailsService } from './../../core/services/client-profile-details.service';
import { IWorkflowStep } from './../../shared/components/work-flow/work-flow.models';

import { UnitTrustsStep } from './unit-trusts.models';
import { UnitTrustsService } from './unit-trusts.service';

const mockAccounts: IDashboardAccount[] = [{
   AccountName: 'Inv CA1',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 10090176410,
   AccountType: 'SA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
},
{
   AccountName: 'Inv NGI',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'INV',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '4',
   InterestRate: 0
}];

const mockRewardsAccounts: IDashboardAccount[] = [{
   AccountName: 'Greenbacks',
   Balance: 2196,
   AvailableBalance: 61,
   AccountNumber: 601710000004,
   AccountType: 'Rewards',
   AccountIcon: null,
   NewAccount: null,
   LastUpdate: null,
   InstitutionName: null,
   Currency: 'GB',
   SiteId: null,
   ItemAccountId: '5',
   InterestRate: null,
   RewardsProgram: 'GB'
}, {
   AccountName: 'Amex membership',
   Balance: 2196,
   AvailableBalance: null,
   AccountNumber: 1601710000004,
   AccountType: 'Rewards',
   AccountIcon: null,
   NewAccount: null,
   LastUpdate: null,
   InstitutionName: null,
   Currency: 'MR',
   SiteId: null,
   ItemAccountId: '6',
   InterestRate: null,
   RewardsProgram: 'MR'
}];

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccounts,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}, {
   ContainerName: 'Rewards',
   Accounts: mockRewardsAccounts,
   ContainerIcon: null,
   Assets: null
}, {
   ContainerName: 'Investment',
   Accounts: mockAccounts,
   ContainerIcon: null,
   Assets: null
}];

const redemptionRes = {
   data: {
      redemptionReferenceNumber: 'GB100890',
      randBalance: 76,
      rewardsAccountBalance: '2736',
      rewardsAccountCurrency: '',
      redemptionList: [
         {
            productReferenceNumber: '2343',
            purchaseOrderNumber: '138567',
            supplierCode: 'NIP',
            supplierName: 'Nedbank Investment Products',
            productCount: 1,
            productCode: 'Investment',
            productName: 'Nedgroup Investments',
            productCostPoints: 10,
            productPropertyList: [
               {
                  propertyName: 'NedbankUnitTrustAccountNumber',
                  propertyValue: '8378201'
               }
            ]
         }
      ]
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: '',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   }
};

const clientDetailsStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue({
      CisNumber: 123,
      PassportNo: 'abc',
      Resident: 'ZA',
      IdOrTaxIdNo: 1234
   })
};

const apiStub = {
   GetRewardsRate: {
      getAll: jasmine.createSpy('GetRewardsRate')
      .and.returnValue(Observable.of({
         data: {
            'programmeRate': 0.0277777778
         }
      }))
   },
   DashboardAccounts: {
      getAll: jasmine.createSpy('GetRewardsRate')
      .and.returnValue(Observable.of(mockDashboardAccounts))
   },
   refreshAccounts: {
      getAll: jasmine.createSpy('refreshAccounts')
        .and.returnValue(Observable.of(mockDashboardAccounts))
   },
   RewardsRedemption: {
      create: jasmine.createSpy('RewardsRedemption')
         .and.returnValue(Observable.of(redemptionRes))
   }
};

const errorServiceStub = {
   raiseError: jasmine.createSpy('raiseError')
      .and.returnValue({})
};

let isAccepted = false;

const testComponent = class { };
const routerTestingStub = [
    { path: 'dashboard', component: testComponent }
];

describe('UnitTrustsService', () => {
   let service: UnitTrustsService;
   let apiService: ApiService;
   let router: Router;
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [ RouterTestingModule.withRoutes(routerTestingStub) ],
         providers: [
            UnitTrustsService,
            { provide: ApiService, useValue: apiStub },
            { provide: SystemErrorService, useValue: errorServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientDetailsStub }
         ]
      });
   });

   beforeEach(inject([UnitTrustsService, ApiService],
      (svc: UnitTrustsService, api: ApiService) => {
         service = svc;
         apiService = api;
         router = TestBed.get(Router);
         isAccepted = false;
      }));

   it('should initialize workflow when called', () => {
      service.initializeUnitTrustsBuyWorkflow();
      expect(service.unitTrustsWorkFlowSteps).toBeDefined();
      expect(apiService.GetRewardsRate.getAll).toHaveBeenCalled();
      expect(apiService.DashboardAccounts.getAll).toHaveBeenCalled();
      service.accountsDataObserver.subscribe(res => {
         expect(res[0].accountNumber.toString()).toBe('601710000004');
      });
      service.rateDataObserver.subscribe(res => {
         expect(res.programmeRate).toBe(0.0277777778);
      });
      service.unitTrustsListDataObserver.subscribe(res => {
         expect(res[0].productPropertyList[0].propertyValue.toString()).toBe('1009017640');
      });
   });

   it('should update buy model correctly', () => {
      service.initializeUnitTrustsBuyWorkflow();
      const model = service.getBuyVm();
      expect(model).toBeDefined();
      model.accountNumberFromDashboard = 'accountdashboarad';
      model.fromAccount = { nickname: 'test' } as any;
      model.gbValue = 100;
      model.randValue = 100;
      const date = new Date();
      model.requestDate = date;
      model.toAccounts = [{ supplierCode: 'abc' }] as any;
      model.transactionReference = 'transactionRef';
      model.yourReference = 'myRef';
      service.saveBuyInfo(model);
      const updatedModel = service.getBuyVm();
      expect(updatedModel.accountNumberFromDashboard).toBe('accountdashboarad');
      expect(updatedModel.fromAccount.nickname).toBe('test');
      expect(updatedModel.gbValue).toBe(100);
      expect(updatedModel.randValue).toBe(100);
      expect(updatedModel.requestDate).toBe(date);
      expect(updatedModel.toAccounts[0].supplierCode).toBe('abc');
      expect(updatedModel.transactionReference).toBe('transactionRef');
      expect(updatedModel.yourReference).toBe('myRef');
   });

   it('should return the summary of the requested step and throw error for invalid step', () => {
      service.initializeUnitTrustsBuyWorkflow();
      expect(service.getStepSummary(1, true)).toBeDefined();
      expect(service.getStepSummary(2, false)).toBeDefined();
      expect(function () {
         service.getStepSummary(-1, true);
      }).toThrow();
   });

   it('should call refresh api on refreshAccounts invocation', () => {
      service.refreshAccounts();
      expect(apiService.refreshAccounts.getAll).toHaveBeenCalled();
   });

   it('should check if any step is dirty', () => {
      service.initializeUnitTrustsBuyWorkflow();
      service.unitTrustsWorkFlowSteps.buy.isDirty = true;
      let isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(true);
      service.unitTrustsWorkFlowSteps.review.isDirty = true;
      isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   });

   it('should mark the review step navigated when buy info is saved', () => {
      service.initializeUnitTrustsBuyWorkflow();
      service.saveBuyInfo({
         fromAccount: {
            nickname: 'Test'
         },
         randValue: 100
      } as any);
      expect(service.getStepSummary(UnitTrustsStep.buy, true)).toBeTruthy();
   });

   it('should get step summary when requested', () => {
      service.initializeUnitTrustsBuyWorkflow();
      const currentStep = service.getStepSummary(UnitTrustsStep.buy, true);
      service.unitTrustsWorkFlowSteps.buy.isNavigated = false;
      expect(currentStep.title).toBeTruthy();
      // check for updated title
      service.unitTrustsWorkFlowSteps.buy.isNavigated = true;
      service.saveBuyInfo({
         fromAccount: {
            nickname: 'Test'
         },
         randValue: 100
      } as any);
      const afterNavigationStep = service.getStepSummary(UnitTrustsStep.buy, false);
      expect(afterNavigationStep.title).toBeDefined();
      expect(afterNavigationStep.title).not.toBe(currentStep.title);
   });

   it('should notify about redemption request when there is response from server', () => {
      service.initializeUnitTrustsBuyWorkflow();
      spyOn(service, 'getRedemptionPayload').and.returnValue({});
      service.redemRewards().subscribe(res => {
         expect(res).toBeDefined();
         const model = service.getBuyVm();
         expect(model.transactionReference).toBeDefined();
         expect(model.requestDate).toBeDefined();
      }, err => {
         throw (new Error('Should not be called'));
      });
   });

   it('should notify about redemption failure and need to raise system error', () => {
      service.initializeUnitTrustsBuyWorkflow();
      apiService.RewardsRedemption.create = jasmine.createSpy('RewardsRedemption').and.returnValue(Observable.create(observer => {
         observer.error(new Error('Error'));
         observer.complete();
      }));
      spyOn(service, 'getRedemptionPayload').and.returnValue({});
      service.redemRewards().subscribe(res => {
         throw (new Error('Should not be called'));
      }, err => {
         expect(err).toBeDefined();
         const spy = spyOn(router, 'navigateByUrl');
         service.callbackFromSystemService.emit({} as any);
         const url = spy.calls.first().args[0];
         expect(url).toBe('/dashboard');
      });
   });

   it('should get step updated information', () => {
      service.initializeUnitTrustsBuyWorkflow();
      const currentStep: IWorkflowStep = {
         summary: {
            isNavigated: true,
            sequenceId: 1,
            title: null
         },
         buttons: {
            next: {
               text: null
            },
            edit: {
               text: null
            }
         },
         component: testComponent
      };
      service.saveBuyInfo({
         fromAccount: {
            nickname: 'Test'
         },
         randValue: 100
      } as any);
      service.unitTrustsWorkFlowSteps.buy.isNavigated = true;
      service.getStepInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
      service.getStepInitialInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
   });

   it('should validate navigation to staus view', () => {
      service.initializeUnitTrustsBuyWorkflow();
      expect(service.isStatusNavigationAllowed()).toBeFalsy();
      service.unitTrustsWorkFlowSteps.buy.isNavigated = true;
      expect(service.isStatusNavigationAllowed()).toBeTruthy();
   });

   it('should set request parameter correctly', () => {
      service.initializeUnitTrustsBuyWorkflow();
      const model = service.getBuyVm();
      const fromAccount = service.getAccountList(mockDashboardAccounts);
      const toAccounts = service.getProductItems(mockDashboardAccounts);
      toAccounts[0].productCostRands = 100;
      model.fromAccount = fromAccount[0];
      model.toAccounts = toAccounts;
      service.saveBuyInfo(model);
      const payload = service.getRedemptionPayload();
      expect(payload.productList.length).toBeGreaterThan(0);
      expect(payload.productList[0].productPropertyList.length).toBe(1);
      const retryPayload = service.getRedemptionPayload(true);
      expect(payload.redemptionReferenceNumber).toBe(retryPayload.redemptionReferenceNumber);
   });
});
