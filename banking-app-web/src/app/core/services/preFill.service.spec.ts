import { TestBed, inject } from '@angular/core/testing';

import { PreFillService } from './preFill.service';
import { IDashboardAccount, IAccountDetail, IChatData, IHomeLoanStatus } from './models';
import { ISelectNumbersVm } from '../../buy/game/models';
import { Constants } from '../utils/constants';
import { assertModuleFactoryCaching } from '../../test-util';

const mockAccount: IDashboardAccount = {
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

};

function getMockGameAccounts(): IAccountDetail[] {
   return [{
      itemAccountId: '1',
      accountNumber: '1001004345',
      productCode: '017',
      productDescription: 'TRANSACTOR',
      isPlastic: false,
      accountType: 'CA',
      nickname: 'TRANS 02',
      sourceSystem: 'Profile System',
      currency: 'ZAR',
      availableBalance: 3000,
      currentBalance: 42250482237.21,
      profileAccountState: 'ACT',
      accountLevel: 'U0',
      viewAvailBal: true,
      viewStmnts: true,
      isRestricted: false,
      viewCurrBal: true,
      viewCredLim: true,
      viewMinAmtDue: true,
      isAlternateAccount: true,
      allowCredits: true,
      allowDebits: true,
      accountRules: {
         instantPayFrom: true,
         onceOffPayFrom: true,
         futureOnceOffPayFrom: true,
         recurringPayFrom: true,
         recurringBDFPayFrom: true,
         onceOffTransferFrom: true,
         onceOffTransferTo: true,
         futureTransferFrom: true,
         futureTransferTo: true,
         recurringTransferFrom: true,
         recurringTransferTo: true,
         onceOffPrepaidFrom: true,
         futurePrepaidFrom: true,
         recurringPrepaidFrom: true,
         onceOffElectricityFrom: true,
         onceOffLottoFrom: true,
         onceOffiMaliFrom: true
      }
   }];
}

const mockReplayData: ISelectNumbersVm = {
   BoardDetails: [{
      BoardNumber: 'A',
      NumbersPlayed: '3 4 6 7 8 5',
      isValid: true
   }],
   IsLottoPlus: false,
   IsLottoPlusTwo: false,
   isValid: true,
   BoardsPlayed: 2,
   DrawsPlayed: 3,
   DrawNumber: {
      drawDate: new Date(),
      drawName: 'Lotto',
      drawNumber: 177,
      nextDrawDate: new Date()
   },
   DrawDate: new Date(),
   TotalCost: 30,
   FromAccount: getMockGameAccounts()[0],
   boardsPlayed: 2,
   drawsPlayed: 3,
   drawNumber: {
      drawDate: new Date(),
      drawName: 'Lotto',
      drawNumber: 177,
      nextDrawDate: new Date()
   },
   drawDate: new Date(),
   totalCost: 30,
   fromAccount: getMockGameAccounts()[0],
   isReplay: true,
   game: Constants.VariableValues.gameTypes.LOT.code,
   method: Constants.VariableValues.playMethods.quickPick.code,
   gameType: Constants.VariableValues.playMethods.quickPick.code

};

const signalR = {
   configuration: '',
    zone: '',
    jHubConnectionFn: Function,
    connect: jasmine.createSpy('connect').and.returnValue('')
};

const mockChatData: IChatData = {
   chatsFE : [],
   chatsFEHistory : [],
   chats : [],
   questionNumber : 0,
   nedBankLogo : false,
   yesClicked : false,
   fillDetails : false,
   agentDisconnected : false,
   agentName : 'xyz',
   connectionId : signalR.connect()
};

const mockHomeLoanStatusData: IHomeLoanStatus = {
   isManageLoanEnabled: true,
   isJointBondEnabled: true,
   isNinetyDaysNoticeEnabled: true,
   isLoanPaidUp: true
};

describe('SystemErrorService', () => {
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [PreFillService]
      });
   });
   it('should be created', inject([PreFillService], (service: PreFillService) => {
      expect(service).toBeTruthy();
   }));
   it('should get null after getting once', inject([PreFillService], (service: PreFillService) => {
      service.preFillBeneficiaryData = {};
      const temp = service.preFillBeneficiaryData;
      expect(service.preFillBeneficiaryData).toBeNull();
   }));
   it('should get and set selected account', inject([PreFillService], (service: PreFillService) => {
      service.selectedAccount = mockAccount;
      expect(service.selectedAccount.AccountNumber).toBe(mockAccount.AccountNumber);
   }));

   it('should get preFillReplayData', inject([PreFillService], (service: PreFillService) => {
      service.preFillReplayData = mockReplayData;
      const temp = service.preFillReplayData;
      expect(service.preFillReplayData).toBeTruthy();
   }));

   it('should get preFillChatData', inject([PreFillService], (service: PreFillService) => {
      service.chatData = mockChatData;
      const temp = service.chatData;
      expect(service.chatData).toBeTruthy();
   }));

   it('should get home loan status data', inject([PreFillService], (service: PreFillService) => {
      service.homeLoanStatusData = mockHomeLoanStatusData;
      expect(service.homeLoanStatusData).toBe(mockHomeLoanStatusData);
   }));
});
