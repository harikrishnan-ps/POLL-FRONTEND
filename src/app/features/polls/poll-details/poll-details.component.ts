import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PollService } from '../../../core/services/poll.service';
import { AuthService } from '../../../core/services/auth.service';
import { PollDto, TeamDto } from '../../../core/models/poll.models';

@Component({
  selector: 'app-poll-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="poll" class="poll-container">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <h1 class="text-gradient" style="margin: 0;">{{ poll.title }}</h1>
          <button *ngIf="isAdmin() && !poll.resultsRevealed" (click)="revealResults()" class="btn btn-secondary">Reveal Results</button>
        </div>
        
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">{{ poll.description }}</p>

        <div *ngIf="!poll.isActive" style="background: rgba(239, 68, 68, 0.1); color: var(--error-color); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; font-weight: 500;">
          This poll is closed. Results have been revealed.
        </div>

        <div *ngIf="poll.hasVoted && poll.isActive && !isAdmin()" style="background: rgba(16, 185, 129, 0.1); color: var(--secondary-color); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; font-weight: 500;">
          You have already voted in this poll. Waiting for admin to reveal results.
        </div>

        <div class="grid grid-cols-2">
          <div *ngFor="let team of poll.teams" 
               class="team-card" 
               [class.selected]="poll.votedTeamId === team.id"
               (click)="selectTeam(team)">
            
            <div class="team-info">
              <h3 style="margin: 0;">{{ team.name }}</h3>
              <div *ngIf="poll.votedTeamId === team.id" class="badge">Your Vote</div>
            </div>

            <div *ngIf="poll.resultsRevealed || isAdmin()" class="stats mt-2">
              <div class="progress-bar">
                <div class="progress" [style.width.%]="team.votePercentage"></div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                <span>{{ team.voteCount }} Votes</span>
                <span>{{ team.votePercentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!poll.hasVoted && poll.isActive && isAuthenticated() && !isAdmin()" class="mt-4 text-center">
          <button class="btn btn-primary" style="width: 100%; max-width: 300px;" 
                  [disabled]="!selectedTeamId || isSubmitting"
                  (click)="submitVote()">
            {{ isSubmitting ? 'Submitting...' : 'Submit Vote' }}
          </button>
        </div>

        <div *ngIf="!isAuthenticated()" class="mt-4 text-center">
          <p>Please <a routerLink="/login" style="color: var(--primary-color);">login</a> to vote.</p>
        </div>

        <!-- Admin View: Vote Details -->
        <div *ngIf="isAdmin() && !poll.isAnonymous && poll.voteDetails" class="mt-4" style="border-top: 1px solid var(--border-color); padding-top: 2rem;">
          <h3 class="text-gradient">Voter Details</h3>
          <p *ngIf="poll.voteDetails.length === 0" style="color: var(--text-secondary);">No votes yet.</p>
          <table *ngIf="poll.voteDetails.length > 0" style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                <th style="padding: 0.5rem; color: var(--text-secondary);">Username</th>
                <th style="padding: 0.5rem; color: var(--text-secondary);">Voted For</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let detail of poll.voteDetails" style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem; font-weight: 500;">{{ detail.username }}</td>
                <td style="padding: 0.5rem;">{{ detail.teamName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .poll-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .team-card {
      background: var(--bg-color);
      border: 2px solid var(--border-color);
      border-radius: var(--radius);
      padding: 1.5rem;
      cursor: pointer;
      transition: var(--transition);
    }
    .team-card:hover {
      border-color: var(--primary-color);
    }
    .team-card.selected {
      border-color: var(--primary-color);
      background: rgba(79, 70, 229, 0.1);
    }
    .team-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      background: var(--primary-color);
      color: white;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-weight: 600;
    }
    .progress-bar {
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress {
      height: 100%;
      background: var(--primary-color);
      transition: width 1s ease-in-out;
    }
  `]
})
export class PollDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  poll: PollDto | null = null;
  selectedTeamId: number | null = null;
  isSubmitting = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPoll(+id);
      }
    });
  }

  loadPoll(id: number) {
    this.pollService.getPollById(id).subscribe({
      next: (data) => {
        this.poll = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  isAuthenticated() {
    return this.authService.currentUser().isAuthenticated;
  }

  isAdmin() {
    return this.authService.currentUser().role === 'Admin';
  }

  selectTeam(team: TeamDto) {
    if (this.poll?.hasVoted || !this.poll?.isActive || !this.isAuthenticated()) return;
    this.selectedTeamId = team.id;
  }

  submitVote() {
    if (!this.poll || !this.selectedTeamId) return;

    this.isSubmitting = true;
    this.pollService.submitVote({ pollId: this.poll.id, teamId: this.selectedTeamId }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loadPoll(this.poll!.id);
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  revealResults() {
    if (!this.poll) return;
    
    if(confirm('Are you sure you want to reveal results? This will close the poll.')) {
      this.pollService.revealResults(this.poll.id).subscribe(() => {
        this.loadPoll(this.poll!.id);
      });
    }
  }
}
