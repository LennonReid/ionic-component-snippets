import { environment } from './environments/environment';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      IonicModule.forRoot(),
      RouterModule.forRoot(appRoutes, {
        bindToComponentInputs: true,
        preloadingStrategy: PreloadAllModules,
      }),
    ),
    // provideStore(APP_REDUCERS, storeConfig),
    // provideEffects(APP_EFFECTS),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    {
      provide: 'APP_ENV',
      useValue: environment.production ? 'prod' : 'dev',
    },
    { provide: Document, useExisting: DOCUMENT },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ],
}).catch((err) => console.error(err));
