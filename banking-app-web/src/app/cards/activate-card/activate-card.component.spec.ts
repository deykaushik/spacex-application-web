import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CardService } from '../card.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { ActivateCardComponent } from './activate-card.component';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IPlasticCard, IApiResponse, IActivateCardEmitObj } from '../../core/services/models';
import { emit } from 'cluster';
import { Constants } from '../../core/utils/constants';

const mockCardsPlasticManagement: IPlasticCard[] = [{
   plasticId: 1,
   plasticNumber: '123456 0000 7891',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: 'F2F',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   cardAccountNumber: '999',
   owner: false,
   availableBalance: 123,
   allowATMLimit: false,
   allowBranch: false,
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   isCardFreeze: false,
   F2FBranch: '',
   ItemAccountId: '1234',
   actionListItem: [{ action: 'canSoftBlock', result: false },
   { action: 'canContactLess', result: false },
   { action: 'canInternetPurchase', result: true }]
},
{
   plasticId: 2,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: 'IAD',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   cardAccountNumber: '999',
   owner: false,
   availableBalance: 123,
   allowATMLimit: false,
   allowBranch: false,
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   isCardFreeze: false,
   F2FBranch: '',
   ItemAccountId: '2222',
   actionListItem: [{ action: 'canSoftBlock', result: true },
   { action: 'canContactLess', result: true },
   { action: 'canInternetPurchase', result: false }]
},
{
   plasticId: 4,
   plasticNumber: '123456 0000 7892',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: 'IAD',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   cardAccountNumber: '999',
   owner: false,
   availableBalance: 123,
   allowATMLimit: false,
   allowBranch: false,
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   isCardFreeze: false,
   F2FBranch: '',
   ItemAccountId: '44444',
   actionListItem: [{ action: 'canSoftBlock' }]
},
{
      plasticId: 5,
      plasticNumber: '123456 0000 7892',
      plasticStatus: 'Blocked',
      plasticType: '',
      dcIndicator: 'D',
      plasticCustomerRelationshipCode: '',
      plasticStockCode: '',
      plasticCurrentStatusReasonCode: 'F2F',
      plasticBranchNumber: '1',
      nameLine: 'Master',
      expiryDate: '2020-11-12 12:00:00 AM',
      issueDate: '',
      plasticDescription: '',
      cardAccountNumber: '999',
      owner: false,
      availableBalance: 123,
      allowATMLimit: false,
      allowBranch: false,
      allowBlock: false,
      allowReplace: false,
      linkedAccountNumber: '123',
      isCardFreeze: false,
      F2FBranch: '',
      ItemAccountId: '44444',
      actionListItem: [{ action: 'canSoftBlock' }]
   }
];

const mockDormantResponse: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'CASA account is dormant, requested card should not be proceed'
               }
            ]
         }
      ]
   }
};

const mockSuccessResponse: IApiResponse = {
      data: {},
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'R00',
                     status: 'SUCCESS',
                     reason: 'Success'
                  }
               ]
            }
         ]
      }
};

const mockResponseFailure: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R01',
                  status: 'FAILURE',
                  reason: 'Failure'
               }
            ]
         }
      ]
   }
};

const cardServiceStub = {
   updateActivateCard: jasmine.createSpy('updateActivateCard').and.returnValue(Observable.of(mockSuccessResponse)),
   getPlasticCards: jasmine.createSpy('getPlasticCards').and.returnValue(Observable.of(mockCardsPlasticManagement)),
   updateCardActionListFailure: Observable.of(mockResponseFailure)
};

const mockUpdateCardActivateServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('ActivateCardComponent', () => {
   let component: ActivateCardComponent;
   let fixture: ComponentFixture<ActivateCardComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         ],
         declarations: [ActivateCardComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ActivateCardComponent);
      component = fixture.componentInstance;
      component.plasticId = 12345600007890;
      component.card = mockCardsPlasticManagement[0];
      component.activateCardLabels.actionRequest = 'ACTIVATE';
      component.showLoader = false;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call onNext method and update activate card status', () => {
      spyOn(component.nextClick, 'emit');
      const emitValue: IActivateCardEmitObj = {
         reason: 'Success',
         result: 'R00'
      };
      cardServiceStub.updateActivateCard.and.returnValue(cardServiceStub.updateCardActionListFailure);
      component.card.dcIndicator = 'C';
      component.onNext();
      expect(component.nextClick.emit).toHaveBeenCalled();
   });

   it('should call onNext method and emit value for failure response', () => {
      spyOn(component.nextClick, 'emit');
      const emitFailureValue: IActivateCardEmitObj = {
         reason: 'Failure',
         result: 'R01'
      };
      cardServiceStub.updateActivateCard.and.returnValue(cardServiceStub.updateCardActionListFailure);
      component.onNext();
      expect(component.nextClick.emit).toHaveBeenCalledWith(emitFailureValue);
   });

   it('should cancel the overlay', () => {
      component.showOverlay = false;
      component.onCancel();
      expect(component.showOverlay).toBe(false);
   });

   it('should display activate pop up overlay on callActivate method', () => {
      const event = true;
      component.callActivate(event);
      expect(component.showOverlay).toBe(true);
   });

   it('should set false to showloader, showOverlay and isActivateCard when api service error occurs', () => {
      cardServiceStub.updateActivateCard.and.returnValue(mockUpdateCardActivateServiceError);
      component.onNext();
      expect(component.showLoader).toBe(false);
      expect(component.showOverlay).toBe(false);
      expect(component.isCardActivated).toBe(true);
   });

   it('should send event when credit card reason code is F2F', () => {
      spyOn(component, 'sendEvent');
      component.card = mockCardsPlasticManagement[0];
      component.onNext();
      expect(component.sendEvent).toHaveBeenCalled();
   });

   it('should send event when  debit card reason code is F2F', () => {
      spyOn(component, 'sendEvent');
      component.card = mockCardsPlasticManagement[3];
      component.onNext();
      expect(component.sendEvent).toHaveBeenCalled();
   });

   it('should send event when credit card reason code is IAD', () => {
      spyOn(component, 'sendEvent');
      component.card = mockCardsPlasticManagement[1];
      component.onCancel();
      expect(component.sendEvent).toHaveBeenCalled();
   });

   it('should send event when debit card reason code is IAD', () => {
      spyOn(component, 'sendEvent');
      component.card = mockCardsPlasticManagement[2];
      component.onCancel();
      expect(component.sendEvent).toHaveBeenCalled();
   });

   it('should emit emitvalue object when card is debit card and result code R00', () => {
      component.card = mockCardsPlasticManagement[2];
      spyOn(component.nextClick, 'emit');
      const result = 'R00';
      const reason = 'CASA account is dormant, requested card should not be proceed';
      const emitValue: IActivateCardEmitObj = {
         reason: 'CASA account is dormant, requested card should not be proceed',
         result: 'R00'
      };
      cardServiceStub.updateActivateCard.and.returnValue(Observable.of(mockDormantResponse));
      component.onNext();
      expect(component.nextClick.emit).toHaveBeenCalledWith(emitValue);
   });

   it('should set emitvalue object for success result and reason is dormant', () => {
      component.card = mockCardsPlasticManagement[2];
      const result = Constants.labels.cardManageConstants.successStatusCode;
      const reason = Constants.labels.activateCardLabels.responseReasonMessages.accountIsDormant;
      cardServiceStub.updateActivateCard.and.returnValue(Observable.of(mockDormantResponse));
      component.onNext();
      expect(component.emitValue.reason).toEqual(reason);
      expect(component.emitValue.result).toEqual(result);
   });

   it('should set emitvalue object for success result and reason is success', () => {
      component.card = mockCardsPlasticManagement[2];
      const result = Constants.labels.cardManageConstants.successStatusCode;
      const reason = Constants.labels.activateCardLabels.responseReasonMessages.success;
      cardServiceStub.updateActivateCard.and.returnValue(Observable.of(mockSuccessResponse));
      component.onNext();
      expect(component.emitValue.reason).toEqual(reason);
      expect(component.emitValue.result).toEqual(result);
   });

   it('should set emitvalue object for success result and reason is success', () => {
      component.card = mockCardsPlasticManagement[2];
      const result = Constants.labels.activateCardLabels.errorCode;
      const reason = Constants.labels.activateCardLabels.responseReasonMessages.failure;
      cardServiceStub.updateActivateCard.and.returnValue(Observable.of(mockResponseFailure));
      component.onNext();
      expect(component.emitValue.reason).toEqual(reason);
      expect(component.emitValue.result).toEqual(result);
   });

   it('should send event when card is debit card and plasticCurrentStatusReasonCode is F2F', () => {
      component.card.plasticCurrentStatusReasonCode = 'F2F';
      component.card.dcIndicator = 'D';
      const event = true;
      component.callActivate(event);
      expect(gaTrackingServiceStub.sendEvent).toHaveBeenCalled();
   });

   it('should send event when card is debit card and plasticCurrentStatusReasonCode is IAD', () => {
      component.card.plasticCurrentStatusReasonCode = 'IAD';
      component.card.dcIndicator = 'D';
      const event = true;
      component.callActivate(event);
      expect(gaTrackingServiceStub.sendEvent).toHaveBeenCalled();
   });

   it('should send event when card is debit card and plasticCurrentStatusReasonCode is F2F for cancel activate debit card', () => {
      component.card.plasticCurrentStatusReasonCode = 'F2F';
      component.card.dcIndicator = 'D';
      component.onCancel();
      expect(gaTrackingServiceStub.sendEvent).toHaveBeenCalled();
   });

   it('should send event when card is credit card and plasticCurrentStatusReasonCode is IAD for  activate dormant debit card', () => {
      component.card.plasticCurrentStatusReasonCode = 'IAD';
      component.card.dcIndicator = 'C';
      component.onNext();
      expect(gaTrackingServiceStub.sendEvent).toHaveBeenCalled();
   });
});
