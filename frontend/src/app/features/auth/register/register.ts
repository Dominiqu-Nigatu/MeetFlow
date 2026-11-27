import { Component, signal } from '@angular/core';
import { AuthLayout } from '../../../layouts/auth-layout/auth-layout';
import { Input } from '../../../shared/components/atoms/input/input';
import { Button } from '../../../shared/components/atoms/button/button';
import { Checkbox } from '../../../shared/components/atoms/checkbox/checkbox';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AuthLayout, Input, Button, Checkbox],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  acceptTerms = signal(false);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  errorMessage = signal('');
  submitted = signal(false);

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

  onTermsChange(value: boolean): void {
    this.acceptTerms.set(value);
    this.errorMessage.set('');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  onSubmit(): void {
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

    if (!this.acceptTerms()) {
      this.errorMessage.set('Please accept the terms and conditions.');
      return;
    }

    console.log('Registration submitted:', {
      fullName,
      email,
    });
  }
}
