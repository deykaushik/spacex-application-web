import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DebugElement, ElementRef, Component, OnChanges, SimpleChange } from '@angular/core';

import { PasswordStrengthMeterComponent } from './password-strength-meter.component';
import { assertModuleFactoryCaching } from './../../test-util';

describe('PasswordStrengthMeterComponent', () => {
  let component: PasswordStrengthMeterComponent;
  let fixture: ComponentFixture<PasswordStrengthMeterComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [PasswordStrengthMeterComponent],
        providers: []
      }).compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordStrengthMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should fail password validation - No input', () => {
    component.isPasswordValid = false;
    component.passwordValue = '';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should fail password validation - less than 8 chars', () => {
    component.isPasswordValid = false;
    component.passwordValue = 'pass';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should fail password validation - more than 16 chars', () => {
    component.isPasswordValid = false;
    component.passwordValue = 'P@ssword12345678901234567';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should fail password validation - No numbers', () => {
    component.isPasswordValid = false;
    component.passwordValue = 'P@ssworddd!';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should fail password validation - No Alpha', () => {
    component.isPasswordValid = false;
    component.passwordValue = '123456*&^7&*8';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should fail password validation - No capital alpha', () => {
    component.isPasswordValid = false;
    component.passwordValue = '12abcd7&*8';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should fail password validation - No special characters', () => {
    component.isPasswordValid = false;
    component.passwordValue = 'paSsword1';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

    it('should fail password validation - Contains whitespace', () => {
    component.isPasswordValid = false;
    component.passwordValue = 'paSs word1!';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should fail password validation - No 4 alpha', () => {
    component.isPasswordValid = false;
    component.passwordValue = 'p1@2P1%a7101';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('should pass password validation', () => {
    component.isPasswordValid = false;
    component.passwordValue = 'P@ssword1!';

    component.ngOnChanges({
      changes: new SimpleChange(null, component.passwordValue, true)
    });
    fixture.detectChanges();
    expect(component.isPasswordValid).toBeTruthy();
  });
});
