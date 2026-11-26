import { Component, computed, input, output, signal } from '@angular/core';
import { ActionItemRow } from '../../molecules/action-item-row/action-item-row';

export interface PanelActionItem {
  id: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  completed: boolean;
}

@Component({
  selector: 'app-action-items-panel',
  standalone: true,
  imports: [ActionItemRow],
  templateUrl: './action-items-panel.html',
  styleUrl: './action-items-panel.scss',
})
export class ActionItemsPanel {
  items = input<PanelActionItem[]>([]);

  itemCompleted = output<{ id: string; completed: boolean }>();
  viewAllClicked = output<void>();

  activeFilter = signal<'all' | 'open' | 'completed'>('all');

  filteredItems = computed(() => {
    const items = this.items();
    const filter = this.activeFilter();

    if (filter === 'open') {
      return items.filter(item => !item.completed);
    }

    if (filter === 'completed') {
      return items.filter(item => item.completed);
    }

    return items;
  });

  openCount = computed(
    () => this.items().filter(item => !item.completed).length
  );

  onFilterChange(filter: 'all' | 'open' | 'completed'): void {
    this.activeFilter.set(filter);
  }

  onItemCompleted(event: { id: string; completed: boolean }): void {
    this.itemCompleted.emit(event);
  }

  onViewAll(): void {
    this.viewAllClicked.emit();
  }
}