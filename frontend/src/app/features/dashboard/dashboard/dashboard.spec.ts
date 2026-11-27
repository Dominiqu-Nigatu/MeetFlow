import { TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
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

    const item = fixture.componentInstance.actionItems().find(item => item.id === '1');

    expect(item?.completed).toBe(true);
  });

  it('should mark an action item as incomplete', () => {
    const fixture = TestBed.createComponent(Dashboard);

    fixture.componentInstance.actionItems.update(items =>
      items.map(item =>
        item.id === '1' ? { ...item, completed: true } : item,
      ),
    );

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: false,
    });

    const item = fixture.componentInstance.actionItems().find(item => item.id === '1');

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

  it('should render the welcome section', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Good to see you');
  });

  it('should render the dashboard stats', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-dashboard-stats')).toBeTruthy();
  });

  it('should render the recent meetings section', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-recent-meetings')).toBeTruthy();
  });

  it('should render the action items section', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-action-items-panel')).toBeTruthy();
  });

  it('should render the meeting upload section', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-meeting-upload-panel')).toBeTruthy();
  });

  it('should render the productivity card', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Make every meeting count.');
  });
});