﻿import { assertModuleFactoryCaching } from './../../test-util';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsComponent } from './accounts.component';

describe('AccountsComponent', () => {
   let component: AccountsComponent;
   let fixture: ComponentFixture<AccountsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AccountsComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
