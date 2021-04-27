import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnChanges, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ComponentHostDirective } from '../component-host.directive';
import { CommonUtility } from '../../core/utils/common';
import { AuthGuardService } from '../../core/guards/auth-guard.service';

@Component({
   selector: 'app-landing',
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

   reportConfig: any;
   dynamicReportComponent: any;
   dynamicReportdata: any;
   componentRef;
   @ViewChild(ComponentHostDirective) componentHost: ComponentHostDirective;

   constructor(private auth: AuthGuardService, private bsModalRef: BsModalRef,
      private componentFactoryResolver: ComponentFactoryResolver) {
   }

   // loads component dynamically
   public loadComponent(): void {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dynamicReportComponent);
      const viewContainerRef = this.componentHost.viewContainerRef;
      viewContainerRef.clear();
      this.componentRef = viewContainerRef.createComponent(componentFactory);
      this.componentRef.instance.reportData = this.dynamicReportdata;
      this.auth.isAuthenticated.subscribe(isLogin => {
         if (!isLogin) {
            this.bsModalRef.hide();
         }
      });
   }
   closeModal() {
      this.bsModalRef.hide();
   }
   PrintFile() {
      CommonUtility.print();
   }

}
