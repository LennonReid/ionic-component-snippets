import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BarcodeScanner, ScanResult } from '@capacitor-community/barcode-scanner';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertController, IonRouterOutlet, LoadingController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { flashlight } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';

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
  ],
  selector: 'ionic-component-snippets-scan',
  template: `
    <ion-content color="darker" #content>
      <ng-container *ngIf="cameraActive">
        <div class="guide">
          <img class="svg guide-frame" src="assets/img/guide-frame.svg" />
        </div>
        <ion-fab vertical="bottom" horizontal="center" slot="fixed">
          <ion-fab-button [color]="flashActive ? 'warning' : 'primary'" (click)="tapHaptic(); toggleFlash()">
            <ion-icon name="flashlight"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ng-container>
    </ion-content>
  `,
  styles: [
    `
      .guide {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        opacity: 1;
      }

      .guide-frame {
        width: 60%;
        max-width: 400px;
        margin-bottom: 6em;
        max-height: 50%;
        opacity: 0.7;
      }
    `,
  ],
  standalone: true,
})
export class CodeScannerComponent implements OnInit, OnDestroy {
  @ViewChild('content') contentEl!: HTMLIonContentElement;

  @Output() scannedResult: EventEmitter<ScanResult> = new EventEmitter();

  @Input() vibration = 'on';
  @Input() isDebugging = false;
  cameraChoice: CameraChoice = CameraChoice.BACK;
  cameraActive = false;
  flashActive = false;

  permissionAlert?: HTMLIonAlertElement;

  readonly iconMaps: any = {
    flashlight: flashlight,
  };
  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public routerOutlet: IonRouterOutlet,
  ) {
    addIcons(this.iconMaps);
  }
  async ngOnInit(): Promise<void> {
    if (this.contentEl != null) {
      this.contentEl.color = 'darker';
    }

    await SplashScreen.hide();
    await BarcodeScanner.disableTorch().then((_) => {
      this.flashActive = false;
    });
    // await this.prepareScanner();
  }

  async ngOnDestroy(): Promise<void> {
    await BarcodeScanner.disableTorch().then((_) => {
      this.flashActive = false;
    });
    await this.stopScanner();
  }

  async stopScanner(): Promise<void> {
    await BarcodeScanner.stopScan();
    document.querySelector('ion-content')?.classList.add('scanner-active');
    document.querySelector('body')?.classList.remove('scanner-active');
    this.cameraActive = false;
  }

  async prepareScanner(): Promise<void> {
    const result = await BarcodeScanner.checkPermission({ force: true });
    if (result.granted) {
      await this.scanQr();
    } else {
      this.permissionAlert?.dismiss();
      this.permissionAlert = await this.alertController.create({
        header: 'Permission Required',
        message: 'To enable scanning, you must grant Camera permission.',
        buttons: [
          {
            text: 'Setting',
            handler: () => {
              BarcodeScanner.openAppSettings();
              return true;
            },
          },
          {
            text: 'Close',
            handler: () => {
              return true;
            },
          },
        ],
        cssClass: ['alert-bg'],
      });
      await this.permissionAlert.present();
    }
  }

  async scanQr(): Promise<void> {
    await this.stopScanner();
    await BarcodeScanner.hideBackground();
    this.cameraActive = true;

    document.querySelector('ion-content')?.classList.add('scanner-active');
    document.querySelector('body')?.classList.add('scanner-active');
    await BarcodeScanner.prepare();
    if (this.contentEl != null) {
      this.contentEl.color = '';
    }
    await BarcodeScanner.startScan().then(async (result: ScanResult) => {
      if (result.hasContent) {
        const text = result.content;
        if (text == null || text?.trim()?.length <= 0 || text == '') {
          this.presentToast('QR Code value cannot be empty', 'short', 'center');
          this.scanQr();
          return;
        }
        if (this.contentEl != null) {
          this.contentEl.color = 'darker';
        }
        if (this.vibration === 'on' || this.vibration === 'on-scanned') {
          await Haptics.vibrate({ duration: 100 }).catch(async (err) => {
            if (this.isDebugging) {
              await Toast.show({
                text: 'Err when Haptics.impact: ' + JSON.stringify(err),
                position: 'top',
                duration: 'long',
              });
            }
          });
        }
        const loading = await this.presentLoading('Please wait');
        await this.processQrCode(result, loading);
      } else {
        this.presentToast('QR Code value cannot be empty', 'short', 'center');
        this.scanQr();
        return;
      }
    });
  }

  async processQrCode(result: ScanResult, loading: HTMLIonLoadingElement): Promise<void> {
    this.scannedResult.emit(result);
    loading.dismiss();
  }

  async toggleFlash(): Promise<void> {
    if (!this.flashActive) {
      await BarcodeScanner.enableTorch().then((_) => {
        this.flashActive = true;
      });
    } else {
      await BarcodeScanner.disableTorch().then((_) => {
        this.flashActive = false;
      });
    }
  }

  async presentAlert(
    msg: string,
    head: string,
    buttonText: string,
    buttonless = false,
  ): Promise<HTMLIonAlertElement> {
    let alert: any;
    if (!buttonless) {
      alert = await this.alertController.create({
        header: head,
        message: msg,
        buttons: [buttonText],
        cssClass: ['alert-bg'],
      });
    } else {
      alert = await this.alertController.create({
        header: head,
        message: msg,
        buttons: [],
        backdropDismiss: false,
        cssClass: ['alert-bg'],
      });
    }
    await alert.present();
    return alert;
  }

  async presentLoading(msg: string): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message: msg,
    });
    await loading.present();
    return loading;
  }

  async presentToast(msg: string, duration: 'short' | 'long', pos: 'top' | 'center' | 'bottom') {
    await Toast.show({
      text: msg,
      duration: duration,
      position: pos,
    });
  }

  async tapHaptic() {
    if (this.vibration === 'on' || this.vibration === 'on-haptic') {
      await Haptics.impact({ style: ImpactStyle.Light }).catch(async (err) => {
        if (this.isDebugging) {
          await Toast.show({
            text: 'Err when Haptics.impact: ' + JSON.stringify(err),
            position: 'top',
            duration: 'long',
          });
        }
      });
    }
  }
}
