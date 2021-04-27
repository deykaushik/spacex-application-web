import { assertModuleFactoryCaching } from './../../../test-util';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleIconHeadingComponent } from './circle-icon-heading.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CircleIconHeadingComponent', () => {
   let component: CircleIconHeadingComponent;
   let fixture: ComponentFixture<CircleIconHeadingComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CircleIconHeadingComponent],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CircleIconHeadingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
