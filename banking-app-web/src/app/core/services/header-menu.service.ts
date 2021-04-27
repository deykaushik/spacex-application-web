import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderMenuService {

   constructor() { }
   private _openHeaderMenu = new Subject<string>();

   public headerMenuOpener() {
      return this._openHeaderMenu.asObservable();
   }
   public openHeaderMenu(menuText: string) {
      this._openHeaderMenu.next(menuText);
   }
}
