import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { assertModuleFactoryCaching } from './../../test-util';
import { CommonUtility } from '../../core/utils/common';
import { IPlasticCard, IApiResponse } from './../../core/services/models';
import { ICardFreeze } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { SystemErrorService } from '../../core/services/system-services.service';
import { GaTrackingService } from '../../core/services/ga.service';

import { ICardBlockResult, ICardBlockInfo, ICardReplaceInfo, ICardUpdateActionListData } from '../models';
import { CardService } from '../card.service';
import { ApoService } from '../apo/apo.service';
import { PreFillService } from '../../core/services/preFill.service';
import { CardManageComponent } from './card-manage.component';
import { IAutoPayDetail } from '../apo/apo.model';
import { OverseaTravelService } from '../overseas-travel/overseas-travel.service';

const returnGetCardAdditionalDetails = Observable.of({
   data:
      {
         ActionList:
            [{ action: '', result: true }]
      },
   metadata: {
      resultData:
         [{
            resultDetail: [{
               operationReference: '',
               result: '', 'status': '', reason: ''
            }
            ]
         }]
   }
});

const cardServiceStub = {

   cardLimitUpdateEmitter: new EventEmitter<boolean>(),
   cardBlockStatusEmitter: new EventEmitter<ICardBlockResult>(),
   retryCardBlockEmitter: new EventEmitter<ICardBlockInfo>(),
   replaceCardBranchLocatorEmitter: new EventEmitter<ICardReplaceInfo>(),
   cardReplaceStatusEmitter: new EventEmitter<ICardReplaceInfo>(),
   hideBlockCardStatusEmitter: new EventEmitter<boolean>(),
   hideReplaceCardStatusEmitter: new EventEmitter<boolean>(),
   updateCardLimit: jasmine.createSpy('updateCardLimit'),
   closeReplacePopUpEmitter: new EventEmitter<boolean>(),
   closeReplaceCardPopup: jasmine.createSpy('closeReplaceCardPopup'),
   closeReplaceCardStatusPopup: jasmine.createSpy('closeReplaceCardStatusPopup')
};

const overseaTravelServiceStub = {
      emitOtnSuccess: new EventEmitter<boolean>()
};

const mockCard: IPlasticCard = {
   plasticId: 1,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false
};
const mockCardsPlasticManagement: IPlasticCard[] = [{
   plasticId: 1,
   plasticNumber: '123456 0000 7891',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
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
   { action: 'canInternetPurchase', result: true },
   { action: 'ActivateCard', result: false}
]
},
{
   plasticId: 2,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
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
   { action: 'canInternetPurchase', result: false },
   { action: 'ActivateCard', result: false}
]
},
{
   plasticId: 4,
   plasticNumber: '123456 0000 7892',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
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
   actionListItem: [{ action: 'canSoftBlock' },
   { action: 'ActivateCard', result: false }]
},
{
   plasticId: 5,
   plasticNumber: '123456 0000 7892',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
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
   actionListItem: [{ action: 'canSoftBlock' },
   { action: 'ActivateCard', result: false }
]
},
{
      plasticId: 5,
      plasticNumber: '123456 0000 7892',
      plasticStatus: 'Blocked',
      plasticType: '',
      dcIndicator: 'charge',
      plasticCustomerRelationshipCode: '',
      plasticStockCode: '',
      plasticCurrentStatusReasonCode: '',
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
      actionListItem: [{ action: 'canSoftBlock' },
      { action: 'ActivateCard', result: false }
   ]
   }
];

const statusChangeDataSuccessTapGo: ICardUpdateActionListData = {
   action: 'canContactLess',
   result: true,
   plasticId: 1,
   eventSuccessful: true
};
const statusChangeDataSuccessInternetPurchase: ICardUpdateActionListData = {
   action: 'canInternetPurchase',
   result: true,
   plasticId: 1,
   eventSuccessful: true
};
const statusChangeDataSuccessCardFreeze: ICardUpdateActionListData = {
   action: 'canSoftBlock',
   result: false,
   plasticId: 1,
   eventSuccessful: true
};

const mockData = {
   'data': [{
      'plasticId': 1, 'plasticNumber': '377095 40026 0134', 'plasticStatus': 'Active', 'plasticType': 'AV2', 'dcIndicator': 'C',
      'plasticCustomerRelationshipCode': 'PRI', 'plasticStockCode': 'AC7', 'plasticCurrentStatusReasonCode': 'SFT',
      'plasticBranchNumber': '1', 'nameLine': 'PGBCK172 27092016', 'expiryDate': '2019-09-30 12:00:00 AM',
      'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription': 'AMEX SAA CO-BRANDED CREDIT CARD - GOLD',
      'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance': 289311.67, 'allowATMLimit': true,
      'allowBranch': true, 'allowBlock': true, 'allowReplace': false
   },
   {
      'plasticId': 2, 'plasticNumber': '529874 0000743030', 'plasticStatus': 'Active', 'plasticType': 'MW4',
      'dcIndicator': 'C', 'plasticCustomerRelationshipCode': 'ADI', 'plasticStockCode': 'MW4',
      'plasticCurrentStatusReasonCode': 'SFT', 'plasticBranchNumber': '9163', 'nameLine': 'ABEGAIL LICINDA FLAANDORP',
      'expiryDate': '2020-10-31 12:00:00 AM', 'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription':
         'MASTERCARD SAA GOLD', 'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance':
         289311.67, 'allowATMLimit': true, 'allowBranch': true, 'allowBlock': true, 'allowReplace': false
   },
   {
      'plasticId': 3, 'plasticNumber': '529874 0000753039', 'plasticStatus': 'Active', 'plasticType': 'MW4', 'dcIndicator': 'C',
      'plasticCustomerRelationshipCode': 'PRI', 'plasticStockCode': 'MW4', 'plasticCurrentStatusReasonCode': 'AAA',
      'plasticBranchNumber': '1', 'nameLine': 'PGBCK172 27092016',
      'expiryDate': '2019-09-30 12:00:00 AM', 'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription': 'MASTERCARD SAA GOLD',
      'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance': 289311.67, 'allowATMLimit': true,
      'allowBranch': true, 'allowBlock': true, 'allowReplace': true
   },
   {
      'plasticId': 4, 'plasticNumber': '529874 0000753039', 'plasticStatus': 'Active', 'plasticType': 'G1D', 'dcIndicator': 'D',
      'plasticCustomerRelationshipCode': 'PRI', 'plasticStockCode': 'GD1', 'plasticCurrentStatusReasonCode': 'AAA',
      'plasticBranchNumber': '702', 'nameLine': 'PGBCK172 27092016',
      'expiryDate': '2019-09-30 12:00:00 AM', 'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription': 'MASTERCARD SAA GOLD',
      'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance': 289311.67, 'allowATMLimit': true,
      'allowBranch': true, 'allowBlock': true, 'allowReplace': true
   }
   ]
};

const testComponent = class { };
const routerTestingParam = [
      { path: 'overseatravel/:plasticId', component: testComponent },
   ];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
   trackPage: jasmine.createSpy('gtag').and.returnValue({})
};

const autoPayDetails: IAutoPayDetail = {
   payToAccount: '589846 076131664 5',
   payToAccountName: 'MR 1RICH GARFIELD',
   autoPayInd: true,
   statementDate: '2018-07-04T00:00:00',
   dueDate: '2018-07-29T00:00:00',
   camsAccType: 'NGB',
   autoPayMethod: 'F',
   autoPayAmount: '',
   branchOrUniversalCode: '123456',
   nedbankIdentifier: true,
   mandateAction: true,
   payFromAccount: '6666666666666',
   payFromAccountType: '2',
   monthlyPaymentDay: '19',
   autoPayTerm: '00',
   allowTermsAndCond: true
};
const getApo: IApiResponse = {
   data: autoPayDetails,
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'APO added successfully',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'Success'
               }
            ]
         }
      ]
   }
};

const apoServiceStub = {
   getPlasticCardDetails: jasmine.createSpy('getPlasticCardDetails').and.returnValue(Observable.of(getApo)),
   setAPODeleteSuccess: jasmine.createSpy('setAPODeleteSuccess'),
   setCardDetails: jasmine.createSpy('setCardDetails')
};

describe('CardManageComponent', () => {
   let component: CardManageComponent;
   let fixture: ComponentFixture<CardManageComponent>;
   let cardService: CardService;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: ApoService, useValue: apoServiceStub },
         { provide: OverseaTravelService, useValue: overseaTravelServiceStub },
            SystemErrorService, PreFillService],
         declarations: [CardManageComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CardManageComponent);
      component = fixture.componentInstance;
      cardService = fixture.debugElement.injector.get(CardService);
      component.card = mockCard;
      router = TestBed.get(Router);
      component.replaceCardStatus = {
         success: true,
         branchName: '',
         branchCode: '',
         cardNumber: ''
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
      expect(component.card.allowBlock).toEqual(mockCard.allowBlock);
      expect(component.card.allowReplace).toEqual(mockCard.allowReplace);
      expect(component.card.nameLine).toEqual(mockCard.nameLine);
   });

   it('should check for hiding update limit status popup', () => {
      component.hideUpdateLimitStatusPopup();
      expect(component.updateLimitStatusPopupVisible).toBe(false);
   });

   it('should check for hiding update limit popup', () => {
      component.hideUpdateLimitPopup();
      expect(component.updateLimitPopupVisible).toBe(false);
   });

   it('should check for showing update limit popup', () => {
      component.showLimitChangePopup();
      expect(component.updateLimitPopupVisible).toBe(true);
   });

   it('should check for showing limit status popup', () => {
      component.showLimitStatusPopup();
      expect(component.updateLimitStatusPopupVisible).toBe(true);
   });

   it('should check for showing block card popup', () => {
      component.showBlockCardPopup();
      expect(component.blockCardVisible).toBe(true);
   });

   it('should check for hiding block card popup', () => {
      component.hideBlockCardPopup();
      expect(component.blockCardVisible).toBe(false);
   });

   it('should check for showing block card status popup', () => {
      component.showBlockCardStatusPopup();
      expect(component.blockCardStatusVisible).toBe(true);
   });

   it('should check for hiding block card status popup', inject([CardService], (service: CardService) => {
      component.hideBlockCardStatusPopup();
      expect(component.blockCardStatusVisible).toBe(false);
   }));

   it('should check for hiding branch locator popup', inject([CardService], (service: CardService) => {
      component.hideReplaceCardBranchLocatorPopup();
      expect(component.replaceCardBranchLocatorVisible).toBe(false);
      expect(service.closeReplaceCardPopup).toHaveBeenCalled();
   }));

   it('should check effect of triggering card limit updation from service', () => {
      cardServiceStub.cardLimitUpdateEmitter.emit(true);
      fixture.detectChanges();
      expect(component.updateLimitStatusPopupVisible).toBe(true);
   });

   it('should check effect of triggering replace card branch locator from service', () => {
      component.cardReplaceInfo = {
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: '9',
         branchName: 'nedbank branch',
         allowBranch: true,
         plasticId: 1,
         cardNumber: 'xxx',
         reason: 'lost'
      };
      cardServiceStub.replaceCardBranchLocatorEmitter.emit(component.cardReplaceInfo);
      fixture.detectChanges();
      expect(component.replaceCardBranchLocatorVisible).toBe(true);
   });

   it('should check for triggering card status update', () => {
      component.ngOnInit();
      cardServiceStub.cardBlockStatusEmitter.emit({
         cardNumber: 'xxx',
         reason: 'lost',
         success: true
      });
      fixture.detectChanges();
      expect(component.blockCardStatusVisible).toBe(true);
   });

   it('should check for triggering retry blocking card', () => {
      component.ngOnInit();
      cardServiceStub.retryCardBlockEmitter.emit({
         plasticId: 1,
         cardNumber: 'xxx',
         reason: 'lost',
         cardType: Constants.VariableValues.cardTypes.debit.text
      });
      fixture.detectChanges();
      expect(component.blockCardVisible).toBe(true);
   });

   it('should check effect of triggering replace card branch locator from service', () => {
      component.cardReplaceInfo = {
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: '9',
         branchName: 'nedbank branch',
         allowBranch: true,
         plasticId: 1,
         cardNumber: 'xxx',
         reason: 'lost'
      };

      fixture.detectChanges();
      cardServiceStub.cardReplaceStatusEmitter.emit(component.cardReplaceInfo);
      expect(component.replaceCardBranchLocatorVisible).toBe(false);
   });

   it('should be show replace card popup', () => {
      component.cardReplaceInfo = {
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: '9',
         branchName: 'nedbank branch',
         allowBranch: true,
         plasticId: 1,
         cardNumber: 'xxx',
         reason: 'lost'
      };

      component.showReplaceCardPopup();
      expect(component.replaceCardBranchLocatorVisible).toBe(false);
   });

   it('should be show replace card popup and hide block card popup', () => {
      component.cardReplaceInfo = {
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: '9',
         branchName: 'nedbank branch',
         allowBranch: true,
         plasticId: 1,
         cardNumber: 'xxx',
         reason: 'lost'
      };

      component.onReplaceCardFromBlock();
      expect(component.blockCardVisible).toBe(false);
      expect(component.replaceCardBranchLocatorVisible).toBe(false);
   });

   it('should check for hiding replace card status popup', inject([CardService], (service: CardService) => {
      component.hideReplaceCardStatusPopup();
      expect(component.replaceCardStatusVisible).toBe(false);
      expect(service.closeReplaceCardPopup).toHaveBeenCalled();
   }));

   it('should check for hiding replace card branch locator popup', () => {
      component.hideReplaceCardPopup();
      expect(component.replaceCardVisible).toBe(false);
   });

   it('should hide block card status popup after done click', () => {
      cardServiceStub.hideBlockCardStatusEmitter.emit(false);
      expect(component.blockCardStatusVisible).toBe(false);
   });

   it('should hide replace card status popup after done click', () => {
      cardServiceStub.hideReplaceCardStatusEmitter.emit(false);
      expect(component.replaceCardStatusVisible).toBe(false);
   });

   it('should call setCardDetailsData response undefined', () => {
      component.card.actionListItem = [];
      component.setCardDetailsData(component.card.actionListItem);
      expect(component.isSoftBlock).toBeUndefined();
      expect(component.card.isCardFreeze).toEqual(false);
      expect(component.freezeEnabled).toBeUndefined();
   });

   it('should call setCardDetailsData response with card freezed, ip activated', () => {
      component.card = mockCardsPlasticManagement[0];
      component.ngOnChanges();
      expect(component.isSoftBlock).toEqual(true);
      expect(component.isTapAndGo).toEqual(false);
      expect(component.isInternetPurchase).toEqual(true);
      expect(component.freezeEnabled).toEqual(true);
      expect(component.card.isCardFreeze).toEqual(true);
   });

   it('should call setCardDetailsData response for card unfreezed and tap go activated', () => {
      component.card = mockCardsPlasticManagement[1];
      component.ngOnChanges();
      expect(component.isSoftBlock).toEqual(false);
      expect(component.isTapAndGo).toEqual(true);
      expect(component.isInternetPurchase).toEqual(false);
      expect(component.freezeEnabled).toEqual(true);
      expect(component.card.isCardFreeze).toEqual(false);
   });

   it('should call setCardDetailsData response for card freeze option disabled', () => {
      component.card = mockCardsPlasticManagement[2];
      component.ngOnChanges();
      expect(component.freezeEnabled).toEqual(false);
   });

   it('should display popup for activate Tap overlay', () => {
      component.isTapAndGo = true;
      component.showPopupForSwitches('tap-go');
      expect(component.statusWarningText.header).toBe('Activate tap and go?');
      expect(component.statusWarningText.title)
         .toBe('This will take effect only after you’ve inserted your card into an ATM or card machine.');
      expect(component.statusWarningText.subTitle)
         .toBe('Click ‘Next’ if you’d like to continue.');
      expect(component.statusWarningText.typeParam).toBe('CONTACTON');
      expect(component.cardToggleStatus).toBe(true);
   });

   it('should display popup for deactivate Tap overlay', () => {
      component.isTapAndGo = false;
      component.showPopupForSwitches('tap-go');
      expect(component.statusWarningText.header).toBe('Deactivate tap and go?');
      expect(component.statusWarningText.title)
         .toBe('This will take effect only after you’ve inserted your card into an ATM or card machine.');
      expect(component.statusWarningText.subTitle)
         .toBe('Click ‘Next’ if you’d like to continue.');
      expect(component.statusWarningText.typeParam).toBe('CONTACTOFF');
      expect(component.cardToggleStatus).toBe(true);
   });

   it('should display popup for activate internet overlay', () => {
      component.isInternetPurchase = true;
      component.showPopupForSwitches('internet-purchase');
      expect(component.statusWarningText.typeParam).toBe('INTPURON');
      expect(component.statusWarningText.header).toBe('Activate online purchases?');
      expect(component.statusWarningText.title).
         toBe('You will be able to pay online with your card, including Scan to Pay and other QR code payments.');
      expect(component.statusWarningText.subTitle).toBe('');
      expect(component.cardToggleStatus).toBe(true);
   });

   it('should display popup for deactivate internet overlay', () => {
      component.isInternetPurchase = false;
      component.showPopupForSwitches('internet-purchase');
      expect(component.statusWarningText.typeParam).toBe('INTPUROFF');
      expect(component.statusWarningText.header).toBe('Deactivate online purchases?');
      expect(component.statusWarningText.title).
         toBe(Constants.labels.cardManageConstants.internetPurchases.deactivateInternetPurchases.title);
      expect(component.statusWarningText.subTitle).toBe('');
      expect(component.cardToggleStatus).toBe(true);
   });

   it('should display popup for activate card freeze overlay', () => {
      component.isSoftBlock = true;
      component.showPopupForSwitches('freeze-card');
      expect(component.statusWarningText.header).toBe('Do you want to freeze your card?');
      expect(component.statusWarningText.typeParam).toBe('softblock');
      expect(component.statusWarningText.title)
         .toBe('Please note that certain transactions will be restricted until you unfreeze your card.');
      expect(component.statusWarningText.subTitle).toBe('If your card is lost or stolen, block your card.');
      expect(component.cardToggleStatus).toBe(true);
   });

   it('should display popup for deactivate card freeze overlay', () => {
      component.isSoftBlock = false;
      component.showPopupForSwitches('freeze-card');
      expect(component.statusWarningText.header).toBe('Do you want to unfreeze your card?');
      expect(component.statusWarningText.typeParam).toBe('unblock');
      expect(component.statusWarningText.title).toBe('Your card will be enabled for all transactions.');
      expect(component.statusWarningText.subTitle).toBe('');
      expect(component.cardToggleStatus).toBe(true);
   });

   it('should close popup Tap overlay', () => {
      component.statusWarningText = Constants.labels.cardManageConstants.tapAndGo.activateTapAndGo;
      component.closePopupForSwitches(true);
      expect(component.isTapAndGo).toBe(false);
      expect(component.cardToggleStatus).toBe(false);
   });

   it('should close popup Internet overlay', () => {
      component.statusWarningText = Constants.labels.cardManageConstants.internetPurchases.activateInternetPurchases;
      component.closePopupForSwitches(true);
      expect(component.isInternetPurchase).toBe(false);
      expect(component.cardToggleStatus).toBe(false);
   });
   it('should close popup Card freeae', () => {
      component.statusWarningText = Constants.labels.cardManageConstants.freezeCard.activateFreezeCard;
      component.closePopupForSwitches(true);
      expect(component.cardToggleStatus).toBe(false);
   });

   it('should listen and toggle overlay for Tap Go', () => {
      spyOn(component.statusChange, 'emit');
      component.statusWarningText = component.activateTapGo;
      fixture.detectChanges();
      component.setUnsetToggle(true);
      expect(component.statusChange.emit).toHaveBeenCalledWith(statusChangeDataSuccessTapGo);
   });

   it('should listen and toggle overlay for IP', () => {
      spyOn(component.statusChange, 'emit');
      component.statusWarningText = component.activateOnlinePurchase;
      component.setUnsetToggle(true);
      expect(component.statusChange.emit).toHaveBeenCalledWith(statusChangeDataSuccessInternetPurchase);
   });
   it('should listen and toggle overlay for Card freeze', () => {
      spyOn(component.statusChange, 'emit');
      component.statusWarningText = component.activateFreezeCard;
      fixture.detectChanges();
      component.setUnsetToggle(true);
      expect(component.statusChange.emit).toHaveBeenCalledWith(statusChangeDataSuccessCardFreeze);
   });

   it('should listen and toggle overlay for tap go failure', () => {
      spyOn(component.statusChange, 'emit');
      component.statusWarningText = component.activateTapGo;
      fixture.detectChanges();
      component.setUnsetToggle(false);
      expect(component.statusChange.emit).toHaveBeenCalledWith({
         action: 'canContactLess',
         result: false,
         plasticId: 1,
         eventSuccessful: false
      });
   });

   it('set isCardActivated as true if dc indicator is neither debit or credit card', () => {
      component.card.actionListItem = [];
      component.card = mockCardsPlasticManagement[4];
      component.setCardDetailsData(component.card.actionListItem);
      expect(component.isCardActivated).toBe(true);
   });

   it('should call disableOnlinePurchaseForGarageCard with card details for garage card', () => {
      component.card = mockData.data[3];
      component.disableInternetPurchaseForGarageCard(component.card);
      expect(CommonUtility.isGarageCard(component.card)).toBe(true);
      expect(component.garageCardInternetPurchaseDisable).toBe(false);
   });

   it('should call disableOnlinePurchaseForGarageCard with card details of not garage card', () => {
      component.card = mockData.data[2];
      component.disableInternetPurchaseForGarageCard(component.card);
      expect(CommonUtility.isGarageCard(component.card)).toBe(false);
      expect(component.garageCardInternetPurchaseDisable).toBe(true);
   });

   it('should call disableInternetPurchaseForGarageCard method when disableGarageCardInternetPurchaseFeature is true', () => {
      component.disableGarageCardInternetPurchaseFeature = true;
      component.disableInternetPurchaseForGarageCard(mockCardsPlasticManagement[0]);
      expect(component.disableGarageCardInternetPurchaseFeature).toBe(true);
   });

   it('should set garageCardInternetPurchaseDisable to true if disableGarageCardInternetPurchaseFeature is false', () => {
      component.disableGarageCardInternetPurchaseFeature = false;
      component.garageCardInternetPurchaseDisable = true;
      component.ngOnChanges();
      expect(component.garageCardInternetPurchaseDisable).toBe(true);
   });

   it('should call disableAtmLimitsForGarageCard with card details for garage card', () => {
      component.card = mockData.data[3];
      component.disableAtmLimitsForGarageCard(component.card);
      expect(CommonUtility.isGarageCard(component.card)).toBe(true);
      expect(component.garageCardAtmLimitsDisable).toBe(false);
   });

   it('should call disableAtmLimitsForGarageCard with card details of not garage card', () => {
      component.card = mockData.data[2];
      component.disableAtmLimitsForGarageCard(component.card);
      expect(CommonUtility.isGarageCard(component.card)).toBe(false);
      expect(component.garageCardAtmLimitsDisable).toBe(true);
   });

   it('should call disableAtmLimitsForGarageCard method when disableGarageCardAtmLimitsFeature is true', () => {
      component.disableGarageCardAtmLimitsFeature = true;
      component.disableAtmLimitsForGarageCard(mockCardsPlasticManagement[0]);
      expect(component.disableGarageCardAtmLimitsFeature).toBe(true);
   });

   it('should set garageCardAtmLimitsDisable to true if disableGarageCardAtmLimitsFeature is false', () => {
      component.disableGarageCardAtmLimitsFeature = false;
      component.garageCardAtmLimitsDisable = true;
      component.ngOnChanges();
      expect(component.garageCardAtmLimitsDisable).toBe(true);
   });

   it('should return true on calling showOtnFeature method', () => {
      component.otnToggle = true;
      component.isCardActivated = true;
      component.isSoftBlock = false;
      component.garageCardInternetPurchaseDisable = true;
      component.showOtnFeature();
      expect(component.showOtnFeature()).toBe(true);
   });

   it('should call getAutoPayIndicator method to get the autopay indicator value ', () => {
      component.card = mockCard;
      component.getAutoPayIndicator();
      expect(component.primaryAccount).toBe(false);
   });

   it('should call getAutoPayIndicator method to get the autopay indicator true value ', () => {
      mockCard.plasticCustomerRelationshipCode = 'PRI';
      component.card = mockCard;
      component.getAutoPayIndicator();
      expect(component.primaryAccount).toBe(true);
   });

   it('should call getAutoPayIndicator method to get the autopay indicator false part ', () => {
      mockCard.plasticCustomerRelationshipCode = 'PRI';
      component.card = mockCard;
      component.autopayDetails = autoPayDetails;
      component.autopayDetails.autoPayInd = false;
      component.getAutoPayIndicator();
      expect(component.showLoader).toBe(false);
   });

   it('should call showAutopayPopup method ', () => {
      component.showAutopayPopup();
      expect(component.initiateApo).toBe(true);
   });

   it('should call successApo method ', () => {
      component.successApo(true);
      expect(component.initiateApo).toBe(false);
   });

   it('should call closeApo method ', () => {
      component.closeApo(false);
      expect(component.initiateApo).toBe(false);
   });
   it('should call deleteApo method ', () => {
      component.deleteApo(false);
      expect(component.initiateApo).toBe(false);
   });

   it('should send events for overseas travel notification', () => {
      component.sendEventForOverseasTravelNotification();
      expect(gaTrackingServiceStub.sendEvent).toHaveBeenCalled();
   });

   it ('should call apo indicator method If apo toggle ON', () => {
      component.apoToggle = true;
      spyOn(component, 'getAutoPayIndicator');
      component.ngOnChanges();
      expect(component.getAutoPayIndicator).toHaveBeenCalled();
   });

   it('should make initiateOtn to true on calling enableOtn method', () => {
      component.enableOtn();
      expect(component.initiateOtn).toBe(true);
   });

   it('should assign event  to showOtnSuccess on calling showSuccess method', () => {
      const event = false;
      component.showSuccess(event);
      expect(component.showOtnSuccess).toBe(false);
   });

   it('should assign event  to initiateOtn on calling onHide method', () => {
      const event = false;
      component.onHide(event);
      expect(component.initiateOtn).toBe(false);
   });

   it('should emit false  on calling closeStepper method', () => {
      spyOn(component.hideOtn, 'emit');
      const emit = false;
      component.closeStepper();
      expect(component.hideOtn.emit).toHaveBeenCalledWith(emit);
   });

   it('should receive value from the service ', () => {
      overseaTravelServiceStub.emitOtnSuccess.emit(true);
      fixture.detectChanges();
      expect(component.initiateOtn).toBe(false);
   });

   it('should send event when card is credit card and plasticCurrentStatusReasonCode is F2F', () => {
      component.card.plasticCurrentStatusReasonCode = 'F2F';
      component.card.dcIndicator = 'C';
      component.analyticsEventforActivateCard();
      expect(gaTrackingServiceStub.sendEvent).toHaveBeenCalled();
   });

   it('should send event when card is credit card and plasticCurrentStatusReasonCode is IAD', () => {
      component.card.plasticCurrentStatusReasonCode = 'IAD';
      component.card.dcIndicator = 'C';
      component.analyticsEventforActivateCard();
      expect(gaTrackingServiceStub.sendEvent).toHaveBeenCalled();
   });

});
