export type FilterType = 'launch_year' | 'launch_success' | 'land_success';

export interface IFlightModel {
  name: string;
  imageUrl: string;
  misionId: string[];
  launchYear: string;
  launchSuccess: boolean;
  landSuccess: boolean;
}

export interface IFlightsQueryParms {
  launch_year?: number;
  launch_success?: boolean;
  land_success?: boolean;
}
