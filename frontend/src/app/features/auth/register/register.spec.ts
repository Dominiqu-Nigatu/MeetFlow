import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
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

    expect(fixture.componentInstance.errorMessage()).toBe('Please fill in all required fields.');
  });

  it('should reject invalid email', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('invalid-email');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.confirmPassword.set('password123');

    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe('Please enter a valid email address.');
  });

  it('should reject passwords shorter than 8 characters', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.password.set('1234567');
    fixture.componentInstance.confirmPassword.set('1234567');

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

    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe('Passwords do not match.');
  });

  it('should accept valid registration details', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.fullName.set('John Doe');
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.confirmPassword.set('password123');

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

    expect(fixture.nativeElement.textContent).toContain('Register');
  });
  it('should link to the dashboard without requiring form submission', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dashboard-preview').getAttribute('href')).toBe(
      '/dashboard',
    );
    expect(fixture.nativeElement.querySelector('a[href="/login"]')).toBeTruthy();
  });

  it('should navigate to the dashboard after valid preview submission', () => {
    const component = TestBed.createComponent(Register).componentInstance;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.email.set('preview@example.com');
    component.password.set('sample-password');
    component.fullName.set('Preview User');
    component.confirmPassword.set('sample-password');
    component.onSubmit();
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });
  it('should keep the page free of decorative text and terms', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.welcome-badge')).toBeNull();
    expect(fixture.nativeElement.querySelector('.preview-note')).toBeNull();
    expect(fixture.nativeElement.querySelector('.terms-field')).toBeNull();
    expect(fixture.nativeElement.querySelector('footer')).toBeNull();
    expect(fixture.nativeElement.querySelector('.dashboard-preview')).toBeTruthy();
  });
  it('shows accessible inline errors only after touch or submit', async () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('input[type="email"]').getAttribute('aria-invalid'),
    ).toBe('false');
    fixture.componentInstance.touch('email');
    fixture.detectChanges();
    const email = fixture.nativeElement.querySelector('input[type="email"]');
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(
      fixture.nativeElement.querySelector('#' + email.getAttribute('aria-describedby')).textContent,
    ).toContain('Enter your email');
    await fixture.componentInstance.onSubmit();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('input[type="password"]').getAttribute('aria-invalid'),
    ).toBe('true');
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('guards pending navigation and disables submission until it resolves', async () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    component.email.set('user@example.com');
    component.password.set('password123');
    component.fullName.set('Jane Doe');
    component.confirmPassword.set('password123');
    let resolve!: (value: boolean) => void;
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockReturnValue(new Promise<boolean>((done) => (resolve = done)));
    const first = component.onSubmit();
    await component.onSubmit();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
    resolve(false);
    await first;
    expect(component.submitting()).toBe(false);
    expect(component.errorMessage()).toContain('Unable to open');
  });

  it('handles rejected navigation without claiming success', async () => {
    const component = TestBed.createComponent(Register).componentInstance;
    component.email.set('user@example.com');
    component.password.set('password123');
    component.fullName.set('Jane Doe');
    component.confirmPassword.set('password123');
    vi.spyOn(TestBed.inject(Router), 'navigate').mockRejectedValue(new Error('offline'));
    await component.onSubmit();
    expect(component.submitting()).toBe(false);
    expect(component.errorMessage()).toContain('Unable to open');
  });
});
