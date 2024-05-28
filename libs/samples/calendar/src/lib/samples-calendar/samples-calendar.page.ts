import { Component, OnInit, signal } from '@angular/core';
import {
  ModalController,
  NavController,
  LoadingController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonItem,
  IonLabel,
  IonContent,
  IonBackButton,
} from '@ionic/angular/standalone';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  CalendarComponent,
  CalendarComponentOptions,
} from '@cs/components/calendar';
import {
  caretDownOutline,
  caretUpOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'ionic-component-snippets-samples-calendar',
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Calendar Samples</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header class="px-0">
          <ion-title class="text-center pb-2">Calendar Range</ion-title>
        </ion-card-header>
        <ion-card-content class="px-0">
          @if (collapse()) {
          <ion-item
            (click)="collapse.set(false)"
            button
            detail="true"
            detail-icon="chevron-down"
          >
            <ion-label class="pl-4"><p>Unfold Date Calendar</p></ion-label>
          </ion-item>
          }@else {
          <ion-item
            (click)="collapse.set(true)"
            button
            class="my-4"
            detail="true"
            detail-icon="chevron-up"
          >
            <ion-label class="pl-4"><p>Collapse Date Calendar</p></ion-label>
          </ion-item>
          }
          <div [class.hidden]="collapse()" [class.display]="!collapse()">
            <ion-calendar
              [(ngModel)]="date"
              (selectStart)="dateSelectStart($event)"
              (change)="dateChange()"
              [options]="options"
              type="string"
              format="YYYY-MM-DD"
            >
            </ion-calendar>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonItem,
    IonContent,
    IonBackButton,
    IonLabel,
    CalendarComponent,
  ],
})
export class SamplesCalendarPage implements OnInit {
  startDate = moment().subtract(4, 'day').format('YYYY-MM-DD');
  endDate = moment().add(1, 'days').format('YYYY-MM-DD');
  maxDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
  costChartData: any[] = [];
  selectedSegment = signal('electricity');
  costCategories: any = [];
  title = '';
  height = 600;

  readonly iconMaps: any = {
    'caret-down-outline': caretDownOutline,
    'caret-up-outline': caretUpOutline,
    'chevron-back-outline': chevronBackOutline,
    'chevron-forward-outline': chevronForwardOutline,
  };

  options: CalendarComponentOptions = {
    pickMode: 'range',
    weekStart: 1,
  };
  collapse = signal(false);

  destroy$ = new Subject<boolean>();
  dateRange = 'pastOneWeek';
  date: {
    from: string;
    to: string;
  } = {
    from: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    to: moment().add(1, 'days').format('YYYY-MM-DD'),
  };

  constructor(
    public modalCtrl: ModalController,
    public navController: NavController,
    private loadingController: LoadingController
  ) {
    addIcons(this.iconMaps);
  }
  dateSelectStart(event: any) {
    this.date.from = moment(event.time).format('YYYY-MM-DD');
  }
  dateChange() {
    // this.collapse.set(true);
    this.handleQuery();
  }
  ngOnInit(): void {
    this.handleQuery();
  }

  async handleQuery(): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      showBackdrop: true,
      backdropDismiss: true,
    });

    await loading.present();
    const query = {
      start: this.date.from,
      end: this.date.to,
    };
    // CALL API
    console.log(query);
    setTimeout(() => {
      loading.dismiss();
    }, 200);
  }
}
