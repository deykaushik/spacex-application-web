import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertActionType, AlertMessageType } from '../../enums';
import { environment } from '../../../../environments/environment';

import { assertModuleFactoryCaching } from './../../../test-util';
import { MessageAlertComponent } from './message-alert.component';
import { DebugElement, SimpleChange, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MessageAlertComponent', () => {
   let component: MessageAlertComponent;
   let fixture: ComponentFixture<MessageAlertComponent>;
   let messageEl: DebugElement;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [MessageAlertComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(MessageAlertComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      messageEl = fixture.debugElement.query(By.css('.alertMessage'));
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should handle Close Action', () => {
      let alertAction: AlertActionType;
      component.showAlert = true;
      component.showForgotDetails = false;
      component.onAlertLinkEmit.subscribe((value) => alertAction = value);
      component.onCloseMsg();
      fixture.detectChanges();
      expect(alertAction).toBe(AlertActionType.Close);
      expect(component.showAlert).toBeFalsy();
   });

   it('should handle ForgotDetails Action', () => {
      let alertAction: AlertActionType;
      component.showAlert = true;
      component.showForgotDetails = true;
      component.action = AlertActionType.ForgotDetails;
      component.onAlertLinkEmit.subscribe((value) => alertAction = value);
      fixture.detectChanges();
      component.onErrorLink();
      expect(alertAction).toBe(AlertActionType.ForgotDetails);
   });

   it('should handle ngOnChanges Action', () => {
      component.showAlert = true;
      component.showForgotDetails = false;
      component.action = AlertActionType.ForgotDetails;
      fixture.detectChanges();
      component.ngOnChanges(null);
      expect(component.action).toBe(AlertActionType.None);
   });
});
