import { Injector } from '@angular/core';
import { GaTrackingService } from '../../services/ga.service';
import { IGaEvent, IGaPageTracking } from '../../services/models';

export class BaseComponent {

  constructor(private injector: Injector) { }

  sendEvent(action?: string, label?: String, value?: string, category?: string) {
    const gaTrackingService = this.injector.get(GaTrackingService);
    gaTrackingService.sendEvent({
      action: action,
      label: label,
      value: value,
      category: category
    });
  }

  changeCategory(categoryName: string) {
    const gaTrackingService = this.injector.get(GaTrackingService);
    gaTrackingService.changeCategory(categoryName);
  }

  trackPage(pageInfo: IGaPageTracking) {
    const gaTrackingService = this.injector.get(GaTrackingService);
    gaTrackingService.trackPage(pageInfo);
  }

}
