import { Injectable } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { TokenRenewalExpiryComponent } from './token-renewal-expiry.component';

@Injectable()
export class TokenRenewalService {

   bsModalRef: BsModalRef;

   constructor(private bsModalService: BsModalService) { }

   public ShowSessionExpired() {
      const config = { animated: true, keyboard: false, backdrop: true, ignoreBackdropClick: true };
      this.bsModalRef = this.bsModalService.show(TokenRenewalExpiryComponent, Object.assign({}, config));
   }
}
