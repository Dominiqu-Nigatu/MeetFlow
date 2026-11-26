
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Select, SelectOption } from './select';

describe('Select', () => {
  let component: Select;
  let fixture: ComponentFixture<Select>;

  const options: SelectOption[] = [
    { label: 'Today', value: 'today' },
    { label: 'This week', value: 'week' },
    { label: 'This month', value: 'month' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Select],
    }).compileComponents();

    fixture = TestBed.createComponent(Select);
    fixture.componentRef.setInput('id', 'test-select');
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a select element', () => {
    expect(fixture.nativeElement.querySelector('select')).toBeTruthy();
  });

  it('should display its label', () => {
    fixture.componentRef.setInput('label', 'Date range');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Date range');
  });

  it('should display the placeholder', () => {
    expect(fixture.nativeElement.textContent)
      .toContain('Select an option');
  });

  it('should render all options', () => {
    const renderedOptions = fixture.nativeElement.querySelectorAll('option');
    expect(renderedOptions.length).toBe(4);
  });

  it('should support a selected value', () => {
    fixture.componentRef.setInput('value', 'week');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select');
    expect(select.value).toBe('week');
  });

  it('should support a disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select');
    expect(select.disabled).toBe(true);
  });

  it('should support a required state', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select');
    expect(select.required).toBe(true);
  });

  it('should display a hint', () => {
    fixture.componentRef.setInput('hint', 'Choose a date range');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toContain('Choose a date range');
  });

  it('should display an error', () => {
    fixture.componentRef.setInput('error', 'Please select an option');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toContain('Please select an option');
  });

  it('should emit the selected value', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const select = fixture.nativeElement.querySelector('select');

    select.value = 'month';
    select.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith('month');
  });
});
