import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../../test-util';
import { RangeSliderComponent } from './range-slider.component';

describe('RangeSliderComponent', () => {
   let component: RangeSliderComponent;
   let fixture: ComponentFixture<RangeSliderComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RangeSliderComponent],
         schemas: [NO_ERRORS_SCHEMA],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RangeSliderComponent);
      component = fixture.componentInstance;
      component.config = {
         max: 100,
         min: 10,
         step: 0
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should validate firing onChange', () => {
      expect(component.onChange(10)).toBeUndefined();
   });

   describe('async current value update', () => {
      beforeEach(function (done) {
         component.currentValue = 200;
         component.value = 100;
         component.ngOnChanges();
         setTimeout(() => {
            done();
         }, 100);
      });
      it('should check of amount change from outside', (done) => {
         expect(component.currentValue).toBe(100);
         done();
      });
      it('should validate firing onChange', () => {
         expect(component.onSliderEnd(10)).toBeUndefined();
         expect(component.currentValue).toBe(10);
      });
      it('should validate firing onChange', () => {
         expect(component.onChange(10)).toBeUndefined();
         expect(component.currentValue).toBe(10);
      });
   });

   describe('async current value update', () => {
      beforeEach(function (done) {
         component.currentValue = 100;
         component.value = 100;
         component.ngOnChanges();
         setTimeout(() => {
            done();
         }, 100);
      });
      it('should check of amount change from outside', (done) => {
         expect(component.currentValue).toBe(100);
         done();
      });
   });
});
