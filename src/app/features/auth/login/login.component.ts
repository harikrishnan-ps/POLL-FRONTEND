import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card" style="max-width: 400px; margin: 0 auto;">
        <h2 class="text-center text-gradient">Welcome Back</h2>
        <p class="text-center" style="color: var(--text-secondary); margin-bottom: 2rem;">Sign in to your account</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control" formControlName="username" placeholder="Enter username">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="Enter password">
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <p class="text-center mt-4">
          Don't have an account? <a routerLink="/register" style="color: var(--primary-color);">Register</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value as any).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
