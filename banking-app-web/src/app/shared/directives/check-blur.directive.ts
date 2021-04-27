import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appCheckBlur]'
})
export class CheckBlurDirective {
  private el: ElementRef;
  constructor(private elementRef: ElementRef, private model: NgModel) {
    this.el = this.elementRef;
    this.appendBlur(this.model, true);
  }
  @HostListener('focus', ['$event'])
  onFocus(event) {
    this.appendBlur(this.model, false);
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    this.appendBlur(this.model, true);
  }
  appendBlur(obj, val: boolean) {
    if (obj) {
    obj.isBlurred = val;
    }
  }
}
