import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card" style="max-width: 400px; margin: 0 auto;">
        <h2 class="text-center text-gradient">Create Account</h2>
        <p class="text-center" style="color: var(--text-secondary); margin-bottom: 2rem;">Join to participate in polls</p>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control" formControlName="username" placeholder="Choose a username">
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" formControlName="email" placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="Create a password">
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>
        
        <p class="text-center mt-4">
          Already have an account? <a routerLink="/login" style="color: var(--primary-color);">Login</a>
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value as any).subscribe({
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
