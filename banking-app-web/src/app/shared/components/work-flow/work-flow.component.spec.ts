import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Component, DebugElement, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { IWorkflowStep, IStepInfo, IWorkflowChildComponent } from './work-flow.models';
import { WorkFlowComponent } from './work-flow.component';
import { StepDirective } from './step.directive';
import { Constants } from './../../../core/utils/constants';
import { BottomButtonComponent } from './../../controls/buttons/bottom-button.component';
import { WindowRefService } from './../../../core/services/window-ref.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Input } from '@angular/core/src/metadata/directives';
import { GaTrackingService } from '../../../core/services/ga.service';
import { Subject } from 'rxjs/Subject';
const spyNextClick = jasmine.createSpy('nextClick');
const spyStepClick = jasmine.createSpy('stepClick');

@Component({
   selector: 'app-step-one-component',
   template: '<h1>{{title}}</h1>'
})
class StepOneComponent {
   title = 'Step One';
   @Output() isComponentValid: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() isButtonLoader: EventEmitter<boolean> = new EventEmitter<boolean>();

   constructor() {
   }

   nextClick(currentStep: number) {
      return Observable.of(spyNextClick(currentStep));
   }

   stepClick(stepInfo: IStepInfo) {
      return Observable.of(spyStepClick(stepInfo));
   }

   validate(isValid) {
      this.isComponentValid.emit(isValid);
      this.isButtonLoader.emit(isValid);
   }
}

@Component({
   selector: 'app-step-two-component',
   template: '<h1>{{title}}</h1>'
})
class StepTwoComponent {
   title = 'Step two';

   constructor() {
   }
}

@Component({
   selector: 'app-step-three-component',
   template: `<h1>{{title}}</h1><form #thirdForm="ngForm">
      <input type="text" id="thirdCompoTextBox" #textBox="ngModel" [(ngModel)] = "recipientName" required /></form >`
})
class StepThreeComponent implements AfterViewInit, IWorkflowChildComponent {
   title = 'Step three';
   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('thirdForm') thirdForm: NgForm;
   @ViewChild('textBox') textBox: ElementRef;
   isNextClicked: boolean;
   isStepClicked: boolean;
   recipientName: string;
   constructor() {
   }
   ngAfterViewInit() {
      this.thirdForm.valueChanges
         .subscribe(values => this.validate());
   }
   validate() {
      this.isComponentValid.emit(this.thirdForm.valid);
   }
   nextClick(currentStep: number) {
      this.isNextClicked = true;
   }

   stepClick(stepInfo: IStepInfo) {
      this.isStepClicked = true;
   }
}
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
   notifySectionChange: new Subject()
};
describe('WorkFlowComponent', () => {
   let component: WorkFlowComponent;
   let fixture: ComponentFixture<WorkFlowComponent>;
   let de: DebugElement;
   let el: HTMLElement;
   let router: Router;
   const routerStub = {
      navigate: jasmine.createSpy('navigate')
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterModule, RouterTestingModule],
         declarations: [WorkFlowComponent, StepDirective, StepOneComponent, StepTwoComponent,
            StepThreeComponent, BottomButtonComponent, SpinnerComponent],
         providers: [

            {
               provide: WindowRefService, useValue: {
                  nativeWindow: {
                     scrollTo() { }
                  }
               }
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ],
      }).overrideModule(BrowserDynamicTestingModule, {
         set: {
            entryComponents: [StepOneComponent, StepTwoComponent, StepThreeComponent]
         }
      });
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(WorkFlowComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      component.activeStep = 1;
      component.steps = [
         {
            summary: {
               title: 'Who would you like to pay?',
               sequenceId: 1,
               isNavigated: false
            },
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: StepOneComponent
         },
         {
            summary: {
               title: 'How much would you like to pay?',
               sequenceId: 2,
               isNavigated: false
            },
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: StepTwoComponent
         },
         {
            summary: {
               title: 'this is third component?',
               sequenceId: 3,
               isNavigated: false
            },
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: StepThreeComponent
         }
      ];
      component.workflowService = {
         getStepInfo(currentStep: IWorkflowStep) { },
         getStepInitialInfo(currentStep: IWorkflowStep) { }
      };
      component.workFlowInfo = {
         title: 'transfer',
         cancelButtonText: Constants.VariableValues.cancelButtonText,
         cancelRouteLink: '/dashboard'
      };
      de = fixture.debugElement.query(By.css('.current-steps .step-title'));
      el = de.nativeElement;

      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should have work flow service and step host', () => {
      expect(component.workflowService).toBeDefined();
      expect(component.stepHost).toBeDefined();
   });

   it('should display next step', () => {
      const stepTwo = 2;
      component.isValid = true;
      component.onNextClick();
      fixture.detectChanges();
      expect(el.textContent.trim()).toEqual(component.steps.filter(step => step.summary.sequenceId === stepTwo).pop().summary.title);
   });

   it('should display selected step', () => {
      const stepOne = 1;
      component.isValid = true;
      component.onNextClick();
      component.onStepClick(stepOne);
      fixture.detectChanges();
      expect(el.textContent.trim()).toEqual(component.steps.filter(step => step.summary.sequenceId === stepOne).pop().summary.title);
   });

   it('should define nextClick in child component', () => {
      expect(component.componentRef.instance.nextClick).toBeDefined();
   });

   it('should not define nextClick in child component', () => {
      component.isValid = true;
      component.onNextClick();
      expect(component.componentRef.instance.nextClick).toBeUndefined();
   });

   it('should call nextClick of child component', () => {
      const activeStep = 1;
      component.isValid = true;
      component.onNextClick();
      expect(spyNextClick).toHaveBeenCalledWith(activeStep);
   });

   it('should call not call nextClick for the parent emitter', () => {
      component.activeStep = 2;
      component.isValid = true;
      component.onNextClick();
      expect(component.activeStep).toBe(3);
   });

   it('should define stepClick in child component', () => {
      expect(component.componentRef.instance.stepClick).toBeDefined();
   });

   it('should not define stepClick in child component', () => {
      component.isValid = true;
      component.onNextClick();
      expect(component.componentRef.instance.stepClick).toBeUndefined();
   });

   it('should call stepClick of child component', () => {
      component.activeStep = 2;
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };

      component.onStepClick(stepInfo.stepClicked);
      expect(spyStepClick).toHaveBeenCalledWith(stepInfo);
   });

   it('should call nextClick for the parent emitter', () => {
      const activeStep = 1;
      component.nextClick.subscribe(data => expect(data).toEqual(activeStep));
      const nextButton = fixture.debugElement.query(By.css('button'));
      nextButton.triggerEventHandler('click', null);
   });

   it('should call stepClick for the parent emitter', () => {
      const activeStep = 2;
      const stepClicked = 1;
      component.isValid = true;
      component.stepClick.subscribe(data => {
         expect(data.activeStep).toEqual(activeStep);
         expect(data.stepClicked).toEqual(stepClicked);
      });

      const nextButton = fixture.debugElement.query(By.css('button'));
      nextButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      const stepButton = fixture.debugElement.query(By.css('button.edit-link'));
      stepButton.triggerEventHandler('click', null);
      fixture.detectChanges();
   });

   it('should validate component to true', () => {
      component.componentRef.instance.isComponentValid.subscribe(data => expect(data).toBe(true));
      component.componentRef.instance.validate(true);
      fixture.detectChanges();
   });
   it('should validate component to false', () => {
      component.componentRef.instance.isComponentValid.subscribe(data => expect(data).toBe(false));
      component.componentRef.instance.validate(false);
      fixture.detectChanges();
   });
   it('should validate button loader to true', () => {
      component.componentRef.instance.isButtonLoader.subscribe(data => expect(data).toBe(true));
      component.componentRef.instance.validate(true);
      fixture.detectChanges();
   });
   it('should validate button loader to false', () => {
      component.componentRef.instance.isButtonLoader.subscribe(data => expect(data).toBe(false));
      component.componentRef.instance.validate(false);
      fixture.detectChanges();
   });
   it('should set title of step to default ', () => {
      component.updateStepInitialSummary(component.steps[1]);
      expect(component.steps[1].summary.title).toBeDefined();
   });
   it('should set title of step with  updated information ', () => {
      component.updateStepSummary(component.steps[1]);
      expect(component.steps[1].summary.title).toBeDefined();
   });
   it('should not load next component if no next emitter found', () => {
      component.activeStep = 2;
      component.loadComponent();
      component.isValid = true;
      component.onNextClick();
      expect(component.componentRef.instance.nextClick).toBeDefined();
   });

   it('should validate Next Click', () => {
      component.componentRef = {};
      expect(component.validateNextClick()).toBeUndefined();
   });
   it('should validate for third component where input field is required', () => {
      component.activeStep = 2;
      component.isValid = true;
      component.onNextClick();
      expect(component.activeStep).toBe(3);
      component.validateNextClick();
      expect(component.activeStep).toBe(3);
   });
   it('should validate for third component where input field is required and value is there', () => {
      component.activeStep = 2;
      component.isValid = true;
      component.onNextClick();
      expect(component.activeStep).toBe(3);
      const thirdComponent = <StepThreeComponent>component.componentRef.instance;
      thirdComponent.recipientName = 'something';
      component.isValid = true;
      component.nextClick.subscribe((activeStep) => {
         expect(activeStep).toBe(3);
      });
      component.validateNextClick();
   });
   it('should not navigate if component is not valid', () => {
      component.activeStep = 2;
      component.isValid = false;
      component.onNextClick();
      expect(component.activeStep).toBe(2);
   });
   it('should emit declineClick onDeclineClick ', () => {
      component.onDeclineClick();
      component.declineClick.subscribe((data) => {
         expect(true).toBe(true);
      });
   });
});
