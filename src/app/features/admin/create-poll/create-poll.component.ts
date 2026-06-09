import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PollService } from '../../../core/services/poll.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <h1 class="text-gradient">Create New Poll</h1>
      
      <form [formGroup]="pollForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Poll Title</label>
          <input type="text" class="form-control" formControlName="title" placeholder="e.g. Who will win the Champions League?">
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea class="form-control" formControlName="description" rows="3" placeholder="Provide some context..."></textarea>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
          <input type="checkbox" formControlName="isAnonymous" id="isAnonymous" style="width: auto;">
          <label for="isAnonymous" style="margin: 0;">Anonymous Poll (Hide voter names from admin)</label>
        </div>

        <div formArrayName="teams">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; margin-top: 2rem;">
            <h3 style="margin: 0;">Teams/Options</h3>
            <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" (click)="addTeam()">+ Add Team</button>
          </div>

          <div *ngFor="let team of teams.controls; let i=index" [formGroupName]="i" class="team-input-group">
            <input type="text" class="form-control" formControlName="name" placeholder="Team name">
            <button type="button" class="btn" style="background: rgba(239, 68, 68, 0.1); color: var(--error-color);" (click)="removeTeam(i)" *ngIf="teams.length > 2">✕</button>
          </div>
          <p *ngIf="teams.length < 2" style="color: var(--error-color); font-size: 0.875rem;">At least 2 teams are required.</p>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 2rem;" [disabled]="pollForm.invalid || isSubmitting || teams.length < 2">
          {{ isSubmitting ? 'Creating...' : 'Create Poll' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .team-input-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
  `]
})
export class CreatePollComponent {
  private fb = inject(FormBuilder);
  private pollService = inject(PollService);
  private router = inject(Router);

  pollForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.pollForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isAnonymous: [true],
      teams: this.fb.array([
        this.createTeamFormGroup(),
        this.createTeamFormGroup()
      ])
    });
  }

  get teams() {
    return this.pollForm.get('teams') as FormArray;
  }

  createTeamFormGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      logoUrl: ['']
    });
  }

  addTeam() {
    this.teams.push(this.createTeamFormGroup());
  }

  removeTeam(index: number) {
    if (this.teams.length > 2) {
      this.teams.removeAt(index);
    }
  }

  onSubmit() {
    if (this.pollForm.valid && this.teams.length >= 2) {
      this.isSubmitting = true;
      this.pollService.createPoll(this.pollForm.value).subscribe({
        next: (poll) => {
          this.router.navigate(['/polls', poll.id]);
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
