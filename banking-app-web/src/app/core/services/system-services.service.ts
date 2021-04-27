import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ISystemErrorModel } from './models';

@Injectable()
export class SystemErrorService {

   constructor() { }
   private _errorOccured = new Subject<ISystemErrorModel>();
   private _errorHide = new Subject<ISystemErrorModel>();

   public getError() {
      return this._errorOccured.asObservable();
   }
   public hideError() {
      return this._errorHide.asObservable();
   }
   public closeError() {
      this._errorHide.next();
   }
   public raiseError(error: ISystemErrorModel) {
      this._errorOccured.next(error);
   }
}
