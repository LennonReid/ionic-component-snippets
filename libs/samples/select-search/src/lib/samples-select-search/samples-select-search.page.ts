import { HttpClientModule } from '@angular/common/http';
import { Component, Injector, OnDestroy, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, LoadingController, SelectChangeEventDetail, ToggleChangeEventDetail, IonContent, IonCard, IonCardHeader, IonCardContent, IonItem, IonToggle, IonSelect, IonLabel, IonSelectOption } from '@ionic/angular/standalone'
import { IonicSelectableComponent } from '@cs/components/select-search'
import { SelectSearchService } from '../services/select-search.service';

export enum ESelectDataMode {
  'short' = 'short',
  'middle' = 'middle',
  'large' = 'large'
}
@Component({
  selector: 'ionic-component-snippets-samples-select-search',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonToggle,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonicSelectableComponent,
    HttpClientModule
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Select Samples</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
    <ion-card>
      <ion-card-header class="px-0">
        <ion-title>Mutiple Select With Search And Virtual Scroll</ion-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
        <ion-toggle (ionChange)="hasVirtualScrollChange($any($event))" [checked]="hasVirtualScroll()">Virtual Scroll</ion-toggle>
        </ion-item>
      <ion-item>
        <ion-select [value]="selectDataMode()" (ionChange)="selectDataModeChange($any($event))" interface="popover" placeholder="Select Data Mode">
          <ion-select-option value="short">Short Data(100 Items)</ion-select-option>
          <ion-select-option value="middle">Middle Data (1k Items)</ion-select-option>
          <ion-select-option value="large">Large Data (10k Items)</ion-select-option>
        </ion-select>
      </ion-item>
        <ion-item lines="none" class="py-2">
          <ion-label position="floating">Select</ion-label>
          <ionic-selectable
            [hasVirtualScroll]="hasVirtualScroll()"
            [isMultiple]="true"
            [items]="largeLists()"
            itemValueField="id"
            itemTextField="first_name"
            [canSearch]="true"
            (onOpen)="onOpenSelectModal()"
            (click)="onClickSelectModal($event)"
          >
          </ionic-selectable>
        </ion-item>
      </ion-card-content>
    </ion-card>
    </ion-content>
  `,
  styles: [``]
})
export class SamplesSelectSearchPage implements OnInit, OnDestroy {
  selectSearchService = this.injector.get(SelectSearchService);
  loadingController = this.injector.get(LoadingController)
  selectDataMode = signal(ESelectDataMode.short);
  eSelectDataModes = ESelectDataMode;
  largeLists = signal([]);
  hasVirtualScroll = signal(false);
  openLoading?: HTMLIonLoadingElement;
  constructor(private injector: Injector) {
  }
  ngOnInit() {
    this.query();
  }

  onOpenSelectModal() {
    this.openLoading?.dismiss();
  }
  async onClickSelectModal(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.openLoading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Modal is opening',
      showBackdrop: true,
      backdropDismiss: true
    })
    await this.openLoading.present()

  }

  async query() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      showBackdrop: true,
      backdropDismiss: true
    })

    await loading.present()
    this.selectSearchService.queryListsData(this.selectDataMode()).subscribe({
      next: (res) => {
        this.largeLists.set(res);
        loading.dismiss();
      },
      error: (err) => {
        console.error(err)
        loading.dismiss();

      }
    })
  }
  hasVirtualScrollChange(ev: CustomEvent<ToggleChangeEventDetail>) {
    const value = ev.detail.value;
    this.hasVirtualScroll.set(value);
  }
  selectDataModeChange(ev: CustomEvent<SelectChangeEventDetail>) {
    const mode = ev.detail.value;
    switch (mode) {
      case 'short':
        this.selectDataMode.set(ESelectDataMode.short);
        break;
      case 'middle':
        this.selectDataMode.set(ESelectDataMode.middle);
        break;
      case 'large':
        this.selectDataMode.set(ESelectDataMode.large);
        break;
      default:
        break;
    }
    this.query();

  }
  ngOnDestroy(): void {
    this.openLoading = void 0;
  }
}
