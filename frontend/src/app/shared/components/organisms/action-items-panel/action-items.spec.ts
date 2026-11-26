import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionItemsPanel } from './action-items-panel';

describe('ActionItemsPanel', () => {
  let component: ActionItemsPanel;
  let fixture: ComponentFixture<ActionItemsPanel>;

  const mockItems = [
    {
      id: '1',
      description: 'Prepare project proposal',
      owner: 'John',
      dueDate: '2026-12-01',
      completed: false,
    },
    {
      id: '2',
      description: 'Send meeting notes',
      owner: 'Jane',
      dueDate: null,
      completed: true,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionItemsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionItemsPanel);
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all action items by default', () => {
    expect(component.filteredItems().length).toBe(2);
  });

  it('should count open action items', () => {
    expect(component.openCount()).toBe(1);
  });

  it('should filter open items', () => {
    component.onFilterChange('open');

    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].id).toBe('1');
  });

  it('should filter completed items', () => {
    component.onFilterChange('completed');

    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].id).toBe('2');
  });

  it('should restore all items when all filter is selected', () => {
    component.onFilterChange('open');
    component.onFilterChange('all');

    expect(component.filteredItems().length).toBe(2);
  });

  it('should emit when an item completion changes', () => {
    const spy = vi.spyOn(component.itemCompleted, 'emit');

    component.onItemCompleted({
      id: '1',
      completed: true,
    });

    expect(spy).toHaveBeenCalledWith({
      id: '1',
      completed: true,
    });
  });

  it('should emit when view all is clicked', () => {
    const spy = vi.spyOn(component.viewAllClicked, 'emit');

    component.onViewAll();

    expect(spy).toHaveBeenCalled();
  });

  it('should display an empty state when there are no items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.empty-state')
    ).toBeTruthy();
  });
});