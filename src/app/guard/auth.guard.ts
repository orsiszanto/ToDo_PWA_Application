import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
