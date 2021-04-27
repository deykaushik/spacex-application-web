﻿import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { UnauthorizedComponent } from './unauthorized.component';

describe('UnauthorizedComponent', () => {
   let component: UnauthorizedComponent;
   let fixture: ComponentFixture<UnauthorizedComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [UnauthorizedComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UnauthorizedComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
