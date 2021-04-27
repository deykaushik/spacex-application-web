import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessingTimeComponent } from './processing-time.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../test-util';

describe('ProcessingTimeComponent', () => {
   let component: ProcessingTimeComponent;
   let fixture: ComponentFixture<ProcessingTimeComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ProcessingTimeComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ProcessingTimeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
