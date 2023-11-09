import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import {
  BarcodeScanner,
  ScanResult
} from '@capacitor-community/barcode-scanner'
import { SplashScreen } from '@capacitor/splash-screen'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Toast } from '@capacitor/toast'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { flashlight } from 'ionicons/icons'
import { addIcons } from 'ionicons'
import {
  AlertController,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone'

enum CameraChoice {
  BACK,
  FRONT
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
    IonIcon
  ],
  selector: 'ionic-component-snippets-code-scanner',
  template: `
    <ion-content color="darker" #content>
      <ng-container *ngIf="cameraActive">
        <div class="guide">
          <svg
            version="1.1"
            id="guide-frame"
            class="svg guide-frame"
            xmlns="http://www.w3.org/2000/svg"
            xml:space="preserve"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 271 236"
            style="enable-background: new 0 0 271 236;"
          >
            <filter
              filterUnits="objectBoundingBox"
              height="200%"
              id="filter-2"
              width="200%"
              x="-50%"
              y="-50%"
            >
              <feMorphology
                in="SourceAlpha"
                operator="dilate"
                radius="1"
                result="shadowSpreadOuter1"
              ></feMorphology>
              <feOffset
                dx="0"
                dy="0"
                in="shadowSpreadOuter1"
                result="shadowOffsetOuter1"
              ></feOffset>
              <feMorphology
                in="SourceAlpha"
                operator="erode"
                radius="1"
                result="shadowInner"
              ></feMorphology>
              <feOffset
                dx="0"
                dy="0"
                in="shadowInner"
                result="shadowInner"
              ></feOffset>
              <feComposite
                in="shadowOffsetOuter1"
                in2="shadowInner"
                operator="out"
                result="shadowOffsetOuter1"
              ></feComposite>
              <feGaussianBlur
                in="shadowOffsetOuter1"
                result="shadowBlurOuter1"
                stdDeviation="6"
              ></feGaussianBlur>
              <feColorMatrix
                in="shadowBlurOuter1"
                type="matrix"
                values="0 0 0 0 0.392156863   0 0 0 0 0.48627451   0 0 0 0 0.909803922  0 0 0 1 0"
              ></feColorMatrix>
            </filter>
            <path
              id="top-left"
              class="frame"
              d="M28,10h53.1c2.8,0,5-2.2,5-5s-2.2-5-5-5H23c-2.8,0-5,2.2-5,5v58c0,2.8,2.2,5,5,5s5-2.2,5-5V10z"
            />
            <path
              id="bottom-left"
              class="frame"
              d="M28,224.7v-53.1c0-2.8-2.2-5-5-5s-5,2.2-5,5v58.1c0,2.8,2.2,5,5,5h58c2.8,0,5-2.2,5-5 c0-2.8-2.2-5-5-5H28z"
            />
            <path
              id="top-right"
              class="frame"
              d="M244,10v53.1c0,2.8,2.2,5,5,5s5-2.2,5-5V5c0-2.8-2.2-5-5-5h-58c-2.8,0-5,2.2-5,5s2.2,5,5,5H244z"
            />
            <path
              id="bottom-right"
              class="frame"
              d="M244.1,225.6H191c-2.8,0-5,2.2-5,5c0,2.8,2.2,5,5,5h58.1c2.8,0,5-2.2,5-5v-58 c0-2.8-2.2-5-5-5s-5,2.2-5,5V225.6z"
            />
          </svg>
          <!-- <img class="svg guide-frame" src="assets/img/guide-frame.svg" /> -->
        </div>
        <ion-fab vertical="bottom" horizontal="center" slot="fixed">
          <ion-fab-button
            [color]="flashActive ? 'warning' : 'primary'"
            (click)="tapHaptic(); toggleFlash()"
          >
            <ion-icon name="flashlight"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ng-container>
    </ion-content>
  `,
  styles: [
    `
      .frame {
        fill: var(--ion-color-success);
        fill-opacity: 0.5;
      }
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
    `
  ],
  standalone: true
})
export class CodeScannerComponent implements OnInit, OnDestroy {
  @ViewChild('content') contentEl!: HTMLIonContentElement

  @Output() scannedResult: EventEmitter<ScanResult> = new EventEmitter()

  @Input() vibration = 'on'
  @Input() isDebugging = false
  cameraChoice: CameraChoice = CameraChoice.BACK
  cameraActive = false
  flashActive = false

  permissionAlert?: HTMLIonAlertElement

  readonly iconMaps: any = {
    flashlight: flashlight
  }
  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
    addIcons(this.iconMaps)
  }
  async ngOnInit(): Promise<void> {
    if (this.contentEl != null) {
      this.contentEl.color = 'darker'
    }

    await SplashScreen.hide()
    await BarcodeScanner.disableTorch().then(_ => {
      this.flashActive = false
    })
    // await this.prepareScanner();
  }

  async ngOnDestroy(): Promise<void> {
    await BarcodeScanner.disableTorch().then(_ => {
      this.flashActive = false
    })
    await this.stopScanner()
  }

  async stopScanner(): Promise<void> {
    await BarcodeScanner.stopScan()
    document.querySelector('ion-content')?.classList.add('scanner-active')
    document.querySelector('body')?.classList.remove('scanner-active')
    this.cameraActive = false
  }

  async prepareScanner(): Promise<void> {
    const result = await BarcodeScanner.checkPermission({ force: true })
    if (result.granted) {
      await this.scanQr()
    } else {
      this.permissionAlert?.dismiss()
      this.permissionAlert = await this.alertController.create({
        header: 'Permission Required',
        message: 'To enable scanning, you must grant Camera permission.',
        buttons: [
          {
            text: 'Setting',
            handler: () => {
              BarcodeScanner.openAppSettings()
              return true
            }
          },
          {
            text: 'Close',
            handler: () => {
              return true
            }
          }
        ],
        cssClass: ['alert-bg']
      })
      await this.permissionAlert.present()
    }
  }

  async scanQr(): Promise<void> {
    await this.stopScanner()
    await BarcodeScanner.hideBackground()
    this.cameraActive = true

    document.querySelector('ion-content')?.classList.add('scanner-active')
    document.querySelector('body')?.classList.add('scanner-active')
    await BarcodeScanner.prepare()
    if (this.contentEl != null) {
      this.contentEl.color = ''
    }
    await BarcodeScanner.startScan().then(async (result: ScanResult) => {
      if (result.hasContent) {
        const text = result.content
        if (text == null || text?.trim()?.length <= 0 || text == '') {
          this.presentToast('QR Code value cannot be empty', 'short', 'center')
          this.scanQr()
          return
        }
        if (this.contentEl != null) {
          this.contentEl.color = 'darker'
        }
        if (this.vibration === 'on' || this.vibration === 'on-scanned') {
          await Haptics.vibrate({ duration: 100 }).catch(async err => {
            if (this.isDebugging) {
              await Toast.show({
                text: 'Err when Haptics.impact: ' + JSON.stringify(err),
                position: 'top',
                duration: 'long'
              })
            }
          })
        }
        const loading = await this.presentLoading('Please wait')
        await this.processQrCode(result, loading)
      } else {
        this.presentToast('QR Code value cannot be empty', 'short', 'center')
        this.scanQr()
        return
      }
    })
  }

  async processQrCode(
    result: ScanResult,
    loading: HTMLIonLoadingElement
  ): Promise<void> {
    this.scannedResult.emit(result)
    loading.dismiss()
  }

  async toggleFlash(): Promise<void> {
    if (!this.flashActive) {
      await BarcodeScanner.enableTorch().then(_ => {
        this.flashActive = true
      })
    } else {
      await BarcodeScanner.disableTorch().then(_ => {
        this.flashActive = false
      })
    }
  }

  async presentAlert(
    msg: string,
    head: string,
    buttonText: string,
    buttonless = false
  ): Promise<HTMLIonAlertElement> {
    let alert: any
    if (!buttonless) {
      alert = await this.alertController.create({
        header: head,
        message: msg,
        buttons: [buttonText],
        cssClass: ['alert-bg']
      })
    } else {
      alert = await this.alertController.create({
        header: head,
        message: msg,
        buttons: [],
        backdropDismiss: false,
        cssClass: ['alert-bg']
      })
    }
    await alert.present()
    return alert
  }

  async presentLoading(msg: string): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message: msg
    })
    await loading.present()
    return loading
  }

  async presentToast(
    msg: string,
    duration: 'short' | 'long',
    pos: 'top' | 'center' | 'bottom'
  ) {
    await Toast.show({
      text: msg,
      duration: duration,
      position: pos
    })
  }

  async tapHaptic() {
    if (this.vibration === 'on' || this.vibration === 'on-haptic') {
      await Haptics.impact({ style: ImpactStyle.Light }).catch(async err => {
        if (this.isDebugging) {
          await Toast.show({
            text: 'Err when Haptics.impact: ' + JSON.stringify(err),
            position: 'top',
            duration: 'long'
          })
        }
      })
    }
  }
}
