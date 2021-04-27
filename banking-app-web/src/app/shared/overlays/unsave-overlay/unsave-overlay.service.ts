import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';

import { IPlasticCard } from './../../../core/services/models';

@Injectable()
export class UnsaveOverlayService {

   OverlayUpdateEmitter = new EventEmitter<any>();
   OverlayUoutEmitter = new EventEmitter<any>();

   updateOverlay(val) {
      this.OverlayUpdateEmitter.emit(val);
   }

   emitOut(val) {
      this.OverlayUoutEmitter.emit(val);
   }
}
