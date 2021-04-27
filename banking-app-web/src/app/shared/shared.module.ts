import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DpDatePickerModule } from 'ng2-date-picker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ColoredOverlayComponent } from './overlays/colored-overlay/overlay.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { NouisliderModule } from 'ng2-nouislider';
import { RangeSliderComponent } from './controls/range-slider/range-slider.component';
import { RangeAmountSliderComponent } from './controls/range-amount-slider/range-amount-slider.component';
import { CustomDatePickerComponent } from './controls/custom-date-picker/custom-date-picker.component';

import { StepDirective } from './components/work-flow/step.directive';
import { WorkFlowComponent } from './components/work-flow/work-flow.component';
import { CircleIconHeadingComponent } from './components/headings/circle-icon-heading.component';
import { BottomButtonComponent } from './controls/buttons/bottom-button.component';
import { AccountListComponent } from './controls/account-list/account-list.component';
import { ValidateInputDirective } from './directives/validations/validateInput.directive';
import { ValidateMultipleNDirective } from './directives/validations/vallidation-multiple-n.directive';
import { ValidateMaxAmountDirective } from './directives/validations/validation-maxAmount';
import { ValidateOnBlurDirective } from './directives/validations/validation-onblur.directive';
import { HighlightPipe } from './pipes/highlight.pipe';
import { ValidateMultipleFiftyDirective } from './directives/validations/validation-multiplefifty.directive';
import { AmountFormatDirective } from '../shared/directives/amount-format.directive';
import { AmountTransformPipe } from '../shared/pipes/amount-transform.pipe';
import { CurrencyFormat } from '../shared/pipes/amount-transform-new.pipe';
import { CardMaskPipe } from './pipes/card-mask.pipe';
import { LocaleDatePipe } from './pipes/locale-date.pipe';
import { MobileNumberMaskPipe } from './pipes/mobile-number-mask.pipe';
import { SearchRecipientsComponent } from './components/search-recipients/search-recipients.component';
import { ClickScrollDirective } from './directives/click-scroll.directive';
import { RadioButtonListComponent } from './controls/radio-button-list/radio-button-list.component';
import { SkeletonLoaderPipe } from './pipes/skeleton-loader.pipe';
import { SmallOverlayComponent } from './overlays/small-overlay/small-overlay.component';
import { UnsaveOverlayComponent } from './overlays/unsave-overlay/unsave-overlay.component';
import { SubmenuComponent } from './components/submenu/submenu.component';
import { RouterModule } from '@angular/router';
import { AmountFieldComponent } from './controls/amount-field/amount-field.component';
import { LottoNumberPickerComponent } from './components/lotto-number-picker/lotto-number-picker.component';
import { TransactionGraphComponent } from './graphs/transaction-graph/transaction-graph.component';
import { FormatSchedulePaymentPipe } from './pipes/format-schedule-payment.pipe';
import { SystemErrorComponent } from './components/system-services/system-services.component';
import { ValidateRequiredDirective } from './directives/validations/validation-required.directive';

import { HaversineService } from 'ng2-haversine';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { DmFocusDirective } from './directives/focus.directive';
import { BrowserBackOverlayComponent } from './overlays/browser-back-overlay/browser-back-overlay.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { ScheduledTransactionComponent } from './components/scheduled-transaction/scheduled-transaction.component';
import { ViewSchedulePaymentComponent } from './components/view-schedule-payment/view-schedule-payment.component';
import { EditScheduledPaymentComponent } from './components/edit-scheduled-payment/edit-scheduled-payment.component';
import { ApproveItComponent } from './../register/approve-it/approve-it.component';

import { FormatMobileNumberPipe } from './../register/pipes/format-mobile-number.pipe';
import { PasswordStrengthMeterComponent } from './../register/password-strength-meter/password-strength-meter.component';
import { OutofbandVerificationComponent } from './components/outofband-verification/outofband-verification.component';
import { ClearFieldDirective } from './directives/clear-field.directive';
import { TruncateDescriptionPipe } from './pipes/truncate-description.pipe';
import { CheckBlurDirective } from './directives/check-blur.directive';
import { EmailMaskPipe } from './pipes/email-mask.pipe';
import { KeyValueMapPipe } from './pipes/key-value-map.pipe';
import { ToggleButtonGroupComponent } from './controls/toggle-button-group/toggle-button-group.component';
import { PhoneNumberValidatorComponent } from './components/phone-number-validator/phone-number-validator.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ValidationLatinWordDirective } from './directives/validations/validation-latin-word.directive';
import { ClipBoardValidationDirective } from './directives/validations/clip-board-validation.directive';
import { MessageAlertComponent } from './components/message-alert/message-alert.component';
import { DpArrowNavigationDirective } from './directives/dp-arrow-navigation.directive';
import { StepperWorkFlowComponent } from './components/stepper-work-flow/stepper-work-flow.component';
import { StepperNavBarComponent } from './components/stepper-work-flow/stepper-nav-bar/stepper-nav-bar.component';
import { StepperMobileNavBarComponent } from './components/stepper-work-flow/stepper-nav-bar-mobile/stepper-nav-bar-mobile.component';
import { ToggleTabGroupComponent } from './controls/toggle-tab-group/toggle-tab-group.component';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { DaySelectionTextPipe } from './pipes/day-selection-text.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { TrusteerComponent } from './components/trusteer/trusteer.component';
import { TokenRenewalExpiryComponent } from './components/token-renewal-expiry/token-renewal-expiry.component';
import { ActionStatusComponent } from './components/action-status/action-status.component';
import { SlideBarComponent } from './slide-bar/slide-bar.component';

@NgModule({
   imports: [
      CommonModule,
      AlertModule.forRoot(),
      BsDropdownModule.forRoot(),
      TypeaheadModule.forRoot(),
      BsDatepickerModule.forRoot(),
      FormsModule,
      DpDatePickerModule,
      TooltipModule.forRoot(),
      NouisliderModule,
      RouterModule,
      ChartsModule,
      Ng2DeviceDetectorModule.forRoot()
   ],
   providers: [AmountTransformPipe, CurrencyFormat, DatePipe, HaversineService],

   declarations: [WorkFlowComponent, StepDirective, CircleIconHeadingComponent, BottomButtonComponent, AccountListComponent,
      ValidateInputDirective, ValidateOnBlurDirective, AmountFormatDirective, ValidateMultipleFiftyDirective,
      AmountTransformPipe, CurrencyFormat, HighlightPipe, LocaleDatePipe, ColoredOverlayComponent,
       CardMaskPipe, SearchRecipientsComponent,
      ClickScrollDirective, RangeSliderComponent, RangeAmountSliderComponent, RadioButtonListComponent, CustomDatePickerComponent,
      SkeletonLoaderPipe, SmallOverlayComponent, UnsaveOverlayComponent, SubmenuComponent, TransactionGraphComponent,
      ValidateMultipleNDirective, ValidateMaxAmountDirective, AmountFieldComponent, LottoNumberPickerComponent, FormatSchedulePaymentPipe,
      ValidateRequiredDirective, SystemErrorComponent, NavMenuComponent, DmFocusDirective, BrowserBackOverlayComponent, SpinnerComponent,
      ApproveItComponent, FormatMobileNumberPipe, PasswordStrengthMeterComponent, OutofbandVerificationComponent, MobileNumberMaskPipe,
      ScheduledTransactionComponent, ViewSchedulePaymentComponent, EditScheduledPaymentComponent, ClearFieldDirective, CheckBlurDirective,
      EmailMaskPipe, TermsAndConditionsComponent, ValidationLatinWordDirective, ClipBoardValidationDirective, TruncateDescriptionPipe,
      KeyValueMapPipe, MessageAlertComponent, PhoneNumberValidatorComponent, DpArrowNavigationDirective,
      ToggleButtonGroupComponent, ToggleButtonGroupComponent,
      StepperWorkFlowComponent, StepperNavBarComponent, StepperMobileNavBarComponent, ToggleTabGroupComponent, NumberFormatPipe,
      DaySelectionTextPipe, TrusteerComponent, SearchPipe, TokenRenewalExpiryComponent, ActionStatusComponent, SlideBarComponent],

   exports: [WorkFlowComponent, CircleIconHeadingComponent, BottomButtonComponent, AlertModule, BsDropdownModule, AccountListComponent,
      FormsModule, ValidateInputDirective, ValidateOnBlurDirective, TypeaheadModule, ValidateMultipleFiftyDirective, AmountFormatDirective,
      AmountTransformPipe, HighlightPipe, BsDatepickerModule, TooltipModule, CardMaskPipe, LocaleDatePipe, ColoredOverlayComponent,
      SearchRecipientsComponent, RangeAmountSliderComponent, RadioButtonListComponent, CustomDatePickerComponent, SkeletonLoaderPipe,
      SmallOverlayComponent, UnsaveOverlayComponent, SubmenuComponent, ValidateMultipleNDirective, TransactionGraphComponent,
      ValidateMaxAmountDirective, AmountFieldComponent, CommonModule, LottoNumberPickerComponent, FormatSchedulePaymentPipe,
      ValidateRequiredDirective, SystemErrorComponent, NavMenuComponent, DmFocusDirective, BrowserBackOverlayComponent, SpinnerComponent,
      ApproveItComponent, FormatMobileNumberPipe, PasswordStrengthMeterComponent, OutofbandVerificationComponent, MobileNumberMaskPipe,
      ScheduledTransactionComponent, ViewSchedulePaymentComponent, EditScheduledPaymentComponent, ClearFieldDirective, CheckBlurDirective,
      EmailMaskPipe, TermsAndConditionsComponent, ValidationLatinWordDirective, ClipBoardValidationDirective, TruncateDescriptionPipe,
      KeyValueMapPipe, MessageAlertComponent, RangeSliderComponent, PhoneNumberValidatorComponent,
      DpArrowNavigationDirective, StepperWorkFlowComponent, StepperNavBarComponent, StepperMobileNavBarComponent,
      ToggleButtonGroupComponent, ToggleTabGroupComponent, NumberFormatPipe, DaySelectionTextPipe, TrusteerComponent, SearchPipe,
      TokenRenewalExpiryComponent, ActionStatusComponent, CurrencyFormat, SlideBarComponent],

   entryComponents: [OutofbandVerificationComponent, TermsAndConditionsComponent, TokenRenewalExpiryComponent]

})
export class SharedModule { }
