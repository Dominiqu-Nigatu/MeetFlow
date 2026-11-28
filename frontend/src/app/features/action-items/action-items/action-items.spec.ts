import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ActionItems } from './action-items';
import { LocalMeetings } from '../../../core/services/local-meetings';
import { ActionSearch } from '../../../core/services/action-search';
describe('ActionItems shared workflow', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ActionItems],
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
  it('renders no duplicate search, icons, progress panel, task crosses or owner/date display labels', () => {
    const fixture = TestBed.createComponent(ActionItems);
    fixture.detectChanges();
    const page = fixture.nativeElement;
    expect(page.querySelector('input[type="search"]')).toBeNull();
    expect(page.querySelector('[role="progressbar"]')).toBeNull();
    expect(page.textContent).not.toContain('×');
    expect(page.textContent).not.toContain('Assigned to');
    expect(page.querySelector('.task-meta').textContent).toContain('(Sample)');
    expect(page.querySelector('.overview-grid p')).toBeNull();
  });
  it('combines topbar search with status, owner and overdue filters', () => {
    const component = TestBed.createComponent(ActionItems).componentInstance;
    TestBed.inject(ActionSearch).query.set('design');
    component.statusFilter.set('in progress');
    component.ownerFilter.set('Sarah');
    component.overdueOnly.set(true);
    expect(component.filteredItems()).toHaveLength(1);
    component.ownerFilter.set('John Doe');
    expect(component.filteredItems()).toHaveLength(0);
    component.clearSearch();
    expect(component.filteredItems()).toHaveLength(component.totalCount());
  });
  it('updates counts immediately when another view changes a task', () => {
    const component = TestBed.createComponent(ActionItems).componentInstance;
    const action = component.items().find((a) => !a.completed)!;
    const completed = component.completedCount();
    component.store.completeAction(action.meetingId, action.id, true);
    expect(component.completedCount()).toBe(completed + 1);
  });
});
