import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardStats } from './dashboard-stats';

describe('DashboardStats', () => {
  let component: DashboardStats;
  let fixture: ComponentFixture<DashboardStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStats],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardStats);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default statistics', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Total Meetings');
    expect(text).toContain('Action Items');
    expect(text).toContain('Completed Tasks');
    expect(text).toContain('Hours Saved');
  });

  it('should display the default metric values', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('24');
    expect(text).toContain('38');
    expect(text).toContain('29');
    expect(text).toContain('12.5');
  });

  it('should render four statistic cards by default', () => {
    const cards = fixture.nativeElement.querySelectorAll('.stat-card');

    expect(cards.length).toBe(4);
  });

  it('should accept custom statistics', () => {
    fixture.componentRef.setInput('stats', [
      {
        label: 'My Meetings',
        value: 10,
        description: 'This month',
        icon: 'M',
      },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('My Meetings');
    expect(fixture.nativeElement.textContent).toContain('This month');
  });

  it('should not render decorative icons or upward arrows', () => {
    expect(fixture.nativeElement.querySelector('.stat-card__icon')).toBeNull();
    expect(fixture.nativeElement.querySelector('.stat-card__trend')).toBeNull();
  });

  it('should keep descriptions without downward arrows', () => {
    fixture.componentRef.setInput('stats', [
      {
        label: 'Overdue',
        value: 3,
        description: 'Tasks overdue',
        icon: '!',
        trend: 'down',
      },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.stat-card__trend')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Tasks overdue');
  });

  it('should display an empty state when there are no statistics', () => {
    fixture.componentRef.setInput('stats', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.dashboard-stats__empty')).toBeTruthy();
  });
});
