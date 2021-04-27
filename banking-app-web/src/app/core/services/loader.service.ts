import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ILoaderProperties } from './models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoaderService {
   constructor() { }

   private _isOpen = true;
   // whether Loader is showing or not
   // return boolean
   get isOpen(): boolean {
      return this._isOpen;
   }
   private _default: ILoaderProperties = { color: 'green', isShown: true };

   private _loader = new Subject<ILoaderProperties>();

   getLoader(): Observable<ILoaderProperties> {
      return this._loader.asObservable();
   }
   show(properties?: ILoaderProperties) {
      this._isOpen = true;
      const loaderProperties: ILoaderProperties = Object.assign({}, this._default, properties, { isShown: this._isOpen });
      this._loader.next(loaderProperties);
   }
   hide() {
      this._isOpen = false;
      const properties: ILoaderProperties = Object.assign({}, this._default, { isShown: this._isOpen });
      this._loader.next(properties);
   }

}

