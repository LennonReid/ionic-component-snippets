import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EnvironmentInjector,
  OnInit,
  inject,
} from '@angular/core';
import {
  IonApp,
  IonButton,
  IonContent,
  IonRouterOutlet,
  Platform,
} from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { register } from 'swiper/element/bundle';

import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';

register();
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'ionic-component-snippets-root',
  standalone: true,
  template: `
    <ion-app>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `,
  imports: [IonApp, IonContent, IonRouterOutlet, IonButton],
})
export class AppComponent implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);

  readonly iconMaps: any = {
    'chevron-down': chevronDown,
    'chevron-up': chevronUp,
  };
  constructor(private platform: Platform) {
    this.initializeApp();
    addIcons(this.iconMaps);
  }
  ngOnInit(): void {
    if (Capacitor.getPlatform() === 'android') {
      this.registerAndroidListener();
    }
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('hybrid')) {
        // StatusBar.hide();
        // SplashScreen.hide();
      }
    });
  }
  registerAndroidListener() {
    App.addListener('backButton', (data) => {
      if (data.canGoBack) window.history.back();
      else App.exitApp();
    });
  }
}
