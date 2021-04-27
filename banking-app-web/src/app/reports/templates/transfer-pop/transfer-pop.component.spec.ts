import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { TransferPopComponent } from './transfer-pop.component';

describe('TransferPopComponent', () => {
   let component: TransferPopComponent;
   let fixture: ComponentFixture<TransferPopComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TransferPopComponent, AmountTransformPipe]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransferPopComponent);
      component = fixture.componentInstance;
      component.reportData = {
         transferDetails: {
            startDate: new Date(),
            execEngineRef: 'some ref',
            amount: 123,
            toAccount: {
               accountNumber: '213123'
            },
            fromAccount: {
               accountNumber: '213123'
            }
         },
         transferAmountVm: {
            selectedToAccount: {
               nickname: 'nick name'
            },
            selectedFromAccount: {
               nickname: 'nick name'
            }
         }
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
