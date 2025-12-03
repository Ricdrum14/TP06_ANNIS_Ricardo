import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../shared/states/auth-states';

/**
 * 🔐 Guard pour protéger les routes
 * Vérifie si l'utilisateur est connecté avant d'accéder à une route
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // 🔍 Vérifier si l'utilisateur est connecté
  const isConnected = store.selectSnapshot(AuthState.isConnected);

  if (isConnected) {
    return true; // ✅ L'utilisateur peut accéder à la route
  } else {
    // ❌ L'utilisateur n'est pas connecté, rediriger vers login
    console.warn('⚠️ Accès refusé : utilisateur non connecté');
    router.navigate(['/login']);
    return false;
  }
};
