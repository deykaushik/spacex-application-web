import { Directive, ElementRef, Input, Renderer2, EventEmitter, OnChanges, Output } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appClearField]'
})
export class ClearFieldDirective implements OnChanges {
  clearElement: any;
  @Input() ngModel;
  @Input() ngModelChange = new EventEmitter();
  @Output() onClear = new EventEmitter();
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private model: NgModel) {
    this.clearElement = this.renderer.createElement('span');
    this.clearElement.id = 'clear-field';
    this.clearElement.onclick = this.clearField.bind(this);
    this.clearElement.classList.add('clear-field');
    this.elementRef.nativeElement.parentElement.appendChild(this.clearElement);
  }

  clearField() {
    this.clearElement.classList.remove('clear-field');
    this.model.control.setValue('');
    this.onClear.emit();
  }
  ngOnChanges() {
    if (this.ngModel && this.ngModel.length > 0) {
      this.clearElement.classList.add('clear-field');
    } else {
      this.clearElement.classList.remove('clear-field');
    }
  }
}
