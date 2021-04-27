import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from '../../../test-util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../../core/services/window-ref.service';
import { CreditLimitService } from '../credit-limit.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { ReviewComponent } from './review.component';
import { IClientDetails } from '../../../core/services/models';

const creditLimitServiceStub = {
   getAccountId: jasmine.createSpy('getAccountId').and.returnValue(1)
};
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: [], MaritalStatus: 'U', MarriageType: '02'
};
const clientProfileDetailsServiceStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
};
describe('ReviewComponent', () => {
   let component: ReviewComponent;
   let fixture: ComponentFixture<ReviewComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ReviewComponent],
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
         }, { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 1 }) } },
         { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
         { provide: CreditLimitService, useValue: creditLimitServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ReviewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.sendMail();
      expect(component).toBeTruthy();
   });
   it('should call openTooltip', () => {
      component.openTooltip(true);
      expect(component.isTooltip).toBeTruthy();
   });
   it('should call goToAccount', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.goToAccount(true);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/1');
   });
});
