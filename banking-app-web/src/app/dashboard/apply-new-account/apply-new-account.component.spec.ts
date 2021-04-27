import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from './../../test-util';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplyNewAccountComponent } from './apply-new-account.component';

describe('ApplyNewAccountComponent', () => {
  let component: ApplyNewAccountComponent;
  let fixture: ComponentFixture<ApplyNewAccountComponent>;
  let router;

  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [ ApplyNewAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNewAccountComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be call apply function', () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.apply();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/open-account');
  });
});
