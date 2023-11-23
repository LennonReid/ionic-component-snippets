import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  AnimationController,
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonProgressBar,
  IonTitle,
  IonToggle,
  IonToolbar,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import type { OverlayEventDetail } from '@ionic/core/components';
import { FormsModule } from '@angular/forms';
import { ModalExampleComponent } from './modal-example/modal-example.component';

@Component({
  selector: 'ionic-component-snippets-test',
  templateUrl: './component-test.page.html',
  styleUrls: ['./component-test.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonBackButton,
    IonProgressBar,
    IonButton,
    IonModal,
    IonItem,
    IonInput,
    FormsModule,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonFooter,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
    IonToggle,
    IonList,
    IonBadge,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
  ],
})
export default class ComponentTestPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  name!: string;

  @ViewChild('square', { static: true })
  squareElRef!: ElementRef<HTMLDivElement>;

  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly animationController = inject(AnimationController);
  private readonly modalController = inject(ModalController);
  private readonly navController = inject(NavController);

  ngOnInit() {
    const animation = this.animationController
      .create()
      .addElement(this.squareElRef.nativeElement)
      .duration(3000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, background: 'orange' },
        { offset: 0.72, background: 'var(--background)' },
        { offset: 1, background: 'green' },
      ]);
    animation.play();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Some Header',
      message: 'Some message',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      const toast = await this.toastController.create({
        header: `Hello, ${ev.detail.data}!`,
        buttons: [
          {
            icon: 'close-circle',
            role: 'cancel',
            side: 'end',
          },
        ],
      });
      await toast.present();
    }
  }

  async openControllerModal() {
    const modal = await this.modalController.create({
      component: ModalExampleComponent,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const toast = await this.toastController.create({
        header: `Hello, ${data}!`,
        buttons: [
          {
            icon: 'close-circle',
            role: 'cancel',
            side: 'end',
          },
        ],
      });
      await toast.present();
    }
  }

  goToInbox() {
    this.navController.navigateForward('/folder/inbox');
  }
}
