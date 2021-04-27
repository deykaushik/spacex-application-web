import { Observable } from 'rxjs/Rx';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayoutTermsComponent } from './payout-terms.component';
import { PayoutService } from '../payout.service';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { assertModuleFactoryCaching } from '../../test-util';

const isError = false;

const payoutServiceStub = {
   getTermsAndConditionsResult: jasmine.createSpy('getTermsAndConditionsResult')
      .and.callFake(function () {
         return Observable.create(observer => {
            if (isError) {
               observer.error(new Error('error'));
               observer.complete();
            } else {
               observer.next({});
               observer.complete();
            }
         });
      })
};

describe('PayoutTermsComponent', () => {
   let component: PayoutTermsComponent;
   let fixture: ComponentFixture<PayoutTermsComponent>;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         declarations: [PayoutTermsComponent],
         providers: [
            PayoutTermsComponent, TermsService,
            { provide: PayoutService, useValue: payoutServiceStub },
         ]
      });
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(PayoutTermsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

});
