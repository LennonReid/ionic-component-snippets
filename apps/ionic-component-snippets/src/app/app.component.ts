import { HttpClientModule } from '@angular/common/http';
import { Component, EnvironmentInjector, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

@Component({
  imports: [IonicModule, HttpClientModule],
  providers: [],
  selector: 'ionic-component-snippets-root',
  standalone: true,
  template: `
    <ion-app>
      <ion-content>
        <ion-router-outlet></ion-router-outlet>
      </ion-content>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    public environmentInjector: EnvironmentInjector,
    private platform: Platform,
  ) {
    this.initializeApp();
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
