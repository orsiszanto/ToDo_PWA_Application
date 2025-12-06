import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'main', loadComponent: () => import('./main-page/main-page.component').then(m => m.MainPage), canActivate: [authGuard] },
  { path: 'landing', loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPage) },
  { path: 'login', loadComponent: () => import('./login-page/login-page.component').then(m => m.LoginPage) },
  { path: 'registration', loadComponent: () => import('./registration-page/registration-page.component').then(m => m.RegistrationPage) },
  { path: '**', redirectTo: 'landing' },
];
