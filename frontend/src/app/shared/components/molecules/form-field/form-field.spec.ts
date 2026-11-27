import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from './form-field';

describe('FormField', () => {
  let component: FormField;
  let fixture: ComponentFixture<FormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormField],
    }).compileComponents();

    fixture = TestBed.createComponent(FormField);
    fixture.componentRef.setInput('id', 'email');
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the input atom', () => {
    expect(fixture.nativeElement.querySelector('app-input')).toBeTruthy();
  });

  it('should pass the label to the input', () => {
    fixture.componentRef.setInput('label', 'Email address');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email address');
  });

  it('should pass the placeholder to the input', () => {
    fixture.componentRef.setInput('placeholder', 'Enter your email');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Enter your email');
  });

  it('should pass the input type', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('password');
  });

  it('should pass the required state', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.required).toBe(true);
  });

  it('should pass the disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });

  it('should display a hint', () => {
    fixture.componentRef.setInput('hint', 'Use your work email');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Use your work email');
  });

  it('should display an error', () => {
    fixture.componentRef.setInput('error', 'Invalid email address');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Invalid email address');
  });

  it('should emit value changes', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');

    component.onValueChange('hello@example.com');

    expect(emitSpy).toHaveBeenCalledWith('hello@example.com');
  });
});
