import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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

  it('should display the default navigation items', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Dashboard');
    expect(text).toContain('Meetings');
    expect(text).toContain('Action Items');
  });

  it('should display Settings', () => {
    expect(fixture.nativeElement.textContent).toContain('Settings');
  });

  it('should accept custom navigation items', () => {
    fixture.componentRef.setInput('navigationItems', [
      { label: 'Reports', path: '/reports', icon: '▧' },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Reports');
    expect(fixture.nativeElement.textContent).not.toContain('Dashboard');
  });

  it('should apply the collapsed class', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.sidebar')
        .classList.contains('sidebar--collapsed'),
    ).toBe(true);
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
});