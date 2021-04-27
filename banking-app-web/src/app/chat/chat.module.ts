import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SignalRConfiguration, SignalRModule, ConnectionTransport, ConnectionTransports } from 'ng2-signalr';
import { environment } from '../../environments/environment';
import { Constants } from '../core/utils/constants';

// setting signalRConfiguration to setup websocket connection
export function createConfig(): SignalRConfiguration {
   const connection = new SignalRConfiguration();
   connection.hubName = Constants.chatMessages.hubName;
   connection.url = environment.signalRUrl;
   connection.logging = false;
   connection.transport = [ConnectionTransports.webSockets, ConnectionTransports.longPolling];
   return connection;
}

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      SignalRModule.forRoot(createConfig)
   ],
   declarations: []
})
export class ChatModule { }
