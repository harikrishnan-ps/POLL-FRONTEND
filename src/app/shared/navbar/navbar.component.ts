import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container navbar-container">
        <a routerLink="/" class="brand">⚽ Football Polls</a>
        
        <div class="nav-links">
          <ng-container *ngIf="!authService.currentUser().isAuthenticated">
            <a routerLink="/login" class="nav-link">Login</a>
            <a routerLink="/register" class="btn btn-primary" style="padding: 0.5rem 1rem;">Register</a>
          </ng-container>

          <ng-container *ngIf="authService.currentUser().isAuthenticated">
            <span class="user-greeting">Hi, {{ authService.currentUser().username }}</span>
            <a *ngIf="authService.currentUser().role === 'Admin'" routerLink="/admin/create-poll" class="nav-link text-gradient">Create Poll</a>
            <button (click)="logout()" class="btn btn-outline" style="padding: 0.5rem 1rem;">Logout</button>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition);
    }
    .nav-link:hover {
      color: var(--primary-color);
    }
    .user-greeting {
      font-weight: 600;
      color: var(--text-primary);
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
