import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { signal } from '@angular/core';
import { MeetingDetail } from './meeting-detail';
import { LocalMeetings } from '../../../core/services/local-meetings';
describe('MeetingDetail', () => {
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  beforeEach(async () => {
    localStorage.clear();
    params = new BehaviorSubject(convertToParamMap({ id: 'local-test' }));
    await TestBed.configureTestingModule({
      imports: [MeetingDetail],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: params } },
        {
          provide: LocalMeetings,
          useValue: {
            uploads: signal([
              {
                id: 'local-test',
                title: 'Real meeting',
                transcript: 'Original words',
                createdAt: '2026-11-28',
                fileName: 'notes.txt',
              },
            ]),
            loaded: signal(true),
            loadError: signal(''),
          },
        },
      ],
    }).compileComponents();
  });
  afterEach(() => localStorage.clear());
  it('renders real uploaded content with no borrowed results', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Real meeting');
    expect(fixture.nativeElement.textContent).toContain('Original words');
    expect(fixture.nativeElement.textContent).toContain('No summary yet.');
    expect(fixture.nativeElement.textContent).not.toContain('John Doe');
  });
  it('shows not found instead of sample data for unknown ids', () => {
    params.next(convertToParamMap({ id: 'missing' }));
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Meeting not found');
    expect(fixture.nativeElement.querySelector('pre')).toBeNull();
  });
  it('edits, saves and cancels notes and decisions', () => {
    const component = TestBed.createComponent(MeetingDetail).componentInstance;
    component.startEdit('summary');
    component.summaryDraft = 'New summary';
    component.saveNotes(new Event('submit'));
    expect(component.notes().summary).toBe('New summary');
    component.startEdit('summary');
    component.summaryDraft = 'Cancelled';
    component.editing.set(null);
    expect(component.notes().summary).toBe('New summary');
    component.startEdit('decisions');
    component.decisionsDraft = 'Decision one\nDecision two';
    component.saveNotes(new Event('submit'));
    expect(component.notes().decisions).toEqual(['Decision one', 'Decision two']);
  });
  it('renders clear retry state when no provider is connected', async () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    const component = fixture.componentInstance;
    await component.store.analyze('local-test');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Retry analysis');
    expect(component.meeting()?.transcript).toBe('Original words');
  });
});
