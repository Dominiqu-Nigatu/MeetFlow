import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MeetingList } from './meeting-list';

describe('MeetingList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingList],
      providers: [provideRouter([])],
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

  it('should not render duplicate search or summary controls', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeNull();
    expect(fixture.nativeElement.querySelector('.meeting-overview')).toBeNull();
    expect(fixture.nativeElement.querySelector('.filter-tabs')).toBeNull();
  });

  it('should render the new meeting button', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('New meeting');
  });
  it('should restore all meetings after clearing the shared topbar search', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.componentInstance.onSearch('frontend');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-meeting-card').length).toBe(1);
    fixture.componentInstance.onSearch('');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-meeting-card').length).toBe(8);
  });
  it('should open the dashboard upload component in a modal from New meeting', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog');
    const showModal = vi.fn(() => dialog.setAttribute('open', ''));
    Object.defineProperty(dialog, 'showModal', { value: showModal, configurable: true });
    fixture.nativeElement.querySelector('.upload-button').click();
    fixture.detectChanges();
    expect(showModal).toHaveBeenCalled();
    expect(dialog.querySelector('app-meeting-upload-panel')).toBeTruthy();
    expect(dialog.textContent).toContain('Upload a meeting transcript');
  });

  it('should close and reset the upload form', () => {
    const fixture = TestBed.createComponent(MeetingList);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog');
    Object.defineProperty(dialog, 'showModal', { value: vi.fn(), configurable: true });
    const close = vi.fn();
    Object.defineProperty(dialog, 'close', { value: close, configurable: true });
    fixture.componentInstance.onUploadMeeting();
    fixture.detectChanges();
    dialog.querySelector('.upload-dialog__close').click();
    fixture.detectChanges();
    expect(close).toHaveBeenCalled();
    expect(fixture.componentInstance.uploadOpen()).toBe(false);
    expect(dialog.querySelector('app-meeting-upload-panel')).toBeNull();
  });
});
