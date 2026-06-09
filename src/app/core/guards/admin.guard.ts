import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser().isAuthenticated && authService.currentUser().role === 'Admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
