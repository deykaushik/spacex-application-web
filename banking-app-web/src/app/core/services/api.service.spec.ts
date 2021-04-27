import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TestBed, inject } from '@angular/core/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientModule],
         providers: [ApiService, HttpClient]
      });
   });

   it('should be created', inject([ApiService], (service: ApiService) => {
      expect(service).toBeTruthy();
   }));

   it('should have get and getAll methods', inject([ApiService], (service: ApiService) => {
      expect(service.PaymentAccounts.get).toBeDefined();
      expect(service.PaymentLimits.getAll).toBeDefined();
      expect(service.TransferAccounts.get).toBeDefined();
      expect(service.TransferLimits.getAll).toBeDefined();
      expect(service.DashboardAccounts.getAll).toBeDefined();
      expect(service.AcceptTermsAndConditions.updateById).toBeDefined();
      expect(service.DownloadTermsAndConditions.getBlob).toBeDefined();
      expect(service.ServiceProviders.getAll).toBeDefined();
      expect(service.ServiceProvidersProducts.getAll).toBeDefined();
      expect(service.PrepaidAccounts.getAll).toBeDefined();
      expect(service.PrepaidLimit.getAll).toBeDefined();
      expect(service.AccountTransactions.getAll).toBeDefined();
      expect(service.PlasticCards.getAll).toBeDefined();
      expect(service.CreditCardAtmLimit.getAll).toBeDefined();
      expect(service.DebitCardAtmLimit.getAll).toBeDefined();
      expect(service.DebitCardAtmLimit.create).toBeDefined();
      expect(service.AccountDebitOrders.getAll).toBeDefined();
      expect(service.AccountMandateOrders.getAll).toBeDefined();
      expect(service.DisputeanOrder.create).toBeDefined();
      expect(service.ShareAccount.create).toBeDefined();
      expect(service.UniversalBranchCodes.getAll).toBeDefined();
      expect(service.UpliftDormantAccount.update).toBeDefined();
      expect(service.UpliftDormantAccountStatus.create).toBeDefined();
      expect(service.OverdraftValidations.getAll).toBeDefined();
      expect(service.UnilateralLimitIndicatorDetails.getAll).toBeDefined();
      expect(service.UnilateralLimitIndicatorUpdate.update).toBeDefined();
      expect(service.UnilateralLimitIndicatorStatus.create).toBeDefined();
      expect(service.SettlementDetails.getAll).toBeDefined();
      expect(service.SettlementQuotes.create).toBeDefined();
      expect(service.OverdraftValidations.getAll).toBeDefined();
      expect(service.TermsAndConditionsItem.getAll).toBeDefined();
      expect(service.GetRewardsRate.getAll).toBeDefined();
      expect(service.RewardsRedemption.create).toBeDefined();
      expect(service.BuildingLoanPayout.create).toBeDefined();
      expect(service.DocumentRequest).toBeDefined();
      expect(service.HomeLoanStatus.getAll).toBeDefined();
      expect(service.CancelLoan.create).toBeDefined();
   }));
});
