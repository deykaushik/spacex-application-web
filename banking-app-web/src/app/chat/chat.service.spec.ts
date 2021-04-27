import { TestBed, inject } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { ConnectionStatus } from 'ng2-signalr/src/services/connection/connection.status';
import { SignalR, SignalRConfiguration, IConnectionOptions } from 'ng2-signalr';
import { TokenManagementService } from '../core/services/token-management.service';
import { AuthGuardService } from '../core/guards/auth-guard.service';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ChatService } from './chat.service';
import { PreFillService } from '../core/services/preFill.service';
import { IConnectProperties, IChatQuestion, IChatProperties } from '../core/services/models';
import { environment } from '../../environments/environment';
import { assertModuleFactoryCaching } from '../test-util';

describe('ChatService', () => {
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ChatService,
            { provide: SignalR },
            { provide: PreFillService, useValue: mockedPreFillService },
            { provide: AuthGuardService },
            { provide: TokenManagementService, useValue: mockedTokenManagementService }]
      });
   });

   const mockedTokenManagementService = {
      getAuthToken: jasmine.createSpy('getAuthToken').and.returnValue('abc123')
   };

   const mockQuesionStub: IChatQuestion = {
      questionOne: 'How was your experience?',
      questionTwo: 'How was the chat?'
   };

   const mockedPreFillService = {
      chatData: {
         agentDisconnected: null,
         chatsFEHistory: [],
         agentName: null,
         chats: [],
         chatsFE: [{ id: '1', WriteTime: 'Tue Jul 03 2018 15:52:09 GMT+0530 (India Standard Time)', val: 'Hi' }],
         connectionId: null,
         fillDetails: null,
         nedBankLogo: null,
         questionNumber: 0,
         yesClicked: null,
         yesClickedLoggedIn: true,
         questions: mockQuesionStub
      }
   };

   const configuration = new SignalRConfiguration();
   configuration.url = environment.signalRUrl;
   configuration.hubName = 'chathub';

   const zone = new NgZone({ enableLongStackTrace: true });

   const signalR = {
      configuration: configuration,
      zone: zone,
      jHubConnectionFn: Function,
      connect: jasmine.createSpy('connect').and.returnValue(configuration)
   };

   const user = {
      name: 'xyz',
      email: 'xyz@abc.com'
   };

   const option: IConnectionOptions = {

   };

   const connection = {
      status: ConnectionStatus[''],
      errors: null,
      id: 'ed75c657-3827-409d-b63a-74cd5e14f86b',
      _configuration: configuration,
      _jConnection: configuration.url,
      _jProxy: configuration,
      _zone: zone,
      invoke: (): any => { },
      listen: Promise[''],
      listenFor: Promise[''],
      start: Promise[''],
      stop: () => { },
   };

   const myconnection = {
      start: () => { },
      invoke: () => { },
      listen: () => { }
   };

   it('should be created', inject([ChatService], (service: ChatService) => {
      expect(service).toBeTruthy();
   }));

   it('should show chat ', inject([ChatService], (service: ChatService) => {
      service.getConnected().subscribe((properties: IConnectProperties) => {
         expect(properties.yesClicked).toBe(false);
      });
   }));

   it('should check if chat is open', inject([ChatService], (service: ChatService) => {
      service.getChatActive().subscribe((properties: IChatProperties) => {
         expect(properties.chatActive).toBe(false);
      });
   }));

   it('should check if chat set active', inject([ChatService], (service: ChatService) => {
      expect(service.setChatActive(true)).toBe(true);
   }));

   it('should start connection', inject([ChatService], (service: ChatService) => {
      spyOn(myconnection, 'start');
      const data = service.start(myconnection);
      expect(myconnection.start).toHaveBeenCalled();
      expect(data).toBeTruthy();
   }));

   it('should stop connection', inject([ChatService], (service: ChatService) => {
      service.myconnection = connection;
      spyOn(service.myconnection, 'stop');
      const data = service.stop();
      expect(service.myconnection.stop).toHaveBeenCalled();
      expect(data).toBeTruthy();
   }));

   it('should set chat data for different messages', inject([ChatService], (service: ChatService) => {
      spyOn(service, 'setChatData');
      const chatsFE = [
         { id: '1', WriteTime: new Date(), val: 'Hi' }
      ];
      service.chatsFE = chatsFE;
      service.setChatsFE();

      expect(service.chatsFE[0].val).toEqual('Hi');

   }));

   it('should send rating', inject([ChatService], (service: ChatService) => {
      spyOn(myconnection, 'invoke');
      const event = 'click',
         questionNumber = '1',
         rating = '4',
         myCustomConnection = myconnection;
      service.sendRating(event, questionNumber, rating, myCustomConnection);
      expect(myCustomConnection.invoke).toHaveBeenCalledWith('click', '1', '4');
   }));

   it('should invoke connection', inject([ChatService], (service: ChatService) => {
      spyOn(myconnection, 'invoke');
      const event = 'click',
         myCustomConnection = myconnection,
         agentObj = {};
      const data = service.invoke(myCustomConnection, event, agentObj);
      expect(myCustomConnection.invoke).toHaveBeenCalledWith('click', {});
      expect(data).toBeTruthy();
   }));

   it('should apply transition', inject([ChatService], (service: ChatService) => {
      service.myconnection = connection;
      spyOn(service.myconnection, 'invoke');
      const event = 'transfer',
         tokenValue = 'abc123';
      service.applyTransition(event);
      expect(service.authToken).toBe(tokenValue);
      expect(service.myconnection.invoke).toHaveBeenCalledWith(event, tokenValue);
   }));

   it('should disconnect chat', inject([ChatService], (service: ChatService) => {
      spyOn(myconnection, 'invoke');
      spyOn(myconnection, 'listen');
      service.disconnectChat(myconnection);
      expect(service.yesClicked).toBeFalsy();
      expect(myconnection.invoke).toHaveBeenCalled();
      expect(myconnection.listen).toHaveBeenCalled();
   }));

   it('should clear chat', inject([ChatService], (service: ChatService) => {
      spyOn(service, 'setChatData');
      service.clearChat();
      expect(service.agentDisconnected).toBeFalsy();
      expect(service.yesClicked).toBeFalsy();
      expect(service.agentName).toBe('');
      expect(service.details).toBeFalsy();
      expect(service.chatsFE).toEqual([]);
      expect(service.connectionId).toBeNull();
      expect(service.chatsFEHistory).toEqual([]);
      expect(service.setChatData).toHaveBeenCalled();
   }));

   it('should set chat data', inject([ChatService], (service: ChatService) => {
      spyOn(service, 'setChatData');
      const chatsFE = [
         { id: '1', WriteTime: '09/09/2018', val: 'Hi' }
      ];
      service.chatsFE = chatsFE;
      service.setChatsFE();

      const expectedDateCheck = moment(new Date(chatsFE[0].WriteTime),
         'DD-MM-YYYY').format('DD-MM-YYYY');

      const expectedchatsFEDobj = {
         ChatMessages: chatsFE,
         Date: 'Today'
      };
      expect(service.dateSet).toBeTruthy();
      expect(service.setChatData).toHaveBeenCalled();
   }));

   it('should log out user and end the chat', inject([ChatService], (service: ChatService) => {
      const methodValue = 'EndChatSession';
      service.myconnection = connection;
      spyOn(service.myconnection, 'invoke');
      service.loggedOutEndChat();
      expect(service.myconnection.invoke).toHaveBeenCalledWith(methodValue);
      service.myconnection = null;
      expect(service.myconnection).toBeNull();
   }));

   it('should set chat data', inject([ChatService], (service: ChatService) => {
      const expectedObj = {
         agentDisconnected: null,
         chatsFEHistory: [],
         agentName: null,
         chats: [],
         chatsFE: [{ id: '1', WriteTime: new Date(), val: 'Hi' }],
         connectionId: null,
         fillDetails: null,
         nedBankLogo: null,
         questionNumber: 0,
         yesClicked: null,
         yesClickedLoggedIn: true
      };
      service.setChatData();
      expect(mockedPreFillService.chatData.yesClickedLoggedIn).toBe(true);
   }));

   it('should set chat data for different date', inject([ChatService], (service: ChatService) => {
      spyOn(service, 'setChatData');
      const chatsFE = [
         {
            'Message': 'Thank you wer, you have been added to the queue',
            'MessageType': 1,
            'WriteTime': 1530709344316
         }];

      service.chatsFE = chatsFE;

      service.history = [
         {
            'Date': '29-06-2018',
            'ChatMessages': [
               {
                  'AgentFirstName': 'Pradeep',
                  'Message': 'Welcome to Nedbank contact centre. How can I help you?',
                  'WriteTime': 1530247343160,
                  'ConversationId': 69,
                  'MessageType': 1
               },

            ]
         },
         {
            'Date': '29-06-2018',
            'ChatMessages': [
               {
                  'AgentFirstName': 'Pradeep',
                  'Message': 'Welcome to Nedbank contact centre. How can I help you?',
                  'WriteTime': 1530247343160,
                  'ConversationId': 69,
                  'MessageType': 1
               },

            ]
         },
         {
            'Date': '29-06-2018',
            'ChatMessages': [
               {
                  'AgentFirstName': 'Pradeep',
                  'Message': 'Welcome to Nedbank contact centre. How can I help you?',
                  'WriteTime': 1530247343160,
                  'ConversationId': 69,
                  'MessageType': 1
               },

            ]
         }
      ];
      service.isHistory = true;
      service.chatsFE = chatsFE;
      service.dateSet = true;
      service.setChatsFE();

      const expectedDateCheck = moment(new Date(chatsFE[0].WriteTime),
         'DD-MM-YYYY').format('DD-MM-YYYY');

      const expectedchatsFEDobj = {
         ChatMessages: chatsFE,
         Date: 'Today'
      };
      expect(service.chatMain).toEqual([{}]);
   }));

   it('should get message object', inject([ChatService], (service: ChatService) => {
      const msg = 'hi',
         from = 'xyz',
         time = new Date();
      const expectedObj = {
         Message: msg,
         MessageType: from,
         WriteTime: time,
         Status: 'Delivered',
         ClientId: 1
      };
      const data = service._getMsgObject(msg, from, time, 'Delivered', 1);
      expect(data).toEqual(expectedObj);
   }));

   it('should set message', inject([ChatService], (service: ChatService) => {
      const msg = {
         Message: 'Thank you Colleen, you have been added to the queue.',
         WriteTime: 1530710952967
      };
      service.setMessage(msg);
   }));

   it('should invoke CustomerIsTyping event if customer is typing', inject([ChatService], (service: ChatService) => {
      service.myconnection = connection;
      service.connected = true;
      spyOn(service.myconnection, 'invoke');
      const event = 'CustomerIsTyping';
      service.customerIsTyping(event);
      expect(service.myconnection.invoke).toHaveBeenCalledWith(event);
   }));

});
