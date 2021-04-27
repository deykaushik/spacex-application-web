import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { PaymentPopComponent } from './payment-pop.component';

describe('PaymentPopComponent', () => {
   let component: PaymentPopComponent;
   let fixture: ComponentFixture<PaymentPopComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PaymentPopComponent, AmountTransformPipe],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PaymentPopComponent);
      component = fixture.componentInstance;
      component.reportData = {
         payAmountVm: {
            selectedAccount: {
               nickname: 'nick name',
               accountNumber: '213123'
            }
         },
         payToVm: {
            isCrossBorderPaymentActive: false
         }
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
