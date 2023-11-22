import {Component} from '@angular/core';

import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonInput, IonItem,
    IonTitle,
    IonToolbar,
    ModalController
} from '@ionic/angular/standalone';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-modal-example',
    templateUrl: 'modal-example.component.html',
    imports: [
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonTitle,
        IonContent,
        IonItem,
        IonInput,
        FormsModule
    ],
    standalone: true
})
export class ModalExampleComponent {
    name!: string;

    constructor(private modalCtrl: ModalController) {
    }

    cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
    }

    confirm() {
        return this.modalCtrl.dismiss(this.name, 'confirm');
    }
}
