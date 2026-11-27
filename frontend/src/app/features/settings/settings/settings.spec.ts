import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise the profile name', () => {
    expect(component.name()).toBe('John Doe');
  });

  it('should initialise the email', () => {
    expect(component.email()).toBe('john.doe@example.com');
  });

  it('should initialise the job title', () => {
    expect(component.jobTitle()).toBe('Software Developer');
  });

  it('should initialise the timezone', () => {
    expect(component.timezone()).toBe('Africa/Johannesburg');
  });

  it('should initialise email notifications as enabled', () => {
    expect(component.emailNotifications()).toBe(true);
  });

  it('should initialise task reminders as enabled', () => {
    expect(component.taskReminders()).toBe(true);
  });

  it('should initialise meeting summaries as enabled', () => {
    expect(component.meetingSummaries()).toBe(true);
  });

  it('should initialise weekly digest as disabled', () => {
    expect(component.weeklyDigest()).toBe(false);
  });

  it('should initialise dark mode as disabled', () => {
    expect(component.darkMode()).toBe(false);
  });

  it('should update name', () => {
    component.onNameChange('Dominique');

    expect(component.name()).toBe('Dominique');
  });

  it('should update email', () => {
    component.onEmailChange('new@example.com');

    expect(component.email()).toBe('new@example.com');
  });

  it('should update job title', () => {
    component.onJobTitleChange('Product Designer');

    expect(component.jobTitle()).toBe('Product Designer');
  });

  it('should update timezone', () => {
    component.onTimezoneChange('Europe/London');

    expect(component.timezone()).toBe('Europe/London');
  });

  it('should update email notification preference', () => {
    component.onNotificationChange('emailNotifications', false);

    expect(component.emailNotifications()).toBe(false);
  });

  it('should update task reminder preference', () => {
    component.onNotificationChange('taskReminders', false);

    expect(component.taskReminders()).toBe(false);
  });

  it('should update meeting summary preference', () => {
    component.onNotificationChange('meetingSummaries', false);

    expect(component.meetingSummaries()).toBe(false);
  });

  it('should update weekly digest preference', () => {
    component.onNotificationChange('weeklyDigest', true);

    expect(component.weeklyDigest()).toBe(true);
  });

  it('should update dark mode preference', () => {
    component.onDarkModeChange(true);

    expect(component.darkMode()).toBe(true);
  });

  it('should save settings', () => {
    component.saveSettings();

    expect(component.saved()).toBe(true);
  });

  it('should reset the profile', () => {
    component.onNameChange('Changed');
    component.onEmailChange('changed@example.com');
    component.onJobTitleChange('Manager');
    component.onTimezoneChange('Europe/London');

    component.resetSettings();

    expect(component.name()).toBe('John Doe');
    expect(component.email()).toBe('john.doe@example.com');
    expect(component.jobTitle()).toBe('Software Developer');
    expect(component.timezone()).toBe('Africa/Johannesburg');
  });

  it('should reset notification preferences', () => {
    component.onNotificationChange('emailNotifications', false);
    component.onNotificationChange('taskReminders', false);
    component.onNotificationChange('meetingSummaries', false);
    component.onNotificationChange('weeklyDigest', true);

    component.resetSettings();

    expect(component.emailNotifications()).toBe(true);
    expect(component.taskReminders()).toBe(true);
    expect(component.meetingSummaries()).toBe(true);
    expect(component.weeklyDigest()).toBe(false);
  });

  it('should reset appearance preferences', () => {
    component.onDarkModeChange(true);

    component.resetSettings();

    expect(component.darkMode()).toBe(false);
  });

  it('should clear saved state when changing name', () => {
    component.saveSettings();
    component.onNameChange('Changed');

    expect(component.saved()).toBe(false);
  });

  it('should clear saved state when changing email', () => {
    component.saveSettings();
    component.onEmailChange('changed@example.com');

    expect(component.saved()).toBe(false);
  });

  it('should clear saved state when changing job title', () => {
    component.saveSettings();
    component.onJobTitleChange('Designer');

    expect(component.saved()).toBe(false);
  });

  it('should clear saved state when changing timezone', () => {
    component.saveSettings();
    component.onTimezoneChange('Europe/London');

    expect(component.saved()).toBe(false);
  });

  it('should clear saved state when changing notification settings', () => {
    component.saveSettings();
    component.onNotificationChange('weeklyDigest', true);

    expect(component.saved()).toBe(false);
  });

  it('should clear saved state when changing appearance', () => {
    component.saveSettings();
    component.onDarkModeChange(true);

    expect(component.saved()).toBe(false);
  });

  it('should render the settings heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Settings');
  });

  it('should render profile settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Profile');
    expect(compiled.textContent).toContain('Full name');
    expect(compiled.textContent).toContain('Email address');
  });

  it('should render notification settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Notifications');
    expect(compiled.textContent).toContain('Weekly digest');
  });

  it('should render appearance settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Appearance');
    expect(compiled.textContent).toContain('Dark mode');
  });

  it('should render account settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Account');
    expect(compiled.textContent).toContain('Account status');
  });

  it('should render save and reset buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Save changes');
    expect(compiled.textContent).toContain('Reset');
  });

  it('should render the profile preview', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('Software Developer');
  });
});
