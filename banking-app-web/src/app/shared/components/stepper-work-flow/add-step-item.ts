import { Type, EventEmitter, Output, Input } from '@angular/core';

export class AddStepItem {
   @Output() discardContinueEmitter = new EventEmitter<boolean>();
   constructor(public component: Type<any>, public data?: any) { }
}
