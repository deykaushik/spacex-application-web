import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgZone, NO_ERRORS_SCHEMA } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { SignalRConfiguration, SignalRConnectionMock } from 'ng2-signalr';
import { LottieAnimationViewModule } from 'ng-lottie';

import { ChatComponent } from './chat.component';
import { environment } from '../../environments/environment';
import { PreFillService } from '../core/services/preFill.service';
import { TokenManagementService } from '../core/services/token-management.service';
import { ChatService } from './chat.service';
import { NgForm } from '@angular/forms';
import { assertModuleFactoryCaching } from '../test-util';
import { IChatQuestion } from '../core/services/models';
import { GaTrackingService } from '../core/services/ga.service';

let component: ChatComponent;
let fixture: ComponentFixture<ChatComponent>;
let signalRService: ChatService;

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

const signalRConnectionMock = {};

const preFillServiceStub = new PreFillService();

const mockQuesionStub: IChatQuestion = {
   questionOne: 'How was your experience?',
   questionTwo: 'How was the chat?'
};

preFillServiceStub.chatData = {
   agentDisconnected: false,
   chatsFEHistory: [],
   agentName: 'Rituja',
   chats: [],
   chatsFE: [],
   connectionId: signalR.connect(),
   fillDetails: false,
   nedBankLogo: false,
   questionNumber: 0,
   yesClicked: false,
   questions: mockQuesionStub
};

const mockConnectStub = {
   connectionId: 'e43443fgfg56vnhhgghnbwme3menm3n4',
   agentName: 'Rituja',
   yesClicked: false,
   showNps: true,
   chatsFE: [],
   chatsFEHistory: [],
   question: mockQuesionStub
};

const chatServiceStub = {
   getConnected: jasmine.createSpy('getConnected')
      .and.returnValue(Observable.of(mockConnectStub)),
   connect: jasmine.createSpy('connect')
      .and.returnValue(Observable.of(mockConnectStub)),
   invoke: jasmine.createSpy('invoke')
      .and.returnValue(Observable.of(mockConnectStub)),
   start: jasmine.createSpy('start')
      .and.returnValue(Observable.of(mockConnectStub)),
   stop: jasmine.createSpy('stop')
      .and.returnValue(Observable.of(mockConnectStub)),
   sendRating: jasmine.createSpy('sendRating')
      .and.returnValue(Observable.of(mockConnectStub)),
   disconnectChat: jasmine.createSpy('disconnectChat')
      .and.returnValue(Observable.of(mockQuesionStub)),
   clearChat: jasmine.createSpy('clearChat')
      .and.returnValue(Observable.of(mockConnectStub)),
   setChatsFE: jasmine.createSpy('setChatsFE')
      .and.returnValue(Observable.of(mockConnectStub)),
   loggedOutEndChat: jasmine.createSpy('loggedOutEndChat')
      .and.returnValue(Observable.of(mockConnectStub)),
   customerIsTyping: jasmine.createSpy('customerIsTyping')
      .and.returnValue(Observable.of(mockConnectStub))

};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('ChatComponent', () => {

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ChatComponent],
         imports: [FormsModule, LottieAnimationViewModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: SignalRConnectionMock, useValue: signalRConnectionMock },
         { provide: ChatService, useValue: chatServiceStub },
         { provide: PreFillService, useValue: preFillServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         {
            provide: TokenManagementService, useValue: {
               getAuthToken: jasmine.createSpy('getAuthToken').and.stub,
               getNedbankIdAnonymousToken: jasmine.createSpy('getNedbankIdAnonymousToken')
                  .and.stub
            }
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ChatComponent);
      component = fixture.componentInstance;
      component.details = true;
      component.userAuthenticated = true;
      component.isloggedIn = true;
      signalRService = fixture.debugElement.injector.get(ChatService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should send message', () => {
      signalRService.connect = chatServiceStub.connect;
      component.sendMessage('Hi');
      expect(component.msg).toBe('');
   });

   it('should submit rating from customers feedback', fakeAsync(() => {
      const feedback = {
         questionNumber: 2,
         rating: 4
      };
      component.submitRating(feedback);
      tick(1200);
      expect(component.agentDisconnected).toBe(false);
   }));

   it('should close chatbox when customer clicks no thanks', fakeAsync(() => {
      component.noThanksClick();
      tick(1200);
      expect(component.agentDisconnected).toBe(false);
   }));

   it('should disconnect chat after feedback', fakeAsync(() => {
      component.chatDisconnect();
      tick(1200);
      expect(component.agentDisconnected).toBe(false);
   }));

   it('should show nps questions if chat is disconnected when agent is connected', fakeAsync(() => {
      component.connected = true;
      component.agentDisconnected = true;
      component.chatDisconnect();
      tick(1200);
      expect(component.showNps).toBe(true);
   }));

   it('should get details of user', fakeAsync(() => {
      component.isloggedIn = true;
      component.connectionId = null;
      preFillServiceStub.chatData.connectionId = null;
      mockConnectStub.connectionId = null;
      component.ngOnInit();
      tick(1200);
      expect(component.details).toBe(false);
   }));

   it('should send message when user strikes enter', () => {
      const msg = 'Hi';
      const event = new KeyboardEvent('keypress', {
         key: 'Enter',
         bubbles: true,
         cancelable: true,
         shiftKey: true
      });

      Object.defineProperty(event, 'keyCode', { 'value': 13 });
      component.enterClick(event, msg);
      expect(component.messageSent).toBe(true);
   });

   it('should get form details for user', () => {
      component.details = false;
      component.userAuthenticated = false;
      this.formDetails = new NgForm([], []);
      component.continue(this.formDetails);
      expect(component.details).toBe(true);
   });

   it('should check anlytics from customers feedback', fakeAsync(() => {
      const feedback = {
         questionNumber: 1,
         rating: 4
      };
      component.submitRating(feedback);
      component.isloggedIn = false;
      const nps_rate = {
         questionNumber: 2,
         rating: 4
      };
      component.submitRating(nps_rate);
      tick(1200);
      expect(component.questionNumber).toBe(0);
   }));

   it('should check anlytics for unauthorised users', fakeAsync(() => {
      component.isloggedIn = false;
      const feedback = {
         questionNumber: 1,
         rating: 4
      };
      component.submitRating(feedback);
      component.chatDisconnect();
      component.chatBoxClose();
      component.noThanksClick();
      component.connect();
      tick(1200);
      expect(component.questionNumber).toBe(1);
   }));

   it('should handle animation when agent is typing', () => {
      component.isTyping = true;
      component.handleAnimation(true);
      expect(component.details).toBe(true);
   });

});
