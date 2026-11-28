import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthLayout } from '../../../layouts/auth-layout/auth-layout';
import { Input } from '../../../shared/components/atoms/input/input';
import { Button } from '../../../shared/components/atoms/button/button';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthLayout, Input, Button, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly router = inject(Router);
  readonly localAccountDeleted = !!(
    this.router.currentNavigation()?.extras.state?.['localAccountDeleted'] ??
    window.history.state?.localAccountDeleted
  );
  email = signal('');
  password = signal('');
  showPassword = signal(false);

  errorMessage = signal('');
  submitted = signal(false);
  submitting = signal(false);
  touched = signal<Record<string, boolean>>({});

  touch(field: string): void {
    this.touched.update((fields) => ({ ...fields, [field]: true }));
  }

  fieldError(field: string): string {
    if (!this.submitted() && !this.touched()[field]) return '';
    switch (field) {
      case 'email':
        return !this.email().trim()
          ? 'Enter your email address.'
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim())
            ? 'Enter a valid email address.'
            : '';
      case 'password':
        return !this.password() ? 'Enter your password.' : '';
      default:
        return '';
    }
  }

  onEmailChange(value: string): void {
    this.email.set(value);
    this.errorMessage.set('');
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.errorMessage.set('');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  async onSubmit(): Promise<void> {
    if (this.submitting()) return;
    this.submitted.set(true);
    this.errorMessage.set('');

    const email = this.email().trim();
    const password = this.password();

    if (!email || !password) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    // UI-only flow: no credentials are persisted and no server session is created.
    this.submitting.set(true);
    try {
      if (!(await this.router.navigate(['/dashboard']))) {
        this.errorMessage.set('Unable to open the dashboard. Please try again.');
      }
    } catch {
      this.errorMessage.set('Unable to open the dashboard. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
