import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Save Changes');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided label', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.textContent).toContain('Save Changes');
  });

  it('should use the primary variant by default', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.classList).toContain('button--primary');
  });

  it('should support different variants', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.classList).toContain('button--secondary');
  });

  it('should support different sizes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.classList).toContain('button--lg');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  it('should be disabled while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  it('should show a loader when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector('.button__loader');

    expect(loader).toBeTruthy();
  });

  it('should support full width', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.classList).toContain('button--full-width');
  });

  it('should support different button types', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.type).toBe('submit');
  });
});
