import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActionItemRow } from '../../../shared/components/molecules/action-item-row/action-item-row';
import { WorkspaceStore } from '../../../core/services/workspace-store';
@Component({
  selector: 'app-meeting-detail',
  standalone: true,
  imports: [ActionItemRow, FormsModule],
  templateUrl: './meeting-detail.html',
  styleUrl: './meeting-detail.scss',
})
export class MeetingDetail {
  readonly store = inject(WorkspaceStore);
  private readonly router = inject(Router);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly id = computed(() => this.params()?.get('id') || '');
  readonly meeting = computed(() => this.store.meeting(this.id()));
  readonly notes = computed(() => this.store.notes(this.id()));
  readonly analysisState = computed(
    () => this.store.analysis()[this.id()] || { status: 'idle', message: '' },
  );
  readonly editing = signal<'summary' | 'decisions' | null>(null);
  readonly addingAction = signal(false);
  summaryDraft = '';
  decisionsDraft = '';
  private editingId = '';
  startEdit(section: 'summary' | 'decisions') {
    this.editingId = this.id();
    this.summaryDraft = this.notes().summary;
    this.decisionsDraft = this.notes().decisions.join('\n');
    this.editing.set(section);
  }
  saveNotes(event: Event) {
    event.preventDefault();
    if (this.editingId !== this.id()) {
      this.editing.set(null);
      return;
    }
    const notes = this.notes();
    if (
      this.store.saveNotes(
        this.id(),
        this.editing() === 'summary' ? this.summaryDraft : notes.summary,
        this.editing() === 'decisions' ? this.decisionsDraft.split('\n') : notes.decisions,
      )
    )
      this.editing.set(null);
  }
  onBack() {
    void this.router.navigate(['/meetings']);
  }
  analyze() {
    void this.store.analyze(this.id());
  }
}
