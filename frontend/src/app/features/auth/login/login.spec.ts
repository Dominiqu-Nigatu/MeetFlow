import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
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

    expect(fixture.componentInstance.errorMessage()).toBe('Please fill in all required fields.');
  });

  it('should show an error if password is empty', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.email.set('test@example.com');
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe('Please fill in all required fields.');
  });

  it('should show an error for an invalid email', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.email.set('invalid-email');
    fixture.componentInstance.password.set('password123');
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.errorMessage()).toBe('Please enter a valid email address.');
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

    expect(fixture.nativeElement.textContent).toContain("Don't have an account?");
  });
  it('should never log credentials on submission', () => {
    const component = TestBed.createComponent(Login).componentInstance;
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      component.onEmailChange('test@example.com');
      component.onPasswordChange('password123');
      component.onSubmit();
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
  it('should link to the dashboard without requiring form submission', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dashboard-preview').getAttribute('href')).toBe(
      '/dashboard',
    );
    expect(fixture.nativeElement.querySelector('a[href="/register"]')).toBeTruthy();
  });

  it('should navigate to the dashboard after valid preview submission', () => {
    const component = TestBed.createComponent(Login).componentInstance;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.email.set('preview@example.com');
    component.password.set('sample-password');
    component.onSubmit();
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });
  it('should keep the page free of decorative text and terms', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.welcome-badge')).toBeNull();
    expect(fixture.nativeElement.querySelector('.preview-note')).toBeNull();
    expect(fixture.nativeElement.querySelector('.terms-field')).toBeNull();
    expect(fixture.nativeElement.querySelector('footer')).toBeNull();
    expect(fixture.nativeElement.querySelector('.dashboard-preview')).toBeTruthy();
  });
  it('should show Sign in without remember-me or extra button text', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#remember-me')).toBeNull();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').textContent.trim()).toBe(
      'Sign in',
    );
  });
  it('shows accessible inline errors only after touch or submit', async () => {
    const fixture = TestBed.createComponent(Login);
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
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    component.email.set('user@example.com');
    component.password.set('password123');

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
    const component = TestBed.createComponent(Login).componentInstance;
    component.email.set('user@example.com');
    component.password.set('password123');

    vi.spyOn(TestBed.inject(Router), 'navigate').mockRejectedValue(new Error('offline'));
    await component.onSubmit();
    expect(component.submitting()).toBe(false);
    expect(component.errorMessage()).toContain('Unable to open');
  });
});
