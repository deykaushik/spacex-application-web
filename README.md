# SpacexApplicationWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.1.

# Check this out 
https://spacex-application-web.herokuapp.com/#/flights


# Approach

This angular app is structured to have

**1. Core Module**
**2. Dashboard Module** 

Under **Core Module** , we have defined all our core ui components like **HeaderComponent, FooterComponent** . 

All our **Services , CommonUtility and Constants** are added under **Core** folder as they can be considered as core features for our application.

**DashboardModule** is configured as our feature module. Under Dashboard module, we have **FlightListCmponent** and **FilterComponent** which shares same instance of **DashboardService** as this has been added as **providers** inside **DashboardModule**


When app loads, our **AppRoutingModule** is set to redirect to **/flights** and our feature module **DashboardModule** is loaded and with it **FlightListComponent** and **FilterComponent** is also rendered. 

**FlightListComponent** subscribes to **selectionUpdated**, a BehaviorSubject object defined in our **DashboardService**, and based on the latest value we are calling **getAllFlights** of **FlightService** which returns the Observable stream. We use **async** pipe to subscribe to this Observable stream so that we avoid explicit subscrip/unsubscription. Also using async helps in auto triggering Angular's **ChangeDetection** whenever there is change in the Observable streams. We are also calling **updateRouteParms** to update the url to reflect the selection changes

**FilterComponent** is used to broadcast the user filter selections through BehaviorSubject object defined in our **DashboardService** . The same BehaviourSubject is again subscribed to get the queryParms selection wich is used to reflect the button active states.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Angular Universal

For Server Side Rendering, Angular Universal is used

Run `ng add @nguniversal/express-engine --clientProject  spacex-application-web` to generate all that is needed to configure all the required server side rendering configurations.

Run `build:universal` to run the server side code which listens to http://localhost:4000


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
