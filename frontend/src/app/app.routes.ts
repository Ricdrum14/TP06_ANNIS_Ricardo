import { Routes } from '@angular/router';
import { PollutionComponent } from './components/pollution/pollution.component';
import { ProfilComponent } from './components/profil/profil.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Page d’accueil : accessible à tous
  { path: '', component: PollutionComponent },

  // Profil : réservation aux personnes connectées
  {
    path: 'profil',
    component: ProfilComponent,
    canActivate: [authGuard]
  },

  // Favoris : réservé aux connectés
  {
    path: 'favoris',
    component: FavoritesComponent,
    canActivate: [authGuard]
  },

  // Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(m => m.SignupComponent)
  },

  // Route fallback
  { path: '**', redirectTo: '' }
];
