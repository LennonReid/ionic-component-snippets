import { Component, ViewChild } from '@angular/core';
import { ScanResult } from '@capacitor-community/barcode-scanner';
import { LoadingController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CodeScannerComponent } from '@cs/components/code-scanner';

enum CameraChoice {
  BACK,
  FRONT,
}

@Component({
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
    IonButtons,
    IonBackButton,
    CodeScannerComponent
  ],
  selector: 'ionic-component-snippets-samples-code-scanner',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>CODE SCANNER SAMPLE</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button (click)="handleScan()">{{ codeScannerEle?.cameraActive ? 'Close' : 'Open' }}Camera</ion-button>
      <ionic-component-snippets-code-scanner #codeScannerEle (scannedResult)="scannedResult($event)"></ionic-component-snippets-code-scanner>
    </ion-content>
  `,
  standalone: true,
})
export class SamplesCodeScannerPage {
  @ViewChild('codeScannerEle') codeScannerEle!: CodeScannerComponent;

  cameraChoice: CameraChoice = CameraChoice.BACK;
  cameraActive = false;
  flashActive = false;

  permissionAlert?: HTMLIonAlertElement;

  constructor(public loadingController: LoadingController) { }
  scannedResult(event: ScanResult) {
    this.presentToast(event.content!, 'short', 'center');
    this.codeScannerEle.scanQr();
  }
  async handleScan() {
    if (this.codeScannerEle.cameraActive) {
      await this.codeScannerEle.stopScanner();
    } else {
      await this.codeScannerEle.prepareScanner();
    }
  }
  async presentToast(msg: string, duration: 'short' | 'long', pos: 'top' | 'center' | 'bottom') {
    await Toast.show({
      text: msg,
      duration: duration,
      position: pos,
    });
  }
}
