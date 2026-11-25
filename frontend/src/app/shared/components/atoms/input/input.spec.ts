
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input } from './input';

describe('Input', () => {
  let component: Input;
  let fixture: ComponentFixture<Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    fixture.componentRef.setInput('id', 'test-input');
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an input element', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should use text as the default type', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('text');
  });

  it('should display the label', () => {
    fixture.componentRef.setInput('label', 'Email address');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label').textContent)
      .toContain('Email address');
  });

  it('should display the placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Enter email');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input').placeholder)
      .toBe('Enter email');
  });

  it('should support different input types', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input').type)
      .toBe('password');
  });

  it('should disable the input', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input').disabled)
      .toBe(true);
  });

  it('should mark the input as required', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input').required)
      .toBe(true);
  });

  it('should display a hint', () => {
    fixture.componentRef.setInput('hint', 'Use your work email');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toContain('Use your work email');
  });

  it('should display an error message', () => {
    fixture.componentRef.setInput('error', 'Invalid email');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toContain('Invalid email');
  });

  it('should emit the updated value', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'hello@test.com';
    input.dispatchEvent(new Event('input'));

    expect(emitSpy).toHaveBeenCalledWith('hello@test.com');
  });
});
