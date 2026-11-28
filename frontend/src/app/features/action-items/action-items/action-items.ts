import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActionItemRow } from '../../../shared/components/molecules/action-item-row/action-item-row';
import { ActionSearch } from '../../../core/services/action-search';
import { WorkspaceStore, ActionStatus } from '../../../core/services/workspace-store';
@Component({
  selector: 'app-action-items',
  standalone: true,
  imports: [ActionItemRow, FormsModule, RouterLink],
  templateUrl: './action-items.html',
  styleUrl: './action-items.scss',
})
export class ActionItems {
  readonly store = inject(WorkspaceStore);
  readonly searchQuery = inject(ActionSearch).query;
  readonly items = this.store.actions;
  readonly statusFilter = signal<ActionStatus | 'all'>('all');
  readonly ownerFilter = signal('all');
  readonly overdueOnly = signal(false);
  readonly addOpen = signal(false);
  meetingId = '';
  readonly owners = computed(() =>
    [
      ...new Set(
        this.items()
          .map((a) => a.owner)
          .filter((o): o is string => !!o),
      ),
    ].sort(),
  );
  readonly totalCount = computed(() => this.items().length);
  readonly completedCount = computed(() => this.items().filter((a) => a.completed).length);
  readonly openCount = computed(() => this.totalCount() - this.completedCount());
  readonly filteredItems = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return this.items().filter(
      (a) =>
        (this.statusFilter() === 'all' || a.status === this.statusFilter()) &&
        (this.ownerFilter() === 'all' ||
          (this.ownerFilter() === 'unassigned' ? !a.owner : a.owner === this.ownerFilter())) &&
        (!this.overdueOnly() || this.store.isOverdue(a)) &&
        (!query ||
          [a.description, a.owner || '', a.meetingTitle].some((s) =>
            s.toLowerCase().includes(query),
          )),
    );
  });
  clearSearch() {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.ownerFilter.set('all');
    this.overdueOnly.set(false);
  }
}
