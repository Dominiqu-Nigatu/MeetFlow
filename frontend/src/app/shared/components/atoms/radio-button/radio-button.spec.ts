import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioButton } from './radio-button';

describe('RadioButton', () => {
  let component: RadioButton;
  let fixture: ComponentFixture<RadioButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButton],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButton);

    fixture.componentRef.setInput('id', 'test-radio');
    fixture.componentRef.setInput('name', 'test-group');
    fixture.componentRef.setInput('value', 'option-one');

    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a radio input', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('radio');
  });

  it('should display the label', () => {
    fixture.componentRef.setInput('label', 'Weekly summary');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Weekly summary');
  });

  it('should use the supplied name', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.name).toBe('test-group');
  });

  it('should use the supplied value', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('option-one');
  });

  it('should be unchecked by default', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.checked).toBe(false);
  });

  it('should support a checked state', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.checked).toBe(true);
  });

  it('should support a disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });

  it('should support a required state', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.required).toBe(true);
  });

  it('should display a description', () => {
    fixture.componentRef.setInput('description', 'A short summary');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('A short summary');
  });

  it('should emit its value when selected', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const input = fixture.nativeElement.querySelector('input');

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith('option-one');
  });
});
