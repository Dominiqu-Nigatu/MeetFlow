import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionItems } from './action-items';

describe('ActionItems', () => {
  let component: ActionItems;
  let fixture: ComponentFixture<ActionItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionItems],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with 8 tasks', () => {
    expect(component.totalCount()).toBe(8);
  });

  it('should initialise with 5 outstanding tasks', () => {
    expect(component.openCount()).toBe(5);
  });

  it('should initialise with 3 completed tasks', () => {
    expect(component.completedCount()).toBe(3);
  });

  it('should calculate the completion percentage', () => {
    expect(component.progressPercentage()).toBe(38);
  });

  it('should initialise with all filter selected', () => {
    expect(component.activeFilter()).toBe('all');
  });

  it('should change filter to open', () => {
    component.onFilterChange('open');

    expect(component.activeFilter()).toBe('open');
  });

  it('should change filter to completed', () => {
    component.onFilterChange('completed');

    expect(component.activeFilter()).toBe('completed');
  });

  it('should show all tasks by default', () => {
    expect(component.filteredItems().length).toBe(8);
  });

  it('should filter outstanding tasks', () => {
    component.onFilterChange('open');

    expect(component.filteredItems().length).toBe(5);
    expect(component.filteredItems().every((item) => !item.completed)).toBe(true);
  });

  it('should filter completed tasks', () => {
    component.onFilterChange('completed');

    expect(component.filteredItems().length).toBe(3);
    expect(component.filteredItems().every((item) => item.completed)).toBe(true);
  });

  it('should search tasks by description', () => {
    component.onSearchChange('budget');

    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].description).toContain('budget proposal');
  });

  it('should search tasks by owner', () => {
    component.onSearchChange('Michael');

    expect(component.filteredItems().length).toBe(2);
  });

  it('should search tasks by meeting title', () => {
    component.onSearchChange('Weekly Project Stand-up');

    expect(component.filteredItems().length).toBe(2);
  });

  it('should search case-insensitively', () => {
    component.onSearchChange('BUDGET');

    expect(component.filteredItems().length).toBe(1);
  });

  it('should combine search and filter', () => {
    component.onSearchChange('Jane');
    component.onFilterChange('open');

    expect(component.filteredItems().length).toBe(2);
  });

  it('should complete a task', () => {
    component.onItemCompleted({
      id: '1',
      completed: true,
    });

    expect(component.items().find((item) => item.id === '1')?.completed).toBe(true);
  });

  it('should reopen a completed task', () => {
    component.onItemCompleted({
      id: '3',
      completed: false,
    });

    expect(component.items().find((item) => item.id === '3')?.completed).toBe(false);
  });

  it('should update counts when completing a task', () => {
    component.onItemCompleted({
      id: '1',
      completed: true,
    });

    expect(component.completedCount()).toBe(4);
    expect(component.openCount()).toBe(4);
  });

  it('should update progress when completing a task', () => {
    component.onItemCompleted({
      id: '1',
      completed: true,
    });

    expect(component.progressPercentage()).toBe(50);
  });

  it('should delete a task', () => {
    component.deleteItem('1');

    expect(component.totalCount()).toBe(7);
    expect(component.items().some((item) => item.id === '1')).toBe(false);
  });

  it('should update counts after deleting an open task', () => {
    component.deleteItem('1');

    expect(component.openCount()).toBe(4);
    expect(component.completedCount()).toBe(3);
  });

  it('should update counts after deleting a completed task', () => {
    component.deleteItem('3');

    expect(component.openCount()).toBe(5);
    expect(component.completedCount()).toBe(2);
  });

  it('should clear search and filters', () => {
    component.onSearchChange('budget');
    component.onFilterChange('completed');

    component.clearSearch();

    expect(component.searchQuery()).toBe('');
    expect(component.activeFilter()).toBe('all');
  });

  it('should format a date', () => {
    expect(component.formatDate('2026-11-25')).toBe('25 Nov 2026');
  });

  it('should handle null due dates', () => {
    expect(component.formatDate(null)).toBe('No due date');
  });

  it('should render the action items heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Action items');
  });

  it('should render the progress section', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Your progress');
  });

  it('should render the task list', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('All tasks');
    expect(compiled.textContent).toContain('Weekly Project Stand-up');
  });

  it('should render the search input', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#action-item-search')).toBeTruthy();
  });

  it('should render the task filters', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('All');
    expect(compiled.textContent).toContain('Open');
    expect(compiled.textContent).toContain('Completed');
  });
});
