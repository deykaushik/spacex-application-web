import { RouterTestingModule } from '@angular/router/testing';
import { WorkflowService } from './../../../../core/services/stepper-work-flow-service';
import { StepperNavBarComponent } from './stepper-nav-bar.component';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { assertModuleFactoryCaching } from '../../../../test-util';

describe('StepperNavBarComponent', () => {
   let component: StepperNavBarComponent;
   let fixture: ComponentFixture<StepperNavBarComponent>;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [StepperNavBarComponent],
         providers: [WorkflowService]
      });
   });
   beforeEach(inject([WorkflowService], (workflowService: WorkflowService) => {
      fixture = TestBed.createComponent(StepperNavBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      router = TestBed.get(Router);
   }));

   it('should be created', () => {
      expect(component).toBeDefined();
   });
   it('should emit the step click', () => {
      spyOn(component.clickedStep, 'emit');
      component.onStepClick(1);
      expect(component.clickedStep.emit).toHaveBeenCalled();
   });
   it('should exit the stepper', () => {
      spyOn(component.exit, 'emit');
      component.exitStepper();
      expect(component.exit.emit).toHaveBeenCalled();
   });
   it('should navigate to dashboard', () => {
      const spy = spyOn(router, 'navigateByUrl');
      spyOn(component, 'goToDashboard').and.callThrough();
      component.goToDashboard();
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/dashboard');
   });
});
