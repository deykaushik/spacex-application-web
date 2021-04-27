import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { assertModuleFactoryCaching } from './../../../test-util';
import { BuyForComponent } from './buy-for.component';
import { BuyService } from '../buy.service';
import { IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { GaTrackingService } from '../../../core/services/ga.service';

const buyServiceStub = {
   buyWorkflowSteps: {
      buyTo: {
         isDirty: false
      },
      buyFor: {
         isDirty: false
      }
   },
   getBuyForVm: jasmine.createSpy('getBuyToVm').and.returnValue({}),
   saveBuyForInfo: jasmine.createSpy('saveBuyForInfo')
};
const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};


describe('BuyForComponent', () => {
   let component: BuyForComponent;
   let fixture: ComponentFixture<BuyForComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyForComponent],
         imports: [FormsModule],
         providers: [{ provide: BuyService, useValue: buyServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyForComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should have default notification as NONE', () => {
      const noneNotification = component.notifications.find(m => m.value === Constants.notificationTypes.none);
      expect(component.vm.notificationType).toBe(noneNotification.value);
   });

   it('should change notification successfully', () => {
      const SMSNotification = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
      component.onNotificationChange(SMSNotification);
      expect(component.vm.notificationType).toBe(SMSNotification.value);
   });

   // when all values are valid
   it('form should be validated with valid Email values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.email,
         notificationInput: 'test@mail.com'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });

   // when all values are valid
   it('form should be invalid with invalid Email values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.email,
         notificationInput: 'test.mail.com'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   });

   // when all values are valid
   it('form should be invalid with Empty Email value ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.email,
         notificationInput: ''
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   });

   // when all values are valid
   it('form should be validated with valid SMS number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.SMS,
         notificationInput: '9898989898'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });

   // when SMS number is not valid
   it('form should be validated with invalid SMS number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.SMS,
         notificationInput: '876'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   });

   // when all values are valid
   it('form should be validated with valid Fax number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.Fax,
         notificationInput: '9898989898'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });

   // when SMS number is not valid
   it('form should be validated with invalid Fax number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.Fax,
         notificationInput: '876'
      };
      fixture.detectChanges();
      component.validate();
      component.isComponentValid.subscribe((data) => {
         expect(data).toBeFalsy();
      });
   });

   // when all values are valid
   it('form should be validated with valid None notification ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.none,
         notificationInput: ''
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });


   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });


   it('should contain step handler', () => {
      expect(component.stepClick).toBeDefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 3,
         stepClicked: 2
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should allow to change mobile/fax number', () => {
      component.vm.yourReference = 'Test your reference';
      component.vm.notificationInput = '1234567891';
      fixture.detectChanges();

      component.vm.notificationInput = '1234567890';
      component.onMobileNumberChange(component.vm.notificationInput);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });
   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.buyForForm.dirty).toBe(false);
   });
});
