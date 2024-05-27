import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  ModalController,
  SelectChangeEventDetail,
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
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonBackButton,
} from '@ionic/angular/standalone';
import moment from 'moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { getRecentDay, getRecentMonth } from '@cs/common/utils';
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
  styles: [``],
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
          <ion-item
            *ngIf="collapse()"
            (click)="collapse.set(false)"
            button
            detail="true"
            detail-icon="chevron-down"
          >
            <ion-label class="pl-4"><p>Unfold Date Calendar</p></ion-label>
          </ion-item>

          <ion-item
            *ngIf="!collapse()"
            (click)="collapse.set(true)"
            button
            class="my-4"
            detail="true"
            detail-icon="chevron-up"
          >
            <ion-label class="pl-4"><p>Collapse Date Calendar</p></ion-label>
          </ion-item>
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
          <ion-segment
            scrollable
            (ionChange)="segmentHandleChange($any($event))"
            [value]="dateRange"
            class="mb-5"
          >
            <ion-segment-button
              *ngFor="let dateRangeSelectionOption of dateRangeSelectionOptions"
              [value]="dateRangeSelectionOption.value"
            >
              <ion-label>{{ dateRangeSelectionOption.title }}</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonItem,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonBackButton,
    IonLabel,
    CalendarComponent,
  ],
})
export default class SamplesCalendarPage implements OnInit {
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
  dateRangeSelectionOptions = [
    {
      title: 'Past 3 days',
      value: 'pastThreeDays',
    },
    {
      title: 'Past week',
      value: 'pastOneWeek',
    },
    {
      title: 'Past 2 weeks',
      value: 'pastHalfMonth',
    },
    {
      title: 'Past month',
      value: 'pastOneMonth',
    },
    {
      title: 'Past 6 months',
      value: 'pastSixMonths',
    },
    {
      title: 'Past year',
      value: 'pastOneYear',
    },
  ];

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
  segmentHandleChange(e: CustomEvent<SelectChangeEventDetail>) {
    switch (e.detail.value) {
      case 'pastThreeDays':
        this.date = {
          from: getRecentDay(3, this.endDate),
          to: this.endDate,
        };
        break;

      case 'pastOneWeek':
        this.date = {
          from: getRecentDay(7, this.endDate),
          to: this.endDate,
        };
        break;
      case 'pastHalfMonth':
        this.date = {
          from: getRecentDay(14, this.endDate),
          to: this.endDate,
        };
        break;
      case 'pastOneMonth':
        this.date = {
          from: getRecentMonth(1, this.endDate),
          to: this.endDate,
        };
        break;
      case 'pastSixMonths':
        this.date = {
          from: getRecentMonth(6, this.endDate),
          to: this.endDate,
        };
        break;
      case 'pastOneYear':
        this.date = {
          from: getRecentMonth(12, this.endDate),
          to: this.endDate,
        };
        break;
    }
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
