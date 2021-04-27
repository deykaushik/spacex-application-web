import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IDashboardAccount, IDashboardAccounts } from './../../core/services/models';
import { ApiService } from './../../core/services/api.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { ClientProfileDetailsService } from './../../core/services/client-profile-details.service';
import { IWorkflowStep } from './../../shared/components/work-flow/work-flow.models';

import { ChargesAndFeesStep } from './charges-and-fees.models';
import { ChargesAndFeesService } from './charges-and-fees.service';

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
  AccountName: 'Inv CA1',
  Balance: 0,
  AvailableBalance: 0,
  AccountNumber: 10090176410,
  AccountType: 'CC',
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

const mockRedeemData = {
  accountNumberFromDashboard: '12345',
  accountType: '124',
  costPoints: '10',
  costRands: '100'
};

const mockData = {
  data: {
    accountNumber: '1996324918',
    accountType: 'CA',
    financialBranchNumber: '3683',
    domicileBranchNumber: '996',
    isRSACitizen: 'true',
    isInTransactableState: 'true',
    currencyCode: 'ZAR',
    productId: '013',
    accountPlanId: '0',
    brandCode: '1',
    dcarGroup: '51996',
    accountCustomerInformation: {
      accountName: 'NXASANA P',
      accountCustomerDCAR: '51996',
      accountClientType: '30',
      accountCustomerNumber: '191573155005'
    },
    primeRat: '10.000',
    fbtRate: '8.000',
    penaltyRate: '0.000',
    productCategory: '13'
  }
};

const mockDataWithoutDomicile = {
  data: {
    accountNumber: '1996324918',
    accountType: 'CA',
    financialBranchNumber: '3683',
    isRSACitizen: 'true',
    isInTransactableState: 'true',
    currencyCode: 'ZAR',
    productId: '013',
    accountPlanId: '0',
    brandCode: '1',
    dcarGroup: '51996',
    accountCustomerInformation: {
      accountName: 'NXASANA P',
      accountCustomerDCAR: '51996',
      accountClientType: '30',
      accountCustomerNumber: '191573155005'
    },
    primeRat: '10.000',
    fbtRate: '8.000',
    penaltyRate: '0.000',
    productCategory: '13'
  }
};


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
  ContainerName: 'Card',
  Accounts: mockAccounts,
  ContainerIcon: null,
  Assets: null
}];

const mockDomicileBranchNumber = {
  data: {
    domicileBranchNumber: '123'
  }
};

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

const apiStub = {
  DashboardAccounts: {
    getAll: jasmine.createSpy('GetDashboardAccounts')
      .and.returnValue(Observable.of(mockDashboardAccounts))
  },
  GetChargesAndFees: {
    getAll: jasmine.createSpy('GetRewardsRate')
      .and.returnValue(Observable.of(mockDashboardAccounts)) // to be taken care not complete yet
  },
  refreshAccounts: {
    getAll: jasmine.createSpy('refreshAccounts')
      .and.returnValue(Observable.of(mockDashboardAccounts))
  },
  RewardsRedemption: {
    create: jasmine.createSpy('RewardsRedemption')
      .and.returnValue(Observable.of(redemptionRes))
  },
  getAccountDetails: {
    create: jasmine.createSpy('getAccountsDetails')
      .and.returnValue(Observable.of(mockDashboardAccounts))
  },
  DomicileBranchNumber: {
    getAll: jasmine.createSpy('DomicileBranchNumber')
      .and.returnValue(Observable.of(mockData))
  }

};

const testComponent = class { };

const routerTestingStub = [
  { path: 'dashboard', component: testComponent }
];

const errorServiceStub = {
  raiseError: jasmine.createSpy('raiseError')
    .and.returnValue({})
};

const clientDetailsStub = {
  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue({
    CisNumber: 123,
    PassportNo: 'abc',
    Resident: 'ZA',
    IdOrTaxIdNo: 1234
  })
};

let isAccepted = false;

describe('ChargesAndFeesService', () => {
  let service: ChargesAndFeesService;
  let apiService: ApiService;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routerTestingStub)],
      providers: [
        ChargesAndFeesService,
        { provide: ApiService, useValue: apiStub },
        { provide: SystemErrorService, useValue: errorServiceStub },
        { provide: ClientProfileDetailsService, useValue: clientDetailsStub }
      ]
    });
  });

  beforeEach(inject([ChargesAndFeesService, ApiService],
    (svc: ChargesAndFeesService, api: ApiService) => {
      service = svc;
      apiService = api;
      router = TestBed.get(Router);
      isAccepted = false;
    }));

  it('should initialize workflow when called in Charges and Fees services', () => {
    service.initializeChargesAndFeesPayWorkflow();
    expect(service.chargesAndFeesWorkFlowSteps).toBeDefined();
    expect(apiService.GetChargesAndFees.getAll).toHaveBeenCalled();
    expect(apiService.DashboardAccounts.getAll).toHaveBeenCalled();
  });

  it('should update pay model correctly', () => {
    service.initializeChargesAndFeesPayWorkflow();
    const model = service.getPayVm();
    expect(model).toBeDefined();
    model.accountNumberFromDashboard = 'accountdashboarad';
    model.fromAccount = { nickname: 'test' } as any;
    const date = new Date();
    model.requestDate = date;
    model.costRands = 100;
    model.forAccount = [{ supplierCode: 'abc' }] as any;
    model.transactionReference = 'transactionRef';
    model.yourReference = 'myRef';
    service.savePayInfo(model);
    const updatedModel = service.getPayVm();
    expect(updatedModel.accountNumberFromDashboard).toBe('accountdashboarad');
    expect(updatedModel.fromAccount.nickname).toBe('test');
    expect(updatedModel.requestDate).toBe(date);
    expect(updatedModel.forAccount[0].supplierCode).toBe('abc');
    expect(updatedModel.costRands).toBe(100);
    expect(updatedModel.transactionReference).toBe('transactionRef');
    expect(updatedModel.yourReference).toBe('myRef');
  });

  it('should return the summary of the requested step and throw error for invalid step', () => {
    service.initializeChargesAndFeesPayWorkflow();
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
    service.initializeChargesAndFeesPayWorkflow();
    service.chargesAndFeesWorkFlowSteps.pay.isDirty = true;
    let isDirty = service.checkDirtySteps();
    expect(isDirty).toBe(true);
    service.chargesAndFeesWorkFlowSteps.review.isDirty = true;
    isDirty = service.checkDirtySteps();
    expect(isDirty).toBe(false);
  });

  it('should mark the review step navigated when pay info is saved', () => {
    service.initializeChargesAndFeesPayWorkflow();
    service.savePayInfo({
      fromAccount: {
        nickname: 'Test'
      },
      costRands: 100
    } as any);
    expect(service.getStepSummary(ChargesAndFeesStep.pay, true)).toBeTruthy();
  });

  it('should get step summary when requested', () => {
    service.initializeChargesAndFeesPayWorkflow();
    const currentStep = service.getStepSummary(ChargesAndFeesStep.pay, true);
    service.chargesAndFeesWorkFlowSteps.pay.isNavigated = false;
    expect(currentStep.title).toBeTruthy();
    // check for updated title
    service.chargesAndFeesWorkFlowSteps.pay.isNavigated = true;
    service.savePayInfo({
      fromAccount: {
        nickname: 'Test'
      },
      costRands: 100
    } as any);
    const afterNavigationStep = service.getStepSummary(ChargesAndFeesStep.pay, false);
    expect(afterNavigationStep.title).toBeDefined();
    expect(afterNavigationStep.title).not.toBe(currentStep.title);
  });

  it('should notify about redemption request when there is response from server', () => {
    service.initializeChargesAndFeesPayWorkflow();
    spyOn(service, 'getRedemptionPayload').and.returnValue({});
    service.redemRewards().subscribe(res => {
      expect(res).toBeDefined();
      const model = service.getPayVm();
      expect(model.transactionReference).toBeDefined();
      expect(model.requestDate).toBeDefined();
    }, err => {
      throw (new Error('Should not be called'));
    });
  });

  it('should notify about redemption failure and need to raise system error', () => {
    service.initializeChargesAndFeesPayWorkflow();
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
    service.initializeChargesAndFeesPayWorkflow();
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
    service.savePayInfo({
      fromAccount: {
        nickname: 'Test'
      },
      costRands: 100
    } as any);
    service.chargesAndFeesWorkFlowSteps.pay.isNavigated = true;
    service.getStepInfo(currentStep);
    expect(currentStep.summary.title).toBeDefined();
    service.getStepInitialInfo(currentStep);
    expect(currentStep.summary.title).toBeDefined();
  });

  it('should validate navigation to staus view', () => {
    service.initializeChargesAndFeesPayWorkflow();
    expect(service.isStatusNavigationAllowed()).toBeFalsy();
    service.chargesAndFeesWorkFlowSteps.pay.isNavigated = true;
    expect(service.isStatusNavigationAllowed()).toBeTruthy();
  });

  it('should set request parameter correctly', () => {
    service.initializeChargesAndFeesPayWorkflow();
    const model = service.getPayVm();
    model.fromAccount = { nickname: 'test' } as any;
    model.forAccount = [{ supplierCode: 'abc' }] as any;
    model.costPoints = 10;
    model.costRands = 100;
    model.productCategory = 'BankFees';
    service.savePayInfo(model);
    const payload = service.getRedemptionPayload();
    const retryPayload = service.getRedemptionPayload(true);
    expect(payload.redemptionReferenceNumber).toBe(retryPayload.redemptionReferenceNumber);
    const model1 = service.getPayVm();
    model1.fromAccount = { nickname: 'test' } as any;
    model1.forAccount = [{ supplierCode: 'abc' }] as any;
    model1.costPoints = 10;
    model1.costRands = 100;
    model1.productCategory = 'RewardsFees';
    service.savePayInfo(model1);
    const payload1 = service.getRedemptionPayload();
    const retryPayload1 = service.getRedemptionPayload(true);
    expect(payload1.redemptionReferenceNumber).toBe(retryPayload1.redemptionReferenceNumber);
  });

  it('should get DomicileBranchNumber', () => {
    const accountId = '1996324918';
    service.getDomicileBranchNumber(accountId).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toBe('996');
    }, err => {
      throw (new Error('Should not be called'));
    });
  });

  it('should get error when the account id is not valid', () => {
    const accountId = '123';
    apiService.DomicileBranchNumber.getAll = jasmine.createSpy('DomicileBranchNumber').and.returnValue(Observable.create(observer => {
      observer.error(new Error('Error'));
      observer.complete();
    }));
    service.getDomicileBranchNumber(accountId);
    expect(errorServiceStub.raiseError).toHaveBeenCalled();

  });

});
