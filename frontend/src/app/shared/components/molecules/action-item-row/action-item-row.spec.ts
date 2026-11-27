import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionItemRow } from './action-item-row';

describe('ActionItemRow', () => {
  let component: ActionItemRow;
  let fixture: ComponentFixture<ActionItemRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionItemRow],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionItemRow);
    fixture.componentRef.setInput('id', 'task-1');
    fixture.componentRef.setInput('description', 'Prepare project proposal');
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the task description', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Prepare project proposal',
    );
  });

  it('should display the owner when provided', () => {
    fixture.componentRef.setInput('owner', 'John Doe');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Assigned to John Doe');
  });

  it('should display unassigned when no owner is provided', () => {
    expect(fixture.nativeElement.textContent).toContain('Unassigned');
  });

  it('should display the due date when provided', () => {
    fixture.componentRef.setInput('dueDate', '30 November 2026');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Due 30 November 2026');
  });

  it('should default to incomplete', () => {
    expect(component.completed()).toBe(false);
  });

  it('should emit true when completed', () => {
    const spy = vi.fn();
    component.completedChange.subscribe(spy);

    component.onCompletedChange(true);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit false when reopened', () => {
    const spy = vi.fn();
    component.completedChange.subscribe(spy);

    component.onCompletedChange(false);

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should display completed badge', () => {
    fixture.componentRef.setInput('completed', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Completed');
  });

  it('should display open badge', () => {
    expect(fixture.nativeElement.textContent).toContain('Open');
  });
});