import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RangeAmountSliderComponent } from './range-amount-slider.component';
import { AmountTransformPipe } from '../../pipes/amount-transform.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { IRangeSliderEmitModel } from '../../models';

describe('RangeAmountSliderComponent', () => {
   let component: RangeAmountSliderComponent;
   let fixture: ComponentFixture<RangeAmountSliderComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RangeAmountSliderComponent, AmountTransformPipe],
         imports: [FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [AmountTransformPipe]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RangeAmountSliderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should check for changing value', () => {
      component.onValueChanged({ value: 100, isValid: true });
      expect(component.currentLimit).toBe(100);
   });
   it('should check for changing value of slider', () => {
      component.onSliderValueChanged(100);
      expect(component.currentLimit).toBe(100);
   });

   it('should check for amount field blur event', () => {
      const amountMask = { isValid: true, value: 100 };
      component.onEnd.subscribe((amountObj: IRangeSliderEmitModel) => {
         expect(amountObj.value).toBe(amountMask.value);
         expect(amountObj.isValid).toBe(amountMask.isValid);
      });
      expect(component.onAmountBlur(amountMask)).toBeUndefined();
   });

   it('should check for changing value of slider', () => {
      const amountMask = { isValid: true, value: 100 };
      component.onEnd.subscribe((amountObj: IRangeSliderEmitModel) => {
         expect(amountObj.value).toBe(amountMask.value);
         expect(amountObj.isValid).toBe(amountMask.isValid);
      });
      expect(component.onSliderBlur(amountMask.value)).toBeUndefined();
   });
});
