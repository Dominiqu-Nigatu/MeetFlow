import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toggle } from './toggle';

describe('Toggle', () => {
  let component: Toggle;
  let fixture: ComponentFixture<Toggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toggle],
    }).compileComponents();

    fixture = TestBed.createComponent(Toggle);
    fixture.componentRef.setInput('id', 'test-toggle');
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

  it('should have switch role', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('role')).toBe('switch');
  });

  it('should display its label', () => {
    fixture.componentRef.setInput('label', 'Email notifications');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email notifications');
  });

  it('should display its description', () => {
    fixture.componentRef.setInput('description', 'Receive meeting updates');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Receive meeting updates');
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

  it('should emit true when enabled', () => {
    const emitSpy = vi.spyOn(component.checkedChange, 'emit');
    const input = fixture.nativeElement.querySelector('input');

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should emit false when disabled', () => {
    const emitSpy = vi.spyOn(component.checkedChange, 'emit');
    const input = fixture.nativeElement.querySelector('input');

    input.checked = false;
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
