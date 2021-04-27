import { assertModuleFactoryCaching } from './../../test-util';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementsComponent } from './statements.component';

describe('StatementsComponent', () => {
   let component: StatementsComponent;
   let fixture: ComponentFixture<StatementsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [StatementsComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatementsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
