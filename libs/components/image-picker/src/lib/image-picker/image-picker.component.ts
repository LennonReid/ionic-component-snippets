import { addIcons } from 'ionicons';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import jsQR from 'jsqr';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { SplashScreen } from '@capacitor/splash-screen';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { image } from 'ionicons/icons';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonText,
    IonItem,
    IonLabel,
    IonButton,
  ],
  selector: 'ionic-component-snippets-image-picker',
  template: ``,
  standalone: true,
})
export class ImagePickerComponent implements OnInit {
  readonly iconMaps: any = {
    image,
  };
  @Input() isDebugging = false;
  @Output() imagePickResult: EventEmitter<string> = new EventEmitter();

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    addIcons(this.iconMaps);
  }
  async ngOnInit(): Promise<void> {
    await SplashScreen.hide();
  }

  async pickImage() {
    const getPictureLoading = await this.presentLoading('Please wait');
    const options = {
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    } as ImageOptions;
    await Camera.requestPermissions({ permissions: ['photos'] }).then(
      async (permissionResult) => {
        if (permissionResult.photos === 'granted' || permissionResult.photos === 'limited') {
          await Camera.getPhoto(options).then(
            async (photo: Photo) => {
              getPictureLoading.dismiss();
              const decodingLoading = await this.presentLoading('Decoding');
              await this.convertDataUrlToImageData(photo?.dataUrl ?? '').then(
                async (imageData) => {
                  await this.getJsQr(imageData.imageData.data, imageData.width, imageData.height).then(
                    async (qrValue) => {
                      decodingLoading.dismiss();
                      const loading = await this.presentLoading('Please wait');
                      await this.processQrCode(qrValue, loading);
                    },
                    async (_) => {
                      decodingLoading.dismiss();
                      await this.presentToast(
                        "Can't detect QR Code",
                        'short',
                        'center',
                      );
                    },
                  );
                },
                async (_) => {
                  decodingLoading.dismiss();
                  await this.presentToast("Can't detect QR Code", 'short', 'center');
                },
              );
            },
            async (err) => {
              getPictureLoading.dismiss();
              if (this.isDebugging) {
                this.presentToast('Error when call Camera.getPhoto: ' + JSON.stringify(err), 'long', 'top');
              }
            },
          );
        } else {
          getPictureLoading.dismiss();
          const alert = await this.alertController.create({
            header: 'Permission Required',
            message: 'You must grant Storage permission for scanning image.',
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
          await alert.present();
        }
      },
      async (err) => {
        getPictureLoading.dismiss();
        if (this.isDebugging) {
          await Toast.show({
            text: 'Err when Camera.requestPermissions: ' + JSON.stringify(err),
            position: 'bottom',
            duration: 'long',
          });
        } else {
          Toast.show({ text: 'Unknown Error', position: 'bottom', duration: 'short' });
        }
      },
    );
  }

  async processQrCode(scannedData: string, loading: HTMLIonLoadingElement): Promise<void> {
    this.imagePickResult.emit(scannedData);
    loading.dismiss();
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

  private async convertDataUrlToImageData(
    uri: string,
  ): Promise<{ imageData: ImageData; width: number; height: number }> {
    return await new Promise((resolve, reject) => {
      if (uri == null) return reject();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      const image = new Image();
      image.addEventListener(
        'load',
        function () {
          canvas.width = image.width;
          canvas.height = image.height;
          context.fillStyle = 'white';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] = avg;
            imageData.data[i + 1] = avg;
            imageData.data[i + 2] = avg;
          }
          const width = image.width;
          const height = image.height;
          resolve({ imageData: imageData, width: width, height: height });
        },
        false,
      );
      if (uri.startsWith('data')) {
        image.src = uri;
      } else {
        image.src = 'data:image/png;base64,' + uri;
      }
    });
  }

  private async getJsQr(imageData: Uint8ClampedArray, width: number, height: number): Promise<string> {
    return await new Promise((resolve, reject) => {
      const qrcode = jsQR(imageData, width, height, { inversionAttempts: 'attemptBoth' });
      if (qrcode) {
        return resolve(qrcode.data);
      } else {
        return reject();
      }
    });
  }
}
