import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ISystemErrorModel } from './models';
import { WindowRefService } from './../services/window-ref.service';

@Injectable()
export class TrusteerService {
   trusteerDownloading: boolean;

   constructor(private winRefService: WindowRefService) { }
   private _show = new Subject<boolean>();

   public ShowTrusteer(value) {
      this.trusteerDownloading = false;
      localStorage.setItem('Trusteer', value);
      this._show.next(value);
      return this._show;
   }

   public CloseTrusteer() {
      this.trusteerDownloading = false;
      localStorage.setItem('Trusteer', 'false');
      this._show.next(false);
      this._show.complete();
   }

   public DownloadTrusteer(link) {
      try {
         if (link) {
            this.trusteerDownloading = true;
            this.winRefService.nativeWindow.location.href = link;
         }
      } catch (ex) { }
      finally {
         this.winRefService.nativeWindow.setTimeout(() => {
            this.trusteerDownloading = false;
         }, 100);
      }
   }
}
