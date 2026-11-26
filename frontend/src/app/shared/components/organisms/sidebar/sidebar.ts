import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  collapsed = input(false);

  navigationItems = input<SidebarItem[]>([
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '⌂',
    },
    {
      label: 'Meetings',
      path: '/meetings',
      icon: '▤',
    },
    {
      label: 'Action Items',
      path: '/action-items',
      icon: '☑',
    },
  ]);

  settingsPath = '/settings';

  navigationSelected = output<SidebarItem>();
  closeRequested = output<void>();

  onNavigationSelected(item: SidebarItem): void {
    this.navigationSelected.emit(item);
  }

  onClose(): void {
    this.closeRequested.emit();
  }
}