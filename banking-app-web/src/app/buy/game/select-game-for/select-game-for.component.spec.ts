import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { MobileNumberMaskPipe } from './../../../shared/pipes/mobile-number-mask.pipe';
import { GameService } from './../game.service';
import { SelectGameForComponent } from './select-game-for.component';
import { Constants } from '../../../core/utils/constants';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { IClientDetails } from '../../../core/services/models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GaTrackingService } from '../../../core/services/ga.service';

function getClientDetails(): IClientDetails {
   return {
      CisNumber: 110282180605,
      FirstName: 'Marc',
      SecondName: '',
      Surname: 'Schutte',
      FullNames: 'Mr Marc Schutte',
      CellNumber: '+27992180605',
      EmailAddress: '',
      BirthDate: '1977-03-04T22:00:00Z',
      FicaStatus: 701,
      SegmentId: 'AAAZZZ',
      IdOrTaxIdNo: 7703055072088,
      SecOfficerCd: '36407',
      PreferredName: 'Marc',
      AdditionalPhoneList: [
         {
            AdditionalPhoneType: 'BUS',
            AdditionalPhoneNumber: '(086) 1828828'
         },
         {
            AdditionalPhoneType: 'CELL',
            AdditionalPhoneNumber: '+27992180605'
         },
         {
            AdditionalPhoneType: 'HOME',
            AdditionalPhoneNumber: '(078) 2228519'
         }
      ],
      Address: {
         AddressLines: [
            {
               AddressLine: 'G12 KYLEMORE'
            },
            {
               AddressLine: 'THE MARINA RESIDENTS DOCK ROAD'
            },
            {
               AddressLine: 'WATERFRONT'
            }
         ],
         AddressCity: 'CAPE TOWN',
         AddressPostalCode: '08001'
      }
   };
}

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   gameWorkflowSteps: {
      selectGameTo: {
         isDirty: false
      },
      selectGameAmount: {
         isDirty: false
      },
      selectGameFor: {
         isDirty: false
      },
      selectGameReview: {
         isDirty: false
      }
   },
   getSelectGameForVm: jasmine.createSpy('getSelectGameForVm').and.returnValue({}),
   saveSelectGameForInfo: jasmine.createSpy('saveSelectGameForInfo'),
   getSelectGameVm: jasmine.createSpy('getSelectGameVm').and.returnValue({
      game: 'PWB',
      method: 'a'
   }),
};

const clientDetailsObserver: BehaviorSubject<any> = new BehaviorSubject<any>(getClientDetails());

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('SelectGameFor Component', () => {
   let component: SelectGameForComponent;
   let fixture: ComponentFixture<SelectGameForComponent>;
   let gameService: GameService;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [SelectGameForComponent, MobileNumberMaskPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: GameService, useValue: gameServiceStub },
         {
            provide: ClientProfileDetailsService, useValue: {
               clientDetailsObserver: clientDetailsObserver
            }
         },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SelectGameForComponent);
      component = fixture.componentInstance;
      gameService = fixture.debugElement.injector.get(GameService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should have default notification as SMS', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const smsSelected = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
         expect(component.vm.notification.value).toBe(smsSelected.value);
      });
   });

   it('should change notification successfully', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const faxSelected = component.notifications.find(m => m.value === Constants.notificationTypes.Fax);
         component.onNotificationChange(null, faxSelected);
         expect(component.vm.notification.value).toBe(faxSelected.value);
         expect(component.vm.notificationInput).toBe('');
      });
   });

   it('should change notification successfully for SMS', () => {
      component.userMobileNumber = '1234567891';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const smsSelected = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
         component.onNotificationChange(null, smsSelected);
         expect(component.vm.notification.value).toBe(smsSelected.value);
         expect(component.vm.notificationInput).toBe(component.userMobileNumber);
      });
   });

   // when all values are valid
   it('form should be validated with valid Email values ', () => {
      expect(component.isValid).toBeFalsy();
      component.vm = {
         yourReference: 'test value',
         notification: { name: Constants.notificationTypes.email, value: Constants.notificationTypes.email },
         notificationInput: 'test@mail.com'
      };
      component.validate();
      expect(component.isValid).toBeTruthy();
   });

   // when all values are valid
   it('form should be invalidated with invalid Email values ', () => {
      expect(component.isValid).toBeFalsy();
      component.vm = {
         yourReference: 'test value',
         notification: { name: Constants.notificationTypes.email, value: Constants.notificationTypes.email },
         notificationInput: 'test.mail.com'
      };
      component.validate();
      expect(component.isValid).toBeFalsy();
   });

   // when all values are valid
   it('form should be invalidated with Empty Email value ', () => {
      expect(component.isValid).toBeFalsy();
      component.vm = {
         yourReference: 'test value',
         notification: { name: Constants.notificationTypes.email, value: Constants.notificationTypes.email },
         notificationInput: ''
      };
      component.validate();
      expect(component.isValid).toBeFalsy();
   });

   // when all values are valid
   it('form should be validated with valid SMS number values ', () => {
      expect(component.isValid).toBeFalsy();
      component.vm = {
         yourReference: 'test value',
         notification: { name: Constants.notificationTypes.SMS, value: Constants.notificationTypes.SMS },
         notificationInput: '9898989898'
      };
      component.validate();
      expect(component.isValid).toBeTruthy();
   });

   // when SMS number is not valid
   it('form should be validated with invalid SMS number values ', () => {
      expect(component.isValid).toBeFalsy();
      component.vm = {
         yourReference: 'test value',
         notification: { name: Constants.notificationTypes.SMS, value: Constants.notificationTypes.SMS },
         notificationInput: '876'
      };
      component.validate();
      expect(component.isValid).toBeFalsy();
   });

   // when all values are valid
   it('form should be validated with valid None notification ', () => {
      expect(component.isValid).toBeFalsy();
      component.vm = {
         yourReference: 'test value',
         notification: { name: Constants.notificationTypes.none, value: Constants.notificationTypes.none },
         notificationInput: '876'
      };
      component.validate();
      expect(component.isValid).toBeTruthy();
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      component.isValid = true;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should contain step handler', () => {
      expect(component.stepClick).toBeDefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should allow to change mobile number', () => {
      component.vm.yourReference = 'Test your reference';
      component.vm.notificationInput = '1234567891';
      fixture.detectChanges();

      component.vm.notificationInput = '1234567890';
      component.onMobileNumberChange(component.vm.notificationInput);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
         expect(component.isValid).toBe(true);
      });
   });
   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.selectGameForForm.valid).toBe(true);
   });
   it('should set game as Lotto on Initialization', () => {
      gameService.getSelectGameVm = jasmine.createSpy('getSelectGameVm').and.returnValue({
         game: 'LOT',
         method: 'a'
      }),
         gameService.getSelectGameForVm = jasmine.createSpy('getSelectGameForVm').and.returnValue({}),
         component.ngOnInit();
   });

   it('should reset notification input and set mobile number input as pristine and untouched on edit click', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onEditClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.vm.notificationInput).toBe('');
            expect(component.selectGameForForm.form.controls.hiddenNotificationInput.dirty).toBe(false);
            expect(component.selectGameForForm.form.controls.hiddenNotificationInput.touched).toBe(false);
         });
      });
   });

   it('should check for valid value on save click', () => {
      component.vm.notificationInput = '1234567891';
      component.isCellphoneEditMode = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onSaveClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.isCellphoneEditMode).toBe(false);
         });
      });
   });

   it('should not exit edit mode for invalid value on save click', () => {
      component.vm.notificationInput = '123456789';
      component.isCellphoneEditMode = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onSaveClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.isCellphoneEditMode).toBe(true);
         });
      });
   });

   it('should reset notification input on cancel click', () => {
      component.savedMobileNumber = '1234567891';
      component.isCellphoneEditMode = true;
      component.vm.notificationInput = '12345';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onCancelClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.vm.notificationInput).toBe('1234567891');
            expect(component.isCellphoneEditMode).toBe(false);
         });
      });
   });

   it('should set user mobile number for valid data', () => {
      const clientDetails = getClientDetails();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.setUserMobile(clientDetails);
         expect(component.userMobileNumber).toBe(clientDetails.CellNumber);
      });
   });

   it('should not throw error if hidden notification input is undefined', () => {
      const clientDetails = getClientDetails();
      component.setUserMobile(clientDetails);
      expect(component.selectGameForForm.form.controls.hiddenNotificationInput).toBeUndefined();
      clientDetailsObserver.next(clientDetails);
      expect(component.selectGameForForm.form.controls.hiddenNotificationInput).toBeUndefined();
   });

   it('should set not user mobile number for invalid data', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.userMobileNumber = undefined;
         component.setUserMobile({});
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.userMobileNumber).toBeUndefined();
         });
      });
   });

   it('should cancel mobile number update if mobile number entered by user is empty', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.vm.notificationInput = '';
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            component.onMobileFocusOut();
            expect(component.isCellphoneEditMode).toBeFalsy();
         });
      });
   });

   it('should keep mobile number in edit mode for invalid number entered by user', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.vm.notificationInput = '123';
         component.isCellphoneEditMode = true;
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            component.onMobileFocusOut();
            expect(component.isCellphoneEditMode).toBeTruthy();
         });
      });
   });

   it('should set the user mobile number in case user does not type a number', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.vm.notificationInput = '';
         component.savedMobileNumber = component.userMobileNumber;
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            component.onMobileFocusOut();
            expect(component.vm.notificationInput).toBe(component.userMobileNumber);
         });
      });
   });

   it('should set mobile number in editable mode if there is no user mobile number on notification change', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.vm.notificationInput = '';
         component.userMobileNumber = '';
         const smsSelected = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
         component.onNotificationChange(null, smsSelected);
         expect(component.isCellphoneEditMode).toBeTruthy();
      });
   });
});
