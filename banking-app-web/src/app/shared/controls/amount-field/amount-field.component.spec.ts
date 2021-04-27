import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from './../../pipes/amount-transform.pipe';
import { AmountFormatDirective } from './../../directives/amount-format.directive';
import { AmountFieldComponent } from './amount-field.component';

describe('AmountFieldComponent', () => {
   let component: AmountFieldComponent;
   let fixture: ComponentFixture<AmountFieldComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AmountFieldComponent, AmountTransformPipe],
         imports: [FormsModule],
         providers: [AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AmountFieldComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should handle amount change for valid value', () => {
      component.onAmountChangeEmitter.subscribe((amountObj) => {
         expect(amountObj.value).toEqual(1111);
      });

      component.onAmountChange('R1 111');
   });

   it('should handle amount change for invalid value', () => {
      component.onAmountChangeEmitter.subscribe((amountObj) => {
         expect(amountObj.value).toEqual(1111);
      });

      component.maxValue = 12000;
      component.divisbleBy = 10;
      component.onAmountChange('R1 111');
      expect(component.isValid).toEqual(false);
   });
   it('should handle amount field blur event', () => {
      component.onEnd.subscribe((amountObj) => {
         expect(amountObj.value).toEqual(2000);
      });

      component.maxValue = 12000;
      component.divisbleBy = 100;
      component.value = 2000;
      component.onAmountBlur({ currentTarget: { value: 2000 } });
      expect(component.isValid).toEqual(true);
   });

});
