import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../test-util';
import { LandingComponent } from './landing.component';
import { CardService } from './../card.service';
import { PreFillService } from '../../core/services/preFill.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { IPlasticCard, IDashboardAccounts, IDashboardAccount, ICardFreeze, IActivateCardEmitObj } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { LoaderService } from '../../core/services/loader.service';
import { ICardUpdateActionListData } from '../models';
import { ApoService } from '../apo/apo.service';
import { TrusteerService} from '../../core/services/trusteer-service';

const mockCardSelected = {
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
   cardAccountNumber: '123',
   ItemAccountId: '',
   isCardFreeze: false,
   actionListItem: [{ action: 'canSoftBlock', result: undefined },
   { action: 'canContactLess', result: true },
   { action: 'ActivateCard', result: true }]
};
const mockDebitCardSelected = {
   plasticId: 1,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'D',
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
   cardAccountNumber: '123',
   ItemAccountId: '',
   isCardFreeze: false
};

const mockAccounts: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1234,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
},
{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 123,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0
}];

const mockAccounts2: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 123,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
},
{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1235,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0
}];
const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Investment',
   Accounts: mockAccounts2,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}, {
   ContainerName: 'Card',
   Accounts: mockAccounts,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];
const mockCards = [];

const mockCardsPlasticManagement: IPlasticCard[] = [{
   plasticId: 1,
   plasticNumber: '123456 0000 7891',
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
   ItemAccountId: '1234',
   actionListItem: [{ action: 'canSoftBlock', result: false },
   { action: 'canContactLess', result: false },
   { action: 'ActivateCard', result: true }
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
   plasticCurrentStatusReasonCode: 'AAA',
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
   actionListItem: [{ action: 'canSoftBlock', result: undefined },
   { action: 'canContactLess', result: true },
   { action: 'ActivateCard', result: false }]
},
{
   plasticId: 3,
   plasticNumber: '123456 0000 7892',
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
   ItemAccountId: '333',
   actionListItem: [
      { action: 'canSoftBlock' },
      { action: 'canContactLess', result: false },
      { action: 'ActivateCard', result: true }
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
   actionListItem: [
      { action: 'canContactLess', result: true }]
}];


const statusChangeDataSuccessActivation: ICardUpdateActionListData = {
   action: 'canContactLess',
   result: true,
   plasticId: 1,
   eventSuccessful: true
};
const statusChangeDataSuccessDeactivation: ICardUpdateActionListData = {
   action: 'canContactLess',
   result: false,
   plasticId: 4,
   eventSuccessful: true
};
const statusChangeDataFailure: ICardUpdateActionListData = {
   action: 'canContactLess',
   result: true,
   plasticId: 4,
   eventSuccessful: false
};
const statusChangeNoUpdate: ICardUpdateActionListData = {
   action: 'canContactLess',
   result: false,
   plasticId: 3,
   eventSuccessful: false
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const apoServiceStub = {
   emitApoDeleteSuccess: new EventEmitter<boolean>(),
   setDashboardAccounts: jasmine.createSpy('setDashboardAccounts'),
   setAccountId: jasmine.createSpy('setAccountId')
};

describe('LandingComponent card', () => {
   const cardServiceStub = {
      cardFreezeEmitter: new EventEmitter<ICardFreeze>(),
      getPlasticCards: jasmine.createSpy('getPlasticCards').and.returnValue(Observable.of(mockCards)),
      getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
      hideReplaceCardStatusEmitter: new EventEmitter<boolean>()
   };

   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   let preFillService: PreFillService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [LandingComponent],
         providers: [TrusteerService,
            {
            provide: CardService,
            useValue: cardServiceStub
         }, {
            provide: 'Window', useValue: {
               innerWidth: 375
            }
         }, { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            PreFillService,
            LoaderService,
         { provide: ApoService, useValue: apoServiceStub },
         ]
      })
         .compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      preFillService = fixture.debugElement.injector.get(PreFillService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call the emit apo success', () => {
      apoServiceStub.emitApoDeleteSuccess.emit(false);
      component.ngOnInit();
      expect(component.updateActionItemMessage).toBe(false);
   });

   it('should set a selected card in the component', () => {
      component.cardSelected(mockCardSelected);
      expect(component.selectedCard.nameLine).toEqual(mockCardSelected.nameLine);
   });

   it('should set Itemaccount Id for debit cards', inject([CardService], (service: CardService) => {
      mockCardSelected.dcIndicator = 'D';
      component.cards = [mockDebitCardSelected];
      service.getDashboardAccounts = jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts));
      component.mapItemAccountId();
      expect(component.cards[0].ItemAccountId).toBeDefined();
   }));
   it('should load all cards', inject([CardService], (service: CardService) => {
      service.getPlasticCards = jasmine.createSpy('getPlasticCards').and.returnValue(Observable.of(mockCardsPlasticManagement));
      component.loadPlasticCards();
      expect(component.cards.length).toBe(4);
   }));

   it('should set Itemaccount Id for empty debit cards', inject([CardService], (service: CardService) => {
      mockCardSelected.dcIndicator = 'D';
      component.cards = [mockCardSelected];
      service.getDashboardAccounts = jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of([]));
      component.mapItemAccountId();
      expect(component.cards[0].ItemAccountId).toBe('');
   }));
   it('should set account type and number when it has accountId', () => {
      preFillService.selectedAccount = mockAccounts2[0];
      component.setAccountDetails();
   });
   it('should close error or success message block in case of cardfreeze, ip and tapGo when X is clicked', () => {
      component.closeMessageBlock();
      expect(component.updateActionItemMessage).toBe(false);
   });
   it('should have no action to display message since api failed to update status of cardfreeze/ip/tapgo', () => {
      component.statusUpdated(undefined);
      expect(component.message).toBeUndefined();
   });
   it('should have no action to update cards cardfreeze/ip/tapgo in case of card management', () => {
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeDataSuccessDeactivation);
      expect(component.message).toBe('Tap and go has been deactivated.');
   });
   it('should set proper success message in case of tapGo deactivation', () => {
      component.accountId = undefined;
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeDataSuccessDeactivation);
      expect(component.message).toBe('Tap and go has been deactivated.');
   });
   it('should set proper success message in case of tapGo activation', () => {
      component.accountId = undefined;
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeDataSuccessActivation);
      expect(component.message).toBe('Tap and go is now active.');
   });
   it('should set proper error or success message in case of internet purchase deactivation', () => {
      component.accountId = undefined;
      component.cards = mockCardsPlasticManagement;
      statusChangeDataSuccessDeactivation.action = 'canInternetPurchase';
      component.statusUpdated(statusChangeDataSuccessDeactivation);
      expect(component.message).toBe('Online purchases have been deactivated.');
   });
   it('should set proper success message in case of internet purchase activation', () => {
      component.accountId = undefined;
      statusChangeDataSuccessActivation.action = 'canInternetPurchase';
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeDataSuccessActivation);
      expect(component.message).toBe('Online purchases are now active.');
   });
   it('should set proper error or success message in case of cardfreeze deactivation', () => {
      component.accountId = undefined;
      component.cards = mockCardsPlasticManagement;
      statusChangeDataSuccessDeactivation.action = 'canSoftBlock';
      component.statusUpdated(statusChangeDataSuccessDeactivation);
      expect(component.message).toBe('Card frozen successfully');
   });
   it('should set proper success message in case of cardfreeze activation', () => {
      component.accountId = undefined;
      statusChangeDataSuccessActivation.action = 'canSoftBlock';
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeDataSuccessActivation);
      expect(component.message).toBe('Un-freeze card successful');
   });
   it('should set proper failure message in case of cardfreeze/ip/tapgo', () => {
      component.accountId = undefined;
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeDataFailure);
      expect(component.message).toBe('Sorry, we are unable to proceed. Please try again later');
   });

   it('should update the cards object whenever toggle status could not be changed on cardfreeze/ip/tapgo', () => {
      component.accountId = undefined;
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeNoUpdate);
      expect(component.cards[2].actionListItem[1].result).toBe(false);
   });

   it('should update the cards object whenever toggle status is successfully changed on cardfreeze/ip/tapgo', () => {
      component.accountId = undefined;
      component.cards = mockCardsPlasticManagement;
      component.statusUpdated(statusChangeDataSuccessDeactivation);
      expect(component.cards[3].actionListItem[0].result).toBe(false);
   });

   it('should set the property activate card true if selected card`s plasticCurrentStatusReason code is IAD', () => {
      component.selectedCard = mockCardsPlasticManagement[0];
      component.cardSelected(component.selectedCard);
      expect(component.isCardActivated).toBe(true);
   });

   it('should set the property activate card true if selected card`s plasticCurrentStatusReason code is F2F', () => {
      component.selectedCard = mockCardsPlasticManagement[2];
      component.cardSelected(component.selectedCard);
      expect(component.isCardActivated).toBe(true);
   });

   it('should set the property activate card false if selected card`s plasticCurrentStatusReason code is not  F2F or IAD', () => {
      component.selectedCard = mockCardsPlasticManagement[1];
      component.cardSelected(component.selectedCard);
      expect(component.isCardActivated).toBe(false);
   });

   it('should set the success response message on update activate card api success response', () => {
      const emitValue: IActivateCardEmitObj = {
            reason: 'Success',
            result: 'R00'
      };
      component.updateActionItemMessage = true;
      component.activateCardMessage(emitValue);
      expect(component.updateActionItemMessage).toBe(true);
      expect(component.message).toEqual('Success! Your card has been activated');
   });

   it('should set the error response message on update activate card api failure response', () => {
      const emitValue: IActivateCardEmitObj = {
            reason: 'Failure',
            result: 'R01'
      };
      component.updateActionItemMessage = true;
      component.updateActionItemFailed = true;
      component.selectedCard = mockCardsPlasticManagement[1];
      component.activateCardMessage(emitValue);
      expect(component.updateActionItemFailed).toBe(true);
      expect(component.message).toEqual('Sorry, we are unable to activate your card. Please try again later.');
   });
   it('should call showSuccess', () => {
      component.showSuccess(false);
      expect(component.updateActionItemMessage).toBe(true);
   });
});
