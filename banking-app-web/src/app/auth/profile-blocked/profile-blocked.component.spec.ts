import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Constants } from './../../core/utils/constants';
import { assertModuleFactoryCaching } from './../../test-util';
import { ProfileBlockedComponent } from './profile-blocked.component';

describe('ProfileBlockedComponent', () => {
  let component: ProfileBlockedComponent;
  let fixture: ComponentFixture<ProfileBlockedComponent>;
  let router: Router;

  assertModuleFactoryCaching();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [ ProfileBlockedComponent ],
      providers: [HttpClient, HttpHandler],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBlockedComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate Close', () => {
    const spy = spyOn(router, 'navigateByUrl');
    spyOn(component, 'navigateClose').and.callThrough();
    component.navigateClose();
    const url = spy.calls.first().args[0];
    expect(url.toString()).toBe('/auth');
  });

  it('should navigate Find Branch', () => {
    const spy = spyOn(router, 'navigateByUrl');
    spyOn(component, 'findBranch').and.callThrough();
    component.findBranch(null);
    const url = spy.calls.first().args[0];
    expect(url.toString()).toBe('/branchlocator');
  });
});
