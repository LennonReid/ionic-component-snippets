import { Route } from '@angular/router';

const SAMPLE_ROUTES = [
  {
    path: 'calendar',
    loadComponent: () => import('@cs/samples/calendar').then((c) => c.SamplesCalendarPage),
  },
  {
    path: 'select-search',
    loadComponent: () => import('@cs/samples/select-search').then((c) => c.SamplesSelectSearchPage),
  },
  {
    path: 'slide-segments',
    loadComponent: () => import('@cs/samples/slide-segments').then((c) => c.SamplesSlideSegmentsPage),
  },
  {
    path: 'code-scanner',
    loadComponent: () => import('@cs/samples/code-scanner').then((c) => c.SamplesCodeScannerPage),
  },
  {
    path: 'image-picker',
    loadComponent: () => import('@cs/samples/image-picker').then((c) => c.SamplesImagePickerPage),
  }
]
export const appRoutes: Route[] = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((c) => c.HomePage),
  },
  ...SAMPLE_ROUTES
];
