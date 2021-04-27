import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../../test-util';
import { SystemErrorComponent } from './system-services.component';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SysErrorInstanceType } from './../../../core/utils/enums';
import { ChatService } from '../../../chat/chat.service';

describe('SystemErrorComponent', () => {
   let component: SystemErrorComponent;
   let fixture: ComponentFixture<SystemErrorComponent>;

   const chatServiceStub = {
      getChatActive: jasmine.createSpy('getChatActive')
         .and.returnValue(Observable.of(true))
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [AlertModule],
         declarations: [SystemErrorComponent],
         providers: [SystemErrorService, { provide: ChatService, useValue: chatServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SystemErrorComponent);
      component = fixture.componentInstance;
      component.document.body.classList.remove('overlay-no-scroll');
      component.document.body.classList.remove('search-recipients-no-scroll');
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should show error window on main body', inject([SystemErrorService], (service) => {
      component.type = SysErrorInstanceType.Body;
      component.service.getError().subscribe((err) => {
         if (component.type === SysErrorInstanceType.Modal && component.isModalOpened()) {
            component.isErrorShown = true;
         } else if (component.type === SysErrorInstanceType.Body && !component.isModalOpened()) {
            component.isErrorShown = true;
         }
      });
      component.service.raiseError({ error: new Error('error') });
      expect(component.isErrorShown).toBeTruthy();
   }));
   it('should show error window on popup', inject([SystemErrorService], (service) => {
      component.type = SysErrorInstanceType.Modal;
      component.service.getError().subscribe((err) => {
         expect(err).toBeDefined();
      });
      component.document.body.classList.add('overlay-no-scroll');
      component.service.raiseError({ error: new Error('error') });
      expect(component.isErrorShown).toBeTruthy();
   }));
   it('should not show on body if poup is opened', inject([SystemErrorService], (service) => {
      component.type = SysErrorInstanceType.Body;
      component.service.getError().subscribe((err) => {
         expect(err).toBeDefined();
      });
      component.document.body.classList.add('overlay-no-scroll');
      component.service.raiseError({ error: new Error('error') });
      expect(component.isErrorShown).toBeFalsy();
   }));
   it('should close message on cross icon', inject([SystemErrorService], (service: SystemErrorService) => {
      component.type = SysErrorInstanceType.Modal;
      component.service.getError().subscribe((err) => {
         expect(err).toBeDefined();
      });
      component.document.body.classList.add('overlay-no-scroll');
      component.service.raiseError({ error: new Error('error') });
      service.closeError();
      component.onSystemAlertClose();
      expect(component.isErrorShown).toBeFalsy();
   }));
});
