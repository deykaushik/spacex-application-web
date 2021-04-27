import { IAddress, IProfileDetails, IClientPreferenceDetails } from '../core/services/models';

export class ProfileDetails implements IProfileDetails {
   FullNames: string;
   CellNumber: string;
   RsaId: number;
   PassportNumber?: string;
   Resident?: string;
   EmailAddress: string;
   Address: IAddress;
}

export class ClientPreferences implements IClientPreferenceDetails {
   PreferenceKey: string;
   PreferenceValue: string;
}

export interface IEditClientProfileEmitter {
   Status: boolean;
   PreferredName: string;
}
