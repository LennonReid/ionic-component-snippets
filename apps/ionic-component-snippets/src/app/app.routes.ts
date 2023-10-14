import { Route } from '@angular/router';

const SAMPLE_ROUTES = [
  {
    path: 'calendar',
    loadComponent: () => import('@cs/samples/calendar').then((c) => c.SamplesCalendarPage),
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
