
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the main layout', () => {
    const fixture = TestBed.createComponent(MainLayout);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have the sidebar expanded initially', () => {
    const fixture = TestBed.createComponent(MainLayout);
    expect(fixture.componentInstance.sidebarCollapsed()).toBe(false);
  });

  it('should have the mobile sidebar closed initially', () => {
    const fixture = TestBed.createComponent(MainLayout);
    expect(fixture.componentInstance.mobileSidebarOpen()).toBe(false);
  });

  it('should have Dashboard as the initial page title', () => {
    const fixture = TestBed.createComponent(MainLayout);
    expect(fixture.componentInstance.pageTitle()).toBe('Dashboard');
  });

  it('should collapse the sidebar when toggled', () => {
    const fixture = TestBed.createComponent(MainLayout);

    fixture.componentInstance.toggleSidebar();

    expect(fixture.componentInstance.sidebarCollapsed()).toBe(true);
  });

  it('should expand the sidebar when toggled twice', () => {
    const fixture = TestBed.createComponent(MainLayout);

    fixture.componentInstance.toggleSidebar();
    fixture.componentInstance.toggleSidebar();

    expect(fixture.componentInstance.sidebarCollapsed()).toBe(false);
  });

  it('should open the mobile sidebar', () => {
    const fixture = TestBed.createComponent(MainLayout);

    fixture.componentInstance.openMobileSidebar();

    expect(fixture.componentInstance.mobileSidebarOpen()).toBe(true);
  });

  it('should close the mobile sidebar', () => {
    const fixture = TestBed.createComponent(MainLayout);

    fixture.componentInstance.openMobileSidebar();
    fixture.componentInstance.closeMobileSidebar();

    expect(fixture.componentInstance.mobileSidebarOpen()).toBe(false);
  });

  it('should update the page title when navigating', () => {
    const fixture = TestBed.createComponent(MainLayout);

    fixture.componentInstance.onNavigationSelected({
      label: 'Meetings',
      path: '/meetings',
    });

    expect(fixture.componentInstance.pageTitle()).toBe('Meetings');
  });

  it('should close the mobile sidebar after navigation', () => {
    const fixture = TestBed.createComponent(MainLayout);

    fixture.componentInstance.openMobileSidebar();
    fixture.componentInstance.onNavigationSelected({
      label: 'Meetings',
      path: '/meetings',
    });

    expect(fixture.componentInstance.mobileSidebarOpen()).toBe(false);
  });

  it('should toggle the sidebar on desktop when the menu is clicked', () => {
    const fixture = TestBed.createComponent(MainLayout);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });

    fixture.componentInstance.onMenuClicked();

    expect(fixture.componentInstance.sidebarCollapsed()).toBe(true);
    expect(fixture.componentInstance.mobileSidebarOpen()).toBe(false);
  });

  it('should toggle the collapsed state when menu is clicked again', () => {
    const fixture = TestBed.createComponent(MainLayout);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });

    fixture.componentInstance.onMenuClicked();
    fixture.componentInstance.onMenuClicked();

    expect(fixture.componentInstance.sidebarCollapsed()).toBe(false);
  });

  it('should open the full sidebar on mobile when the menu is clicked', () => {
    const fixture = TestBed.createComponent(MainLayout);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });

    fixture.componentInstance.sidebarCollapsed.set(true);
    fixture.componentInstance.onMenuClicked();

    expect(fixture.componentInstance.sidebarCollapsed()).toBe(false);
    expect(fixture.componentInstance.mobileSidebarOpen()).toBe(true);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
  });

  it('should render the sidebar', () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-sidebar')).toBeTruthy();
  });

  it('should render the navbar', () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-navbar')).toBeTruthy();
  });

  it('should render the router outlet', () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
