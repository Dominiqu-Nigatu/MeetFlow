import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkspaceStore, ActionStatus } from '../../../../core/services/workspace-store';
import { Checkbox } from '../../atoms/checkbox/checkbox';
import { Badge } from '../../atoms/badge/badge';

@Component({
  selector: 'app-action-item-row',
  standalone: true,
  imports: [Checkbox, Badge, FormsModule],
  templateUrl: './action-item-row.html',
  styleUrl: './action-item-row.scss',
})
export class ActionItemRow {
  id = input.required<string>();
  description = input.required<string>();
  owner = input<string | null>(null);
  dueDate = input<string | null>(null);
  completed = input(false);

  meetingId = input('');
  status = input<ActionStatus>('todo');
  creating = input(false);
  saved = output<void>();
  cancelled = output<void>();
  readonly store = inject(WorkspaceStore);
  editing = signal(false);
  confirmingDelete = signal(false);
  descriptionDraft = '';
  ownerDraft = '';
  dateDraft = '';
  statusDraft: ActionStatus = 'todo';
  error = signal('');
  startEdit(): void {
    this.descriptionDraft = this.description();
    this.ownerDraft = this.owner() || '';
    this.dateDraft = this.dueDate() || '';
    this.statusDraft = this.completed() ? 'done' : this.status();
    this.error.set('');
    this.confirmingDelete.set(false);
    this.editing.set(true);
  }
  save(event: Event): void {
    event.preventDefault();
    const draft = {
      description: this.descriptionDraft,
      owner: this.ownerDraft || null,
      dueDate: this.dateDraft || null,
      status: this.statusDraft,
    };
    if (!draft.description.trim()) {
      this.error.set('Enter a task description.');
      return;
    }
    const ok = this.creating()
      ? this.store.addAction(this.meetingId(), draft)
      : this.store.updateAction(this.meetingId(), this.id(), draft);
    if (ok) {
      this.editing.set(false);
      this.saved.emit();
    } else
      this.error.set(this.store.storageError() || 'Enter a valid description, status and date.');
  }
  cancel(): void {
    this.editing.set(false);
    this.confirmingDelete.set(false);
    this.error.set('');
    this.cancelled.emit();
  }
  remove(): void {
    if (this.store.deleteAction(this.meetingId(), this.id())) {
      this.editing.set(false);
      this.saved.emit();
    } else this.error.set(this.store.storageError() || 'This task could not be deleted.');
  }
  completedChange = output<boolean>();

  restoreCheckbox(event: Event): void {
    // Native checkboxes toggle before change handlers. Restore the persisted value
    // if the parent could not save; a failed save must not look completed.
    if (!this.meetingId()) return;
    const action = this.store.notes(this.meetingId()).actions.find((a) => a.id === this.id());
    if (action && event.target instanceof HTMLInputElement) event.target.checked = action.completed;
  }

  onCompletedChange(value: boolean): void {
    this.completedChange.emit(value);
  }
}
