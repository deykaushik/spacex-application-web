import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from './../../test-util';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { GreetingComponent } from './greeting.component';
import { Subject } from 'rxjs/Subject';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';

describe('GreetingComponent', () => {
   let component: GreetingComponent;
   let fixture: ComponentFixture<GreetingComponent>;
   const clientObserver = new Subject();
   const resultMock = {
      PreferredName: 'Test',
      FirstName: 'Test'
   };
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [GreetingComponent, SkeletonLoaderPipe],
         providers: [{
            provide: ClientProfileDetailsService,
            useValue: {
               clientDetailsObserver: clientObserver
            }
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GreetingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
      clientObserver.next(undefined);
      clientObserver.next(resultMock);
      clientObserver.next({ FirstName: 'Test' });
   });

   it('should unsubscribe on ngDestroy', () => {
      expect(component).toBeTruthy();
      component.ngOnDestroy();
   });

   it('should unsubscribe on ngDestroy when observer is null', () => {
      expect(component).toBeTruthy();
      component.clientDeatilSubscription = null;
      component.ngOnDestroy();
   });
});
