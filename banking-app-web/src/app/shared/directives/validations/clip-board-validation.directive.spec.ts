import { ClipBoardValidationDirective } from './clip-board-validation.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { assertModuleFactoryCaching } from './../../../test-util';

@Component({
  template: `<input type="text" appClipBoardValidation [(ngModel)]="inputValue">`
})
class ClipBoardComponent {
  inputValue = '';
}
describe('ClipBoardValidationDirective', () => {
  let component: ClipBoardComponent;
  let fixture: ComponentFixture<ClipBoardComponent>;
  let inputEl: DebugElement;

  assertModuleFactoryCaching();
  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [FormsModule],
       declarations: [
        ClipBoardComponent,
        ClipBoardValidationDirective]
    });
    fixture = TestBed.createComponent(ClipBoardComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();

 });
  it('should create an instance', () => {
    const directive = new ClipBoardValidationDirective(inputEl);
    expect(directive).toBeTruthy();
  });
  it('should validate on cut copy paste contextmenu only, should have ng-touched after these events', () => {
    inputEl.triggerEventHandler('cut', null);
    inputEl.nativeElement.inputValue = 'Text Value 676767';
    inputEl.triggerEventHandler('copy', null);
    inputEl.triggerEventHandler('paste', null);
    inputEl.triggerEventHandler('contextmenu', null);
    fixture.detectChanges();

    const classes = inputEl.nativeElement.getAttribute('class');
    expect(classes.indexOf('ng-touched')).toBe(-1);
 });
});
