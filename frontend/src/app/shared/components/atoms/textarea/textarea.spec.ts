import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Textarea } from './textarea';

describe('Textarea', () => {
  let component: Textarea;
  let fixture: ComponentFixture<Textarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textarea],
    }).compileComponents();

    fixture = TestBed.createComponent(Textarea);
    fixture.componentRef.setInput('id', 'test-textarea');
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a textarea element', () => {
    expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();
  });

  it('should display the label', () => {
    fixture.componentRef.setInput('label', 'Meeting notes');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Meeting notes');
  });

  it('should display the placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Enter notes...');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('textarea').placeholder).toBe('Enter notes...');
  });

  it('should use four rows by default', () => {
    expect(fixture.nativeElement.querySelector('textarea').rows).toBe(4);
  });

  it('should support custom row counts', () => {
    fixture.componentRef.setInput('rows', 8);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('textarea').rows).toBe(8);
  });

  it('should disable the textarea', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('textarea').disabled).toBe(true);
  });

  it('should mark the textarea as required', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('textarea').required).toBe(true);
  });

  it('should display a hint', () => {
    fixture.componentRef.setInput('hint', 'Add your meeting notes');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Add your meeting notes');
  });

  it('should display an error', () => {
    fixture.componentRef.setInput('error', 'This field is required');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('This field is required');
  });

  it('should display a character counter', () => {
    fixture.componentRef.setInput('value', 'Hello');
    fixture.componentRef.setInput('maxLength', 100);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('5 / 100');
  });

  it('should emit the updated value', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const textarea = fixture.nativeElement.querySelector('textarea');

    textarea.value = 'Meeting discussion';
    textarea.dispatchEvent(new Event('input'));

    expect(emitSpy).toHaveBeenCalledWith('Meeting discussion');
  });
});
