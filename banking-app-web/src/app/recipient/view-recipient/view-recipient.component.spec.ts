import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { ViewRecipientComponent } from './view-recipient.component';

describe('ViewRecipientComponent', () => {
   let component: ViewRecipientComponent;
   let fixture: ComponentFixture<ViewRecipientComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ViewRecipientComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ViewRecipientComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
