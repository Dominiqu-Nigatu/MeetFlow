import { TestBed } from '@angular/core/testing';
import { MeetingList } from './meeting-list';

describe('MeetingList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingList],
    }).compileComponents();
  });

  it('should create the meetings page', () => {
    const fixture = TestBed.createComponent(MeetingList);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialise eight meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);
    expect(fixture.componentInstance.meetings().length).toBe(8);
  });

  it('should initially show all meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);
    expect(fixture.componentInstance.filteredMeetings().length).toBe(8);
  });

  it('should count completed meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);
    expect(fixture.componentInstance.completedCount()).toBe(4);
  });

  it('should count processing meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);
    expect(fixture.componentInstance.processingCount()).toBe(2);
  });

  it('should count pending meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);
    expect(fixture.componentInstance.pendingCount()).toBe(2);
  });

  it('should filter completed meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onFilterChange('completed');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(4);
    expect(
      fixture.componentInstance
        .filteredMeetings()
        .every((meeting) => meeting.summaryStatus === 'completed'),
    ).toBe(true);
  });

  it('should filter processing meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onFilterChange('processing');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(2);
    expect(
      fixture.componentInstance
        .filteredMeetings()
        .every((meeting) => meeting.summaryStatus === 'processing'),
    ).toBe(true);
  });

  it('should filter pending meetings', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onFilterChange('pending');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(2);
    expect(
      fixture.componentInstance
        .filteredMeetings()
        .every((meeting) => meeting.summaryStatus === 'pending'),
    ).toBe(true);
  });

  it('should return all meetings when the filter is reset', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onFilterChange('completed');
    fixture.componentInstance.onFilterChange('all');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(8);
  });

  it('should search meetings by title', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onSearch('Product Strategy');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(1);
    expect(fixture.componentInstance.filteredMeetings()[0].title).toBe('Product Strategy Meeting');
  });

  it('should search case-insensitively', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onSearch('frontend');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(1);
  });

  it('should return no meetings for an unmatched search', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onSearch('Something nonexistent');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(0);
  });

  it('should combine search and status filtering', () => {
    const fixture = TestBed.createComponent(MeetingList);

    fixture.componentInstance.onSearch('review');
    fixture.componentInstance.onFilterChange('completed');

    expect(fixture.componentInstance.filteredMeetings().length).toBe(1);
    expect(fixture.componentInstance.filteredMeetings()[0].title).toBe('Design Review');
  });

  it('should render the page heading', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Meetings');
  });

  it('should render the meeting cards', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-meeting-card').length).toBe(8);
  });

  it('should render the filter buttons', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Completed');
    expect(fixture.nativeElement.textContent).toContain('Processing');
    expect(fixture.nativeElement.textContent).toContain('Pending');
  });

  it('should render the search bar', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeTruthy();
  });

  it('should render the new meeting button', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('New meeting');
  });
});
