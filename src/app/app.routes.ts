import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

// We'll use standalone components, so we can load them directly via loadComponent
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'polls/:id',
    loadComponent: () => import('./features/polls/poll-details/poll-details.component').then(m => m.PollDetailsComponent)
  },
  {
    path: 'admin/create-poll',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/create-poll/create-poll.component').then(m => m.CreatePollComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
