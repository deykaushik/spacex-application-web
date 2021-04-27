import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackAttemptsComponent } from './feedback-attempts.component';
import { assertModuleFactoryCaching } from '../../test-util';

describe('FeedbackAttemptsComponent', () => {
   let component: FeedbackAttemptsComponent;
   let fixture: ComponentFixture<FeedbackAttemptsComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [FeedbackAttemptsComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(FeedbackAttemptsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should display message with hours', () => {
      component.remainingTime = '24';
      component.ngOnChanges();
      expect(component.value.hours).toEqual('hours');
   });
});
