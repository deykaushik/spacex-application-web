import { Injectable, Inject } from '@angular/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { IConnectionOptions, SignalR, ISignalRConnection, BroadcastEventListener } from 'ng2-signalr';
import { Observable } from 'rxjs/Observable';
import { IConnectProperties, IChatDetails, IChatQuestion, IChatProperties } from '../core/services/models';

import { PreFillService } from '../core/services/preFill.service';
import { TokenManagementService } from '../core/services/token-management.service';
import { AuthGuardService } from '../core/guards/auth-guard.service';
import { ChatComponent } from './chat.component';
import { Constants } from '../core/utils/constants';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { Subject } from 'rxjs/Subject';
import { CommonUtility } from '../core/utils/common';

@Injectable()
export class ChatService {
   details: any;
   chats = [];
   chatsFE = [];
   question: IChatQuestion;
   myconnection: ISignalRConnection;
   connectionId: ISignalRConnection;
   agentDisconnected: boolean;
   chatsFEHistory: any[];
   isHistory: boolean;
   sessionStarted: boolean;
   saluteToken: string;
   authToken: string;
   fingerprint: any;
   chatDetailsheight: number;
   chatBotheight: number;
   yesClicked: boolean;
   agentName: string;
   nedBankLogo: boolean;
   strTime: any;
   agentFirstMessage1: ChatComponent;
   agentInitialMessage: string;
   strTimeChat: string;
   recTime: any;
   date = Constants.formats;
   label = Constants.chatMessages;
   today = this.date.ddMMYYYY;
   fullDateFormat = this.date.fullDateChat;
   connectionEstablished = false;
   yesClickedLoggedIn = false;

   dateSet: any;
   dateCheck: string;
   timeCheck: string;
   chatMessages = [];
   chatsFED = {};
   chatMain: any[];
   messageSet: boolean;
   history: any;
   showNps = false;
   connected = false;
   isTyping = false;

   constructor(private _signalR: SignalR, private tokenManagementService: TokenManagementService,
      public auth: AuthGuardService, private prefillService: PreFillService,
      @Inject(DOCUMENT) public document: Document) {
   }
   private _chatActive = new Subject<IChatProperties>();

   private _default: IConnectProperties =
      {
         connectionId: null, agentName: '', chatHistory: null,
         chatsFE: null, yesClicked: false, question: null, connectionEstablished: false,
         agentDisconnected: false, yesClickedLoggedIn: false, connected: false, showNps: false,
         isTyping: false
      };

   private _connect = new Subject<IConnectProperties>();

   getConnected(): Observable<IConnectProperties> {
      return this._connect.asObservable();
   }

   getChatActive(): Observable<IChatProperties> {
      return this._chatActive.asObservable();
   }

   setChatActive(event) {
      const chatProperties: IChatProperties = Object.assign({}, this._default,
         {
            chatActive: event
         });
      this._chatActive.next(chatProperties);
      return event;
   }

   connect(options: IConnectionOptions, isloggedIn: boolean, myconnection: ISignalRConnection, user): Observable<ISignalRConnection> {
      this._signalR.connect(options).then((connectionID) => {
         this.connectionId = connectionID;
         this.myconnection = this.connectionId;
         this.connectionEstablished = true;
         this.chatsFEHistory = [];
         this.sendChatDetails();
         if (!isloggedIn) {
            this.myconnection.start();

            const fingerPrint2 = require('fingerprintjs2sync');
            this.fingerprint = (new fingerPrint2()).getSync().fprint;

            this.saluteToken = this.tokenManagementService.getNedbankIdAnonymousToken();

            const agentObject = {
               InteractionOrigin: this.label.platformWeb,
               ChatInitiationType: this.label.initiationType,
               BrowserFingerprint: this.fingerprint,
               ClientName: user.name,
               ClientEmailId: user.email,
               JWT: this.saluteToken,
               EnableDeliveryNotifications: true
            };

            this.sessionStarted = this.invoke(this.myconnection, this.label.startChatSession, agentObject);

         }

         if (isloggedIn) {
            this.authToken = this.tokenManagementService.getAuthToken();
            this.myconnection.invoke(this.label.requestChatHistory, this.authToken);
            const chatHistory = new BroadcastEventListener<IChatDetails>(this.label.chatHistory);
            this.myconnection.listen(chatHistory);
            chatHistory.subscribe((chatHistoryList: IChatDetails) => {
               this.isHistory = true;
               this.history = CommonUtility.clone(chatHistoryList);
               this.chatsFEHistory = CommonUtility.clone(chatHistoryList);
               this.yesClicked = true;
               this.yesClickedLoggedIn = false;
               this.setChatData();
               this.setChatsFE();
               this.setChatProperties();
            });
         }

         // this.sessionStarted = true;
         const messageFromNedBank = new BroadcastEventListener<IChatDetails>(this.label.messageFromNedbank);
         this.myconnection.listen(messageFromNedBank);
         messageFromNedBank.subscribe((messageFromBank: IChatDetails) => {
            this.isTyping = false;
            this.setMessage(messageFromBank);
            this.myconnection.invoke(this.label.ackFromNedbank, messageFromBank.WriteTime);
         });

         // agent assigned
         const contactCenter = new BroadcastEventListener<IChatDetails>(this.label.chatQueuedFromNedbank);
         this.myconnection.listen(contactCenter);
         const contactCenterQueue = contactCenter.subscribe((messageChatQued: IChatDetails) => {
            // first message from agent in queue

            this.nedBankLogo = true;
            this.setMessage(messageChatQued);
         });

         // agent connected
         const agentConnected = new BroadcastEventListener<IChatDetails>(this.label.agentConnectedFromNedbank);
         this.myconnection.listen(agentConnected);
         agentConnected.subscribe((messageAgentConnected: IChatDetails) => {
            this.myconnection.invoke(this.label.ackFromNedbank, messageAgentConnected.WriteTime);
            this.agentName = messageAgentConnected.AgentFirstName;
            this.connected = true;
            this.agentName = this.agentName;
            this.yesClicked = true;
            this.agentDisconnected = true;
            this.messageSet = this.setMessage(messageAgentConnected);
         });

         // agent disconnected
         const agentDisconnected = new BroadcastEventListener<IChatDetails>(this.label.agentDisconnectedFromNedbank);
         this.myconnection.listen(agentDisconnected);
         agentDisconnected.subscribe((messageAgentDisconnected: IChatDetails) => {
            this.yesClicked = false;
            this.agentDisconnected = false;
            this.yesClickedLoggedIn = true;
            this.showNps = true;
            this.isTyping = false;
            this.setChatData();
            this.setMessage(messageAgentDisconnected);
            this.setChatProperties();
         });

         // if user is inactive
         const inactivityTimeout = new BroadcastEventListener<IChatDetails>(this.label.inactivityTimeout);
         this.myconnection.listen(inactivityTimeout);
         inactivityTimeout.subscribe((messageAgentTimeout: IChatDetails) => {
            this.yesClicked = false;
            this.agentDisconnected = false;
            this.yesClickedLoggedIn = true;
            this.showNps = true;
            this.isTyping = false;
            this.setChatData();
            this.setMessage(messageAgentTimeout);
            this.setChatProperties();
         });

         // chat transfered from one agent to another
         const chatTransferred = new BroadcastEventListener<IChatDetails>(this.label.chatTransferred);
         this.myconnection.listen(chatTransferred);
         chatTransferred.subscribe((messageChatTransferred: IChatDetails) => {
            this.agentName = messageChatTransferred.AgentFirstName;
         });

         // chat connection failed
         const chatConnectFailed = new BroadcastEventListener<IChatDetails>(this.label.failedToConnectChat);
         this.myconnection.listen(chatConnectFailed);
         chatConnectFailed.subscribe((connectionFailed: IChatDetails) => {
         });

         // agent acknowledgment
         const ackNedbankCustomerMessage = new BroadcastEventListener<IChatDetails>(this.label.ackNedbankCustomerMessage);
         this.myconnection.listen(ackNedbankCustomerMessage);
         ackNedbankCustomerMessage.subscribe((ackNedbankMessage: IChatDetails) => {
            this.chatsFEHistory.forEach(chats => {
               chats.ChatMessages.forEach(element => {
                  if (ackNedbankMessage === element.ClientId) {
                     element.Status = this.label.statusDelivered;
                  }
               });
            });
         });

         // agent is typing
         const agentIsTyping = new BroadcastEventListener<IChatDetails>(this.label.agentIsTyping);
         this.myconnection.listen(agentIsTyping);
         agentIsTyping.subscribe((agentIsTypingMessage: IChatDetails) => {
            this.isTyping = true;
            this.setChatProperties();
         });

      });
      this.sendChatDetails();
      return Observable.of(this.connectionId);
   }

   setMessage(message) {
      this.recTime = (message.WriteTime);
      const msg = JSON.parse(JSON.stringify(message.Message));
      const chatmsg = msg.replace(this.label.messageRegex, '');
      this.chats.push(chatmsg);
      const msgObj = this._getMsgObject(chatmsg, this.label.messageTypeFromAgent,
         this.recTime, this.label.emptyString, this.label.clientIdAgent);
      this.chatsFE.push(msgObj);
      this.setChatData();
      this.setChatsFE();
      this.setChatProperties();

      return true;

   }

   start(myconnection) {
      if (myconnection) {
         myconnection.start();
      }
      return true;
   }

   stop() {
      if (this.myconnection) {
         this.myconnection.stop();
      }
      return true;
   }

   sendRating(event, questionNumber, rating, myconnection) {
      if (myconnection) {
         myconnection.invoke(event, questionNumber, rating);
      }
   }

   invoke(myconnection, event, agentObject) {
      if (myconnection) {
         myconnection.invoke(event, agentObject);
      }
      return true;
   }

   applyTransition(event) {
      this.authToken = this.tokenManagementService.getAuthToken();
      if (this.myconnection) {
         this.myconnection.invoke(event, this.authToken);
      }
   }

   customerIsTyping(event) {
      if (this.myconnection && this.connected) {
         this.myconnection.invoke(event);
      }
   }

   disconnectChat(myconnection) {
      const question = myconnection.invoke(this.label.requestNpsQuestions);
      const npsQuestions = new BroadcastEventListener<IChatDetails>(this.label.npsQuestions);
      myconnection.listen(npsQuestions);
      npsQuestions.subscribe((npsQuestionsList: IChatDetails) => {
         this.agentDisconnected = true;
         this.yesClickedLoggedIn = true;
         this.yesClicked = false;
         this.question = {
            questionOne: npsQuestionsList[0].Question,
            questionTwo: npsQuestionsList[1].Question
         };
         this.showNps = false;
         this.sendChatDetails();
      });
      if (myconnection) {
         myconnection.invoke(this.label.endChatSession);
      }
      return question;

   }

   clearChat() {
      this.agentDisconnected = false;
      this.yesClickedLoggedIn = false;
      this.yesClicked = false;
      this.agentName = '';
      this.details = false;
      this.chatsFE = [];
      this.connectionId = null;
      this.chatsFEHistory = [];
      this.showNps = false;
      this.connected = false;
      this.isTyping = false;
      this.setChatData();
   }

   setChatData() {
      this.prefillService.chatData = {
         agentDisconnected: this.agentDisconnected,
         chatsFEHistory: this.chatsFEHistory,
         agentName: this.agentName,
         chats: this.chats,
         chatsFE: this.chatsFE,
         connectionId: this.connectionId,
         fillDetails: this.details,
         nedBankLogo: this.nedBankLogo,
         questionNumber: 0,
         yesClicked: this.yesClicked,
         yesClickedLoggedIn: this.yesClickedLoggedIn,
         showNps: this.showNps
      };
   }

   loggedOutEndChat() {
      if (this.myconnection) {
         this.myconnection.invoke(this.label.endChatSession);
      }
      this.setChatProperties();

   }

   checkNewDate(element) {
      if (!this.dateSet) {
         this.dateCheck = moment(new Date(element.WriteTime), this.date.ddmmyyyy).format(this.date.ddmmyyyy);
         this.dateSet = true;
      }
   }

   sendChatDetails() {
      this.setChatData();
      this.setChatProperties();
   }

   setChatProperties() {
      if (this.prefillService.chatData) {
         const loaderProperties: IConnectProperties = Object.assign({}, this._default,
            {
               chatsFE: this.prefillService.chatData.chatsFE,
               agentName: this.prefillService.chatData.agentName,
               connectionId: this.prefillService.chatData.connectionId,
               chatHistory: this.prefillService.chatData.chatsFEHistory,
               yesClicked: this.prefillService.chatData.yesClicked,
               question: this.question,
               agentDisconnected: this.prefillService.chatData.agentDisconnected,
               yesClickedLoggedIn: this.prefillService.chatData.yesClickedLoggedIn,
               connectionEstablished: this.prefillService.chatData.connectionEstablished,
               connected: this.connected,
               showNps: this.showNps,
               isTyping: this.isTyping
            });
         this._connect.next(loaderProperties);
      }

   }

   // setting chat history array to check page breaker
   setChatsFE() {
      this.chatsFE = this.prefillService.chatData.chatsFE || [];
      this.chatsFEHistory = [];
      this.chatMessages = [];
      this.chatMain = [];

      if (this.chatsFE.length) {
         for (const x of this.chatsFE) {
            this.checkNewDate(x);
            this.timeCheck = moment(new Date(x.WriteTime), this.date.ddmmyyyy).format(this.date.ddmmyyyy);
            // check for same date array
            if (this.timeCheck === this.dateCheck) {
               this.chatMessages.push(x);
            } else {
               // when new date comes date needs to be set again
               this.dateSet = false;
               this.chatMain.push(this.chatsFED);
               this.chatMessages = [];
               this.chatMessages.push(x);
               this.checkNewDate(x);
            }
            this.chatsFED = {
               ChatMessages: this.chatMessages,
               Date: this.dateCheck
            };
         }
      }
      // if chathistory is there for authenticated user
      this.chatsFEHistory = this.isHistory ? CommonUtility.clone(this.history) : this.chatsFEHistory;

      if (this.chatsFE.length) {
         this.chatsFEHistory.push(this.chatsFED);
      }

      // removing same date array
      for (let i = 0; i < this.chatsFEHistory.length - 1; i++) {
         if (this.chatsFEHistory[i].Date === this.chatsFEHistory[i + 1].Date) {
            this.chatsFEHistory[i + 1].ChatMessages.forEach(element => {
               this.chatsFEHistory[i].ChatMessages.push(element);
            });
            this.chatsFEHistory.splice(++i, 1);
         }
      }

      const datePipe = new DatePipe(Constants.labels.localeString);

      const today = moment(new Date()).format(this.date.ddmmyyyy);

      const yesterday = moment(new Date()).add(-1, 'days').format(this.date.ddmmyyyy);

      for (const element of this.chatsFEHistory) {
         const responseDate = moment(element.Date, this.date.ddmmyyyy).format(this.date.ddmmyyyy);
         element.Date = moment(element.Date, this.date.ddmmyyyy).format();
         element.Date = datePipe.transform(element.Date, this.fullDateFormat);

         if (responseDate === today) {
            element.Date = this.label.todayLabel;
         } else if (responseDate === yesterday) {
            element.Date = this.label.yesterdayLabel;
         }
      }
      this.sendChatDetails();
   }

   _getMsgObject(msg, from, time, status, id) {
      const msgObj = {
         Message: msg,
         MessageType: from,
         WriteTime: time,
         Status: status,
         ClientId: id
      };
      return msgObj;
   }

}
