import { ValidateInputDirective } from './validateInput.directive';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../../test-util';

@Component({
   selector: 'app-alphabet-only-component',
   template: `<input type="text" id="txtAlphabetInput" appValidateInput validateFor='alphabet' [(ngModel)]="inputValue">`
})
class AlphabetOnlyComponent {
   inputValue = '';
}

@Component({
   selector: 'app-number-only-component',
   template: `<input type="text" id="txtNumberInput" appValidateInput validateFor='number' [(ngModel)]="inputValue">`
})
class NumberOnlyComponent {
   inputValue = '';
}

@Component({
   selector: 'app-number-only-component',
   template: `<input type="text" id="txtNameInput" appValidateInput validateFor='name' [(ngModel)]="inputValue" maxLimit="15">`
})
class NameOnlyComponent {
   inputValue = '';
}

@Component({
   selector: 'app-alphanumeric-only-component',
   template: `<input type="text" id="txtalphaspaceInput" appValidateInput validateFor='alphanumeric' [(ngModel)]="inputValue">`
})
class AlphaComponent {
   inputValue = '';
}

@Component({
   selector: 'app-alphanumeric-space-only-component',
   template: `<input type="text" id="txtalphaspaceInput" appValidateInput validateFor='alphanumericwithspace' [(ngModel)]="inputValue">`
})
class AlphaSpaceComponent {
   inputValue = '';
}

@Component({
   selector: 'app-no-validatefor-component',
   template: `<input type="text" id="txtalphaspaceInput" appValidateInput validateFor='' [(ngModel)]="inputValue">`
})
class NoValidateForComponent {
   inputValue = '';
}

@Component({
   template: `<input type="tel" appValidateInput validateFor='mobile' [(ngModel)]="inputValue">`
})
class MobileNumberComponent {
   inputValue = '';
}

describe('ValidateInputDirective', () => {
   let component: AlphabetOnlyComponent;
   let fixture: ComponentFixture<AlphabetOnlyComponent>;
   let inputEl: DebugElement;

   let componentNum: AlphabetOnlyComponent;
   let fixtureNum: ComponentFixture<AlphabetOnlyComponent>;
   let inputElNum: DebugElement;

   let componentName: NameOnlyComponent;
   let fixtureName: ComponentFixture<NameOnlyComponent>;
   let inputElName: DebugElement;

   let componentAlphaSpace: AlphaSpaceComponent;
   let fixtureAlphaSpace: ComponentFixture<AlphaSpaceComponent>;
   let inputElAlphaSpace: DebugElement;

   let componentAlpha: AlphaComponent;
   let fixtureAlpha: ComponentFixture<AlphaComponent>;
   let inputElAlpha: DebugElement;

   let componentNoValid: NoValidateForComponent;
   let fixtureNoValid: ComponentFixture<NoValidateForComponent>;
   let inputElNoValid: DebugElement;

   let componentMobile: MobileNumberComponent;
   let fixtureMobile: ComponentFixture<MobileNumberComponent>;
   let inputElMobile: DebugElement;

   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [
            AlphabetOnlyComponent,
            NumberOnlyComponent,
            NameOnlyComponent,
            AlphaSpaceComponent,
            AlphaComponent,
            NoValidateForComponent,
            MobileNumberComponent,
            ValidateInputDirective]
      });
      fixture = TestBed.createComponent(AlphabetOnlyComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();

      fixtureNum = TestBed.createComponent(NumberOnlyComponent);
      componentNum = fixtureNum.componentInstance;
      inputElNum = fixtureNum.debugElement.query(By.css('input'));
      fixtureNum.detectChanges();

      fixtureName = TestBed.createComponent(NameOnlyComponent);
      componentName = fixtureName.componentInstance;
      inputElName = fixtureName.debugElement.query(By.css('input'));
      fixtureName.detectChanges();

      fixtureAlpha = TestBed.createComponent(AlphaComponent);
      componentAlpha = fixtureAlpha.componentInstance;
      inputElAlpha = fixtureAlpha.debugElement.query(By.css('input'));
      fixtureAlpha.detectChanges();

      fixtureAlphaSpace = TestBed.createComponent(AlphaSpaceComponent);
      componentAlphaSpace = fixtureAlphaSpace.componentInstance;
      inputElAlphaSpace = fixtureAlphaSpace.debugElement.query(By.css('input'));
      fixtureAlphaSpace.detectChanges();

      fixtureNoValid = TestBed.createComponent(NoValidateForComponent);
      componentNoValid = fixtureNoValid.componentInstance;
      inputElNoValid = fixtureNoValid.debugElement.query(By.css('input'));
      fixtureNoValid.detectChanges();

      fixtureMobile = TestBed.createComponent(MobileNumberComponent);
      componentMobile = fixtureMobile.componentInstance;
      inputElMobile = fixtureMobile.debugElement.query(By.css('input'));
      fixtureMobile.detectChanges();

   });

   it('should create an instance', () => {
      const validateDirective = new ValidateInputDirective(null, null);
      expect(validateDirective).toBeTruthy();
   });

   it('should avoid numbers for alphabet only component', () => {
      inputEl.nativeElement.value = '123';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(fixture.componentInstance.inputValue).toBe('');
      });
   });

   it('should accept alphabets for alphabet only component', () => {
      inputEl.nativeElement.value = 'abc';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(fixture.componentInstance.inputValue).toBe('abc');
      });
   });

   it('should avoid alphabets for number only component', () => {
      inputElNum.nativeElement.value = 'abc';
      inputElNum.nativeElement.dispatchEvent(new Event('input'));
      fixtureNum.detectChanges();
      fixtureNum.whenStable().then(() => {
         expect(fixtureNum.componentInstance.inputValue).toBe('');
      });
   });

   it('should accept numbers for number only component', () => {
      inputElNum.nativeElement.value = '123';
      inputElNum.nativeElement.dispatchEvent(new Event('input'));
      fixtureNum.detectChanges();
      fixtureNum.whenStable().then(() => {
         expect(fixtureNum.componentInstance.inputValue).toBe('123');
      });
   });

   it('should avoid anything except alphabets and space for name component', () => {
      inputElName.nativeElement.value = '12@#$%_.';
      inputElName.nativeElement.dispatchEvent(new Event('input'));
      fixtureName.detectChanges();
      fixtureName.whenStable().then(() => {
         expect(fixtureName.componentInstance.inputValue).toBe('');
      });
   });

   it('should except alphabets and space for name component', () => {
      inputElName.nativeElement.value = 'Test User';
      inputElName.nativeElement.dispatchEvent(new Event('input'));
      fixtureName.detectChanges();
      fixtureName.whenStable().then(() => {
         expect(fixtureName.componentInstance.inputValue).toBe('Test User');
      });
   });

   it('should not except alphabets more than 15 characters for name component', () => {
      inputElName.nativeElement.value = 'Test User with more than 15 characters';
      inputElName.nativeElement.dispatchEvent(new Event('input'));
      fixtureName.detectChanges();
      fixtureName.whenStable().then(() => {
         expect(fixtureName.componentInstance.inputValue.length).toBe(15);
      });
   });

   it('should avoid special characters in alpha numeric component', () => {
      inputElAlpha.nativeElement.value = '@#$%_.';
      inputElAlpha.nativeElement.dispatchEvent(new Event('input'));
      fixtureAlpha.detectChanges();
      fixtureAlpha.whenStable().then(() => {
         expect(fixtureAlpha.componentInstance.inputValue).toBe('');
      });
   });

   it('should accept alphabets and numbers in alpha numeric component', () => {
      inputElAlpha.nativeElement.value = 'Test1234';
      inputElAlpha.nativeElement.dispatchEvent(new Event('input'));
      fixtureAlpha.detectChanges();
      fixtureAlpha.whenStable().then(() => {
         expect(fixtureAlpha.componentInstance.inputValue).toBe('Test1234');
      });
   });

   it('should avoid special characters in alpha numeric space component', () => {
      inputElAlphaSpace.nativeElement.value = '@#$%_.';
      inputElAlphaSpace.nativeElement.dispatchEvent(new Event('input'));
      fixtureAlphaSpace.detectChanges();
      fixtureAlphaSpace.whenStable().then(() => {
         expect(fixtureAlphaSpace.componentInstance.inputValue).toBe('');
      });
   });

   it('should accept alphabets, space and numbers in alpha numeric space component', () => {
      inputElAlphaSpace.nativeElement.value = 'Test 1234';
      inputElAlphaSpace.nativeElement.dispatchEvent(new Event('input'));
      fixtureAlphaSpace.detectChanges();
      fixtureAlphaSpace.whenStable().then(() => {
         expect(fixtureAlphaSpace.componentInstance.inputValue).toBe('Test 1234');
      });
   });

   it('should accept mobile number with only +27 country code', () => {
      inputElMobile.nativeElement.value = '+9111111111';
      inputElMobile.nativeElement.dispatchEvent(new Event('input'));
      fixtureMobile.detectChanges();
      fixtureMobile.whenStable().then(() => {
         expect(fixtureMobile.componentInstance.inputValue).toBe('+');
      });
   });

   it('should apply +27 on mobile number only ', () => {
      inputElMobile.nativeElement.value = '27111111111';
      inputElMobile.nativeElement.dispatchEvent(new Event('input'));
      fixtureMobile.detectChanges();
      fixtureMobile.whenStable().then(() => {
         expect(fixtureMobile.componentInstance.inputValue).toBe('+27111111111');
      });
   });

   it('should accept mobile number with zero in start', () => {
      inputElMobile.nativeElement.value = '0111111111';
      inputElMobile.nativeElement.dispatchEvent(new Event('input'));
      fixtureMobile.detectChanges();
      fixtureMobile.whenStable().then(() => {
         expect(fixtureMobile.componentInstance.inputValue).toBe('0111111111');
      });
   });

   it('should accept mobile number with ten digits', () => {
      inputElMobile.nativeElement.value = '111111111';
      inputElMobile.nativeElement.dispatchEvent(new Event('input'));
      fixtureMobile.detectChanges();
      fixtureMobile.whenStable().then(() => {
         expect(fixtureMobile.componentInstance.inputValue).toBe('111111111');
      });
   });


   it('should not accept decimal point for numbers', () => {
      const eventObj = inputElNum.nativeElement.createEventObject ?
         inputElNum.nativeElement.createEventObject() : document.createEvent('Events');

      if (eventObj.initEvent) {
         eventObj.initEvent('keydown', true, true);
      }

      eventObj.keyCode = 190;
      eventObj.which = 190;
      eventObj.ctrlKey = true;

      inputElNum.nativeElement.dispatchEvent ? inputElNum.nativeElement.dispatchEvent(eventObj) :
         inputElNum.nativeElement.fireEvent('keydown', eventObj);

      fixtureNum.detectChanges();
      fixtureNum.whenStable().then(() => {
         expect(inputElNum.nativeElement.value).toBe('');
      });
   });

   it('should accept alphabets for alphabets validation', () => {
      const eventObj = inputElAlpha.nativeElement.createEventObject ?
         inputElAlpha.nativeElement.createEventObject() : document.createEvent('Events');

      if (eventObj.initEvent) {
         eventObj.initEvent('keydown', true, true);
      }

      eventObj.keyCode = 65;
      eventObj.which = 65;
      eventObj.ctrlKey = true;

      inputElAlpha.nativeElement.dispatchEvent ? inputElAlpha.nativeElement.dispatchEvent(eventObj) :
         inputElAlpha.nativeElement.fireEvent('keydown', eventObj);

      fixtureAlpha.detectChanges();
      fixtureAlpha.whenStable().then(() => {
         expect(inputElAlpha.nativeElement.value).toBe('');
      });
   });

   it('should not accept alphabets for number validation', () => {
      const eventObj = inputElNum.nativeElement.createEventObject ?
         inputElNum.nativeElement.createEventObject() : document.createEvent('Events');

      if (eventObj.initEvent) {
         eventObj.initEvent('keydown', true, true);
      }

      eventObj.keyCode = 65;
      eventObj.which = 65;
      eventObj.ctrlKey = true;

      inputElNum.nativeElement.dispatchEvent ? inputElNum.nativeElement.dispatchEvent(eventObj) :
         inputElNum.nativeElement.fireEvent('keydown', eventObj);

      fixtureNum.detectChanges();
      fixtureNum.whenStable().then(() => {
         expect(inputElNum.nativeElement.value).toBe('');
      });
   });
});
