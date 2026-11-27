import { TestBed } from '@angular/core/testing';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();
  });

  it('should create the login component', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialise email as empty', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance.email()).toBe('');
  });

  it('should initialise password as empty', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance.password()).toBe('');
  });

  it('should initialise remember me as false', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance.rememberMe()).toBe(false);
  });

  it('should update email', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.onEmailChange('test@example.com');

    expect(fixture.componentInstance.email()).toBe('test@example.com');
  });

  it('should update password', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.onPasswordChange('password123');

    expect(fixture.componentInstance.password()).toBe('password123');
  });

  it('should update remember me', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.onRememberMeChange(true);

    expect(fixture.componentInstance.rememberMe()).toBe(true);
  });

  it('should toggle password visibility', () => {
    const fixture = TestBed.createComponent(Login);

    expect(fixture.componentInstance.showPassword()).toBe(false);

    fixture.componentInstance.togglePasswordVisibility();

    expect(fixture.componentInstance.showPassword()).toBe(true);

    fixture.componentInstance.togglePasswordVisibility();

    expect(fixture.componentInstance.showPassword()).toBe(false);
  });

  it('should show an error if email is empty', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Please fill in all required fields.',
    );
  });

  it('should show an error if password is empty', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Please fill in all required fields.',
    );
  });

  it('should show an error for an invalid email', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.email.set('invalid-email');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Please enter a valid email address.',
    );
  });

  it('should clear the error when email changes', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.errorMessage.set('Some error');

    fixture.componentInstance.onEmailChange('new@example.com');

    expect(fixture.componentInstance.errorMessage()).toBe('');
  });

  it('should clear the error when password changes', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.errorMessage.set('Some error');

    fixture.componentInstance.onPasswordChange('newPassword');

    expect(fixture.componentInstance.errorMessage()).toBe('');
  });

  it('should mark the form submitted', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.submitted()).toBe(true);
  });

  it('should not show an error for valid credentials', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe('');
  });

  it('should render the login heading', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sign in to');
  });

  it('should render the email field', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#email')).toBeTruthy();
  });

  it('should render the password field', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#password')).toBeTruthy();
  });

  it('should render the sign in button', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sign in');
  });

  it('should render the signup prompt', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      "Don't have an account?",
    );
  });
});