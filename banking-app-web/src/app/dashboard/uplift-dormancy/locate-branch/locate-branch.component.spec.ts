import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocateBranchComponent } from './locate-branch.component';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../../test-util';

describe('LocateBranchComponent', () => {
   let component: LocateBranchComponent;
   let fixture: ComponentFixture<LocateBranchComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [LocateBranchComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LocateBranchComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should close overdraft overlay', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.itemAccountId = 1;
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/1');
   });
});
