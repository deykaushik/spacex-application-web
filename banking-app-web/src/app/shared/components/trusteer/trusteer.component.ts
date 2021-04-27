import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SharedConstants } from '../../constants';
import { TrusteerService } from '../../../core/services/trusteer-service';

@Component({
   selector: 'app-trusteer',
   templateUrl: './trusteer.component.html',
   styleUrls: ['./trusteer.component.scss']
})

export class TrusteerComponent {
   @Output() onCloseTrusteerEmit = new EventEmitter();
   messages: any = SharedConstants.TrusteerMessages;

   constructor(private service: TrusteerService) { }

   onDownload(event) {
      const link = window['trusteerLink'];
      if (link) {
         this.service.DownloadTrusteer(link);
      }
   }

   onCloseMsg(event) {
      this.onCloseTrusteerEmit.emit();
      this.service.CloseTrusteer();
   }
}

