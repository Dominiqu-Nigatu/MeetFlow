import { TestBed } from '@angular/core/testing';
import { Register } from './register';

describe('Register', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
    }).compileComponents();
  });

  it('should create the register component', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialise full name as empty', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance.fullName()).toBe('');
  });

  it('should initialise email as empty', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance.email()).toBe('');
  });

  it('should initialise password as empty', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance.password()).toBe('');
  });

  it('should initialise confirm password as empty', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance.confirmPassword()).toBe('');
  });

  it('should initialise terms acceptance to false', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance.acceptTerms()).toBe(false);
  });

  it('should update full name', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.onFullNameChange('John Doe');

    expect(fixture.componentInstance.fullName()).toBe('John Doe');
  });

  it('should update email', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.onEmailChange('test@example.com');

    expect(fixture.componentInstance.email()).toBe('test@example.com');
  });

  it('should update password', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.onPasswordChange('password123');

    expect(fixture.componentInstance.password()).toBe('password123');
  });

  it('should update confirm password', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.onConfirmPasswordChange('password123');

    expect(fixture.componentInstance.confirmPassword()).toBe('password123');
  });

  it('should update terms acceptance', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.onTermsChange(true);

    expect(fixture.componentInstance.acceptTerms()).toBe(true);
  });

  it('should toggle password visibility', () => {
    const fixture = TestBed.createComponent(Register);

    expect(fixture.componentInstance.showPassword()).toBe(false);

    fixture.componentInstance.togglePasswordVisibility();

    expect(fixture.componentInstance.showPassword()).toBe(true);
  });

  it('should toggle confirm password visibility', () => {
    const fixture = TestBed.createComponent(Register);

    expect(fixture.componentInstance.showConfirmPassword()).toBe(false);

    fixture.componentInstance.toggleConfirmPasswordVisibility();

    expect(fixture.componentInstance.showConfirmPassword()).toBe(true);
  });

  it('should reject empty fields', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Please fill in all required fields.',
    );
  });

  it('should reject invalid email', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('invalid-email');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.confirmPassword.set('password123');
    fixture.componentInstance.acceptTerms.set(true);

    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Please enter a valid email address.',
    );
  });

  it('should reject passwords shorter than 8 characters', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.password.set('1234567');
    fixture.componentInstance.confirmPassword.set('1234567');
    fixture.componentInstance.acceptTerms.set(true);

    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Password must be at least 8 characters long.',
    );
  });

  it('should reject mismatched passwords', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.confirmPassword.set('different123');
    fixture.componentInstance.acceptTerms.set(true);

    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Passwords do not match.',
    );
  });

  it('should reject unaccepted terms', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.confirmPassword.set('password123');

    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe(
      'Please accept the terms and conditions.',
    );
  });

  it('should accept valid registration details', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.confirmPassword.set('password123');
    fixture.componentInstance.acceptTerms.set(true);

    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe('');
  });

  it('should mark the form as submitted', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.submitted()).toBe(true);
  });

  it('should clear errors when email changes', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.errorMessage.set('Some error');

    fixture.componentInstance.onEmailChange('test@example.com');

    expect(fixture.componentInstance.errorMessage()).toBe('');
  });

  it('should render the register heading', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Create your');
  });

  it('should render the full name field', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#full-name')).toBeTruthy();
  });

  it('should render the email field', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#register-email')).toBeTruthy();
  });

  it('should render the password field', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#register-password')).toBeTruthy();
  });

  it('should render the confirm password field', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#confirm-password')).toBeTruthy();
  });

  it('should render the create account button', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Create account');
  });
});