import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from '../../test-util';
import { WindowRefService } from '../../core/services/window-ref.service';
import { PreFillService } from '../../core/services/preFill.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { IAccountBalanceDetail } from '../../core/services/models';
import { SharedModule } from '../../shared/shared.module';

import { FinalDoneComponent } from './final-done.component';

const mockBuildingBalanceData: IAccountBalanceDetail = {
   accountName: 'BOND A/C',
   accountNumber: '8605376000101',
   accountType: 'HL',
   currency: '&#x52;',
   outstandingBalance: 1.17,
   nextInstallmentAmount: 3519.45,
   amountInArrears: -181726.91,
   nextPaymentDue: 3519.45,
   nextPaymentDate: '2018-05-01T05:30:00+05:30',
   interestRate: 8.25,
   loanAmount: 405000,
   email: 'test@gmail.com',
   paymentTerm: '240',
   termRemaining: '64 months',
   balanceNotPaidOut: 10000,
   registeredAmount: 405000,
   accruedInterest: 0,
   isSingleBond: true,
   PropertyAddress: '6, WABOOM, 40672, Sandton',
   nameAndSurname: 'Mr Brian Bernard Sheinuk',
   contactNumber: '+27991365718'
};

describe('FinalDoneComponent', () => {
   let component: FinalDoneComponent;
   let fixture: ComponentFixture<FinalDoneComponent>;
   let router: Router;
   let prefillService: PreFillService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [FinalDoneComponent],
         imports: [RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{
            provide: WindowRefService,
            useValue: {
               nativeWindow: {
                  location: {
                     replace: () => { }, reload: (clearcache) => { }
                  },
                  setTimeout: (callback, time) => { }
               }
            }
         }, { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 1, payoutType: 'final' }) } },
            PreFillService, SystemErrorService]
      })
         .compileComponents();
   }));
   beforeEach(inject([PreFillService], (service: PreFillService) => {
      fixture = TestBed.createComponent(FinalDoneComponent);
      component = fixture.componentInstance;
      prefillService = service;
      prefillService.buildingBalanceData = mockBuildingBalanceData;
      fixture.detectChanges();
      router = TestBed.get(Router);
   }));
   it('should create component', () => {
      expect(component).toBeDefined();
   });
   it('should open email client', () => {
      component.sendMail();
   });
   it('should navigate to a account detail page', () => {
      const spy = spyOn(router, 'navigateByUrl');
      spyOn(component, 'goToAccounts').and.callThrough();
      component.goToAccounts();
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/dashboard/account/detail/1');
   });
});
