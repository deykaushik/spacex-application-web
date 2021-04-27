import { async, TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SystemErrorService } from '../../core/services/system-services.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { InitiatePayoutComponent } from './initiate-payout.component';
import { assertModuleFactoryCaching } from '../../test-util';

const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/detail/:accountId', component: testComponent },
   { path: 'payout/:accountId', component: testComponent }
];
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('InitiatePayoutComponent', () => {
   let component: InitiatePayoutComponent;
   let fixture: ComponentFixture<InitiatePayoutComponent>;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [InitiatePayoutComponent],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 3 }) } }, SystemErrorService,
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(InitiatePayoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      router = TestBed.get(Router);
   });

   it('should create component', () => {
      expect(component).toBeDefined();
   });
   it('should navigate back to accounts detail page', fakeAsync(() => {
      const accountDetailURL = '/dashboard/account/detail/3';
      const spy = spyOn(router, 'navigateByUrl');
      component.exitAction();
      const url = spy.calls.first().args[0];
      expect(url).toBe(accountDetailURL);
   }));
   it('should navigate to payout', fakeAsync(() => {
      const payoutURL = '/payout/3';
      const spy = spyOn(router, 'navigateByUrl');
      component.getStarted();
      const url = spy.calls.first().args[0];
      expect(url).toBe(payoutURL);
   }));
});
