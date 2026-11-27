import { Component, signal } from '@angular/core';
import { Toggle } from '../../../shared/components/atoms/toggle/toggle';
import { Button } from '../../../shared/components/atoms/button/button';
import { Avatar } from '../../../shared/components/atoms/avatar/avatar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [Toggle, Button, Avatar],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  name = signal('John Doe');
  email = signal('john.doe@example.com');
  jobTitle = signal('Software Developer');
  timezone = signal('Africa/Johannesburg');

  emailNotifications = signal(true);
  taskReminders = signal(true);
  meetingSummaries = signal(true);
  weeklyDigest = signal(false);

  darkMode = signal(false);

  saved = signal(false);

  onNameChange(value: string): void {
    this.name.set(value);
    this.saved.set(false);
  }

  onEmailChange(value: string): void {
    this.email.set(value);
    this.saved.set(false);
  }

  onJobTitleChange(value: string): void {
    this.jobTitle.set(value);
    this.saved.set(false);
  }

  onTimezoneChange(value: string): void {
    this.timezone.set(value);
    this.saved.set(false);
  }

  onNotificationChange(
    setting: 'emailNotifications' | 'taskReminders' | 'meetingSummaries' | 'weeklyDigest',
    value: boolean,
  ): void {
    this[setting].set(value);
    this.saved.set(false);
  }

  onDarkModeChange(value: boolean): void {
    this.darkMode.set(value);
    this.saved.set(false);
  }

  saveSettings(): void {
    this.saved.set(true);
  }

  resetSettings(): void {
    this.name.set('John Doe');
    this.email.set('john.doe@example.com');
    this.jobTitle.set('Software Developer');
    this.timezone.set('Africa/Johannesburg');

    this.emailNotifications.set(true);
    this.taskReminders.set(true);
    this.meetingSummaries.set(true);
    this.weeklyDigest.set(false);

    this.darkMode.set(false);
    this.saved.set(false);
  }
}
