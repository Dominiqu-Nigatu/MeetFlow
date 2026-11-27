import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';

describe('Spinner', () => {
  let component: Spinner;
  let fixture: ComponentFixture<Spinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner],
    }).compileComponents();

    fixture = TestBed.createComponent(Spinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a spinner element', () => {
    const spinner = fixture.nativeElement.querySelector('.spinner');

    expect(spinner).toBeTruthy();
  });

  it('should use medium size by default', () => {
    const spinner: HTMLElement = fixture.nativeElement.querySelector('.spinner');

    expect(spinner.classList).toContain('spinner--md');
  });

  it('should support different sizes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const spinner: HTMLElement = fixture.nativeElement.querySelector('.spinner');

    expect(spinner.classList).toContain('spinner--lg');
  });

  it('should display a loading message when provided', () => {
    fixture.componentRef.setInput('message', 'Generating summary...');
    fixture.detectChanges();

    const message: HTMLElement = fixture.nativeElement.querySelector('.spinner__message');

    expect(message.textContent?.trim()).toBe('Generating summary...');
  });

  it('should have an accessible loading role', () => {
    const container: HTMLElement = fixture.nativeElement.querySelector('.spinner-container');

    expect(container.getAttribute('role')).toBe('status');
  });

  it('should use the message as its accessible label', () => {
    fixture.componentRef.setInput('message', 'Loading meetings...');
    fixture.detectChanges();

    const container: HTMLElement = fixture.nativeElement.querySelector('.spinner-container');

    expect(container.getAttribute('aria-label')).toBe('Loading meetings...');
  });
});
