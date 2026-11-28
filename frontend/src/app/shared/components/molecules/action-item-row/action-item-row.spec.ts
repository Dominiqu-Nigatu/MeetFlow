import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionItemRow } from './action-item-row';
import { WorkspaceStore } from '../../../../core/services/workspace-store';

describe('ActionItemRow', () => {
  let component: ActionItemRow;
  let fixture: ComponentFixture<ActionItemRow>;

  beforeEach(async () => {
    localStorage.clear();
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
    expect(fixture.nativeElement.textContent).toContain('Prepare project proposal');
  });

  it('should not display owner text when provided', () => {
    fixture.componentRef.setInput('owner', 'John Doe');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Assigned to');
    expect(fixture.nativeElement.textContent).not.toContain('John Doe');
  });

  it('should not display an unassigned label', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Unassigned');
  });

  it('should not display due-date text when provided', () => {
    fixture.componentRef.setInput('dueDate', '30 November 2026');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Due 30 November 2026');
    expect(component.dueDate()).toBe('30 November 2026');
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
  it('saves edits through the shared workspace and cancels without mutation', () => {
    const store = TestBed.inject(WorkspaceStore);
    const action = store.notes('1').actions[0];
    fixture.componentRef.setInput('id', action.id);
    fixture.componentRef.setInput('meetingId', '1');
    fixture.componentRef.setInput('description', action.description);
    fixture.componentRef.setInput('owner', action.owner);
    fixture.componentRef.setInput('dueDate', action.dueDate);
    fixture.componentRef.setInput('status', action.status);
    component.startEdit();
    component.descriptionDraft = 'Changed';
    component.ownerDraft = 'Pat';
    component.statusDraft = 'in progress';
    component.save(new Event('submit'));
    expect(store.notes('1').actions[0].description).toBe('Changed');
    expect(store.notes('1').actions[0].owner).toBe('Pat');
    expect(store.notes('1').actions[0].status).toBe('in progress');
    component.startEdit();
    component.descriptionDraft = 'Not saved';
    component.cancel();
    expect(store.notes('1').actions[0].description).toBe('Changed');
    localStorage.clear();
  });

  it('requires a separate delete confirmation inside the editor', () => {
    const store = TestBed.inject(WorkspaceStore);
    const action = store.notes('1').actions[0];
    fixture.componentRef.setInput('id', action.id);
    fixture.componentRef.setInput('meetingId', '1');
    component.startEdit();
    fixture.detectChanges();
    const buttons = () =>
      Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    buttons()
      .find((b) => b.textContent?.trim() === 'Delete')!
      .click();
    fixture.detectChanges();
    expect(store.notes('1').actions.some((a) => a.id === action.id)).toBe(true);
    buttons()
      .find((b) => b.textContent?.trim() === 'Keep task')!
      .click();
    fixture.detectChanges();
    expect(component.confirmingDelete()).toBe(false);
    buttons()
      .find((b) => b.textContent?.trim() === 'Delete')!
      .click();
    fixture.detectChanges();
    buttons()
      .find((b) => b.textContent?.trim() === 'Confirm delete')!
      .click();
    fixture.detectChanges();
    expect(store.notes('1').actions.some((a) => a.id === action.id)).toBe(false);
    localStorage.clear();
  });

  it('keeps the editor and draft when persistence fails', () => {
    fixture.componentRef.setInput('id', 'sample-action-1');
    fixture.componentRef.setInput('meetingId', '1');
    component.startEdit();
    component.descriptionDraft = 'Unsaved draft';
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Full');
    });
    component.save(new Event('submit'));
    expect(component.editing()).toBe(true);
    expect(component.descriptionDraft).toBe('Unsaved draft');
    expect(component.error()).toContain('not saved');
    spy.mockRestore();
  });
  it('restores the native completion checkbox if saving fails', () => {
    fixture.componentRef.setInput('id', 'sample-action-1');
    fixture.componentRef.setInput('meetingId', '1');
    const store = TestBed.inject(WorkspaceStore);
    component.completedChange.subscribe((completed) =>
      store.completeAction('1', 'sample-action-1', completed),
    );
    fixture.detectChanges();
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Full');
    });
    const checkbox = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(checkbox.checked).toBe(false);
    expect(store.notes('1').actions[0].completed).toBe(false);
    expect(store.storageError()).toContain('not saved');
    spy.mockRestore();
  });
});
