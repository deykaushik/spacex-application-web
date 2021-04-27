import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideBarComponent } from './slide-bar.component';
import { SkeletonLoaderPipe } from '../pipes/skeleton-loader.pipe';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Router } from '@angular/router';
import { IPreApprovedOffers } from '../../core/services/models';

let navigateTORoute = false;
let toggle = false;
let getInitialized = false;
const RouteStub = {
  navigateByUrl: jasmine.createSpy('navigateByUrl').and.callFake(arr => {
    navigateTORoute = true;
    return true;
  })
};

const preApprovedOffersServiceStub = {
  offersObservable: Observable.create(obs => {
    obs.next('result');
    obs.complete();
  }),
  clickObserver: Observable.create(obs => { obs.next(true); obs.complete(); }),
  toggleSlider: jasmine.createSpy('toggleSlider').and.callFake(() => {
    toggle = true;
  }),
  InitializeWorkFlow: jasmine.createSpy('InitializeWorkFlow').and.callFake(() => {
    getInitialized = true;
  }),
  changeOfferStatusById: jasmine.createSpy('changeOfferStatusById').and.callFake((payload, id) => {
    return Observable.create(obs => {
      obs.next();
      obs.complete();
    });
  })
};

describe('SlideBarComponent', () => {
  let component: SlideBarComponent;
  let fixture: ComponentFixture<SlideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlideBarComponent, SkeletonLoaderPipe],
      imports: [
      ],
      providers: [
        { provide: Router, useValue: RouteStub },
        { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should handle the closeSlider', () => {
    component.closeSlider('');
    expect(toggle).toBeTruthy();
  });
  it('should handle readNotification', () => {
    const value: IPreApprovedOffers = { id: 1, shortMessage: '', message: '', status: '', amount: 100 };
    component.readNotification(value);
    expect(getInitialized).toBeTruthy();
  });
});
