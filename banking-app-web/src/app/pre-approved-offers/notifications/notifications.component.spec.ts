import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { SlideBarComponent } from '../../shared/slide-bar/slide-bar.component';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { RouterTestingModule } from '../../../../node_modules/@angular/router/testing';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ApiService } from '../../core/services/api.service';
import { HttpClientModule } from '../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs';
import { Router } from '../../../../node_modules/@angular/router';

const PreApprovedOffersServiceStub = {
  offersObservable: Observable.create(obs => {
    obs.next();
    obs.complete();
  }),
  clickObserver: Observable.create(obs => {
    obs.next();
    obs.complete();
  })
};

const RouteStub = {
  navigate: jasmine.createSpy('navigate').and.callFake(arr => {
    return true;
  }),
  navigateByUrl: jasmine.createSpy('navigate').and.callFake(arr => {
    return true;
  })
};
describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent, SlideBarComponent, SkeletonLoaderPipe ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: PreApprovedOffersService, useValue: PreApprovedOffersServiceStub},
        { provide: Router, useValue: RouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    component.closeNotification();
    expect(component).toBeTruthy();
  });
});
