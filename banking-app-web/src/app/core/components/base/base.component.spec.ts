import { BaseComponent } from './base.component';
import { Injector } from '@angular/core';
import { inject } from '@angular/core/testing';

describe('BaseComponent', () => {
  it('should create an instance', inject([Injector], (injector: Injector) => {
    expect(new BaseComponent(injector)).toBeTruthy();
}));
});
