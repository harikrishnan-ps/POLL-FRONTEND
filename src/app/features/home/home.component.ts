import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PollService } from '../../core/services/poll.service';
import { AuthService } from '../../core/services/auth.service';
import { PollDto } from '../../core/models/poll.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 class="text-gradient">Active Polls</h1>
      </div>

      <div *ngIf="isLoading" class="text-center" style="padding: 3rem;">
        <p style="color: var(--text-secondary);">Loading polls...</p>
      </div>

      <div *ngIf="!isLoading && polls.length === 0" class="card text-center" style="padding: 3rem;">
        <p style="color: var(--text-secondary);">No active polls available right now.</p>
      </div>

      <div *ngIf="!isLoading" class="grid grid-cols-2">
        <div class="card" *ngFor="let poll of polls">
          <h3>{{ poll.title }}</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">{{ poll.description }}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.875rem; color: var(--text-secondary);">
              <span *ngIf="poll.isActive" style="color: var(--secondary-color);">● Active</span>
              <span *ngIf="!poll.isActive" style="color: var(--error-color);">● Closed</span>
              • {{ poll.totalVotes }} Votes
            </span>
            <div style="display: flex; gap: 0.5rem;">
              <button *ngIf="isAdmin()" (click)="deletePoll(poll.id)" class="btn" style="background: rgba(239, 68, 68, 0.1); color: var(--error-color); padding: 0.5rem 1rem;">Delete</button>
              <a [routerLink]="['/polls', poll.id]" class="btn btn-outline" style="padding: 0.5rem 1rem;">View Poll</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private pollService = inject(PollService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  
  polls: PollDto[] = [];
  isLoading = true;

  ngOnInit() {
    this.pollService.getAllPolls().subscribe({
      next: (data) => {
        this.polls = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isAdmin() {
    return this.authService.currentUser().role === 'Admin';
  }

  deletePoll(id: number) {
    if(confirm('Are you sure you want to delete this poll?')) {
      this.pollService.deletePoll(id).subscribe(() => {
        this.polls = this.polls.filter(p => p.id !== id);
        this.cdr.detectChanges();
      });
    }
  }
}
