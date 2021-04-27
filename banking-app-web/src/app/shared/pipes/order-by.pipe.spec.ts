import { OrderByPipe } from './order-by.pipe';
import { ILottoHistoryData } from '../../core/services/models';

describe('Pipe: Default', () => {
   let pipe: OrderByPipe;

   const args = {
      direction: 1,
      property: 'Amount'
   };

   const mockLottoHistory: ILottoHistoryData[] = [{
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'DrawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   },
   {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'Amount': 10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'PWB',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'DrawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   },
   {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'Amount': 20,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'DrawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': true,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   },
   {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'Amount': 10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'PWB',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'DrawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': true,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   },
   ];

   beforeEach(() => {
      pipe = new OrderByPipe();
   });
   it('sort records', () => {
      expect(pipe.transform(mockLottoHistory, args)).toBeTruthy();
   });
});
