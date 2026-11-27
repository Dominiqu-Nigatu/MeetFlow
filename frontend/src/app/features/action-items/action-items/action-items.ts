import { Component, computed, signal } from '@angular/core';
import { ActionItemRow } from '../../../shared/components/molecules/action-item-row/action-item-row';
import { Badge } from '../../../shared/components/atoms/badge/badge';
import { Input } from '../../../shared/components/atoms/input/input';

export interface ActionItem {
  id: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  completed: boolean;
  meetingTitle: string;
}

@Component({
  selector: 'app-action-items',
  standalone: true,
  imports: [ActionItemRow, Badge, Input],
  templateUrl: './action-items.html',
  styleUrl: './action-items.scss',
})
export class ActionItems {
  searchQuery = signal('');
  activeFilter = signal<'all' | 'open' | 'completed'>('all');

  items = signal<ActionItem[]>([
    {
      id: '1',
      description: 'Prepare the updated project timeline',
      owner: 'John Doe',
      dueDate: '2026-11-28',
      completed: false,
      meetingTitle: 'Weekly Project Stand-up',
    },
    {
      id: '2',
      description: 'Send the revised budget proposal to the client',
      owner: 'Jane Smith',
      dueDate: '2026-11-27',
      completed: false,
      meetingTitle: 'Client Budget Review',
    },
    {
      id: '3',
      description: 'Schedule the next sprint planning session',
      owner: 'John Doe',
      dueDate: '2026-11-30',
      completed: true,
      meetingTitle: 'Development Team Meeting',
    },
    {
      id: '4',
      description: 'Review feedback from the design team',
      owner: 'Michael',
      dueDate: '2026-11-26',
      completed: false,
      meetingTitle: 'Design Review',
    },
    {
      id: '5',
      description: 'Update documentation for the new API',
      owner: 'Sarah',
      dueDate: '2026-12-02',
      completed: true,
      meetingTitle: 'Technical Discussion',
    },
    {
      id: '6',
      description: 'Confirm requirements with stakeholders',
      owner: 'Jane Smith',
      dueDate: '2026-11-29',
      completed: false,
      meetingTitle: 'Product Planning',
    },
    {
      id: '7',
      description: 'Share meeting notes with the team',
      owner: 'Michael',
      dueDate: null,
      completed: false,
      meetingTitle: 'Weekly Project Stand-up',
    },
    {
      id: '8',
      description: 'Finalise the onboarding documentation',
      owner: 'Sarah',
      dueDate: '2026-11-25',
      completed: true,
      meetingTitle: 'Onboarding Improvements',
    },
  ]);

  totalCount = computed(() => this.items().length);

  completedCount = computed(
    () => this.items().filter(item => item.completed).length
  );

  openCount = computed(
    () => this.items().filter(item => !item.completed).length
  );

  progressPercentage = computed(() => {
    const total = this.totalCount();

    if (total === 0) return 0;

    return Math.round((this.completedCount() / total) * 100);
  });

  filteredItems = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();

    return this.items().filter(item => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'open' && !item.completed) ||
        (filter === 'completed' && item.completed);

      const matchesSearch =
        !query ||
        item.description.toLowerCase().includes(query) ||
        (item.owner?.toLowerCase().includes(query) ?? false) ||
        item.meetingTitle.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onFilterChange(filter: 'all' | 'open' | 'completed'): void {
    this.activeFilter.set(filter);
  }

  onItemCompleted(event: { id: string; completed: boolean }): void {
    this.items.update(items =>
      items.map(item =>
        item.id === event.id
          ? { ...item, completed: event.completed }
          : item
      )
    );
  }

  deleteItem(id: string): void {
    this.items.update(items => items.filter(item => item.id !== id));
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.activeFilter.set('all');
  }

  formatDate(date: string | null): string {
    if (!date) return 'No due date';

    const parsed = new Date(`${date}T00:00:00`);

    return parsed.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}