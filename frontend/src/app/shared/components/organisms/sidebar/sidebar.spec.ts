import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the MeetFlow brand', () => {
    expect(fixture.nativeElement.textContent).toContain('MeetFlow');
  });

  it('should not display the removed footer branding', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Meeting productivity');
    expect(fixture.nativeElement.querySelector('.sidebar__footer')).toBeNull();
  });

  it('should display the default navigation items', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Dashboard');
    expect(text).toContain('Meetings');
    expect(text).toContain('Action Items');
    expect(fixture.nativeElement.querySelector('a[href="/account"]')).toBeTruthy();
  });

  it('should not display Settings', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Settings');
  });

  it('should accept custom navigation items', () => {
    fixture.componentRef.setInput('navigationItems', [{ label: 'Reports', path: '/reports' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Reports');
    expect(fixture.nativeElement.textContent).not.toContain('Dashboard');
  });

  it('should apply the collapsed class', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.sidebar').classList.contains('sidebar--collapsed'),
    ).toBe(true);
  });

  it('should render text-only navigation even when compact', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;
    expect(Array.from(links, (link) => link.textContent?.trim())).toEqual([
      'Dashboard',
      'Meetings',
      'Action Items',
      'Account',
    ]);
    expect(fixture.nativeElement.querySelector('.sidebar__link-icon')).toBeNull();
  });

  it('should emit when a navigation item is selected', () => {
    const spy = vi.fn();
    component.navigationSelected.subscribe(spy);

    const item = component.navigationItems()[0];
    component.onNavigationSelected(item);

    expect(spy).toHaveBeenCalledWith(item);
  });

  it('should emit when close is requested', () => {
    const spy = vi.fn();
    component.closeRequested.subscribe(spy);

    component.onClose();

    expect(spy).toHaveBeenCalled();
  });
  it('should return to login and close the sidebar when Logout is clicked', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const close = vi.fn();
    component.closeRequested.subscribe(close);
    fixture.nativeElement.querySelector('.sidebar__logout').click();
    expect(navigate).toHaveBeenCalledWith(['/login']);
    expect(close).toHaveBeenCalled();
  });

  it('should keep Logout available when compact', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sidebar__logout').textContent.trim()).toBe(
      'Logout',
    );
  });
  it('guards repeat Logout clicks and handles navigation rejection', async () => {
    let reject!: (reason: Error) => void;
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockReturnValue(new Promise<boolean>((_, fail) => (reject = fail)));
    const first = component.onLogout();
    await component.onLogout();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sidebar__logout').disabled).toBe(true);
    expect(navigate).toHaveBeenCalledTimes(1);
    reject(new Error('offline'));
    await first;
    fixture.detectChanges();
    expect(component.loggingOut()).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Could not open sign in',
    );
  });
});
