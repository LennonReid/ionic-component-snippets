import { Routes } from '@angular/router';

const SAMPLE_ROUTES: Routes = [
  {
    path: 'calendar',
    loadComponent: () => import('@cs/samples/calendar'),
  },
  {
    path: 'select-search',
    loadComponent: () => import('@cs/samples/select-search'),
  },
  {
    path: 'slide-segments',
    loadComponent: () => import('@cs/samples/slide-segments'),
  },
  {
    path: 'code-scanner',
    loadComponent: () => import('@cs/samples/code-scanner'),
  },
  {
    path: 'image-picker',
    loadComponent: () => import('@cs/samples/image-picker'),
  },
];
export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page'),
  },
  ...SAMPLE_ROUTES,
];
