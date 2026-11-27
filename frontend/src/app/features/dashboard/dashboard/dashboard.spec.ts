import { TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { provideRouter } from '@angular/router';

describe('Dashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the dashboard', () => {
    const fixture = TestBed.createComponent(Dashboard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialise the user name', () => {
    const fixture = TestBed.createComponent(Dashboard);
    expect(fixture.componentInstance.userName()).toBe('John');
  });

  it('should initialise four stats', () => {
    const fixture = TestBed.createComponent(Dashboard);
    expect(fixture.componentInstance.stats().length).toBe(4);
  });

  it('should initialise four meetings', () => {
    const fixture = TestBed.createComponent(Dashboard);
    expect(fixture.componentInstance.meetings().length).toBe(4);
  });

  it('should initialise four action items', () => {
    const fixture = TestBed.createComponent(Dashboard);
    expect(fixture.componentInstance.actionItems().length).toBe(4);
  });

  it('should mark an action item as completed', () => {
    const fixture = TestBed.createComponent(Dashboard);

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: true,
    });

    const item = fixture.componentInstance.actionItems().find((item) => item.id === '1');

    expect(item?.completed).toBe(true);
  });

  it('should mark an action item as incomplete', () => {
    const fixture = TestBed.createComponent(Dashboard);

    fixture.componentInstance.actionItems.update((items) =>
      items.map((item) => (item.id === '1' ? { ...item, completed: true } : item)),
    );

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: false,
    });

    const item = fixture.componentInstance.actionItems().find((item) => item.id === '1');

    expect(item?.completed).toBe(false);
  });

  it('should not change other action items when updating one', () => {
    const fixture = TestBed.createComponent(Dashboard);
    const originalSecondItem = fixture.componentInstance.actionItems()[1];

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: true,
    });

    expect(fixture.componentInstance.actionItems()[1]).toEqual(originalSecondItem);
  });

  it('should not render the removed welcome banner', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.welcome-section')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Good to see you');
  });

  it('should render the dashboard stats', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-dashboard-stats')).toBeTruthy();
  });

  it('should render the recent meetings section', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('#recent-meetings-panel .activity-list'),
    ).toBeTruthy();
  });

  it('should render the action items section', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#action-items-panel .activity-list')).toBeTruthy();
  });

  it('should render the meeting upload section', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-meeting-upload-panel')).toBeTruthy();
  });

  it('should not render the removed productivity card', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.productivity-card')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Make every meeting count.');
  });
  it('should place upload in the wide column and activity in the side column', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.dashboard-main-column app-meeting-upload-panel'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.activity-card #recent-meetings-panel'),
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.activity-card #action-items-panel')).toBeTruthy();
  });

  it('should switch activity tabs without losing completed tasks', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const page = fixture.nativeElement;
    expect(page.querySelector('#recent-meetings-panel').hidden).toBe(false);
    expect(page.querySelector('#action-items-panel').hidden).toBe(true);
    page.querySelector('#action-items-tab').click();
    fixture.detectChanges();
    expect(page.querySelector('#recent-meetings-panel').hidden).toBe(true);
    expect(page.querySelector('#action-items-panel').hidden).toBe(false);
    fixture.componentInstance.onActionItemCompleted({ id: '1', completed: true });
    page.querySelector('#recent-meetings-tab').click();
    page.querySelector('#action-items-tab').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.actionItems()[0].completed).toBe(true);
  });

  it('should support keyboard navigation between tabs', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('#recent-meetings-tab')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab()).toBe('actions');
    expect(
      fixture.nativeElement.querySelector('#action-items-tab').getAttribute('aria-selected'),
    ).toBe('true');
  });
  it('should show only titles and arrows in compact activity rows', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const page = fixture.nativeElement;
    expect(page.querySelector('#recent-meetings-panel .activity-link').getAttribute('href')).toBe(
      '/meetings/1',
    );
    expect(page.querySelector('#action-items-panel .activity-link').getAttribute('href')).toBe(
      '/action-items',
    );
    expect(page.querySelector('.activity-card .activity-tabs')).toBeTruthy();
    expect(page.querySelector('.activity-card').textContent).not.toContain('45 min');
    expect(page.querySelector('.activity-card').textContent).not.toContain('John Doe');
    expect(page.querySelector('.activity-card .filter-bar')).toBeNull();
    expect(page.querySelectorAll('#recent-meetings-panel .activity-link').length).toBe(4);
  });
});
