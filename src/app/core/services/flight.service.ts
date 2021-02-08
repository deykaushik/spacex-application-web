import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, tap } from "rxjs/operators";
import { IFlightModel, IFlightsQueryParms } from "src/app/dashboard/model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private apiService: ApiService) { }

  getAllFlights(queryParms = {}): Observable<IFlightModel[]> {
    return this.apiService.GetAllFlightList.getAll(queryParms)
      .pipe(
        map((flights: any[]) =>
          flights.map((flight: any) => ({
            name: `${flight.mission_name} #${flight.flight_number}`,
            imageUrl: flight.links.mission_patch_small || '',
            misionId: flight.mission_id || [],
            launchYear: flight.launch_year,
            launchSuccess: flight.launch_success,
            landSuccess: flight.land_success
          }))
        )
      );
  }
}