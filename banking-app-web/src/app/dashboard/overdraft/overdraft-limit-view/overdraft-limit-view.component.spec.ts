import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { OverdraftLimitViewComponent } from './overdraft-limit-view.component';
import { assertModuleFactoryCaching } from './../../../test-util';
import { AccountService } from '../../account.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { IAccountBalanceDetail, IOverdraftAttempts, IApiResponse } from '../../../core/services/models';
import { HttpErrorResponse } from '@angular/common/http';

const mockBalanceDetail: IAccountBalanceDetail = {
   currentBalance: 2618759.14,
   availableBalance: 10000.00,
   overdraftLimit: 15900.00,
   dbInterestRate: 9.25,
   movementsDue: -10000.00,
   unclearedEffects: 0.00,
   accruedFees: 0.00,
   pledgedAmount: 0.00,
   crInterestDue: 1482.96,
   crInterestRate: 1.00,
   dbInterestDue: 0.00,
};

const mockAccountBalanceDetail: IApiResponse = {
   data: mockBalanceDetail
};

const mockOverdraftAttempt: IOverdraftAttempts = {
   remainingTime: '',
   overdraftAttempts: 5
};

const mockOverdraftAttempts: IApiResponse = {
   data: mockOverdraftAttempt
};

const accountServiceStub = {
   getAccountOverdraftAttempts: jasmine.createSpy('getAccountOverdraftAttempts').and.returnValue(Observable.of(mockOverdraftAttempts)),
   getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail')
      .and.returnValue(Observable.of(mockBalanceDetail))
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('OverdraftLimitViewComponent', () => {
   let component: OverdraftLimitViewComponent;
   let fixture: ComponentFixture<OverdraftLimitViewComponent>;
   let router: Router;
   let service: AccountService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [OverdraftLimitViewComponent, AmountTransformPipe, SkeletonLoaderPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: ActivatedRoute, useValue: { params: Observable.of({ itemAccountId: 1 }) } },
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OverdraftLimitViewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      service = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should check overdraft balance on Account Change', () => {
      component.accountBalanceDetails = mockBalanceDetail;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.availableOverdraftBalance).toEqual(10000);
   });

   it('should close overdraft overlay', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.itemAccountId = 1;
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/1');
   });

   it('should used amount equal to overdraft amount', () => {
      mockBalanceDetail.availableBalance = -100.00;
      component.accountBalanceDetails = mockBalanceDetail;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.usedAmount).toEqual(mockBalanceDetail.overdraftLimit);
   });

   it('should check used amount', () => {
      mockBalanceDetail.availableBalance = 100.00;
      component.accountBalanceDetails = mockBalanceDetail;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.usedAmount).toEqual(mockBalanceDetail.overdraftLimit - mockBalanceDetail.availableBalance);
   });

   it('should show skeleton mode false if  getAccountBalancesAndOverdraftLimit API fails', () => {
      service.getAccountBalanceDetail = jasmine.createSpy('getAccountBalanceDetail').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.getAccountBalancesAndOverdraftLimit(1);
      expect(component.isSkeletonMode).toBeFalsy();
   });

   it('should show skeleton mode false if  getAccountBalancesAndOverdraftLimit API fails', () => {
      service.getAccountOverdraftAttempts = jasmine.createSpy('getAccountOverdraftAttempts').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.getAccountOverdraftAttempt(1);
      expect(component.isSkeletonMode).toBeFalsy();
   });

   it('Should open cancel overdraft overlay', () => {
      component.overdraftAttempt = 0;
      component.isSkeletonMode = false;
      const label = 'Change limit';
      component.overdraftChangeLimit(label);
      expect(component.isChangeLimit).toBe(true);
   });

   it('Should open change overdraft overlay', () => {
      component.overdraftAttempt = 0;
      component.isSkeletonMode = false;
      const label = 'Cancel overdraft';
      component.overdraftChangeLimit(label);
      expect(component.isCancelLimit).toBe(true);
   });
});
