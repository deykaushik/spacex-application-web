import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../../test-util';
import { Constants } from '../../../core/utils/constants';
import { PhoneNumberValidatorComponent } from './phone-number-validator.component';

describe('PhoneNumberValidatorComponent', () => {
   let component: PhoneNumberValidatorComponent;
   let fixture: ComponentFixture<PhoneNumberValidatorComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [PhoneNumberValidatorComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PhoneNumberValidatorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.ngOnChanges();
      expect(component).toBeTruthy();
   });

   it('should be created phone number in format', () => {
      component.splitPhoneNumber('+27 12 3456789');
      expect(component.placeholder).toBe('123456789');
      expect(component.phoneNumberField).toBe('+27 12 345 6789');
   });

   it('should be created empty phone number in format', () => {
      component.splitPhoneNumber(undefined);
      expect(component.placeholder).toBe('');
      expect(component.phoneNumberField).toBe('+27   ');
   });

   it('should accept number', () => {
      const event = '+27123';
      component.phoneNumberField = '+27123';
      component.onInputKeyPressValidator(event);
      expect(component.invalidPhoneNumber).toBe(true);
   });

   it('should not accept character', () => {
      const event = '+27123a';
      component.phoneNumberField = '+27123a';
      component.onInputKeyPressValidator(event);
      expect(component.phoneNumberField).toBe('+27123');
   });

   it('should not accept space', () => {
      const event = '+27123 ';
      component.onInputKeyPressValidator(event);
      expect(component.invalidPhoneNumber).toBe(true);
   });

   it('should initialize value if value is +27', () => {
      const event = '+27';
      component.onInputKeyPressValidator(event);
      expect(component.invalidPhoneNumber).toBe(false);
   });

   it('should set value as of phoneNumberField', () => {
      const event = {
         target: {
            value: ''
         }
      };
      component.countryCode = '+27';
      component.phoneNumberLength = 9;
      // component.phoneNumberField = '+27';
      component.invalidPhoneNumber = true;
      component.phoneNumberField = '+271234567';
      component.onInputTermValidator(event);
      expect(event.target.value).toBe('+271234567');
   });

   it('should show +27 on focus', () => {
      component.phoneNumberField = '';
      component.placeholder = '';
      component.countryCode = '+27';
      expect(component.phoneNumberField).toBe('');
   });

   it('should show error on focus out', () => {
      component.phoneNumberField = '';
      component.placeholder = '';
      component.countryCode = '+27';
      component.phoneNumberLength = 9;
      const error = component.onFocusOut();
      expect(component.validPhoneNumber.isValid).toBe(false);
   });

   it('should validate mobile number', () => {
      component.placeholder = '';
      const event = {
         target: {
            value: ''
         }
      };
      component.countryCode = '+27';
      component.phoneNumberLength = 9;
      component.phoneNumberField = '+27';
      component.onInputTermValidator(event);
      component.phoneNumberField = '+27 12 123 1234';
      component.onInputTermValidator(event);
      expect(component.validPhoneNumber.phoneNumber).toBe(component.phoneNumberField);
   });
});
