import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '../../../shared/components/atoms/input/input';
import { Button } from '../../../shared/components/atoms/button/button';

export const ACCOUNT_DELETED_KEY = 'meetflow.account.deletedAt';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [Input, Button],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private readonly router = inject(Router);
  confirming = signal(false);
  confirmation = signal('');
  submitted = signal(false);
  touched = signal(false);
  deleting = signal(false);
  deletedAt = signal<string | null>(null);
  errorMessage = signal('');

  confirmationError(): string {
    return (this.submitted() || this.touched()) && this.confirmation() !== 'DELETE'
      ? 'Type DELETE exactly to confirm.'
      : '';
  }

  beginDeletion(): void {
    this.confirmation.set('');
    this.submitted.set(false);
    this.touched.set(false);
    this.errorMessage.set('');
    this.confirming.set(true);
  }

  cancelDeletion(): void {
    if (this.deleting()) return;
    this.confirming.set(false);
    this.confirmation.set('');
    this.submitted.set(false);
    this.touched.set(false);
    this.errorMessage.set('');
  }

  async deleteAccount(): Promise<void> {
    if (this.deleting() || !this.confirming() || this.deletedAt()) return;
    this.submitted.set(true);
    if (this.confirmationError()) return;
    this.deleting.set(true);
    this.errorMessage.set('');
    try {
      const timestamp = new Date().toISOString();
      // This tombstone is the entire local-only operation. Meeting data is untouched.
      localStorage.setItem(ACCOUNT_DELETED_KEY, timestamp);
      this.deletedAt.set(timestamp);
    } catch {
      this.errorMessage.set(
        'Could not mark the local account deleted. Nothing was changed. Please try again.',
      );
      this.deleting.set(false);
      return;
    }
    await this.navigateToLogin();
  }

  async returnToLogin(): Promise<void> {
    if (!this.deletedAt() || this.deleting()) return;
    await this.navigateToLogin();
  }

  private async navigateToLogin(): Promise<void> {
    this.deleting.set(true);
    try {
      if (!(await this.router.navigate(['/login'], { state: { localAccountDeleted: true } }))) {
        this.errorMessage.set(
          'Local account marked deleted, but sign in could not open. Please try again.',
        );
      }
    } catch {
      this.errorMessage.set(
        'Local account marked deleted, but sign in could not open. Please try again.',
      );
    } finally {
      this.deleting.set(false);
    }
  }
}
