import { Injectable } from '@angular/core';
import { Constants } from '../utils/constants';

@Injectable()
export class WindowRefService {
   constructor() { }

   get nativeWindow(): any {
      return this._window();
   }

   private _window() {
      return window;
   }

   isSmallScreen() {
      if (window.innerHeight < Constants.disablePoupMin.height ||
         window.innerWidth < Constants.disablePoupMin.width) {
         return true;
      }
      return false;
   }
}
