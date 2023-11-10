import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonApp, IonButton, IonContent, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { register } from 'swiper/element/bundle';
import { defineCustomElement as defineLoading } from '@ionic/core/components/ion-loading';

import { addIcons } from 'ionicons';
import {
  chevronDown,
  chevronUp
} from 'ionicons/icons';

register();
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    HttpClientModule,
    IonApp,
    IonContent,
    IonRouterOutlet,
    IonButton
  ],
  providers: [],
  selector: 'ionic-component-snippets-root',
  standalone: true,
  template: `
    <ion-app>
        <ion-router-outlet [environmentInjector]="environmentInjector"></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);

  readonly iconMaps: any = {
    'chevron-down': chevronDown,
    'chevron-up': chevronUp,
  };
  constructor(
    private platform: Platform,
  ) {
    defineLoading();
    this.initializeApp();
    addIcons(this.iconMaps)
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
