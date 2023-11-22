import { Component, ViewChild } from '@angular/core';
import { Toast } from '@capacitor/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
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
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ImagePickerComponent } from '@cs/components/image-picker';

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
    IonButtons,
    IonBackButton,
    ImagePickerComponent
  ],
  selector: 'ionic-component-snippets-samlpes-image-picker',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>IMAGE PICKER QRCODE SAMPLE</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
    <ion-button class="mt-3" (click)="tapHaptic(); pickImage()">Pick Image From gallery</ion-button>
    <ionic-component-snippets-image-picker [isDebugging]="isDebugging" #imagePickerEle (imagePickResult)="imagePickResult($event)"></ionic-component-snippets-image-picker>
    </ion-content>
  `,
  standalone: true,
})
export default class SamplesImagePickerPage {
  readonly iconMaps: any = {
    image,
  };
  vibration = 'on';
  isDebugging = true;
  @ViewChild('imagePickerEle') imagePickerEle!: ImagePickerComponent;

  async pickImage() {
    await this.imagePickerEle.pickImage();
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
  async presentToast(msg: string, duration: 'short' | 'long', pos: 'top' | 'center' | 'bottom') {
    await Toast.show({
      text: msg,
      duration: duration,
      position: pos,
    });
  }

  imagePickResult(result: string) {
    this.presentToast(result, 'short', 'center');
  }
}
