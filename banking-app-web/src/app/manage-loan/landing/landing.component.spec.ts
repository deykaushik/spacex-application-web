import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../test-util';
import { PreFillService } from '../../core/services/preFill.service';
import { LandingComponent } from './landing.component';
import { IHomeLoanStatus } from '../../core/services/models';

const mockHomeLoanStatusData: IHomeLoanStatus = {
   isManageLoanEnabled: true,
   isJointBondEnabled: true,
   isNinetyDaysNoticeEnabled: true,
   isLoanPaidUp: true
};

const preFillServiceStub = new PreFillService();
preFillServiceStub.homeLoanStatusData = mockHomeLoanStatusData;

describe('LandingComponent', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   let router: Router;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [LandingComponent],
         providers: [
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }), snapshot: {} } },
         { provide: PreFillService, useValue: preFillServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should close overlay and navigate to account detail', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(component.isOverlayVisible).toBe(false);
      expect(url).toBe('/dashboard/account/detail/1');
   });

   it('should navigate to place notice', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.onClickPlaceNotice();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/manageloan/placenotice/1');
   });

   it('should navigate to cancel loan', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.onClickCancelLoan();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/manageloan/cancelloan/1');
   });

});
