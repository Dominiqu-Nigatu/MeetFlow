import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthLayout } from '../../../layouts/auth-layout/auth-layout';
import { Input } from '../../../shared/components/atoms/input/input';
import { Button } from '../../../shared/components/atoms/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AuthLayout, Input, Button, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly router = inject(Router);
  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  showPassword = signal(false);
  showConfirmPassword = signal(false);

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
      case 'fullName':
        return this.fullName().trim() ? '' : 'Enter your full name.';
      case 'email':
        return !this.email().trim()
          ? 'Enter your email address.'
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim())
            ? 'Enter a valid email address.'
            : '';
      case 'password':
        return !this.password()
          ? 'Enter your password.'
          : this.password().length < 8
            ? 'Use at least 8 characters.'
            : '';
      case 'confirmPassword':
        return !this.confirmPassword()
          ? 'Confirm your password.'
          : this.confirmPassword() !== this.password()
            ? 'Passwords do not match.'
            : '';
      default:
        return '';
    }
  }

  onFullNameChange(value: string): void {
    this.fullName.set(value);
    this.errorMessage.set('');
  }

  onEmailChange(value: string): void {
    this.email.set(value);
    this.errorMessage.set('');
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.errorMessage.set('');
  }

  onConfirmPasswordChange(value: string): void {
    this.confirmPassword.set(value);
    this.errorMessage.set('');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  async onSubmit(): Promise<void> {
    if (this.submitting()) return;
    this.submitted.set(true);
    this.errorMessage.set('');

    const fullName = this.fullName().trim();
    const email = this.email().trim();
    const password = this.password();
    const confirmPassword = this.confirmPassword();

    if (!fullName || !email || !password || !confirmPassword) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
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
