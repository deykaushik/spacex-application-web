import { DOCUMENT } from '@angular/platform-browser';
import { Component, OnInit, Input, Inject, EventEmitter } from '@angular/core';

import { SysErrorInstanceType } from './../../../core/utils/enums';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { Constants } from '../../../core/utils/constants';
import { ISystemErrorModel, IErrorEmitterResponse, IChatProperties } from '../../../core/services/models';
import { ChatService } from '../../../chat/chat.service';

@Component({
   selector: 'app-system-error',
   templateUrl: './system-services.component.html',
   styleUrls: ['./system-services.component.scss']
})
export class SystemErrorComponent implements OnInit {

   @Input() type: SysErrorInstanceType;
   isErrorShown: Boolean = false;
   sysErrorInstanceType = SysErrorInstanceType;
   errorMessages = Constants.VariableValues.sytemErrorMessages;
   messageType: String;
   callbackEmitter: EventEmitter<IErrorEmitterResponse>;
   chatActive: boolean;
   constructor(public service: SystemErrorService, private chatService: ChatService, @Inject(DOCUMENT) public document: Document) { }
   ngOnInit() {
      this.service.getError().subscribe((response: ISystemErrorModel) => {
         if (typeof response.error === 'object') {
            this.messageType = this.errorMessages.defaultMessage;
         } else if (typeof response.error === 'string') {
            this.messageType = response.error;
         }
         this.callbackEmitter = response.callbackEmitter;
         if (this.type === SysErrorInstanceType.Modal && this.isModalOpened()) {
            this.isErrorShown = true;
         } else if (this.type === SysErrorInstanceType.Body && !this.isModalOpened()) {
            this.isErrorShown = true;
         }
      });
      this.service.hideError().subscribe(() => {
         this.isErrorShown = false;
      });
      this.chatService.getChatActive().subscribe((properties: IChatProperties) => {
         this.chatActive = properties.chatActive;
      });
   }
   navigationClick($event) {
      if (this.callbackEmitter) {
         this.callbackEmitter.emit({ type: 'anchorClick' });
      }
   }
   onSystemAlertClose() {
      this.isErrorShown = false;
   }
   isModalOpened(): boolean {
      return this.document.body.classList.contains('overlay-no-scroll')
         || this.document.body.classList.contains('search-recipients-no-scroll');
   }
}
