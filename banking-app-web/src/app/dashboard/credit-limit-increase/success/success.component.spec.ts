import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from '../../../test-util';
import { CreditLimitService } from '../credit-limit.service';
import { CreditSuccessComponent } from './success.component';
import { ICreditLimitMaintenance } from '../../../core/services/models';

const mockcreditLimitDetails: ICreditLimitMaintenance = {
   plasticId: 1,
   grossMonthlyIncome: 40000,
   netMonthlyIncome: 45000,
   otherIncome: 10000,
   monthlyCommitment: 25000,
   monthlyDebt: 15000,
   bankName: 'Nedbank',
   branchNumber: '48102',
   accountNumber: '12345678902',
   preferContactNumber: '+27123456789',
   primaryClientDebtReview: 'No',
   spouseDebtReview: 'yes',
   statementRetrival: true
};

const creditLimitServiceStub = {
   getCreditLimitMaintenanceDetails: jasmine.createSpy('getCreditLimitMaintenanceDetails').and.returnValue(mockcreditLimitDetails),
   getAccountId: jasmine.createSpy('getAccountId').and.returnValue(1)
};

describe('CreditSuccessComponent', () => {
   let component: CreditSuccessComponent;
   let fixture: ComponentFixture<CreditSuccessComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [CreditSuccessComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CreditLimitService, useValue: creditLimitServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CreditSuccessComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call goToOverview', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.goToOverview();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/1');
   });
});
