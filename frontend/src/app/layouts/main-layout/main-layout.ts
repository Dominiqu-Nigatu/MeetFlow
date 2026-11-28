import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ActionSearch } from '../../core/services/action-search';
import { MeetingSearch } from '../../core/services/meeting-search';
import { Sidebar } from '../../shared/components/organisms/sidebar/sidebar';
import { Navbar } from '../../shared/components/organisms/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  readonly meetingSearch = inject(MeetingSearch);
  readonly actionSearch = inject(ActionSearch);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);
  pageTitle = signal('Dashboard');

  constructor(router: Router) {
    this.updatePageTitle(router.url);
    router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.updatePageTitle(event.urlAfterRedirects));
  }

  private searchReturnUrl: string | null = null;

  onMeetingSearch(query: string): void {
    const value = query.trim();
    if (this.router.url.split(/[?#]/, 1)[0] === '/action-items') {
      this.actionSearch.query.set(value);
      return;
    }
    this.meetingSearch.query.set(value);

    if (!value) {
      const returnUrl = this.searchReturnUrl;
      this.searchReturnUrl = null;
      if (returnUrl && this.router.url.split(/[?#]/, 1)[0] === '/meetings') {
        void this.router.navigateByUrl(returnUrl);
      }
      return;
    }

    if (this.router.url.split(/[?#]/, 1)[0] !== '/meetings') {
      this.searchReturnUrl ??= this.router.url;
      void this.router.navigate(['/meetings']);
    }
  }

  openAccount(): void {
    void this.router.navigate(['/account']);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  openMobileSidebar(): void {
    this.mobileSidebarOpen.set(true);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  onMenuClicked(): void {
    if (window.innerWidth <= 768) {
      this.sidebarCollapsed.set(false);
      this.mobileSidebarOpen.set(true);
      return;
    }

    this.toggleSidebar();
  }

  onNavigationSelected(item: { label: string; path: string }): void {
    this.pageTitle.set(item.label);
    this.closeMobileSidebar();
  }

  private updatePageTitle(url: string): void {
    const path = url.split(/[?#]/, 1)[0];
    const title =
      path === '/account'
        ? 'Account'
        : path === '/action-items'
          ? 'Action Items'
          : path === '/meetings'
            ? 'Meetings'
            : path === '/meetings/upload'
              ? 'Upload Meeting'
              : path.startsWith('/meetings/')
                ? 'Meeting Details'
                : 'Dashboard';

    this.pageTitle.set(title);
  }
}
