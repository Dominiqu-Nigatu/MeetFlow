import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly router = inject(Router);
  collapsed = input(false);
  loggingOut = signal(false);
  logoutError = signal('');

  navigationItems = input<SidebarItem[]>([
    {
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      label: 'Meetings',
      path: '/meetings',
    },
    {
      label: 'Action Items',
      path: '/action-items',
    },
    { label: 'Account', path: '/account' },
  ]);

  navigationSelected = output<SidebarItem>();
  closeRequested = output<void>();

  onNavigationSelected(item: SidebarItem): void {
    this.navigationSelected.emit(item);
  }

  async onLogout(): Promise<void> {
    if (this.loggingOut()) return;
    this.loggingOut.set(true);
    this.logoutError.set('');
    this.closeRequested.emit();
    try {
      if (!(await this.router.navigate(['/login']))) {
        this.logoutError.set('Could not open sign in. Please try again.');
      }
    } catch {
      this.logoutError.set('Could not open sign in. Please try again.');
    } finally {
      this.loggingOut.set(false);
    }
  }

  onClose(): void {
    this.closeRequested.emit();
  }
}
