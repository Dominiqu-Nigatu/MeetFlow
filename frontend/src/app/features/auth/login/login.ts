import { Component, signal } from '@angular/core';
import { AuthLayout } from '../../../layouts/auth-layout/auth-layout';
import { Input } from '../../../shared/components/atoms/input/input';
import { Button } from '../../../shared/components/atoms/button/button';
import { Checkbox } from '../../../shared/components/atoms/checkbox/checkbox';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthLayout, Input, Button, Checkbox],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  showPassword = signal(false);

  errorMessage = signal('');
  submitted = signal(false);

  onEmailChange(value: string): void {
    this.email.set(value);
    this.errorMessage.set('');
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.errorMessage.set('');
  }

  onRememberMeChange(value: boolean): void {
    this.rememberMe.set(value);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
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

    this.errorMessage.set('');

    console.log('Login submitted:', {
      email,
      password,
      rememberMe: this.rememberMe(),
    });
  }
}
