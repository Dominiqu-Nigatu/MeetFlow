import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentMeetings } from './recent-meetings';

describe('RecentMeetings', () => {
  let component: RecentMeetings;
  let fixture: ComponentFixture<RecentMeetings>;

  const mockMeetings = [
    {
      id: 'meeting-1',
      title: 'Project Planning',
      date: '24 November 2026',
      duration: '45 minutes',
      summaryStatus: 'completed' as const,
      actionItemCount: 3,
    },
    {
      id: 'meeting-2',
      title: 'Sprint Review',
      date: '23 November 2026',
      duration: '30 minutes',
      summaryStatus: 'processing' as const,
      actionItemCount: 5,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentMeetings],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentMeetings);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the section heading', () => {
    expect(fixture.nativeElement.textContent).toContain('Recent Meetings');
  });

  it('should display the section subtitle', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Your latest recorded meetings and summaries',
    );
  });

  it('should display the empty state when there are no meetings', () => {
    expect(fixture.nativeElement.querySelector('.recent-meetings__empty')).toBeTruthy();
  });

  it('should display meeting cards when meetings are provided', () => {
    fixture.componentRef.setInput('meetings', mockMeetings);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-meeting-card');

    expect(cards.length).toBe(2);
  });

  it('should display the meeting titles', () => {
    fixture.componentRef.setInput('meetings', mockMeetings);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Project Planning');
    expect(text).toContain('Sprint Review');
  });

  it('should emit the selected meeting id', () => {
    fixture.componentRef.setInput('meetings', mockMeetings);
    fixture.detectChanges();

    const spy = vi.fn();
    component.meetingSelected.subscribe(spy);

    component.onMeetingSelected('meeting-1');

    expect(spy).toHaveBeenCalledWith('meeting-1');
  });

  it('should emit when View all is clicked', () => {
    const spy = vi.fn();
    component.viewAllClicked.subscribe(spy);

    fixture.nativeElement.querySelector('.recent-meetings__view-all').click();

    expect(spy).toHaveBeenCalled();
  });
});
