import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedComponent } from './get-started.component';
import { Subject } from '../../../../node_modules/rxjs/Subject';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from '../../../../node_modules/rxjs';
import { SharedModule } from '../../shared/shared.module';
import { IGetStarted } from '../pre-approved-offers.model';
import { FeedbackComponent } from '../feedback/feedback.component';
import { WrongInformationComponent } from '../wrong-information/wrong-information.component';
import { assertModuleFactoryCaching } from '../../test-util';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ChatService } from '../../chat/chat.service';
import { on } from 'cluster';


const ActivatedRouteStub = {
  params: Observable.create(obs => {
    obs.next({ offerid: 1 });
    obs.complete();
  })
};
let navigateTORoute = false;
const RouteStub = {
  navigate: jasmine.createSpy('navigate').and.callFake(arr => {
    navigateTORoute = true;
    return true;
  }),
  navigateByUrl: jasmine.createSpy('navigate').and.callFake(arr => {
    navigateTORoute = true;
    return true;
  })
};

const getStarted: IGetStarted = {
  screen: [],
  options: []
};
const preApprovedOffersServiceStub = {
  offersObservable: new Subject(),
  getScreenContent: jasmine.createSpy('getScreenContent').and.returnValue(Observable.create(obs => {
    obs.next([{ content: [] }, []]);
    obs.complete();
  })),
  sendUserContent: jasmine.createSpy('sendUserContent').and.callFake((payload, offerId, constants) => {
    // navigateTORoute = true;
    return Observable.create(obs => {
      obs.next();
      obs.complete();
    });
  }),
  updateGetStartedVm: jasmine.createSpy('updateGetStartedVm').and.returnValue(''),
  getGetStartedVm: jasmine.createSpy('getGetStartedVm').and.returnValue({ screen: [], options: [1, 2] })
};

const SystemErrorServiceStub = {
  getError: jasmine.createSpy('getError').and.returnValue(Observable.create(obs => {
    obs.next({ error: 'some thing went wrong' });
    obs.complete();
  })),
  hideError: jasmine.createSpy('hideError').and.returnValue(Observable.create(obs => {
    obs.next({ error: '' });
    obs.complete();
  }))
};

const ChatServiceStub = {
  getChatActive: jasmine.createSpy('getChatActive').and.returnValue(Observable.create(obs => {
    obs.next({ chatActive: true });
    obs.complete();
  }))
};

describe('GetStartedComponent', () => {
  let component: GetStartedComponent;
  let fixture: ComponentFixture<GetStartedComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetStartedComponent, FeedbackComponent, WrongInformationComponent ],
      imports: [SharedModule],
      providers: [
        { provide: Router, useValue: RouteStub },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub },
        { provide: SystemErrorService, useValue: SystemErrorServiceStub},
        { provide: ChatService, useValue: ChatServiceStub}
      ]
,
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle the exit()', () => {
    component.exit();
    expect(component.showFeedbackScreen).toBeTruthy();
  });

  it('should navigate to dashboard', () => {
    component.goBack();
    component.cancel();
    expect(component.showFeedbackScreen).toBeFalsy();
  });

  it('should confirm lets get started', () => {
    component.getStartedVm.screen = [{ type: '', id: 1, content: [] }, { type: 'str', id: 2, content: [] }];
    component.confirmLetsGetStarted();
    expect(navigateTORoute).toBeTruthy();
  });

});
