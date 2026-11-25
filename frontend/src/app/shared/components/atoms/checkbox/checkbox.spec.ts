import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
    fixture.componentRef.setInput('id', 'test-checkbox');
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a checkbox input', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('checkbox');
  });

  it('should display the label', () => {
    fixture.componentRef.setInput('label', 'Remember me');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Remember me');
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

  it('should mark the checkbox as required', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.required).toBe(true);
  });

  it('should display a description', () => {
    fixture.componentRef.setInput('description', 'Keep me signed in');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toContain('Keep me signed in');
  });

  it('should emit true when checked', () => {
    const emitSpy = vi.spyOn(component.checkedChange, 'emit');
    const input = fixture.nativeElement.querySelector('input');

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should emit false when unchecked', () => {
    const emitSpy = vi.spyOn(component.checkedChange, 'emit');
    const input = fixture.nativeElement.querySelector('input');

    input.checked = false;
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
