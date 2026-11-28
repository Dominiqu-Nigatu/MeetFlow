import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Dashboard } from './dashboard';
import { LocalMeetings } from '../../../core/services/local-meetings';
describe('Dashboard', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: LocalMeetings,
          useValue: { uploads: signal([]), loaded: signal(true), loadError: signal('') },
        },
      ],
    }).compileComponents();
  });
  afterEach(() => localStorage.clear());
  it('derives totals and activity from the shared workspace', () => {
    const fixture = TestBed.createComponent(Dashboard);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.stats()[0].value).toBe(component.store.meetings().length);
    const before = component.stats()[1].value as number;
    component.store.addAction('1', {
      description: 'New task',
      owner: null,
      dueDate: null,
      status: 'todo',
    });
    expect(component.stats()[1].value).toBe(before + 1);
    expect(fixture.nativeElement.querySelector('.welcome-section')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.dashboard-main-column app-meeting-upload-panel'),
    ).toBeTruthy();
  });
  it('labels sample meetings and shows compact activity without icons or owner metadata', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#recent-meetings-panel').textContent).toContain(
      '(Sample)',
    );
    expect(fixture.nativeElement.querySelector('.activity-arrow')).toBeNull();
    expect(fixture.nativeElement.querySelector('.activity-card').textContent).not.toContain(
      'John Doe',
    );
  });
  it('supports keyboard tab navigation and retains shared action changes', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('#recent-meetings-tab')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab()).toBe('actions');
    expect(fixture.nativeElement.querySelector('#action-items-panel').hidden).toBe(false);
    fixture.componentInstance.onActionItemCompleted({ id: 'sample-action-1', completed: true });
    expect(fixture.componentInstance.store.notes('1').actions[0].completed).toBe(true);
  });
});
