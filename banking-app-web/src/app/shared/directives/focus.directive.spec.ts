import { DmFocusDirective } from './focus.directive';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Ng2DeviceService, Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { assertModuleFactoryCaching } from './../../test-util';

const ng2DeviceServiceStub = {
   device: 'ipad',
   browser_version: '60'
};


@Component({
   template: '<input  appFocus />'
})
class TestAmountFormatComponent {
}

describe('Directive: AmountFormat', () => {
   let component: TestAmountFormatComponent;
   let fixture: ComponentFixture<TestAmountFormatComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, Ng2DeviceDetectorModule.forRoot()],
         declarations: [TestAmountFormatComponent, DmFocusDirective],
         providers: [
         {
            provide: Ng2DeviceService, useValue: ng2DeviceServiceStub
         }]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TestAmountFormatComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create an instance', () => {
      expect(component).toBeTruthy();
   });
   it('should create an instance when device is windows', () => {
      ng2DeviceServiceStub.device = 'windows';
      fixture = TestBed.createComponent(TestAmountFormatComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
   });
   it('should create an instance when device is iphone', () => {
      ng2DeviceServiceStub.device = 'iphone';
      fixture = TestBed.createComponent(TestAmountFormatComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
   });
});
