import { Component, OnInit, Output, EventEmitter, Input, Inject, HostListener, ViewChild, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgForm } from '@angular/forms';

import { IConnectionOptions, ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';

import { Constants } from './../core/utils/constants';
import { ConstantsRegister } from '../register/utils/constants';
import { TokenManagementService } from '../core/services/token-management.service';
import { CommonUtility } from '../core/utils/common';
import { PreFillService } from '../core/services/preFill.service';
import { environment } from '../../environments/environment';
import { IChatUser, IConnectProperties, IChatQuestion, IChatFeedback } from '../core/services/models';
import { ChatService } from './chat.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AuthConstants } from '../auth/utils/constants';
import { BaseComponent } from '../core/components/base/base.component';

@Component({
   selector: 'app-chat',
   templateUrl: './chat.component.html',
   styleUrls: ['./chat.component.scss']
})

export class ChatComponent extends BaseComponent implements OnInit {
   questionNumber: number;

   messageSent = false;
   connectionId: ISignalRConnection;
   questions: IChatQuestion;
   saluteToken: string;
   fingerprint: string;
   chatQueued = false;
   dateArray = [];
   isHistory: boolean;
   sessionStarted = false;
   secondQuestion = false;
   showSecondQuestion = false;
   chatDetailsheight: number;
   agentDisconnected = false;
   userAuthenticated: boolean;
   agentName = '';
   details = false;
   authToken: string;
   strTimeChat: string;
   chatsheight: number;
   messageheight = 498;
   strTime: string;
   patterns = Constants.patterns;
   message = ConstantsRegister.messages;
   recTime: string;
   sentTime: Date;
   nedBankLogo = false;
   chatBotheight: number;
   msg = '';
   myconnection: ISignalRConnection;
   chats = [];
   chatsFE = [];
   chatsFEHistory = [];
   user: IChatUser;
   connection: IConnectionOptions;
   yesClicked = false;
   labels = Constants.chatMessages;
   chatHeading: string = this.labels.chatHeading;
   agentInitialMessage: string = this.labels.agentInitialMessage;
   agentLiveMessage = this.labels.agentLiveMessage;
   date = Constants.formats;
   startChat = this.labels.startChat;
   questionHeader: string = this.labels.questionHeader;
   noThanks: string = this.labels.noThanks;
   agentFirstMessage: string = this.labels.agentFirstMessage;
   termsAndConditionsPath = this.labels.TermsGeneralHtml;
   options: IConnectionOptions = { hubName: this.labels.hubName };
   closedChat = false;
   connectionEstablished: boolean;
   showNps = false;
   yesClickedLoggedIn = false;
   connected = false;
   scroll = false;
   isTyping = false;
   lottieConfig: Object;
   anim: any;
   constructor(private prefillService: PreFillService,
      private tokenManagementService: TokenManagementService,
      private signalRService: ChatService,
      @Inject(DOCUMENT) public document: Document, injector: Injector) {
      super(injector);
      this.lottieConfig = {
         path: this.labels.lottiePath,
         renderer: this.labels.svgType,
         autoplay: true,
         loop: true
      };
   }

   @Output()
   change: EventEmitter<boolean> = new EventEmitter<boolean>();

   @ViewChild(PerfectScrollbarComponent) chatBodyScroll: PerfectScrollbarComponent;

   @Input() isloggedIn: boolean;
   ngOnInit() {

      if (this.prefillService.chatData) {
         this.agentDisconnected = this.prefillService.chatData.agentDisconnected;
         this.agentName = this.prefillService.chatData.agentName;
         this.details = this.prefillService.chatData.fillDetails;
         this.nedBankLogo = this.prefillService.chatData.nedBankLogo;
         this.chats = this.prefillService.chatData.chats;
         this.chatsFE = this.prefillService.chatData.chatsFE;
         this.chatsFEHistory = this.prefillService.chatData.chatsFEHistory;
         this.yesClicked = this.prefillService.chatData.yesClicked;
         this.yesClickedLoggedIn = this.prefillService.chatData.yesClickedLoggedIn;
         this.showNps = this.prefillService.chatData.showNps;
         this.questions = this.prefillService.chatData.questions;
         this.questionNumber = this.prefillService.chatData.questionNumber;
         this.showSecondQuestion = this.prefillService.chatData.showSecondQuestion;
      }
      const fingerPrint2 = require('fingerprintjs2sync');
      this.fingerprint = (new fingerPrint2()).getSync().fprint;

      this.userAuthenticated = this.isloggedIn;
      this.authToken = this.tokenManagementService.getAuthToken();
      this.saluteToken = this.tokenManagementService.getNedbankIdAnonymousToken();

      this.options.hubName = this.labels.hubName;
      this.options.url = environment.signalRUrl;
      this.options.withCredentials = false;

      this.signalRService.getConnected().subscribe((properties: IConnectProperties) => {
         this.connectionId = properties.connectionId;
         this.agentName = properties.agentName;
         this.yesClicked = properties.yesClicked;
         this.chatsFEHistory = properties.chatHistory;
         this.chatsFE = properties.chatsFE;
         this.agentDisconnected = properties.agentDisconnected;
         this.connectionEstablished = properties.connectionEstablished;
         this.yesClickedLoggedIn = properties.yesClickedLoggedIn;
         this.connected = properties.connected;
         this.scroll = false;
         this.isTyping = properties.isTyping;

         if (properties.showNps) {
            this.chatDisconnect();
         }

         if (properties.question && this.prefillService.chatData) {
            this.prefillService.chatData.questions = {
               questionOne: properties.question.questionOne,
               questionTwo: properties.question.questionTwo
            };
            this.questions = this.prefillService.chatData.questions;
         }

         this.myconnection = this.connectionId;
         this.setChatData();
         this.onResize();
         const objDiv = document.getElementById(this.labels.messageDiv);

         if (this.chatBodyScroll && objDiv) {
            setTimeout(() => {
               this.chatBodyScroll.directiveRef.scrollToBottom();
            }, 100);
         }
      });

      if (this.prefillService.chatData) {
         this.myconnection = this.prefillService.chatData.connectionId;
      }

      if (this.isloggedIn) {
         this.details = true;
         if (!this.myconnection) {
            this.connect();
         }

      }

      this.user = {
         name: '',
         email: ''
      };

      this.strTimeChat = this.formatDate(new Date());
      if (this.prefillService.chatData && this.prefillService.chatData.connectionId) {
         this.myconnection = this.prefillService.chatData.connectionId;
      } else if (this.details) {
         this.connect();
      }
      this.onResize();
   }

   private _getMsgObject(msg, from, time, status, id) {
      const msgObj = {
         Message: msg,
         MessageType: from,
         WriteTime: time,
         Status: status,
         ClientId: id
      };
      return msgObj;
   }

   submitRating(feedback: IChatFeedback) {

      Observable.interval(600)
         .takeWhile(() => !this.showSecondQuestion)
         .subscribe(i => {
            this.prefillService.chatData.showSecondQuestion = true;
            this.showSecondQuestion = this.prefillService.chatData.showSecondQuestion;
         });
      this.prefillService.chatData.questionNumber = feedback.questionNumber;
      this.questionNumber = this.prefillService.chatData.questionNumber;

      if (feedback.questionNumber === 2) {
         Observable.interval(600)
            .takeWhile(() => !this.secondQuestion)
            .subscribe(i => {
               this.onResize();
               this.secondQuestion = true;
               this.agentDisconnected = this.signalRService.stop();
               this.agentDisconnected = false;
               this.questionNumber = 0;
               this.chatBoxClose();
               this.yesClicked = false;
               this.agentName = '';
               this.chatsFE = [];
               this.connectionId = null;
               this.setChatData();
               this.signalRService.clearChat();
            });
         this.isloggedIn ? this.addAnalytics(AuthConstants.gaEvents.chatNPSQuestioneTwoAuth)
            : this.addAnalytics(AuthConstants.gaEvents.chatNPSQuestioneTwoUnAuth);
      } else if (feedback.questionNumber === 1) {
         this.isloggedIn ? this.addAnalytics(AuthConstants.gaEvents.chatNPSQuestioneOneAuth)
            : this.addAnalytics(AuthConstants.gaEvents.chatNPSQuestioneOneUnAuth);
      }
      //  send rating to agent
      this.signalRService.sendRating(this.labels.rateChatSession, feedback.questionNumber, feedback.rating, this.myconnection);

   }

   handleAnimation(anim) {
      this.anim = anim;
   }

   connect() {

      this.signalRService.connect(this.options, this.isloggedIn, this.myconnection, this.user).subscribe((response) => {
         this.myconnection = response;

      });
      if (!this.isloggedIn) {
         this.addAnalytics(AuthConstants.gaEvents.chatSessionStartedUnAuth);
      }
      this.onResize();
   }

   sendMessage(chatmsg) {
      // set scroll position
      if (chatmsg.trim().length) {
         if (!this.sessionStarted) {
            this.sessionStarted = this.signalRService.start(this.myconnection);
            const agentObject = {
               InteractionOrigin: this.labels.platformWeb,
               ChatInitiationType: this.labels.initiationType,
               BrowserFingerprint: this.fingerprint,
               ClientName: '',
               ClientEmailId: '',
               JWT: this.authToken,
               EnableDeliveryNotifications: true
            };
            if (this.isloggedIn) {
               this.sessionStarted = this.signalRService.invoke(this.myconnection, this.labels.startChatSession, agentObject);
               this.addAnalytics(AuthConstants.gaEvents.chatSessionStartedAuth);
            }
         }

         this.sentTime = new Date();
         const clientMessageUniqueId = UUID.UUID();
         const msgObj = this._getMsgObject(chatmsg, 0, this.sentTime, this.labels.statusPending, clientMessageUniqueId);
         this.chatsFE.push(msgObj);
         this.chats.push(chatmsg);
         this.setChatData();
         if (this.chatsFE.length) {
            this.signalRService.setChatsFE();
         }
         const sendMsgObj = {
            NedbankCustomerMessage: chatmsg,
            ClientMessageUniqueId: clientMessageUniqueId
         };
         this.sessionStarted = this.signalRService.invoke(this.myconnection, this.labels.nedbankCustomerMessage, sendMsgObj);
         this.msg = '';

      }
   }

   continue(details: NgForm) {
      CommonUtility.markFormControlsTouched(details);
      if (!details.form.invalid) {
         this.details = true;
         this.setChatData();
         this.connect();
      }
   }

   chatBoxClose() {
      this.change.emit(false);
      this.isloggedIn ? this.addAnalytics(AuthConstants.gaEvents.minimiseChatAuth)
         : this.addAnalytics(AuthConstants.gaEvents.minimiseChatUnAuth);

   }

   noThanksClick() {
      this.isloggedIn ? this.addAnalytics(AuthConstants.gaEvents.chatNoThanksClickedAuth)
         : this.addAnalytics(AuthConstants.gaEvents.chatNoThanksClickedUnAuth);
      this.signalRService.loggedOutEndChat();
      Observable.interval(600)
         .takeWhile(() => (!this.closedChat))
         .subscribe(i => {
            this.closedChat = true;
            this.change.emit(false);
            this.agentDisconnected = this.signalRService.stop();
            this.agentDisconnected = false;
            this.yesClicked = false;
            this.agentName = '';
            this.details = false;
            this.chatsFE = [];
            this.connectionId = null;
            this.setChatData();
            this.signalRService.clearChat();
         });

      return true;

   }

   chatDisconnect() {
      this.isloggedIn ? this.addAnalytics(AuthConstants.gaEvents.chatTerminatedAuth)
         : this.addAnalytics(AuthConstants.gaEvents.chatTerminatedUnAuth);
      if (this.connected) {
         this.isTyping = false;
         this.prefillService.chatData.showNps = true;
         this.showNps = this.prefillService.chatData.showNps;
         this.setChatData();
         this.yesClickedLoggedIn = true;
         this.prefillService.chatData.yesClickedLoggedIn = this.yesClickedLoggedIn;
         this.questions = this.signalRService.disconnectChat(this.myconnection);
         this.agentDisconnected = true;
      } else {
         this.noThanksClick();
      }
   }

   enterClick(e, msg) {
      this.signalRService.customerIsTyping(this.labels.customerIsTyping);
      if (e.keyCode === 13 && msg.trim().length) {
         this.messageSent = true;
         this.sendMessage(msg);
         e.preventDefault();
      }
   }

   setChatData() {
      this.prefillService.chatData = {
         agentDisconnected: this.agentDisconnected,
         chatsFEHistory: this.chatsFEHistory,
         agentName: this.agentName,
         chats: this.chats,
         chatsFE: this.chatsFE,
         connectionId: this.myconnection,
         fillDetails: this.details,
         nedBankLogo: this.nedBankLogo,
         questionNumber: this.questionNumber,
         questions: this.questions,
         yesClicked: this.yesClicked,
         yesClickedLoggedIn: this.yesClickedLoggedIn,
         showNps: this.showNps,
         showSecondQuestion: this.showSecondQuestion
      };
   }

   private formatDate(date) {
      const strTime = CommonUtility.getTimeInHoursAndSeconds(date);
      const elem = this.document.getElementById(this.labels.messageDiv);

      Observable.interval(600)
         .takeWhile(() => (elem === null))
         .subscribe(i => {
            this.onResize();
         });

      return strTime;
   }

   addAnalytics(event) {
      this.sendEvent(
         event.eventAction, event.label, null, event.category);
   }

   @HostListener('window:resize', ['$event'])
   onResize() {
      const elem = this.document.getElementById(this.labels.messageDiv);
      if (elem) {
         this.chatBotheight = window.innerHeight - elem.offsetTop - 250;
      }
   }
}
