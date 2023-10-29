import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    // provideStore(APP_REDUCERS, storeConfig),
    // provideEffects(APP_EFFECTS),

    {
      provide: 'APP_ENV',
      useValue: environment.production ? 'prod' : 'dev',
    },
    { provide: Document, useExisting: DOCUMENT },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ],
}).catch((err) => console.error(err));
